import { setupThemeButton } from "./components/themeButton.js";
import { setupBill } from "./components/billComponent.js";
import { setupTax } from "./components/taxComponent.js";
import { setupDiscount } from "./components/discountComponent.js";
import { setupPeople } from "./components/peopleComponent.js";
import { setupResultComponent } from "./components/resultComponent.js";

setupThemeButton();

setupResultComponent();

setupBill();
setupTax();
setupDiscount();
setupPeople();