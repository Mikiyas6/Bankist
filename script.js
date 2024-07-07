'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type} </div>
          <div class="movements__value">${movement}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserNames = function (accounts) {
  accounts.forEach(function (account) {
    const owner = account.owner.split(' ');
    const initials = owner
      .map(string => string[0])
      .join('')
      .toLowerCase();
    account.userName = initials;
  });
};

createUserNames(accounts);

const displayBalance = function (account) {
  const movements = account.movements;
  const balance = movements.reduce(function (accumulator, movement) {
    return accumulator + movement;
  }, 0);

  labelBalance.textContent = `${balance}€`;
  account.balance = balance;
};

const calcDisplaySummary = function (account) {
  const movements = account.movements;
  const totalDeposit = movements
    .filter(movement => movement > 0)
    .reduce((total, deposit) => total + deposit, 0);
  const totalWithdrawal = Math.abs(
    movements
      .filter(movement => movement < 0)
      .reduce((total, withdrawal) => total + withdrawal, 0)
  );
  const interest = movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((total, interest) => total + interest, 0);
  labelSumIn.textContent = totalDeposit;
  labelSumOut.textContent = totalWithdrawal;
  labelSumInterest.textContent = interest;
};

const updateUI = function (account) {
  displayMovements(account.movements);
  displayBalance(account);
  calcDisplaySummary(account);
};

let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); //Is used to prevent the default action that is associated with the event
  const initials = inputLoginUsername.value;
  const password = Number(inputLoginPin.value);
  currentAccount = accounts.find(account => account.userName === initials);
  if (currentAccount && password === currentAccount.pin) {
    containerApp.style.opacity = '100';
    labelWelcome.textContent = `Good Day, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // The account from which we're transferring to
  const initials = inputTransferTo.value;
  const receiver = accounts.find(function (account) {
    return account.userName === initials;
  });
  // The amount we're going to transfer
  const amountTransfer = Number(inputTransferAmount.value);

  if (
    receiver &&
    receiver.userName !== currentAccount.userName &&
    amountTransfer > 0 &&
    currentAccount.balance >= amountTransfer
  ) {
    currentAccount.movements.push(-1 * amountTransfer);
    receiver.movements.push(amountTransfer);
    updateUI(currentAccount);
  }
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const initials = inputCloseUsername.value;
  const password = Number(inputClosePin.value);
  if (currentAccount.userName === initials && currentAccount.pin === password) {
    const accountIndex = accounts.findIndex(
      account => account.userName === currentAccount.userName
    );
    accounts.splice(accountIndex, 1);
    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanRequest = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';

  loanRequest > 0 &&
    currentAccount.movements
      .filter(movement => movement > 0)
      .some(deposit => deposit > 0.1 * loanRequest) &&
    currentAccount.movements.push(loanRequest) &&
    updateUI(currentAccount);
});

let isSorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
