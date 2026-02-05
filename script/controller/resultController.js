import { responseController } from "./responseController.js";
import { billController } from "./billController.js";
import { taxController } from "./taxController.js";
import { discountController } from "./discountController.js";
import { peopleController } from "./peopleController.js";
import { debounce } from "../utils/debounce.js";
import {
    clearSubtotalItem,
    renderSubtotalTotal,
    renderSubtotalItem,
    clearTaxItem,
    renderTaxItem,
    renderTaxTotal,
    clearDiscountItem,
    renderDiscountTotal,
    renderDiscountItem,
    renderFinalTotal,
    clearFinalItem,
    renderFinalItem,
    renderPaymentMismatch,
    clearPaymentMismatch
} from "../components/resultComponent.js";

export class resultController {
    static prevTotalBill = 0;
    static prevTaxesTotal = 0;
    static prevDiscountsTotal = 0;
    static prevFinalTotal = 0;

    static prevTaxesObjects = {};
    static prevDiscountsObjects = {};
    static prevBillsObjects = {};
    static prevPeopleObjects = {};

    static calculateTotalBill() {
        let total = billController.calculateTotal();
        return total;
    }

    static setupListeners(uiObject) {
        const options = { attributes: true, childList: true, subtree: true, characterData: false };

        const debouncedUpdateResult = debounce(() => {
            resultController.updateResult(uiObject);
        });

        const callback = (mutationList, observer) => {
            // for (const mutation of mutationList) {
            //     if (mutation.type === "childList") {
            //         console.log("A child node has been added or removed.");
            //     } else if (mutation.type === "attributes") {
            //         console.log(`The ${mutation.attributeName} attribute was modified.`);
            //     } else if (mutation.type === "characterData") {
            //         console.log(`The ${mutation.characterData} character data was modified.`);
            //     }
            // }
            debouncedUpdateResult();
        };

        const observer = new MutationObserver(callback);
        observer.observe(document.body, options);
    }

    static updateResult() {
        console.log("Updating Result Component");
        let totalBill = resultController.calculateTotalBill();
        let billObjects = billController.getAllBills();

        let taxesSummary = taxController.getTaxesSummary();

        let discountsSummary = discountController.getDiscountsSummary();

        let finalTotal = totalBill
        let peopleSortedObjects = peopleController.getAllSortedByTypePeople();
        // let people = peopleController.getAllPeople();

        if (totalBill != resultController.prevTotalBill) {
            renderSubtotalTotal(totalBill);
            resultController.prevTotalBill = totalBill;
        }
        if (resultController.compareTwoObjects(billObjects, resultController.prevBillsObjects) == false) {
            clearSubtotalItem();
            let array = Object.entries(billObjects)
            array = array.filter(entry => entry[1].price > 0 && entry[1].amount > 0)

            array.sort((a, b) => (a[1].amount * a[1].price) - (b[1].amount * b[1].price))
            array.forEach(entry => {
                renderSubtotalItem(entry[1])
            })
            resultController.prevBillsObjects = resultController.returnCopyObj(billObjects);
        }


        let discountsTotal = resultController.handleDiscountsResult(discountsSummary, totalBill);
        if (discountsTotal != resultController.prevDiscountsTotal) {
            renderDiscountTotal(discountsTotal);
            resultController.prevDiscountsTotal = discountsTotal;
        }
        let discountsObjects = resultController.getAllCalculatedDiscounts(totalBill);
        if (resultController.compareTwoObjects(discountsObjects, resultController.prevDiscountsObjects) == false) {
            clearDiscountItem()
            let array = Object.entries(discountsObjects)
            array = array.filter(entry => entry[1].price > 0)
            array.sort((a, b) => a[1].price - b[1].price)

            array.forEach(entry => {
                renderDiscountItem(entry[1])
            })
            resultController.prevDiscountsObjects = resultController.returnCopyObj(discountsObjects);
        }
        finalTotal = Math.max(0, finalTotal - discountsTotal);
        // console.log("Final Total after discounts: ", finalTotal);

        let taxesTotal = resultController.handleTaxesResult(taxesSummary, finalTotal);
        if (taxesTotal != resultController.prevTaxesTotal) {
            renderTaxTotal(taxesTotal);
            resultController.prevTaxesTotal = taxesTotal;
        }
        let taxesObjects = resultController.getAllCalculatedTaxes(finalTotal)
        if (resultController.compareTwoObjects(taxesObjects, resultController.prevTaxesObjects) == false) {
            clearTaxItem();
            let array = Object.entries(taxesObjects)
            array = array.filter(entry => entry[1].price > 0)
            array.sort((a, b) => a[1].price - b[1].price)

            array.forEach(entry => {
                renderTaxItem(entry[1])
            })
            resultController.prevTaxesObjects = resultController.returnCopyObj(taxesObjects);
        }
        finalTotal = finalTotal + taxesTotal;

        let [peopleTotal, peopleArrayObjects] = resultController.handlePeopleResult(peopleSortedObjects, finalTotal);
        if (finalTotal != resultController.prevFinalTotal) {
            renderFinalTotal(finalTotal);
            resultController.prevFinalTotal = finalTotal;
            clearPaymentMismatch();
            if (finalTotal - peopleTotal > 0 && peopleArrayObjects.length > 0) {
                renderPaymentMismatch({
                    name: "Payment mismatch",
                    type: "error",
                    rate: 0,
                    price: 0,
                    maxPrice: 0,
                    calculatedPay: finalTotal - peopleTotal
                })
            }
        }
        if (resultController.compareTwoObjects(peopleArrayObjects, resultController.prevPeopleObjects) == false) {
            clearFinalItem();
            peopleArrayObjects.forEach(entry => {
                renderFinalItem(entry);
            })
            resultController.prevPeopleObjects = resultController.returnCopyObj(peopleArrayObjects);
            clearPaymentMismatch();
            if (finalTotal - peopleTotal > 0) {
                renderPaymentMismatch({
                    name: "Payment mismatch",
                    type: "error",
                    rate: 0,
                    price: 0,
                    maxPrice: 0,
                    calculatedPay: finalTotal - peopleTotal
                })
            }
        }

        // if (resultController.compareTwoObjects(peopleSortedObjects, resultController.prevPeopleObjects) == false) {
        //     clearPeopleItem();
        //     renderPeopleItem(peopleSortedObjects);
        //     resultController.prevPeopleObjects = resultController.returnCopyObj(peopleSortedObjects);
        // }



        // uiObject.TAX_TOTAL.innerText = taxesSummary.fixed.total + taxesSummary.percentage.total + " $";
        // uiObject.DISCOUNT_TOTAL.innerText = discountsSummary.fixed.total + discountsSummary.percentage.total + " $";
        // uiObject.FINAL_TOTAL.innerText = (totalBill - (discountsSummary.fixed.total + discountsSummary.percentage.total) + (taxesSummary.fixed.total + taxesSummary.percentage.total)) + " $";
    }

