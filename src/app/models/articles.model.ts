export class Article {
    id: number;
    seller: String;
    name: String;
    price: Number;
    description: String;

        constructor(_id: number, _seller: String, _name: String, _price: Number, _description: String) {
        this.id = _id;
        this.seller = _seller;
        this.name = _name;
        this.price = _price;
        this.description = _description;
    }
}
