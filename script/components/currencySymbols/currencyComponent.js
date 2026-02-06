import { currencyList } from './currencyList.js';
import { currencyController } from '../../controller/currencyController.js';

const CURRENCY_DROPDOWN = document.getElementById('List_Currency');
const CURRENT_CURRENCY = currencyController.getCurrentValue();

let keys = Object.keys(currencyList);

if (CURRENT_CURRENCY) {
    CURRENCY_DROPDOWN.querySelector('button').innerText = currencyController.textCurrency(CURRENT_CURRENCY)
}

export function setupCurrencyButton() {
    keys.forEach(key => {
        let k = document.createElement("li")
        let a = document.createElement("a")
        a.innerText = currencyController.textCurrency(key)
        a.setAttribute("value", key)
        a.addEventListener("click", () => {
            currencyController.setCurrentValue(key);
            CURRENCY_DROPDOWN.querySelector('button').innerText = a.innerText
        })
        k.appendChild(a)
        CURRENCY_DROPDOWN.querySelector('ul').appendChild(k)
    })
}