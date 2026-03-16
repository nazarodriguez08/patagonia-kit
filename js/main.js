
import { renderProducts, renderCategories } from "./render.js";
import { initCart } from "./cart.js";
import { initMenu } from "./menu.js";
import { initContactForm } from "./form.js";

function initCurrentYear() {
const yearEl = document.getElementById("current-year");
if (!yearEl) return;
const now = new Date();
yearEl.textContent = String(now.getFullYear());
}

function initApp() {
renderCategories();
renderProducts();


initCart();

initMenu();

initContactForm();

initCurrentYear();
}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", initApp);
} else {
initApp();
};