import { People } from "../class/peopleClass.js";
import { responseController } from "./responseController.js";
import { deepCopy } from "../utils/deepCopy.js";

let priority = [
    "rate",
    "fixed",
    "paid",
    "NotExceed",
    "reduction",
    "equal",
]

export class peopleController {
    static people = {};

    static addPeople(id, name, type, rate, price, maxPrice) {
        const people = new People(id, name, type, rate, price, maxPrice).getData();
        peopleController.people[id] = people;
        return people;
    }

    static updatePeople(id, name, type, rate, price, maxPrice) {
        const people = peopleController.getPeople(id);
        if (people) {
            people.name = name;
            people.type = type;
            people.rate = Math.abs(parseFloat(rate));
            people.price = Math.abs(parseFloat(price));
            people.maxPrice = Math.abs(parseFloat(maxPrice));
        } else {
            return responseController.createResponse(true, "People not found");
        }
        peopleController.people[id] = people;
        return responseController.createResponse(people);
    }

    static updatePeople(id, name, type, obj) {
        const people = peopleController.getPeople(id);
        if (people) {
            let keys = Object.keys(obj);
            let peopleKeys = Object.keys(people);
            keys.forEach(key => {
                if (peopleKeys.includes(key))
                    people[key] = Math.abs(parseFloat(obj[key]));
            });
            people.name = name;
            people.type = type;
        } else {
            return responseController.createResponse(true, "People not found");
        }
        peopleController.people[id] = people;
        return responseController.createResponse(people);
    }

    static getPeople(id) {
        return peopleController.people[id];
    }

    static removePeople(id) {
        delete peopleController.people[id];
    }

    static getAllPeople() {
        return peopleController.people;
    }

    static getAllSortedByTypePeople() {
        let sorted = {}
        for (let type of priority) {
            sorted[type] = [];
        }
        let allPeople = peopleController.getAllPeople();
        let keys = Object.keys(allPeople);
        keys.forEach(key => {
            let people = allPeople[key];
            sorted[people.type].push(people);
        });
        sorted['rate'] = sorted['rate'].toSorted((a, b) => b.rate - a.rate);
        sorted['fixed'] = sorted['fixed'].toSorted((a, b) => b.price - a.price);
        sorted['NotExceed'] = sorted['NotExceed'].toSorted((a, b) => a.maxPrice - b.maxPrice);
        sorted['reduction'] = sorted['reduction'].toSorted((a, b) => a.price - b.price);
        return sorted;
    }

    static getPriorityArray() {
        return priority;
    }

    static calculatePaidToArray(arrayPeople) {
        let resultArray = deepCopy(arrayPeople);
        for (let people of resultArray) {
            people.calculatedPay = 0;
        }
        return resultArray;
    }

    static calculateEqualSplit(arrayPeople, Bill) {
        let numberOfPeople = arrayPeople.length;
        if (numberOfPeople == 0) return 0;
        return Bill / numberOfPeople;
    }

    static calculateEqualSplitToArray(arrayPeople, Bill) {
        let numberOfPeople = arrayPeople.length;
        if (numberOfPeople == 0) return [];
        let calculatedPay = Bill / numberOfPeople;

        let resultArray = deepCopy(arrayPeople);
        for (let people of resultArray) {
            people.calculatedPay = calculatedPay;
        }
        return resultArray;
    }

    static calculateRateToArray(arrayPeople, Bill) {
        let resultArray = deepCopy(arrayPeople);
        let currentBill = Bill;
        for (let people of resultArray) {
            let calculatedPay = (people.rate / 100) * Bill;
            people.calculatedPay = Math.min(calculatedPay, currentBill);
            currentBill -= calculatedPay;
            currentBill = Math.max(0, currentBill);
        }
        return resultArray;
    }

    static calculateRate(arrayPeople, Bill) {
        let currentBill = Bill;
        let total = 0;
        for (let people of arrayPeople) {
            let calculatedPay = (people.rate / 100) * Bill;
            calculatedPay = Math.min(calculatedPay, currentBill);
            currentBill -= calculatedPay;
            currentBill = Math.max(0, currentBill);
            total += calculatedPay;
        }
        return total;
    }

