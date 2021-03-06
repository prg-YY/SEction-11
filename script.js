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

const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
  <div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${mov}???</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}???`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}???`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}???`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}???`;
};
const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUi = acc => {
  //Display movments
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event handler
let currentAccount;
let currentAccount1;
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //DIsplay UI welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUi(currentAccount);
  }
  console.log('LOGIN');
  // currentAccount1 = accounts.find(
  //   password => password.pin === Number(inputLoginPin.value)
  // );
  // console.log(currentAccount1);
});

//Transfer money

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Up date UI
    updateUi(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(move => move >= amount * 0.1)
  ) {
    //Add movement
    currentAccount.movements.push(amount);

    //Update Ui
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
//STW

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// //Slice
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice());
// console.log([...arr]);
// console.log(...arr);

// console.log('////////////////////////////////');
// //Splice
// // console.log(...arr.splice(2));
// arr.splice(-1);
// console.log(...arr);

// //Reverse
// arr = ['a', 'b', 'c', 'd', 'e'];
// let arr2 = ['h', 'j', 'L', 'M'];

// console.log(arr.reverse());

// //Concat
// const letters = arr.concat(arr2);
// console.log([...arr, ...arr2]);
// console.log(letters);

// //Join
// console.log(letters.join('-'));

//AT
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr.at(2));
// //Getting last array element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1));
// console.log(arr.at(-1));
// console.log('Josub'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (let movement of movements) {
//   if (movement > 0) {
//     console.log(`Your Deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('////////////////////');
// movements.forEach(movement => {
//   if (movement > 0) {
//     console.log(`Your Deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// });
// console.log('...../////////');
// for (const [i, movement1] of movements.entries()) {
//   if (movement1 > 0) {
//     console.log(`Movement ${i + 1}:Your Deposited ${movement1}`);
//   } else {
//     console.log(`Movement ${i + 1}:You withdrew ${Math.abs(movement1)}`);
//   }
// }

//FOrEACH
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });
// //SET

// const arr2 = new Set(['USA', 'GAP', 'USA', 'EUR', 'EUR']);
// console.log(arr2);
// arr2.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Juliafoundoutthattheownersofthefirstandthelasttwodogsactuallyhave cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
// 2. CreateanarraywithbothJulia's(corrected)andKate'sdata
// 3. Foreachremainingdog,logtotheconsolewhetherit'sanadult("Dognumber1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy   ")
// 4. Runthefunctionforbothtestdatasets
// Test data:
// ?? Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3] ?? Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far ????

//Chanllenge 1
// const checkDogs = (dogsJulia, dogsKate) => {
//   const juliasCurDogs = dogsJulia.slice();
//   juliasCurDogs.splice(0, 1);
//   juliasCurDogs.splice(2, 4);
//   console.log(juliasCurDogs);

//   const dogs = juliasCurDogs.concat(dogsKate);
//   console.log(dogs);

//   dogs.forEach((dog, i) => {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years ol`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy  ????`);
//     }
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

//MAP//////////////////////////////////////////
// const eurToUsd = 1.1;
// const movUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movUSD);

// const moveUSDFor = [];
// for (let mov of movements) moveUSDFor.push(mov * eurToUsd);
// console.log(moveUSDFor);

// const movDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1} : You ${mov > 0 ? 'Deposited' : 'Withdraw'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movDescription);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(mov => {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (let mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrew = movements.filter(mov => {
//   return mov < 0;
// });
// console.log(withdrew);

// const withdrewFor = [];
// for (let mov of movements) if (mov < 0) withdrewFor.push(mov);
// console.log(withdrewFor);

//Reduce
// console.log(movements);
// const balance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);
// console.log(balance);

// let balance2 = 0;
// for (let mov of movements) balance2 += mov;
// console.log(balance2);

// //Maximum value
// const max = movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   movements[0]
// );
// console.log(max);

// TEST DATA 1: [5,2,4,1,15,8,3]
// TEST DATA 2: [16,6,10,5,6,1,4]
// const calcAverageHumanAge = ages => {
//   const humanAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   console.log(humanAge);
//   const adult = humanAge.filter(age => age > 18);
//   console.log(adult);
//   // const average = adult.reduce((acc, age) => acc + age, 0) / adult.length;
//   const average = adult.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   return average;
// };
// const aveg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const aveg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(aveg1, aveg2);

// const eurToUsd = 1.1;

// //PIPELINE
// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     // console.log(arr);
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositUSD);

// ///Chanllange 2

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// const aveAge1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const aveAge2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(aveAge1, aveAge2);

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => (acc.owner = 'Jonas Schmedtmann'));
// console.log(account);

// console.log(movements);
// //EQUALITY
// console.log(movements.includes(-130));

// // some CONDITION
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// //EVERY
// console.log(movements.every(mov => mov > 0));

// //Separate callback
// const deposit = mov => mov > 0;

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat(5));
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// //flat
// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// //flatMap
// const overalBalance1 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance1);

//String sort

// const owners = ['Josub', 'Jacob', 'Jasin', 'Batur', 'Martha'];
// console.log(owners);
// console.log(owners.sort());
// console.log(owners);

// //Numbers
// console.log(movements);
// console.log(movements.sort());

// //retun < 0,A,B (keep order)
// //return >0 ,B , A (Switch order)

// //Ascending order
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });
// movements.sort((a, b) => a - b);
// console.log(movements);

// //Decending order
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array([1, 2, 3, 4, 5, 6, 7]));

// //Emty arrays + fill method
// const x = new Array(7);
// console.log(x);

// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 4, 6);
// console.log(arr);

// //Array.form
// const y = Array.from({ length: 7 }, () => 1);
// const z = Array.from({ length: 7 }, (cur, i) => i + 1, 0);
// console.log(y);
// console.log(z);

// labelBalance.addEventListener('click', () => {
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('???', ''))
//   );
//   console.log(movementUI);

//   const movementUI2 = [...document.querySelectorAll('.movements__value')];
//   console.log(movementUI2);
// });

//1,
const backDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, acc) => sum + acc, 0);
console.log(backDepositSum);

//2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

//3,
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//4.

//Chanllange 4
