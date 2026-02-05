import { baseClass } from "./baseClass.js";

export class Bill extends baseClass{
    constructor(id, name, amount, price){
        super(id);
        this.name = name;
        this.amount = amount;
        this.price = price;
    }
}