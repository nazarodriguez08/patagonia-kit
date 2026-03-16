
const SELECTORS = {
hamburger: "hamburger-toggle",
nav: "main-nav",
overlay: "overlay",
cartToggle: "cart-toggle",
cartDrawer: "cart-drawer",
cartClose: "cart-close"
};

let hamburgerBtn = null;
let nav = null;
let overlay = null;
let cartToggleBtn = null;
let cartDrawer = null;
let cartCloseBtn = null;

function cacheDomRefs() {
hamburgerBtn = document.getElementById(SELECTORS.hamburger);
nav = document.getElementById(SELECTORS.nav);
overlay = document.getElementById(SELECTORS.overlay);
cartToggleBtn = document.getElementById(SELECTORS.cartToggle);
cartDrawer = document.getElementById(SELECTORS.cartDrawer);
cartCloseBtn = document.getElementById(SELECTORS.cartClose);
}

function openNav() {
if (!nav || !hamburgerBtn) return;
nav.classList.add("is-open");
hamburgerBtn.classList.add("is-active");
hamburgerBtn.setAttribute("aria-expanded", "true");
showOverlay();
}

function closeNav() {
if (!nav || !hamburgerBtn) return;
nav.classList.remove("is-open");
hamburgerBtn.classList.remove("is-active");
hamburgerBtn.setAttribute("aria-expanded", "false");
  // Si el carrito no está abierto, ocultamos el overlay
if (!isCartOpen()) {
    hideOverlay();
}
}

function toggleNav() {
if (!nav) return;
if (nav.classList.contains("is-open")) {
    closeNav();
} else {
    openNav();
}
}

function openCart() {
if (!cartDrawer) return;
cartDrawer.classList.add("is-open");
showOverlay();
}

function closeCart() {
if (!cartDrawer) return;
cartDrawer.classList.remove("is-open");
  // Si el menú no está abierto, ocultamos el overlay
if (!isNavOpen()) {
    hideOverlay();
}
}

function toggleCart() {
if (!cartDrawer) return;
if (cartDrawer.classList.contains("is-open")) {
    closeCart();
} else {
    openCart();
}
}

function isCartOpen() {
return !!cartDrawer && cartDrawer.classList.contains("is-open");
}

function isNavOpen() {
return !!nav && nav.classList.contains("is-open");
}

function showOverlay() {
if (!overlay) return;
overlay.classList.add("is-active");
}

function hideOverlay() {
if (!overlay) return;
overlay.classList.remove("is-active");
}

function handleOverlayClick() {
closeCart();
closeNav();
}

function handleKeydown(e) {
if (e.key === "Escape" || e.key === "Esc") {
    let consumed = false;  }

    if (isCartOpen()) {
    closeCart();
    consumed = true;
    }

    if (isNavOpen()) {
    closeNav();
    consumed = true;
    }

    if (consumed) {
    e.preventDefault();
    }
}

function handleNavLinkClick(e) {
const target = e.target;
if (!(target instanceof HTMLElement)) return;
if (target.tagName.toLowerCase() !== "a") return;
if (window.innerWidth < 768 && isNavOpen()) {
    closeNav();
}
}

export function initMenu() {
cacheDomRefs();

if (hamburgerBtn && nav) {
    hamburgerBtn.addEventListener("click", () => {
    toggleNav();
    });
    nav.addEventListener("click", handleNavLinkClick);
}

if (cartToggleBtn && cartDrawer) {
    cartToggleBtn.addEventListener("click", () => {
    toggleCart();
    });
}

if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", () => {
    closeCart();
    });
}

if (overlay) {
    overlay.addEventListener("click", handleOverlayClick);
}

window.addEventListener("keydown", handleKeydown);
}