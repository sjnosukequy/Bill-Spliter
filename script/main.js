import { setupThemeButton } from "./components/themeButton.js";
import { setupCurrencyButton } from "./components/currencySymbols/currencyComponent.js";
import { setupBill } from "./components/billComponent.js";
import { setupTax } from "./components/taxComponent.js";
import { setupDiscount } from "./components/discountComponent.js";
import { setupPeople } from "./components/peopleComponent.js";
import { setupResultComponent } from "./components/resultComponent.js";
import { parseRenderIcon } from "./libs/icon/iconController.js";
import { throttleOnce } from "./utils/throttleOnce.js";
import { removeLoader } from "./controller/loaderController.js";
import { wait } from "./utils/wait.js";

document.addEventListener("DOMContentLoaded", async() => {
    setupThemeButton();
    setupCurrencyButton();

    setupBill();
    setupTax();
    setupDiscount();
    setupPeople();

    const callbacks = {
        renderIcon: throttleOnce(parseRenderIcon, 1000)
    }

    setupResultComponent(callbacks);

    await wait(1000);
    removeLoader();
})
