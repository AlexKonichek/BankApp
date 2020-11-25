'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-11-25T18:49:59.371Z',
    '2020-11-24T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
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
    '2020-11-25T18:49:59.371Z',
    '2020-11-24T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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
const now = new Date()

const formatMovementsDate = function (date) {
      const calcDayPassed = (date1, date2) => 
        Math.round(Math.abs(date2 - date1)/(1000*60*60*24));  
            const day = `${date.getDate()}`.padStart(2,0);
            const month = `${date.getMonth()+1}`.padStart(2,0);
            const year = date.getFullYear();
            const min = `${now.getMinutes()}`.padStart(2,0);
            const hour = `${now.getHours()}`.padStart(2,0);
            const dayPassed = calcDayPassed(new Date(), date);
          if(dayPassed===0)return `Today at ${hour}:${min}`;
          if(dayPassed===1)return `Yesterday at ${hour}:${min}`;
          else{
            return `${day}/${month}/${year}`;
        }
        

  
  
}
const displayMovements = function (acc, sort = false) {
      containerMovements.innerHTML = '';
      const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

      movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementsDate(date);
        console.log(formatMovementsDate(date));
        const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
          i + 1
        } ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${mov.toFixed(2)}€</div>
          </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
      });
};

const calcDisplayBalance = function (acc) {
      
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

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 1 minute
  let time = 15;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

document.addEventListener('click', function () {
  clearInterval(timer);
    timer = startLogOutTimer();
  
})
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
      displayMovements(acc)

      calcDisplayBalance(acc)

      calcDisplaySummary(acc)
}





//login event handlers
let currentAcount, timer

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


//create current date

const day = `${now.getDate()}`.padStart(2,0);
const month = `${now.getMonth()+1}`.padStart(2,0);
const year = now.getFullYear();
const min = `${now.getMinutes()}`.padStart(2,0);
const hour = `${now.getHours()}`.padStart(2,0);
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

// Timer
if (timer) clearInterval(timer);
timer = startLogOutTimer();

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
     //add the date of the transfer
     currentAcount.movementsDates.push(new Date().toISOString());
     receiverAcc.movementsDates.push(new Date().toISOString());
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
        // add loan date
        currentAcount.movementsDates.push(new Date().toISOString());
        console.log(new Date())
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