    static returnCopyObj(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    static compareTwoObjects(obj1, obj2) {
        // console.log(obj1, obj2);
        // console.log(JSON.stringify(obj1) === JSON.stringify(obj2));
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    static handleTaxesResult(taxesSummary, totalBill) {
        // console.log("Taxes Summary: ", taxesSummary);
        let percentageTotal = (taxesSummary.percentage.total / 100) * totalBill;
        return (taxesSummary.fixed.total + percentageTotal) || 0;
    }

    static getAllCalculatedTaxes(totalBill) {
        let allTaxes = taxController.getAllTaxes();
        let keys = Object.keys(allTaxes);
        keys.forEach(key => {
            let tax = allTaxes[key];
            tax.calculatedPrice = tax.price;
            if (tax.type == "percentage") {
                tax.calculatedPrice = (parseFloat(tax.price) / 100 * totalBill);
            }
        });
        return allTaxes;
    }

    static handleDiscountsResult(discountsSummary, totalBill) {
        // console.log("Discounts Summary: ", discountsSummary);
        let percentageTotal = (discountsSummary.percentage.total / 100) * totalBill;
        return (discountsSummary.fixed.total + percentageTotal) || 0;
    }

    static getAllCalculatedDiscounts(totalBill) {
        let allDiscounts = discountController.getAllDiscounts();
        let keys = Object.keys(allDiscounts);
        keys.forEach(key => {
            let discount = allDiscounts[key];
            discount.calculatedPrice = discount.price;
            if (discount.type == "percentage") {
                discount.calculatedPrice = (parseFloat(discount.price) / 100 * totalBill);
            }
        });
        return allDiscounts;
    }

    static handlePeopleResult(peopleSortedObjects, totalBill) {
        let bill = totalBill;
        let billCalculated = 0;
        let ratePeople = peopleController.calculateRateToArray(peopleSortedObjects['rate'], bill);
        let rateBill = peopleController.calculateRate(peopleSortedObjects['rate'], bill);
        bill -= rateBill;
        billCalculated += rateBill;

        let fixedPeople = peopleController.calculateFixedToArray(peopleSortedObjects['fixed'], bill);
        let fixedBill = peopleController.calculateFixed(peopleSortedObjects['fixed'], bill);
        bill -= fixedBill;
        billCalculated += fixedBill;

        let notExceedPeople = peopleController.calculateNotExceedToArray(peopleSortedObjects['NotExceed'], peopleSortedObjects['reduction'], peopleSortedObjects['equal'], bill);
        let notExceedBill = peopleController.calculateNotExceed(peopleSortedObjects['NotExceed'], peopleSortedObjects['reduction'], peopleSortedObjects['equal'], bill);
        bill -= notExceedBill;
        billCalculated += notExceedBill;

        let reductionPeople = peopleController.calculateReductionToArray(peopleSortedObjects['reduction'], peopleSortedObjects['equal'], bill);
        let reductionBill = peopleController.calculateReduction(peopleSortedObjects['reduction'], peopleSortedObjects['equal'], bill);
        bill -= reductionBill;
        billCalculated += reductionBill;

        let equalPeople = peopleController.calculateEqualSplitToArray(peopleSortedObjects['equal'], bill);
        let equalBill = peopleController.calculateEqualSplit(peopleSortedObjects['equal'], bill) * peopleSortedObjects['equal'].length;
        bill -= equalBill;
        billCalculated += equalBill;

        let paidPeople = peopleController.calculatePaidToArray(peopleSortedObjects['paid']);

        let tempArray = [...ratePeople, ...fixedPeople, ...paidPeople, ...notExceedPeople, ...reductionPeople, ...equalPeople];
        tempArray.sort((a, b) => a.calculatedPay - b.calculatedPay);
        // console.log("Temp Array: ", tempArray);
        // console.log("Remaining Bill: ", bill);
        return [billCalculated, tempArray];
    }
}