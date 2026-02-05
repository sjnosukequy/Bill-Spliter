import { resultController } from "../controller/resultController.js";
import { roundToTwo } from "../utils/roundNum.js";

const SUBTOTAL_CONTAINER = document.getElementById("subtotal-items");
const TAX_CONTAINER = document.getElementById("tax-items");
const DISCOUNT_CONTAINER = document.getElementById("discount-items");
const FINAL_CONTAINER = document.getElementById("final-items");
const SUBTOTAL_TOTAL = document.getElementById("subtotal-total");
const TAX_TOTAL = document.getElementById("tax-total");
const DISCOUNT_TOTAL = document.getElementById("discount-total");
const FINAL_TOTAL = document.getElementById("final-total");
const PAYMENT_MISMATCH = document.getElementById("payment-mismatch");

const formatter = new Intl.NumberFormat('en-US');

function clearResultItems() {
    SUBTOTAL_CONTAINER.innerHTML = "";
    TAX_CONTAINER.innerHTML = "";
    DISCOUNT_CONTAINER.innerHTML = "";
    SUBTOTAL_TOTAL.innerText = "0 $";
    TAX_TOTAL.innerText = "+0 $";
    DISCOUNT_TOTAL.innerText = "-0 $";
    FINAL_TOTAL.innerText = "0 $";
}

export function setupResultComponent() {
    clearResultItems();
    resultController.setupListeners();
}

function formatNumber(number) {
    return formatter.format(roundToTwo(number));
}

function createSubtotalItem(name, value, amount, total) {
    let subtotalTemplate = `
<div class="flex flex-row items-baseline gap-3">
<span>${name} (${amount} x ${formatNumber(value)} $)</span>
<div class="flex-1 border-b border-dashed"></div>
<span class="ml-auto">${formatNumber(total)} $</span>
</div>`;
    return document.createRange().createContextualFragment(subtotalTemplate);
}

export function clearSubtotalItem() {
    SUBTOTAL_CONTAINER.innerHTML = "";
}

export function renderSubtotalTotal(subtotalTotal) {
    SUBTOTAL_TOTAL.innerText = formatNumber(subtotalTotal) + " $";
}

export function renderSubtotalItem(SubtotalObject) {
    let total = SubtotalObject.amount * SubtotalObject.price;
    SUBTOTAL_CONTAINER.appendChild(createSubtotalItem(SubtotalObject.name, SubtotalObject.price, SubtotalObject.amount, total));
}


function createTaxItem(name, value) {
    let taxTemplate = `
<div class="flex flex-row items-baseline gap-3">
<span class="text-error">${name}</span>
<div class="flex-1 border-b border-error border-dashed"></div>
<span class="text-error">+${formatNumber(value)} $</span>
</div>
`;
    return document.createRange().createContextualFragment(taxTemplate);
}

export function clearTaxItem() {
    TAX_CONTAINER.innerHTML = "";
}

export function renderTaxTotal(taxTotal) {
    TAX_TOTAL.innerText = "+" + formatNumber(taxTotal) + " $";
}

export function renderTaxItem(TaxesObject) {
    TAX_CONTAINER.appendChild(createTaxItem(TaxesObject.name, TaxesObject.calculatedPrice));
}


function createDiscountItem(name, value) {
    let discountTemplate = `
<div class="flex flex-row items-baseline gap-3">
<span class="text-success">${name}</span>
<div class="flex-1 border-b border-success border-dashed"></div>
<span class="text-success">-${formatNumber(value)} $</span>
</div>
`;
    return document.createRange().createContextualFragment(discountTemplate);
}

export function clearDiscountItem() {
    DISCOUNT_CONTAINER.innerHTML = "";
}

export function renderDiscountTotal(discountsTotal) {
    DISCOUNT_TOTAL.innerText = "-" + formatNumber(discountsTotal) + " $";
}

export function renderDiscountItem(DiscountsObject) {
    DISCOUNT_CONTAINER.appendChild(createDiscountItem(DiscountsObject.name, DiscountsObject.calculatedPrice));
}

let peopleCauses = {
    "rate": "Paid rate on total",
    "fixed": "Paid fixed amount",
    "paid": "Paid by others",
    "NotExceed": "Paid not to exceed",
    "reduction": "Paid reduction",
    "equal": "Paid equally",
}

let peopleCausesKey = Object.keys(peopleCauses);

function generatePeopleCause(type, rate, price, maxPrice, value) {
    switch (type) {
        case "rate":
            return `Paid ${rate}% of total | ${formatNumber(value)} $`;
        case "fixed":
            return `Paid fixed amount | ${formatNumber(value)} $`;
        case "paid":
            return `Paid by others | ${formatNumber(0)} $`;
        case "NotExceed":
            return `Paid not to exceed ${formatNumber(maxPrice)} $ | ${formatNumber(value)} $`;
        case "reduction":
            return `Paid reduction of ${formatNumber(price)} $ | ${formatNumber(value)} $`;
        case "equal":
            return `Paid equally | ${formatNumber(value)} $`;
        default:
            return `Missing ${formatNumber(value)} $`;
    }
}

function createPeopleItem(name, type, rate, price, maxPrice, value) {
    let peopleTemplate = `
<div class="flex flex-row items-baseline gap-3">
<span class="${peopleCausesKey.includes(type) ? "text-primary" : "text-error"}">${name}</span>
<div class="flex-1 border-b ${peopleCausesKey.includes(type) ? "border-primary" : "border-error"} border-dashed"></div>
<span class="${peopleCausesKey.includes(type) ? "text-primary" : "text-error"}">${generatePeopleCause(type, rate, price, maxPrice, value)}</span>
</div>
`;
    return document.createRange().createContextualFragment(peopleTemplate);
}

export function renderFinalTotal(finalTotal) {
    FINAL_TOTAL.innerText = formatNumber(finalTotal) + " $";
}

export function clearPaymentMismatch() {
    PAYMENT_MISMATCH.innerHTML = "";
    PAYMENT_MISMATCH.className = "";
}

export function renderPaymentMismatch(FinalObject) {
    PAYMENT_MISMATCH.className = "bg-red-50 border border-warning p-5 rounded-lg";
    PAYMENT_MISMATCH.appendChild(createPeopleItem(FinalObject.name, FinalObject.type, FinalObject.rate, FinalObject.price, FinalObject.maxPrice, FinalObject.calculatedPay));
}

export function renderFinalItem(FinalObject) {
    FINAL_CONTAINER.appendChild(createPeopleItem(FinalObject.name, FinalObject.type, FinalObject.rate, FinalObject.price, FinalObject.maxPrice, FinalObject.calculatedPay));
}

export function clearFinalItem() {
    FINAL_CONTAINER.innerHTML = "";
}