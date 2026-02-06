import { UUID } from "../uuidjs.js";
import { debounce } from "../utils/debounce.js";
import { taxController } from "../controller/taxController.js";

let taxType = {
    "fixed": `<i class="fa-solid fa-dollar-sign"></i> Fixed Amount`,
    "percentage": `<i class="fa-solid fa-percent"></i> Percentage`,
}

let taxTypeElements = {
    "fixed": `<input name="tax-price" type="number" class="input validator w-full" required placeholder="Value" pattern="[0-9]*" min="1" />`,
    "percentage": `<input name="tax-price" type="range" class="range range-primary w-full" required min="0" max="100" value="0"/> <input class="range-number-display input max-w-min p-0" disabled value="0%" type="text"/>`
}

let taxKeys = Object.keys(taxType);

let taxTemplate = `
<div class="flex flex-col gap-2">
<input
name="tax-name"
type="text"
placeholder="Tax Name"
class="input input-bordered w-full" />
<div class="flex flex-row gap-2 w-full">
<div class="dropdown dropdown-start">
<div
tabindex="0"
role="button"
name="tax-type-button"
value="${taxKeys[0]}"
class="btn whitespace-nowrap">
${taxType[taxKeys[0]]}
</div>
<ul
tabindex="-1"
class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
${renderDropdownOptions()}
</ul>
</div>
<label class="validator w-full items-center flex flex-row gap-3">

</label>
<button class="btn btn-error p-3 delete-tax-item-button">
<i class="fa-solid fa-minus"></i>
</button>
</div>
</div>`

function renderDropdownOptions() {
    let html = ``;
    for (let key in taxType) {
        html += `
        <li>
            <a value="${key}">${taxType[key]}</a>
        </li>`;
    }
    return html
}

const debouncedHandleNumberInput = debounce(
    (uuid, taxItem) => handleNumberInput(uuid, taxItem)
);


function renderDropdownElement(taxItem, uuid, selectedValue) {
    let container = taxItem.querySelector('.validator')
    container.innerHTML = taxTypeElements[selectedValue];
    let inputElement = container.querySelector('input[name="tax-price"]');
    if (inputElement != null)
        inputElement.addEventListener("input", () => {
            debouncedHandleNumberInput(uuid, taxItem);
            handleNumberInputUI(taxItem);
        });
}


const TAX_CONTAINER = document.getElementById("taxes-items");
const ADD_TAX_BUTTON = document.getElementById("Add_Tax_Button");

function createTaxComponent() {
    let taxItem = document.createElement("div");
    taxItem.innerHTML = taxTemplate;
    let uuid = UUID.generate();
    taxItem.id = `tax-item-${uuid}`;
    createTaxItem(uuid);

    taxItem.querySelector(".delete-tax-item-button").addEventListener("click", () => {
        deleteTaxItem(uuid);
        TAX_CONTAINER.removeChild(taxItem);
        // console.log(taxController.getAllTaxes());
    });

    let nameInput = taxItem.querySelector('input[name="tax-name"]');
    const typeButton = taxItem.querySelector('div[name="tax-type-button"]');
    renderDropdownElement(taxItem, uuid, typeButton.getAttribute("value"));

    const typeLinks = taxItem.querySelectorAll('ul a');
    typeLinks.forEach(link => {
        link.addEventListener('click', () => {
            const selectedValue = link.getAttribute('value');
            handleDropdownSelection(taxItem, selectedValue);
            renderDropdownElement(taxItem, uuid, typeButton.getAttribute("value"));
            let priceInput = taxItem.querySelector('input[name="tax-price"]');
            updateTaxItem(uuid, nameInput.value, selectedValue, priceInput.value || 0);
        });
    });

    nameInput.addEventListener("input", debounce(() => {
        let priceInput = taxItem.querySelector('input[name="tax-price"]');
        updateTaxItem(uuid, nameInput.value, typeButton.getAttribute("value"), priceInput.value || 0);
        nameInput.setAttribute("value", nameInput.value || 0);
    }));
    return taxItem;
}

function handleDropdownSelection(taxItem, selectedValue) {
    const typeButton = taxItem.querySelector('div[name="tax-type-button"]');
    typeButton.setAttribute('value', selectedValue);
    typeButton.innerHTML = taxType[selectedValue];
}

function handleNumberInputUI(taxItem) {
    let numberRange = taxItem.querySelector('.range-number-display')
    if (numberRange) {
        numberRange.value = taxItem.querySelector('input[name="tax-price"]').value + "%";
    }
}

function handleNumberInput(uuid, taxItem) {
    // console.log("Number input changed");
    const typeButton = taxItem.querySelector('div[name="tax-type-button"]');
    let nameInput = taxItem.querySelector('input[name="tax-name"]');
    let priceInput = taxItem.querySelector('input[name="tax-price"]');
    updateTaxItem(uuid, nameInput.value, typeButton.getAttribute("value"), priceInput.value || 0);
    priceInput.setAttribute("value", priceInput.value || 0);
    // console.log("changed")
}


function createTaxItem(uuid) {
    taxController.addTax(uuid, "", taxKeys[0], 0);
    // console.log(taxController.getAllTaxes());
}

function deleteTaxItem(uuid) {
    taxController.removeTax(uuid);
}

function updateTaxItem(uuid, name, type, price) {
    taxController.updateTax(uuid, name, type, price);
    // console.log(taxController.getAllTaxes());
}


export function setupTax() {
    ADD_TAX_BUTTON.addEventListener("click", () => {
        let taxItem = createTaxComponent();
        TAX_CONTAINER.appendChild(taxItem);
    });
}