import './App.css';
import {useEffect, useState} from 'react';
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'https://api.apilayer.com/exchangerates_data/latest'
var myHeaders = new Headers();
myHeaders.append("apikey", "oTcdXW4tQCd1rrJic4IzC6oiaUpLpHoX");

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

function App() {

const [currencyOptions, setCurrencyOptions] = useState([])
const [fromCurrency, setFromCurrency] = useState()
const [toCurrency, setToCurrency] = useState()
const [exchangeRate, setExchangeRate] = useState()
const [amount, setAmount] = useState(1)
const [amountInFromCurrency, setamountInFromCurrency] = useState(true)


let toAmount, fromAmount

if (amountInFromCurrency) {
  fromAmount = amount
  toAmount = amount * exchangeRate
} else {
  toAmount = amount
  fromAmount = amount / exchangeRate
}


function handleFromAmountChange(e) {
  setAmount(e.target.value)
  setamountInFromCurrency(true)
}

function handleToAmountChange(e) {
  setAmount(e.target.value)
  setamountInFromCurrency(false)
}

  useEffect(() => {
    fetch(BASE_URL, requestOptions)
      .then(response => response.json())
      .then(data =>  {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
      .catch(error => console.log('error', error));
  }, [])

  useEffect(() => {
    if(fromCurrency !=null && toCurrency != null)
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`, requestOptions)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
  }, [fromCurrency,toCurrency])
  return (
    <div className="App">
      <main className='main'>
        <h1>Convert</h1>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectCurrency={fromCurrency}
          onChangeCurrency={e => setFromCurrency(e.target.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />
        <p>=</p>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectCurrency={toCurrency}
          onChangeCurrency={e => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />
      </main>
      <footer className='footer'>
        <h2>Made by Moshchenko</h2>
      </footer>
    </div>
  );
}

export default App;
