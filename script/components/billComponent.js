import { billController } from "../controller/billController.js";
import { UUID } from "../uuidjs.js";
import { debounce } from "../utils/debounce.js";
let billTemplate = `
<div class="flex flex-row gap-2">
<input
name="bill-name"
type="text"
placeholder="Item Name"
class="input input-bordered w-full" />
<label class="input validator">
<i class="fa-solid fa-dollar-sign"></i>
<input
name="bill-price"
type="number"
class="tabular-nums"
required
placeholder="Item Price"
pattern="[0-9]*"
min="1" />
</label>
<label class="input validator">
<i class="fa-solid fa-cubes-stacked"></i>
<input
name="bill-amount"
type="number"
class="tabular-nums"
required
placeholder="Item Amount"
pattern="[0-9]*"
min="1" />
</label>
<button class="btn btn-error p-3 delete-bill-item-button">
<i class="fa-solid fa-minus"></i>
</button>
</div>`

const BILL_CONTAINER = document.getElementById("Bill_Items");
const ADD_BILL_BUTTON = document.getElementById("Add_Bill_Item_Button");

function createBillCompoent() {
    let billItem = document.createElement("div");
    billItem.innerHTML = billTemplate;
    let uuid = UUID.generate();
    billItem.id = `bill-item-${uuid}`;
    createBillItem(uuid);

    billItem.querySelector(".delete-bill-item-button").addEventListener("click", () => {
        deleteBillItem(uuid);
        BILL_CONTAINER.removeChild(billItem);
        // console.log(billController.getAllBills());
    });

    let nameInput = billItem.querySelector('input[name="bill-name"]');
    let priceInput = billItem.querySelector('input[name="bill-price"]');
    let amountInput = billItem.querySelector('input[name="bill-amount"]');

    nameInput.addEventListener("input", debounce(() => {
        updateBillItem(uuid, nameInput.value, amountInput.value || 0, priceInput.value || 0);
        nameInput.setAttribute("value", nameInput.value);
    }));
    priceInput.addEventListener("input", debounce(() => {
        updateBillItem(uuid, nameInput.value, amountInput.value || 0, priceInput.value || 0);
        priceInput.setAttribute("value", priceInput.value || 0);
    }));
    amountInput.addEventListener("input", debounce(() => {
        updateBillItem(uuid, nameInput.value, amountInput.value || 0, priceInput.value || 0);
        amountInput.setAttribute("value", amountInput.value || 0);
    }));

    return billItem;
}

function createBillItem(uuid) {
    billController.addBill(uuid, "", 0, 0);
    // console.log(billController.getAllBills());
}

function deleteBillItem(uuid) {
    billController.removeBill(uuid);
}

function updateBillItem(uuid, name, amount, price) {
    billController.updateBill(uuid, name, amount, price);
    // console.log(billController.getAllBills());
}


export function setupBill() {
    ADD_BILL_BUTTON.addEventListener("click", () => {
        let billItem = createBillCompoent();
        BILL_CONTAINER.appendChild(billItem);
    });
}