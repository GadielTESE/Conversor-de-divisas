document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('currency-form');
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const resultDiv = document.getElementById('result');
    const swapButton = document.querySelector('.swap-button');
  
    // Inicializa las opciones de monedas
    const currencies = ["USD", "EUR", "MXN", "JPY", "GBP"]; // Agregar más si es necesario
    currencies.forEach(currency => {
      const optionFrom = document.createElement('option');
      optionFrom.value = currency;
      optionFrom.textContent = currency;
  
      const optionTo = optionFrom.cloneNode(true);
      fromCurrency.appendChild(optionFrom);
      toCurrency.appendChild(optionTo);
    });
  
    // Función para realizar el cálculo
    const calculateConversion = async () => {
      const amount = parseFloat(amountInput.value);
      const from = fromCurrency.value;
      const to = toCurrency.value;
  
      if (isNaN(amount) || !from || !to) {
        resultDiv.textContent = "Por favor, complete todos los campos.";
        return;
      }
  
      try {
        // Llama a la API para obtener tasas de cambio
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await response.json();
  
        if (!data.rates[to]) {
          resultDiv.textContent = "Conversión no disponible.";
          return;
        }
  
        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);
  
        resultDiv.innerHTML = `
          ${amount} ${from} equivale a <strong>${convertedAmount} ${to}</strong><br>
          Tasa: 1 ${from} = ${rate} ${to}
        `;
      } catch (error) {
        resultDiv.textContent = "Error al obtener tasas de cambio. Intente más tarde.";
        console.error(error);
      }
    };
  
    // Función para intercambiar las divisas y calcular automáticamente
    swapButton.addEventListener('click', () => {
      const fromValue = fromCurrency.value;
      const toValue = toCurrency.value;
  
      // Intercambiar valores
      fromCurrency.value = toValue;
      toCurrency.value = fromValue;
  
      // Realizar el cálculo automáticamente
      calculateConversion();
    });
  
    // Manejar el envío del formulario
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateConversion();
    });
  });
  