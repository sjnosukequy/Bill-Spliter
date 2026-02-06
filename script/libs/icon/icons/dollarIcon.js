import { currencyController } from "../../../controller/currencyController.js";

export class dollarIcon {
    static getHtmlContent() {
        let currentSymbol = currencyController.getCurrentSymbol();
        return currentSymbol;
    }

    static getHtmlElement(width = 20) {
        let currentSymbol = currencyController.getCurrentSymbol();

        let element = document.createElement("span");
        element.classList.add("currency-icon");
        element.innerHTML = currentSymbol;
        element.style.fontSize = `${width}px`;
        element.style.fontWeight = "600";
        // element.style.aspectRatio = "1 / 1";
        
        return element;
    }
}