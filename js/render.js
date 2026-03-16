
import { products } from "./data.js";

let currentCategory = "todos";

const CATEGORY_ORDER = ["todos", "camping", "mate", "abrigo", "seguridad", "accesorios"];

const CATEGORY_LABELS = {
todos: "Todos",
camping: "Camping",
mate: "Mate",
abrigo: "Abrigo",
seguridad: "Seguridad",
accesorios: "Accesorios"
};

function getFilteredProducts(category) {
if (!category || category === "todos") {
    return products;
}
return products.filter((product) => product.category === category);
}

function createProductCard(product) {
const article = document.createElement("article");
article.className = "product-card";
article.dataset.productId = String(product.id);

article.innerHTML = `
    <div class="product-card__image-wrapper">
    <img
        src="${product.image}"
        alt="${product.title}"
        class="product-card__image"
    />
    <span class="product-card__badge">${CATEGORY_LABELS[product.category] || ""}</span>
    </div>
    <div class="product-card__body">
    <h3 class="product-card__title">${product.title}</h3>
    <p class="product-card__meta">${product.description}</p>
    <div class="product-card__price-row">
        <span class="product-card__price">$${product.price.toLocaleString("es-AR")}</span>
        <span class="product-card__tag">Categoría: ${CATEGORY_LABELS[product.category] || product.category}</span>
    </div>
    <div class="product-card__actions">
        <button
        class="btn btn--primary"
        type="button"
        data-product-id="${product.id}"
        >
        Agregar al carrito
        </button>
    </div>
    </div>
`;

  // Dispara un evento personalizado para que otro módulo maneje el carrito
const addButton = article.querySelector("button[data-product-id]");
addButton.addEventListener("click", () => {
    const event = new CustomEvent("patagonia:add-to-cart", {
    detail: { product },
    bubbles: true
    });
    addButton.dispatchEvent(event);
});

return article;
}

export function renderProducts(category = currentCategory) {
const grid = document.getElementById("products-grid");
const emptyMessage = document.getElementById("products-empty-message");

if (!grid || !emptyMessage) return;

currentCategory = category;
const visibleProducts = getFilteredProducts(currentCategory);

  // Limpiar contenedor
grid.innerHTML = "";

if (visibleProducts.length === 0) {
    emptyMessage.hidden = false;
    grid.setAttribute("aria-busy", "false");
    return;
}

emptyMessage.hidden = true;
grid.setAttribute("aria-busy", "true");

const fragment = document.createDocumentFragment();
visibleProducts.forEach((product) => {
    const card = createProductCard(product);
    fragment.appendChild(card);
});

grid.appendChild(fragment);
grid.setAttribute("aria-busy", "false");
}

export function renderCategories() {
const filtersContainer = document.getElementById("category-filters");
if (!filtersContainer) return;

filtersContainer.innerHTML = "";

  // Tomar categorías únicas desde los productos
const categoriesSet = new Set(products.map((p) => p.category));
const categories = ["todos", ...Array.from(categoriesSet)];

  // Ordenar categorías según orden deseado
categories.sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
);

const fragment = document.createDocumentFragment();

categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = CATEGORY_LABELS[category] || category;
    button.dataset.category = category;

    if (category === currentCategory) {
    button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
    currentCategory = category;
    updateActiveFilter(filtersContainer, category);
    renderProducts(category);
    });

    fragment.appendChild(button);
});

filtersContainer.appendChild(fragment);
}

function updateActiveFilter(container, activeCategory) {
const buttons = container.querySelectorAll("button[data-category]");
buttons.forEach((btn) => {
    const isActive = btn.dataset.category === activeCategory;
    btn.classList.toggle("is-active", isActive);
});
}
