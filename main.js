
const balance = document.getElementById("balance");
const incomeValue = document.getElementById("incomeValue");
const expensesValue = document.getElementById("expensesValue");
const valueList = document.getElementById("valueList");
const transactionForm = document.getElementById("transactionForm");
const concept = document.getElementById("concept");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = [];

if (localStorage.getItem("transactions") !== null) {
    transactions = localStorageTransactions;
}

transactionForm.addEventListener("submit", addTransaction);

// Function to add transaction
function addTransaction(element) {
    element.preventDefault();
    if (concept.value === "" || amount.value === "") {
        concept.placeholder = "Por favor introduce el concepto";
        amount.placeholder = "Por favor introduce la cantidad"
    } else {
        const transaction = {
            id: randomID(),
            concept: concept.value,
            amount: amount.value,
        };
        transactions.push(transaction);
        addTransactionToDOM(transaction);
        updateValues();
        updateLocalStorage();
        concept.value = "";
        amount.value = "";
    }
}

// Function to generate random ID
function randomID() {
    return Math.floor(Math.random() * 1000000);
}

// Function to update balance, incomes & expenses values in DOM
function updateValues() {
    const amounts = transactions.map((transaction) => Number(transaction.amount));
    const totalAmounts = amounts.reduce((accum, item) => (accum += item), 0).toFixed(2);
    const income = amounts
        .filter((item) => item > 0)
        .reduce((accum, item) => (accum += item), 0)
        .toFixed(2);
    const expense = (amounts.filter((item) => item < 0).reduce((accum, item) => (accum += item), 0) * -1).toFixed(2);
    balance.innerText = `${totalAmounts}€`;
    incomeValue.innerText = `${income}€`;
    expensesValue.innerText = `${expense}€`
}

// Initialize the array and display the DOM first loading
function initArray() {
    valueList.innerHTML = "";
    transactions.forEach(addTransactionToDOM);
    updateValues();
}
initArray();

// Function to add transactions to DOM list items
function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const listItem = document.createElement("li");
    listItem.classList.add(transaction.amount < 0 ? "negative" : "positive");
    listItem.innerHTML = `${transaction.concept} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-item" onclick="removeTransaction(${transaction.id})">x</button>`;
    valueList.appendChild(listItem);
}

// Function to remove list items
function removeTransaction(id){
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocalStorage();
    initArray();
}

// Function to update Local Storage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}