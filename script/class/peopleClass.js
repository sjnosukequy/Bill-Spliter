import { baseClass } from "./baseClass.js";

export class People extends baseClass{
    constructor(id, name, type, rate, price, maxPrice){
        super(id);
        this.name = name;
        this.type = type;
        this.rate = rate;
        this.price = price;
        this.maxPrice = maxPrice;
    }
}