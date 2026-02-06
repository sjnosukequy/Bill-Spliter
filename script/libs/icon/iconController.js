import { userIcon } from "./icons/userIcon.js";
import { plusIcon } from "./icons/plusIcon.js";
import { percentIcon } from "./icons/percentIcon.js";
import { tagIcon } from "./icons/tagIcon.js";
import { calculatorIcon } from "./icons/calculatorIcon.js";
import { invoiceIcon } from "./icons/invoiceIcon.js";
import { exportIcon } from "./icons/exportIcon.js";
import { cubeStackIcon } from "./icons/cubeStackIcon.js";
import { dollarIcon } from "./icons/dollarIcon.js";
import { minusIcon } from "./icons/minusIcon.js";
import { questionIcon } from "./icons/questionIcon.js";

let iconSize = 25

function handleRender(iconElement) {
    let className = iconElement.className
    // console.log(className)
    switch (true) {
        case className.includes("fa-user"):
            return userIcon.getHtmlElement(iconSize);
        case className.includes("fa-plus"):
            return plusIcon.getHtmlElement();
        case className.includes("fa-tag"):
            return tagIcon.getHtmlElement(iconSize);
        case className.includes("fa-calculator"):
            return calculatorIcon.getHtmlElement(iconSize);
        case className.includes("invoice-dollar"):
            return invoiceIcon.getHtmlElement(iconSize);
        case className.includes("fa-file-export"):
            return exportIcon.getHtmlElement();
        case className.includes("fa-percent"):
            return percentIcon.getHtmlElement(17);
        case className.includes("fa-cubes-stacked"):
            return cubeStackIcon.getHtmlElement(17);
        case className.includes("fa-dollar-sign"):
            return dollarIcon.getHtmlElement(17);
        case className.includes("currency-icon"):
            return dollarIcon.getHtmlElement(17);
        case className.includes("fa-minus"):
            return minusIcon.getHtmlElement(17);
        case className.includes("fa-question"):
            return questionIcon.getHtmlElement(iconSize);
        default:
            return '';
    }
}

export function parseRenderIcon() {
    let icons = document.querySelectorAll('i[class*="fa-"]')
    let icons2 = document.querySelectorAll('.currency-icon')
    // console.log('render icon')
    icons = [...icons, ...icons2]
    icons.forEach(icon => {
        icon.replaceWith(handleRender(icon))
    })
}