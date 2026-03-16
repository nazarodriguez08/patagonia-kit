
const STORAGE_KEY = "cart";

let cart = [];

function loadCartFromStorage() {
try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
} catch {
    return [];
}
}

function saveCartToStorage() {
try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
} catch {
    
}
}

let cartItemsList = null;
let cartEmptyMessage = null;
let cartTotalEl = null;
let cartBadge = null;
let cartClearBtn = null;

function cacheDomRefs() {
cartItemsList = document.getElementById("cart-items");
cartEmptyMessage = document.getElementById("cart-empty-message");
cartTotalEl = document.getElementById("cart-total");
cartBadge = document.getElementById("cart-badge");
cartClearBtn = document.getElementById("cart-clear");
}

function getCartTotal() {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function getCartCount() {
return cart.reduce((acc, item) => acc + item.quantity, 0);
}

export function renderCart() {
if (!cartItemsList || !cartEmptyMessage || !cartTotalEl || !cartBadge) {
    cacheDomRefs();
}
if (!cartItemsList) return;

cartItemsList.innerHTML = "";

if (cart.length === 0) {
    cartEmptyMessage && (cartEmptyMessage.style.display = "");
} else {
    cartEmptyMessage && (cartEmptyMessage.style.display = "none");
}

const fragment = document.createDocumentFragment();

cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.dataset.productId = String(item.id);

    const subtotal = item.price * item.quantity;

    li.innerHTML = `
    <img
        src="${item.image}"
        alt="${item.title}"
        class="cart-item__image"
    />
    <div class="cart-item__info">
        <div class="cart-item__title">${item.title}</div>
        <div class="cart-item__meta">
        Precio: $${item.price.toLocaleString("es-AR")}
        </div>
        <div class="cart-item__meta">
        Subtotal: <strong>$${subtotal.toLocaleString("es-AR")}</strong>
        </div>
    </div>
    <div class="cart-item__actions">
        <div class="cart-item__qty">
        <button
            type="button"
            class="cart-item__qty-btn"
            data-action="decrease"
            aria-label="Disminuir cantidad"
        >
            −
        </button>
        <span class="cart-item__qty-value">${item.quantity}</span>
        <button
            type="button"
            class="cart-item__qty-btn"
            data-action="increase"
            aria-label="Aumentar cantidad"
        >
            +
        </button>
        </div>
        <button
        type="button"
        class="cart-item__remove"
        data-action="remove"
        >
        Eliminar
        </button>
    </div>
    `;

    fragment.appendChild(li);
});

cartItemsList.appendChild(fragment);

const total = getCartTotal();
cartTotalEl.textContent = `$${total.toLocaleString("es-AR")}`;

const count = getCartCount();
cartBadge.textContent = String(count);
}

export function addToCart(product) {
if (!product || typeof product.id === "undefined") return;

const existing = cart.find((item) => item.id === product.id);

if (existing) {
    existing.quantity += 1;
} else {
    cart.push({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    quantity: 1
    });
}

saveCartToStorage();
renderCart();
}

function increaseQuantity(productId) {
const item = cart.find((p) => p.id === productId);
if (!item) return;
item.quantity += 1;
saveCartToStorage();
renderCart();
}

function decreaseQuantity(productId) {
const item = cart.find((p) => p.id === productId);
if (!item) return;
item.quantity -= 1;
if (item.quantity <= 0) {
    cart = cart.filter((p) => p.id !== productId);
}
saveCartToStorage();
renderCart();
}

function removeItem(productId) {
cart = cart.filter((p) => p.id !== productId);
saveCartToStorage();
renderCart();
}

export function clearCart() {
cart = [];
saveCartToStorage();
renderCart();
}


function handleCartItemClick(e) {
const target = e.target;
if (!(target instanceof HTMLElement)) return;

const action = target.dataset.action;
if (!action) return;

const itemEl = target.closest(".cart-item");
if (!itemEl) return;

const idStr = itemEl.dataset.productId;
if (!idStr) return;

const productId = Number(idStr);

if (action === "increase") {
    increaseQuantity(productId);
} else if (action === "decrease") {
    decreaseQuantity(productId);
} else if (action === "remove") {
    removeItem(productId);
}
}

function attachDomEvents() {
if (!cartItemsList) cacheDomRefs();
if (!cartItemsList) return;

cartItemsList.addEventListener("click", handleCartItemClick);

if (cartClearBtn) {
    cartClearBtn.addEventListener("click", () => {
    clearCart();
    });
}

window.addEventListener("patagonia:add-to-cart", (event) => {
    const customEvent = event;
    const detail = customEvent.detail;
    if (!detail || !detail.product) return;
    addToCart(detail.product);
});
}

export function initCart() {
    cart = loadCartFromStorage();
    cacheDomRefs();
attachDomEvents();
renderCart();
}