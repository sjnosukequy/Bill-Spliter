import { UUID } from "../uuidjs.js";
import { debounce } from "../utils/debounce.js";
import { peopleController } from "../controller/peopleController.js";

let peopleType = {
    "equal": `Equal Split`,
    "reduction": `Reduction`,
    "rate": `Rate Adjustment`,
    "fixed": `Fixed Amount`,
    "paid": `Paid by others`,
    "NotExceed": `Not Exceeding`,
}

let peopleTypeElements = {
    "equal": ``,
    "reduction": `<input name="people-price" type="number" class="input validator w-full" required placeholder="Value" pattern="[0-9]*" min="0" key="price"/>`,
    "rate": `<input name="people-price" type="range" class="range range-primary w-full" required min="0" max="100" value="0" key="rate"/> <input class="range-number-display input max-w-min p-0" disabled value="0%" type="text"/>`,
    "fixed": `<input name="people-price" type="number" class="input validator w-full" required placeholder="Value" pattern="[0-9]*" min="0" key="price"/>`,
    "paid": ``,
    "NotExceed": `<input name="people-price" type="number" class="input validator w-full" required placeholder="Value" pattern="[0-9]*" min="0" key="maxPrice"/>`,
}

let peopleTypeDescriptions = {
    "equal": `Splits the bill equally among all people.`,
    "reduction": `Reduces a fixed amount from this person's share.`,
    "rate": `Rate Adjustment on total bill for this person.`,
    "fixed": `Fixed Amount that this person will pay.`,
    "paid": `Orther people will cover this person's share.`,
    "NotExceed": `This person's share will not exceed a certain amount.`,
}

let peopleKeys = Object.keys(peopleType);

let peopleTemplate = `
<div class="flex flex-col gap-2">

<div class="flex flex-row gap-2 w-full">
<input
name="people-name"
type="text"
placeholder="Person Name"
class="input input-bordered w-full" />
<button class="btn btn-error p-3 delete-people-item-button">
<i class="fa-solid fa-minus"></i>
</button>
</div>

<div class="flex flex-row gap-2 w-full">
<div class="dropdown dropdown-start">
<div
tabindex="0"
role="button"
name="people-type-button"
value="${peopleKeys[0]}"
class="btn whitespace-nowrap">
${peopleType[peopleKeys[0]]}
</div>
<ul
tabindex="-1"
class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
${renderDropdownOptions()}
</ul>
</div>
<label class="validator w-full items-center flex flex-row gap-3">
</label>
<div class="tooltip tooltip-left flex" data-tip="hello">
<i class="fa-solid fa-question"></i>
</div>
</div>
</div>`

function renderDropdownOptions() {
    let html = ``;
    for (let key in peopleType) {
        html += `
        <li>
            <a value="${key}">${peopleType[key]}</a>
        </li>`;
    }
    return html
}

const debouncedHandleNumberInput = debounce(
    (uuid, peopleItem) => handleNumberInput(uuid, peopleItem)
);


function renderDropdownElement(peopleItem, uuid, selectedValue) {
    let container = peopleItem.querySelector('.validator')
    container.innerHTML = peopleTypeElements[selectedValue];
    let inputElement = container.querySelector('input[name="people-price"]');
    if (inputElement != null)
        inputElement.addEventListener("input", () => {
            debouncedHandleNumberInput(uuid, peopleItem);
            handleNumberInputUI(peopleItem);
        });
}

function renderDescriptionElement(peopleItem, selectedValue) {
    let container = peopleItem.querySelector('.tooltip')
    container.setAttribute('data-tip', peopleTypeDescriptions[selectedValue]);
}


const PEOPLE_CONTAINER = document.getElementById("People_Items");
const ADD_PEOPLE_BUTTON = document.getElementById("Add_People_Button");

function createPeopleComponent() {
    let peopleItem = document.createElement("div");
    peopleItem.innerHTML = peopleTemplate;
    let uuid = UUID.generate();
    peopleItem.id = `people-item-${uuid}`;
    createPeopleItem(uuid);

    peopleItem.querySelector(".delete-people-item-button").addEventListener("click", () => {
        deletePeopleItem(uuid);
        PEOPLE_CONTAINER.removeChild(peopleItem);
        // console.log(peopleController.getAllPeople());
    });

    let nameInput = peopleItem.querySelector('input[name="people-name"]');
    const typeButton = peopleItem.querySelector('div[name="people-type-button"]');
    renderDropdownElement(peopleItem, uuid, typeButton.getAttribute("value"));
    renderDescriptionElement(peopleItem, typeButton.getAttribute("value"));

    const typeLinks = peopleItem.querySelectorAll('ul a');
    typeLinks.forEach(link => {
        link.addEventListener('click', () => {
            const selectedValue = link.getAttribute('value');
            handleDropdownSelection(peopleItem, selectedValue);
            renderDropdownElement(peopleItem, uuid, selectedValue);
            renderDescriptionElement(peopleItem, selectedValue);
            updateHandler(uuid, nameInput.value, selectedValue, peopleItem);
        });
    });

    nameInput.addEventListener("input", debounce(() => {
        updateHandler(uuid, nameInput.value, typeButton.getAttribute("value"), peopleItem)
        nameInput.setAttribute("value", nameInput.value);
    }));
    return peopleItem;
}

function handleDropdownSelection(peopleItem, selectedValue) {
    const typeButton = peopleItem.querySelector('div[name="people-type-button"]');
    typeButton.setAttribute('value', selectedValue);
    typeButton.innerHTML = peopleType[selectedValue];
}

function handleNumberInputUI(peopleItem) {
    let numberRange = peopleItem.querySelector('.range-number-display')
    if (numberRange) {
        numberRange.value = peopleItem.querySelector('input[name="people-price"]').value + "%";
    }
}


function handleNumberInput(uuid, peopleItem) {
    // console.log("Number input changed");
    const typeButton = peopleItem.querySelector('div[name="people-type-button"]');
    let nameInput = peopleItem.querySelector('input[name="people-name"]');
    updateHandler(uuid, nameInput.value, typeButton.getAttribute("value"), peopleItem);
}

function updateHandler(uuid, name, type, peopleItem) {
    let obj = {};
    let priceInput = peopleItem.querySelector('input[name="people-price"]');
    let priceKey = priceInput?.getAttribute("key");
    if (priceKey != null)
        obj[priceKey] = priceInput.value || 0;
    peopleController.updatePeople(uuid, name, type, obj);
    priceInput?.setAttribute("value", priceInput.value || 0);
}

function createPeopleItem(uuid) {
    peopleController.addPeople(uuid, "", peopleKeys[0], 0, 0, 0);
    // console.log(peopleController.getAllPeople());
}

function deletePeopleItem(uuid) {
    peopleController.removePeople(uuid);
}


export function setupPeople() {
    ADD_PEOPLE_BUTTON.addEventListener("click", () => {
        let peopleItem = createPeopleComponent();
        PEOPLE_CONTAINER.appendChild(peopleItem);
    });
}