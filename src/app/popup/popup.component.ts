import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Web3Service } from '../util/web3.service';
import { Article } from '../models/articles.model';
declare var require: any;

const chainlist_artifacts = require('assets/ChainList.json');
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  ChainList: any;
  article: Article = new Article(0, '', '', 0, '');
  constructor(private web3Service: Web3Service,
     private matDialogRef: MatDialogRef<PopupComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    console.log('account test popup: ' + this.data.account);
  }

  sellArticle() {

    const popUp = this.matDialogRef;
    this.web3Service.artifactsToContract(chainlist_artifacts)
      .then((ChainListAbstraction) => {
        this.ChainList = ChainListAbstraction;
        this.ChainList.deployed().then(deployed => {

          return deployed.sellArticle(this.article.name, this.article.description, this.article.price, {
            from: this.data.account,
            gas: 500000
          });

        }).then(function(result) {
          console.log('result: ' + result);
          popUp.close({data: 'closing popup'});

        }).catch(function(err) {
          console.error('error: ' + err);
        });

      });
  }


  public closePopUp(matDialogRef: MatDialogRef<PopupComponent>) {
    matDialogRef.close({data: 'closing popup'});
  }
}
