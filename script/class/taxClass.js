import { baseClass } from "./baseClass.js";

export class Tax extends baseClass{
    constructor(id, name, type, price){
        super(id);
        this.name = name;
        this.type = type;
        this.price = price;
    }
}