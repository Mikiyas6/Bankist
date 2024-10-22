'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Mikiyas Teowodroes',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-07-05T14:11:59.604Z',
    '2024-05-08T17:01:17.194Z',
    '2024-07-09T23:36:17.929Z',
    '2024-07-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Birkity Yishak',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
// const labelMovementsDate = document.querySelector('.movements__date')
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

let currentAccount, timer;
const now = new Date();
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(now, date);
  if (daysPassed === 0) return 'Today';
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (account, sort = false) {
  const movements = account.movements;
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const displayDate = formatMovementDate(
      new Date(account.movementsDates[index]),
      account.locale
    );
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${movement.toFixed(2)}€</div>
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

  labelBalance.textContent = `${balance.toFixed(2)}€`;
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
  labelSumIn.textContent = totalDeposit.toFixed(2);
  labelSumOut.textContent = totalWithdrawal.toFixed(2);
  labelSumInterest.textContent = interest.toFixed(2);
};

const updateUI = function (account) {
  displayMovements(account);
  displayBalance(account);
  calcDisplaySummary(account);
};

// const startLogOutTimer = function () {
//   // Set time to 10 minutes

//   let time = 10;
//   let min = Math.floor(time / 60);
//   let sec = String(time % 60);
//   // Call the timer every second
//   timer = setInterval(function () {
//     // In each call, print the remaining time to UI
//     labelTimer.textContent = `${min}:${sec.padStart(2, '0')}`;
//     sec -= 1;
//     sec = String(sec);
//     if (sec === '-1') sec = '59';

//     if (sec === '59') min -= 1;
//     // When 0 seconds, stop timer and log out user
//     if (min === 0 && sec === '0') {
//       labelTimer.textContent = `${min}:${sec.padStart(2, '0')}`;
//       clearInterval(timer);
//       labelWelcome.textContent = 'Log in to get started';
//       containerApp.style.opacity = 0;
//     }
//   }, 1000);
//   return timer;
// };

const startLogOutTimer = function () {
  // Set time to 10 minutes
  let time = 10 * 60; // 10 minutes in seconds

  const timer = setInterval(function () {
    // Calculate minutes and seconds
    const min = Math.floor(time / 60);
    const sec = String(time % 60).padStart(2, '0');

    // Print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // Decrement the time
    time--;

    // When 0 seconds, stop timer and log out user
    if (time < 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
  }, 1000);

  return timer;
};

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
    inputLoginUsername.blur();
    inputLoginPin.blur();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      Weekday: 'long ',
    };
    // const locale = navigator.language
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
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
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
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
  const loanRequest = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = '';

  if (
    loanRequest > 0 &&
    currentAccount.movements
      .filter(movement => movement > 0)
      .some(deposit => deposit > 0.1 * loanRequest)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(loanRequest);
      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount);
    }, 4000);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

let isSorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !isSorted);
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
