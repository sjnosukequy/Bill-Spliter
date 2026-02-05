import { Discount } from "../class/discountClass.js";
import { responseController } from "./responseController.js";

export class discountController {
    static discounts = {};
    
    static addDiscount(id, name, type, price) {
        const discount = new Discount(id, name, type, price).getData();
        discountController.discounts[id] = discount;
        return discount;
    }

    static updateDiscount(id, name, type, price) {
        const discount = discountController.getDiscount(id);
        if (discount) {
            discount.name = name;
            discount.type = type;
            discount.price = Math.abs(parseFloat(price));
        } else {
            return responseController.createResponse(true, "Discount not found");
        }
        discountController.discounts[id] = discount;
        return responseController.createResponse(discount);
    }

    static getDiscount(id) {
        return discountController.discounts[id];
    }

    static removeDiscount(id) {
        delete discountController.discounts[id];
    }

    static getAllDiscounts() {
        return discountController.discounts;
    }

    static getDiscountsSummary() {
        const summary = {};
        const fixed = { count: 0, total: 0  };
        const percentage = { count: 0, total: 0 };
        summary["fixed"] = fixed;
        summary["percentage"] = percentage;
        for (const id in discountController.discounts) {
            const discount = discountController.discounts[id];
            summary[discount.type].count += 1;
            summary[discount.type].total += parseFloat(discount.price);
        }
        return summary;
    }
}