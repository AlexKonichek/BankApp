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

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  console.log(acc.movements)
 acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
 labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
     // console.log(acc.username)
  });
};
createUsernames(accounts);

const updateUI = function(acc){
  displayMovements(acc.movements)

  calcDisplayBalance(acc)

  calcDisplaySummary(acc)
}


//login event handlers
let currentAcount;
btnLogin.addEventListener('click',function(e){
  e.preventDefault()

  currentAcount= accounts.find(
    acc => acc.username === inputLoginUsername.value)
    //console.log(currentAcount)
  if(currentAcount?.pin === Number(inputLoginPin.value)){
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAcount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear inputs fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
   
    updateUI(currentAcount);

    
  }
});


//implamenting money transfering 
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  console.log(amount,receiverAcc)

  if (amount>0 && receiverAcc &&  currentAcount.balance>=amount && receiverAcc?.username !== receiverAcc){
     console.log('transfer is valid')
     //doing the  money transfer
     currentAcount.movements.push(-amount);
     receiverAcc.movements.push(amount);
     inputTransferAmount.value = inputTransferTo.value =''
     //update UI
     updateUI(currentAcount);
  }
  else{console.log('transfer is  NOT valid')}
})

//requesting a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault()
  const amount = Math.floor(inputLoanAmount.value)
//you should add some varification on inputs
  if (amount > 0 && currentAcount.movements.some(mov => mov >= amount * 0.1)) {
   console.log('valid loan')
    //add the movement to current account
    currentAcount.movements.push(amount);
    //update UI
    updateUI(currentAcount);
    inputLoanAmount.value = ''
  }
  else{inputLoanAmount.value = ''
  
    
    }
})


//close account  feature
btnClose.addEventListener('click', function (e) {
  e.preventDefault()

  console.log(currentAcount)
  const closeName = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);

  if(closeName === currentAcount.username && closePin === currentAcount.pin){
    const index = accounts.findIndex(acc=> acc.username===closeName)
  //delete acount
    accounts.splice(index,1)
  //hide UI
  containerApp.style.opacity = 0;
  }
  closeName=closePin='';

  
})



