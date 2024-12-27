"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2021-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2023-09-08T16:33:06.386Z",
    "2023-09-29T18:49:59.371Z",
    "2023-10-01T18:49:59.371Z",
    "2023-10-03T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2023-09-29T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2023-10-01T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Mayank Kumar",
  movements: [500, 5400, -1000, -700, 1500, 1000, -500, 90],
  interestRate: 1.6,
  pin: 3333,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2023-09-29T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2023-10-01T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "hi-IN",
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions
//timer  ===================================>

const startTimerFunc = function () {
  let time = 240;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min} : ${sec}`;
    // check if timer reach 0
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    //decrease by 1
    time--;
  };

  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

// movements date creation for displaymovements function ===================================>
const calcDate = function (movdate, locale) {
  //create a function to differentiate b/w current and passed date
  const diffDates = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  };
  const datedifference = diffDates(new Date(), movdate);
  if (datedifference == 0) {
    return "Today";
  }
  if (datedifference == 1) {
    return "Yesterday";
  }
  if (datedifference <= 7) {
    return `${datedifference} Days ago`;
  } else {
    // const year = movdate.getFullYear();
    // const month = String(movdate.getMonth() + 1).padStart(2, 0);
    // const date = String(movdate.getDate()).padStart(2, 0);
    // return `${date}/${month}/${year}`;
    return Intl.DateTimeFormat(locale).format(movdate);
  }
};

//format currency method      ===================================>
const formatCur = function (value, local, currency) {
  return Intl.NumberFormat(local, {
    style: "currency",
    currency: currency,
  }).format(value);
};
// console.log(formatCur(10000, "en-US", "USD"));

//display movements (passing sort as 2nd arguments)  ===================================>
const displayMovements = function (acc, sort = false) {
  // first remove all the previous details
  containerMovements.innerHTML = "";
  // declaring movs variabel based on if sorting is true or not using ternary operator
  const movs = sort
    ? acc.movements.slice().sort((a, b) => {
        return a - b;
      })
    : acc.movements;
  // looping through movement array
  movs.forEach((mov, i) => {
    //looping through movementsdate array of each account
    const movInfoDate = acc.movementsDates[i];
    const movDates = new Date(movInfoDate);
    const balanceDate = calcDate(movDates, acc.locale);
    // calculating type (deposit or withdrwal)
    const type = mov > 0 ? "deposit" : "withdrawal";
    //movement currency format using formatCur function
    const formatedMovCurrency = formatCur(mov, acc.locale, acc.currency);
    // html structure for movements row
    const movHtml = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${balanceDate}</div>
      <div class="movements__value">${formatedMovCurrency}</div>
    </div>`;
    // displaying on UI
    containerMovements.insertAdjacentHTML("afterbegin", movHtml);
  });
};

//display total balance (using reduce)  ===================================>
const displayBalance = function (accSingle) {
  accSingle.balance = accSingle.movements.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  //main balance currency format using formatCur function
  const mainBalance = formatCur(
    accSingle.balance,
    accSingle.locale,
    accSingle.currency
  );
  labelBalance.innerHTML = `${mainBalance}`;
};

//display summary (income, outgoing, intrest)  ===================================>
const displaySummary = function (accSingle) {
  //calculating income (step 1. filter out positve amounts, 2. add all the amounts)
  const income = accSingle.movements
    .filter((mov) => {
      return mov > 0;
    })
    .reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  // displaying income
  labelSumIn.innerHTML = `${formatCur(
    income,
    accSingle.locale,
    accSingle.currency
  )}`;
  //calculatin outgoing
  const out = accSingle.movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  labelSumOut.innerHTML = `${formatCur(
    Math.abs(out),
    accSingle.locale,
    accSingle.currency
  )}`;
  //calculating intrest (based on user's intrest rate)
  const intrest = accSingle.movements
    .filter((mov) => {
      return mov > 0;
    })
    .map((mov) => {
      return (mov * accSingle.interestRate) / 100;
    })
    .reduce((acc, int) => {
      return acc + int;
    });
  labelSumInterest.innerHTML = `${formatCur(
    intrest,
    accSingle.locale,
    accSingle.currency
  )}`;
};

// computing username      ===================================>
const computeUsername = function (accs) {
  // looping through accounts array which have all the account object accout1,accoutn2 etc
  accs.forEach((accSingle) => {
    // steps (1.convert owner name to lowercase, 2.split it(string) to make it array, 3.use map to retrun first letter, 4.join the reult(array) to make string)
    accSingle.userName = accSingle.owner
      .toLowerCase()
      .split(" ")
      .map((accName) => {
        return accName[0];
      })
      .join("");
  });
};

