import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PopupComponent } from '../popup/popup.component';
import { Web3Service } from '../util/web3.service';
import { Article } from '../models/articles.model';
import { Subject } from 'rxjs';
declare var require: any;
const chainlist_artifacts = require('assets/ChainList.json');

@Component({
  selector: 'app-chainlist',
  templateUrl: './chainlist.component.html',
  styleUrls: ['./chainlist.component.css']
})
export class ChainlistComponent implements OnInit {
  accounts: string[];
  ChainList: any;
  balance: any;
  model = {
    balance: 0,
    account: ''
  };
  _price: number;
  isLoading: boolean;
  public eventsSellObservable = new Subject<any[]>();
  public sellEvents: any;

  public eventsBuyObservable = new Subject<any[]>();
  public BuyEvents: any;

  status = '';

  articles: Article[] = [];

  options = { fromBlock: 0, toBlock: 'latest' };

  constructor(private web3Service: Web3Service, public dialog: MatDialog, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
    this.isLoading = false;
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(chainlist_artifacts)
      .then((ChainListAbstraction) => {
        this.ChainList = ChainListAbstraction;
        this.ChainList.deployed().then(deployed => {
          console.log('ChainList' + deployed);
          this.ChainList = deployed;
          this.setStatus('ChainList loaded successfully');
        });

      });
      this.getArticles(this.articles);
      setInterval(() => this.listenToSellEvents(), 5000);
      setInterval(() => this.listenToBuyEvents(), 5000);

  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account =  accounts[0];
      this.refreshBalance();
    });
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
     this.web3Service.getAccountBalance(this.model.account).then((balance) => {
      this.balance = 'Balance: ' + balance + ' Eth';
    });
    } catch (e) {
      console.log(e);
       this.setStatus('Error getting balance; see log.');
    }
  }

  getArticles(articles: Article[]) {
    let Instance: any;
    let articleId: any;
    this.web3Service.artifactsToContract(chainlist_artifacts)
      .then((ChainListAbstraction) => {
        this.ChainList = ChainListAbstraction;
        this.ChainList.deployed().then(deployed => {
          Instance = deployed;
          return deployed.getArticlesForSale();

        }).then(function(result) {
          for (let i = 0; i < result.length; i++) {
            articleId = result[i];
            Instance.articles(articleId.toNumber()).then(function(article) {
             console.log('article: ', article);
             articles.unshift(new Article(article.id, article.seller, article.name, article.price.toNumber(), article.description));
            });
           // console.log('array size: ' + articles.length);
          }

        }).catch(function(err) {
          console.error('articles error:' + err);
        });

      });
  }

  public openModal() {
    this.isLoading = true;
    this.dialog.open(PopupComponent, {data: { account: this.model.account, loading: this.isLoading }}).afterClosed().subscribe(response => {
      this.isLoading = false;
    });
  }

  listenToSellEvents() {
    /*if (this.sellEvents.length > 0) {
     console.log('testt2: ' + this.sellEvents[0].returnValues._id);
    }*/
    this.web3Service.artifactsToContract(chainlist_artifacts)
    .then((ChainListAbstraction) => {
      this.ChainList = ChainListAbstraction;
      this.ChainList.deployed().then(deployed => {
            deployed.contract.events.LogSellArticle('LogSellArticle', {}, {}, (err, events) => {
             // console.log('args: ' + events.returnValues._name );
              // console.log('testt: ' + events[0].returnValues._id);
            if (!this.sellEvents || this.sellEvents.length !== events.length ||
              this.sellEvents.returnValues._id !== events.returnValues._id) {
              // this.articles.length = 0;
             // this.getArticles(this.articles);
               console.log('event :' + events);
             this.articles.unshift(new Article(events.returnValues._id, events.returnValues._seller,
              events.returnValues._name, events.returnValues._price, events.returnValues._description));
            this.eventsSellObservable.next(events);
            this.sellEvents = events;
            this.setStatus(this.sellEvents.returnValues._name + ' is now for sale !');
            }
          });
      });
    });
  }

  listenToBuyEvents() {

    this.web3Service.artifactsToContract(chainlist_artifacts)
    .then((ChainListAbstraction) => {
      this.ChainList = ChainListAbstraction;
      this.ChainList.deployed().then(deployed => {
            deployed.contract.events.LogBuyArticle('LogBuyArticle', {}, {}, (err, events) => {
            if (!this.BuyEvents || this.BuyEvents.length !== events.length ||
              this.BuyEvents.returnValues._id !== events.returnValues._id) {
                let articleToRm: Article;
                articleToRm = new Article(events.returnValues._id, events.returnValues._seller,
                  events.returnValues._name, events.returnValues._price, events.returnValues._description);

                  const index = this.articles.findIndex(order => order.id === articleToRm.id);
                  this.articles.splice(index, 1);

                /*  for ( var i = 0; i < this.articles.length; i++) {
                    console.log(this.articles[i].id + ' vs ' + articleToRm.id);
                   if (this.articles[i].id === articleToRm.id) {
                     this.articles.splice(1, 1);
                      console.log('found it');
                   }
                } */
              //  this.articles.splice(this.articles.indexOf(articleToRm), 1);
              console.log('Buy event: ', events);
              this.eventsBuyObservable.next(events);
              this.BuyEvents = events;
              this.setStatus(this.BuyEvents.returnValues._name + ' was sold');
            }
          });
      });
    });
  }



  buyArticle(id, price) {
    this.web3Service.artifactsToContract(chainlist_artifacts)
      .then((ChainListAbstraction) => {
        this.ChainList = ChainListAbstraction;
        this.ChainList.deployed().then(deployed => {
          return deployed.buyArticle(id, {
            from: this.model.account,
            value: price,
            gas: 500000
          });
        }).then(function(result) {
          console.log(result);
         // popUp.close({data: 'closing popup'});

        }).catch(function(err) {
          console.error(err);
        });

      });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

}
