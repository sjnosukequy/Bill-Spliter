import { currencyList } from "../components/currencySymbols/currencyList.js";
export class currencyController {
    static keys = Object.keys(currencyList);
    static currentValue = localStorage.getItem("currency") || currencyController.keys[0];

    static getCurrentValue() {
        return currencyController.currentValue;
    }

    static getCurrentSymbol(){
        return currencyList[currencyController.currentValue];
    }

    static textCurrency(key) {
        return key + " - " + currencyList[key]
    }

    static setCurrentValue(value) {
        this.currentValue = value;
        localStorage.setItem("currency", value);
    }
}