computeUsername(accounts);

//update UI function      ===================================>
const updateUI = function (crtAcc) {
  //display movements
  displayMovements(crtAcc);
  //display balance
  displayBalance(crtAcc);
  //display summary
  displaySummary(crtAcc);
};

//event listeners

// login feature         ===================================>
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  //check for username (using find method)
  currentAccount = accounts.find((accOne) => {
    return accOne.userName == inputLoginUsername.value;
  });
  //checking for pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 1;
    // empty username and pin fields after login
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();
    //create main date for balance
    const now = new Date();

    // const year = now.getFullYear();
    // const month = String(now.getMonth() + 1).padStart(2, 0);
    // const date = String(now.getDate()).padStart(2, 0);
    // const hours = String(now.getHours()).padStart(2, 0);
    // const minutes = String(now.getMinutes()).padStart(2, 0);
    // options for local as object
    let options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    };
    const formatedDate = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // labelDate.textContent = `${date}/${month}/${year}, ${hours}:${minutes}`;
    labelDate.textContent = formatedDate;

    // reset timer
    if (timer) {
      clearInterval(timer);
    }
    timer = startTimerFunc();
    //update UI function
    updateUI(currentAccount);
  }
});

// transfer feature           ===================================>
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const rcvAcount = accounts.find((acc) => {
    return acc.userName == inputTransferTo.value;
  });

  // console.log(transferAmount, rcvAcount);
  //checking if transfer amount is greater than 0 and not grater than the total balance
  // also checking if reciver excist and sender and reciever are not same
  if (
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    rcvAcount &&
    rcvAcount.userName !== currentAccount.userName
  ) {
    //transfer amount
    currentAccount.movements.push(-transferAmount);
    // conditions for currency exchange ex. rupees to dollor
    if (currentAccount.currency == "USD" && rcvAcount.currency == "INR") {
      rcvAcount.movements.push(transferAmount * 64);
    } else if (
      currentAccount.currency == "INR" &&
      rcvAcount.currency == "USD"
    ) {
      rcvAcount.movements.push(transferAmount / 64);
    } else if (
      currentAccount.currency == "EUR" &&
      rcvAcount.currency == "USD"
    ) {
      rcvAcount.movements.push(transferAmount * 1.05);
    } else if (
      currentAccount.currency == "USD" &&
      rcvAcount.currency == "EUR"
    ) {
      rcvAcount.movements.push(transferAmount * 0.95);
    } else if (
      currentAccount.currency == "INR" &&
      rcvAcount.currency == "EUR"
    ) {
      rcvAcount.movements.push(transferAmount / 87);
    } else if (
      currentAccount.currency == "EUR" &&
      rcvAcount.currency == "INR"
    ) {
      rcvAcount.movements.push(transferAmount * 87);
    } else {
      rcvAcount.movements.push(transferAmount);
    }

    // empty fields
    inputTransferTo.value = inputTransferAmount.value = "";
    // transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    rcvAcount.movementsDates.push(new Date().toISOString());
    // reset timer
    clearInterval(timer);
    timer = startTimerFunc();
    //update UI
    updateUI(currentAccount);
  }
});

//  delete account feauture        ===================================>
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  //checking for username and user pin comparing with cuurent account
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // setting the index of current user comparing with acounts array
    const index = accounts.findIndex((acc) => {
      return acc.userName === currentAccount.userName;
    });
    // splice the accounts array with the index value we go using findIndex
    accounts.splice(index, 1);
    //hiding the UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
    // empty username and pin fields after login
    inputLoginUsername.focus();
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//takking loan feature          ===================================>
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(Number(inputLoanAmount.value));
  //our bank has a rule that there should be a minimum amount 10% of requested loan to approve loan
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => {
      return mov >= loanAmount * 0.1;
    })
  ) {
    //add loan amount to current user
    currentAccount.movements.push(loanAmount);
    //transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    // reset timer
    clearInterval(timer);
    timer = startTimerFunc();
    //update UI
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  }
});

//sorting features       ===================================>
let sorted = false;
btnSort.addEventListener("click", function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

const demoBox = document.querySelector(".demo-users");
document.querySelector(".demouser-det").addEventListener("click", function () {
  demoBox.classList.toggle("activedemo");
});

const closeICn = document.querySelector(".closeicon");
closeICn.addEventListener("click", function () {
  demoBox.classList.remove("activedemo");
});