    static calculateFixedToArray(arrayPeople, Bill) {
        let resultArray = deepCopy(arrayPeople);
        let currentBill = Bill;
        for (let people of resultArray) {
            let calculatedPay = people.price;
            people.calculatedPay = Math.min(calculatedPay, currentBill);
            currentBill -= calculatedPay;
            currentBill = Math.max(0, currentBill);
        }
        return resultArray;
    }

    static calculateFixed(arrayPeople, Bill) {
        let currentBill = Bill;
        let total = 0;
        for (let people of arrayPeople) {
            let calculatedPay = people.price;
            calculatedPay = Math.min(calculatedPay, currentBill);
            currentBill -= calculatedPay;
            currentBill = Math.max(0, currentBill);
            total += calculatedPay;
        }
        return total;
    }

    static calculateNotExceedToArray(arrayNotExceed, arrayReduction, arrayEqual, Bill) {
        let resultArray = deepCopy(arrayNotExceed);
        let currentBill = Bill;
        let proccessedIndex = 0;
        let maxIndex = arrayNotExceed.length;
        while (proccessedIndex < maxIndex) {
            let tempArray = arrayNotExceed.slice(proccessedIndex)
            let equalSplit = this.calculateEqualSplit([...tempArray, ...arrayReduction, ...arrayEqual], currentBill);
            let calculatedPay = Math.min(resultArray[proccessedIndex].maxPrice, equalSplit);
            resultArray[proccessedIndex].calculatedPay = calculatedPay;
            currentBill -= calculatedPay;
            currentBill = Math.max(0, currentBill);
            proccessedIndex++;
        }
        return resultArray;
    }

    static calculateNotExceed(arrayNotExceed, arrayReduction, arrayEqual, Bill) {
        let currentBill = Bill;
        let proccessedIndex = 0;
        let maxIndex = arrayNotExceed.length;
        let total = 0;
        while (proccessedIndex < maxIndex) {
            let tempArray = arrayNotExceed.slice(proccessedIndex)
            let equalSplit = this.calculateEqualSplit([...tempArray, ...arrayReduction, ...arrayEqual], currentBill);
            let calculatedPay = Math.min(arrayNotExceed[proccessedIndex].maxPrice, equalSplit);
            total += calculatedPay;
            currentBill -= calculatedPay;
            currentBill = Math.max(0, currentBill);
            proccessedIndex++;
        }
        return total;
    }

    static calculateReductionToArray(arrayReduction, arrayEqual, Bill) {
        let resultArray = deepCopy(arrayReduction);
        let currentBill = Bill;
        let proccessedIndex = 0;
        let maxIndex = arrayReduction.length;
        while (proccessedIndex < maxIndex) {
            let tempArray = arrayReduction.slice(proccessedIndex)
            let equalSplit = this.calculateEqualSplit([...tempArray, ...arrayEqual], currentBill);
            let calculatedPay = Math.max(equalSplit - arrayReduction[proccessedIndex].price, 0);
            resultArray[proccessedIndex].calculatedPay = calculatedPay;
            currentBill -= calculatedPay;
            currentBill = Math.max(0, currentBill);
            proccessedIndex++;
        }
        return resultArray;
    }

    static calculateReduction(arrayReduction, arrayEqual, Bill) {
        let currentBill = Bill;
        let proccessedIndex = 0;
        let maxIndex = arrayReduction.length;
        let total = 0;
        while (proccessedIndex < maxIndex) {
            let tempArray = arrayReduction.slice(proccessedIndex)
            let equalSplit = this.calculateEqualSplit([...tempArray, ...arrayEqual], currentBill);
            let calculatedPay = Math.max(equalSplit - arrayReduction[proccessedIndex].price, 0);
            total += calculatedPay;
            currentBill -= calculatedPay;
            currentBill = Math.max(0, currentBill);
            proccessedIndex++;
        }
        return total;
    }
}