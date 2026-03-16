
let form = null;
let nameInput = null;
let emailInput = null;
let messageInput = null;

let errorName = null;
let errorEmail = null;
let errorMessage = null;
let successMessage = null;

function cacheDomRefs() {
form = document.getElementById("contact-form");
if (!form) return;

nameInput = document.getElementById("name");
emailInput = document.getElementById("email");
messageInput = document.getElementById("message");

errorName = document.getElementById("error-name");
errorEmail = document.getElementById("error-email");
errorMessage = document.getElementById("error-message");
successMessage = document.getElementById("form-success");
}

function clearErrors() {
if (errorName) errorName.textContent = "";
if (errorEmail) errorEmail.textContent = "";
if (errorMessage) errorMessage.textContent = "";
}

function hideSuccess() {
if (successMessage) {
    successMessage.hidden = true;
}
}

function showSuccess() {
if (successMessage) {
    successMessage.hidden = false;
}
}

function isValidEmail(value) {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(String(value).toLowerCase());
}

function validateForm() {
clearErrors();
hideSuccess();

let isValid = true;

const nameValue = nameInput?.value.trim() ?? "";
const emailValue = emailInput?.value.trim() ?? "";
const messageValue = messageInput?.value.trim() ?? "";

  // Nombre
if (nameValue.length < 3) {
    isValid = false;
    if (errorName) {
    errorName.textContent = "El nombre debe tener al menos 3 caracteres.";
    }
}

  // Email
if (!emailValue) {
    isValid = false;
    if (errorEmail) {
    errorEmail.textContent = "Ingresá un email.";
    }
} else if (!isValidEmail(emailValue)) {
    isValid = false;
    if (errorEmail) {
    errorEmail.textContent = "Ingresá un email válido.";
    }
}

  // Mensaje
if (messageValue.length < 10) {
    isValid = false;
    if (errorMessage) {
    errorMessage.textContent = "El mensaje debe tener al menos 10 caracteres.";
    }
}

return isValid;
}

function handleSubmit(event) {
event.preventDefault();
if (!form) return;

const ok = validateForm();

if (!ok) return;

  // Éxito
form.reset();
clearErrors();
showSuccess();
}

export function initContactForm() {
cacheDomRefs();
if (!form) return;

form.addEventListener("submit", handleSubmit);


[nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
    hideSuccess();
    });
});
}