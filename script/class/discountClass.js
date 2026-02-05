import { baseClass } from "./baseClass.js";

export class Discount extends baseClass{
    constructor(id, name, type, price){
        super(id);
        this.name = name;
        this.type = type;
        this.price = price;
    }
}