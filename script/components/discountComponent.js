import { UUID } from "../uuidjs.js";
import { debounce } from "../utils/debounce.js";
import { discountController } from "../controller/discountController.js";

let discountType = {
    "fixed": `<i class="fa-solid fa-cubes-stacked"></i> Fixed Amount`,
    "percentage": `<i class="fa-solid fa-percent"></i> Percentage`,
}

let discountTypeElements = {
    "fixed": `<input name="discount-price" type="number" class="input validator w-full" required placeholder="Value" pattern="[0-9]*" min="1" />`,
    "percentage": `<input name="discount-price" type="range" class="range range-primary w-full" required min="0" max="100" value="0"/> <input class="range-number-display input max-w-min p-0" disabled value="0%" type="text"/>`
}

let discountKeys = Object.keys(discountType);

let discountTemplate = `
<div class="flex flex-col gap-2">
<input
name="discount-name"
type="text"
placeholder="Discount Name"
class="input input-bordered w-full" />
<div class="flex flex-row gap-2 w-full">
<div class="dropdown dropdown-start">
<div
tabindex="0"
role="button"
name="discount-type-button"
value="${discountKeys[0]}"
class="btn whitespace-nowrap">
${discountType[discountKeys[0]]}
</div>
<ul
tabindex="-1"
class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
${renderDropdownOptions()}
</ul>
</div>
<label class="validator w-full items-center flex flex-row gap-3">

</label>
<button class="btn btn-error p-3 delete-discount-item-button">
<i class="fa-solid fa-minus"></i>
</button>
</div>
</div>`

function renderDropdownOptions() {
    let html = ``;
    for (let key in discountType) {
        html += `
        <li>
            <a value="${key}">${discountType[key]}</a>
        </li>`;
    }
    return html
}

const debouncedHandleNumberInput = debounce(
    (uuid, discountItem) => handleNumberInput(uuid, discountItem)
);

function renderDropdownElement(discountItem, uuid, selectedValue) {
    let container = discountItem.querySelector('.validator')
    container.innerHTML = discountTypeElements[selectedValue];
    let inputElement = container.querySelector('input[name="discount-price"]');
    if (inputElement != null)
        inputElement.addEventListener("input", () => {
            debouncedHandleNumberInput(uuid, discountItem);
            handleNumberInputUI(discountItem);
        });
}

const DISCOUNT_CONTAINER = document.getElementById("discounts-items");
const ADD_DISCOUNT_BUTTON = document.getElementById("Add_Discount_Button");

function createDiscountComponent() {
    let discountItem = document.createElement("div");
    discountItem.innerHTML = discountTemplate;
    let uuid = UUID.generate();
    discountItem.id = `discount-item-${uuid}`;
    createDiscountItem(uuid);

    discountItem.querySelector(".delete-discount-item-button").addEventListener("click", () => {
        deleteDiscountItem(uuid);
        DISCOUNT_CONTAINER.removeChild(discountItem);
        // console.log(discountController.getAllDiscounts());
    });

    let nameInput = discountItem.querySelector('input[name="discount-name"]');
    const typeButton = discountItem.querySelector('div[name="discount-type-button"]');

    renderDropdownElement(discountItem, uuid, typeButton.getAttribute("value"));

    const typeLinks = discountItem.querySelectorAll('ul a');
    typeLinks.forEach(link => {
        link.addEventListener('click', () => {
            const selectedValue = link.getAttribute('value');
            handleDropdownSelection(discountItem, selectedValue);
            renderDropdownElement(discountItem, uuid, selectedValue);
            let priceInput = discountItem.querySelector('input[name="discount-price"]');
            updateDiscountItem(uuid, nameInput.value, selectedValue, priceInput.value || 0);
        });
    });

    nameInput.addEventListener("input", debounce(() => {
        let priceInput = discountItem.querySelector('input[name="discount-price"]');
        updateDiscountItem(uuid, nameInput.value, typeButton.getAttribute("value"), priceInput.value || 0);
        nameInput.setAttribute("value", nameInput.value);
    }));
    return discountItem;
}



function handleDropdownSelection(discountItem, selectedValue) {
    const typeButton = discountItem.querySelector('div[name="discount-type-button"]');
    typeButton.setAttribute('value', selectedValue);
    typeButton.innerHTML = discountType[selectedValue];
}

function handleNumberInputUI(discountItem) {
    let numberRange = discountItem.querySelector('.range-number-display')
    if (numberRange) {
        numberRange.value = discountItem.querySelector('input[name="discount-price"]').value + "%";
    }
}

function handleNumberInput(uuid, discountItem) {
    const typeButton = discountItem.querySelector('div[name="discount-type-button"]');
    let nameInput = discountItem.querySelector('input[name="discount-name"]');
    let priceInput = discountItem.querySelector('input[name="discount-price"]');
    updateDiscountItem(uuid, nameInput.value, typeButton.getAttribute("value"), priceInput.value || 0);
    priceInput.setAttribute("value", priceInput.value || 0);
}


function createDiscountItem(uuid) {
    discountController.addDiscount(uuid, "", discountKeys[0], 0);
    // console.log(discountController.getAllDiscounts());
}

function deleteDiscountItem(uuid) {
    discountController.removeDiscount(uuid);
}

function updateDiscountItem(uuid, name, type, price) {
    discountController.updateDiscount(uuid, name, type, price);
    // console.log(discountController.getAllDiscounts());
}


export function setupDiscount() {
    ADD_DISCOUNT_BUTTON.addEventListener("click", () => {
        let discountItem = createDiscountComponent();
        DISCOUNT_CONTAINER.appendChild(discountItem);
    });
}