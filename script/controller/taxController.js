import { Tax } from "../class/taxClass.js";
import { responseController } from "./responseController.js";

export class taxController {
    static taxes = {};

    static addTax(id, name, type, price) {
        const tax = new Tax(id, name, type, price).getData();
        taxController.taxes[id] = tax;
        return tax;
    }

    static updateTax(id, name, type, price) {
        const tax = taxController.getTax(id);
        if (tax) {
            tax.name = name;
            tax.type = type;
            tax.price = Math.abs(parseFloat(price));
        } else {
            return responseController.createResponse(true, "Tax not found");
        }
        taxController.taxes[id] = tax;
        return responseController.createResponse(tax);
    }

    static getTax(id) {
        return taxController.taxes[id];
    }

    static removeTax(id) {
        delete taxController.taxes[id];
    }

    static getAllTaxes() {
        return taxController.taxes;
    }

    static getTaxesSummary() {
        const summary = {};
        const fixed = { count: 0, total: 0  };
        const percentage = { count: 0, total: 0 };
        summary["fixed"] = fixed;
        summary["percentage"] = percentage;
        for (const id in taxController.taxes) {
            const tax = taxController.taxes[id];
            summary[tax.type].count += 1;
            summary[tax.type].total += parseFloat(tax.price);
        }
        return summary;
    }
}