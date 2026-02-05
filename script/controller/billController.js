import { Bill } from "../class/billClass.js";
import { responseController } from "./responseController.js";

export class billController {
    static bills = {};

    static addBill(id, name, amount, price) {
        const bill = new Bill(id, name, amount, price).getData();
        billController.bills[id] = bill;
        return bill;
    }

    static updateBill(id, name, amount, price) {
        const bill = billController.getBill(id);
        if (bill) {
            bill.name = name;
            bill.amount = Math.abs(parseInt(amount));
            bill.price = Math.abs(parseFloat(price));
        } else {
            return responseController.createResponse(true, "Bill not found");
        }
        billController.bills[id] = bill;
        return responseController.createResponse(bill);
    }

    static getBill(id) {
        return billController.bills[id];
    }

    static removeBill(id) {
        delete billController.bills[id];
    }

    static getAllBills() {
        return billController.bills;
    }

    static calculateTotal() {
        let total = 0;
        for (const key in billController.bills) {
            total += parseFloat(billController.bills[key].price * billController.bills[key].amount);
        }
        return total;
    }
}