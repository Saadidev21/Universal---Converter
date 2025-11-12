// Comprehensive conversion functions
const conversionFunctions = {
  // Length
  'miles-km': (value) => value * 1.60934,
  'km-miles': (value) => value * 0.621371,
  'feet-meters': (value) => value * 0.3048,
  'meters-feet': (value) => value * 3.28084,
  'inches-cm': (value) => value * 2.54,
  'cm-inches': (value) => value * 0.393701,
  'inches-feet': (value) => value / 12,
  'feet-inches': (value) => value * 12,
  'feet-miles': (value) => value / 5280,
  'miles-feet': (value) => value * 5280,
  'km-feet': (value) => value * 3280.84,
  'feet-km': (value) => value / 3280.84,
  'cm-feet': (value) => value / 30.48,
  'feet-cm': (value) => value * 30.48,
  
  // Weight/Mass
  'kg-pounds': (value) => value * 2.20462,
  'pounds-kg': (value) => value * 0.453592,
  'kg-grams': (value) => value * 1000,
  'grams-kg': (value) => value / 1000,
  'pounds-grams': (value) => value * 453.592,
  'grams-pounds': (value) => value / 453.592,
  'kg-ounces': (value) => value * 35.274,
  'ounces-kg': (value) => value / 35.274,
  
  // Volume
  'ml-liters': (value) => value / 1000,
  'liters-ml': (value) => value * 1000,
  'ml-gallons': (value) => value / 3785.41,
  'gallons-ml': (value) => value * 3785.41,
  'liters-gallons': (value) => value / 3.78541,
  'gallons-liters': (value) => value * 3.78541,
  'cups-ml': (value) => value * 236.588,
  'ml-cups': (value) => value / 236.588,
  
  // Temperature
  'fahrenheit-celsius': (value) => (value - 32) * 5/9,
  'celsius-fahrenheit': (value) => (value * 9/5) + 32
};

// REAL-TIME CURRENCY API
async function getLiveCurrencyRates(baseCurrency) {
  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
    
    if (!response.ok) throw new Error('API response not OK');
    
    const data = await response.json();
    
    if (data && data.rates) {
      return {
        USD: data.rates.USD || 1,
        EUR: data.rates.EUR || 0.93,
        GBP: data.rates.GBP || 0.80,
        JPY: data.rates.JPY || 150.0,
        PKR: data.rates.PKR || 278.0,
        INR: data.rates.INR || 83.0,
        CAD: data.rates.CAD || 1.35,
        AUD: data.rates.AUD || 1.52,
        CNY: data.rates.CNY || 7.25
      };
    }
    throw new Error('Invalid API response');
  } catch (error) {
    return {
      USD: 1, EUR: 0.93, GBP: 0.80, JPY: 150.0, 
      PKR: 278.0, INR: 83.0, CAD: 1.35, AUD: 1.52,
      CNY: 7.25
    };
  }
}

// SIMPLE MATH FUNCTION
function calculateMath(input) {
  try {
    let expression = input.toLowerCase().replace(/\s+/g, '');
    
    // Handle percentage
    if (expression.includes('%')) {
      if (expression.includes('%of')) {
        const parts = expression.split('%of');
        if (parts.length === 2) {
          const percent = parseFloat(parts[0]);
          const number = parseFloat(parts[1]);
          if (!isNaN(percent) && !isNaN(number)) {
            return (percent * number) / 100;
          }
        }
      }
      const num = parseFloat(expression.replace('%', ''));
      if (!isNaN(num)) return num / 100;
    }
    
    // Handle average
    if (expression.includes('average') || expression.includes('avg')) {
      const numbers = input.match(/\d+\.?\d*/g);
      if (numbers && numbers.length > 0) {
        const sum = numbers.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        return sum / numbers.length;
      }
    }
    
    // Replace common terms
    expression = expression
      .replace(/into/g, '*')
      .replace(/x/g, '*')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/dividedby/g, '/')
      .replace(/plus/g, '+')
      .replace(/minus/g, '-')
      .replace(/multiply/g, '*');
    
    if (/^[0-9+\-*/().]+$/.test(expression)) {
      const result = eval(expression);
      return !isNaN(result) ? result : null;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// FIND ALL NUMBER-UNIT PAIRS IN TEXT
function findAllConversions(text) {
  const conversions = [];
  const lowerText = text.toLowerCase();
  
  // Define patterns to find number+unit pairs
  const patterns = [
    // Length
    { regex: /(\d+\.?\d*)\s*(mile|miles)/gi, type: 'length', unit: 'miles', key: 'miles' },
    { regex: /(\d+\.?\d*)\s*(km|kilometer|kilometers)/gi, type: 'length', unit: 'km', key: 'km' },
    { regex: /(\d+\.?\d*)\s*(feet|ft|foot)/gi, type: 'length', unit: 'feet', key: 'feet' },
    { regex: /(\d+\.?\d*)\s*(inch|inches|")/gi, type: 'length', unit: 'inches', key: 'inches' },
    
    // Weight
    { regex: /(\d+\.?\d*)\s*(kg|kilo|kilos|kilogram|kilograms)/gi, type: 'weight', unit: 'kg', key: 'kg' },
    { regex: /(\d+\.?\d*)\s*(pound|pounds|lb)/gi, type: 'weight', unit: 'pounds', key: 'pounds' },
    
    // Volume
    { regex: /(\d+\.?\d*)\s*(cup|cups)/gi, type: 'volume', unit: 'cups', key: 'cups' },
    { regex: /(\d+\.?\d*)\s*(ml|milliliter|milliliters)/gi, type: 'volume', unit: 'ml', key: 'ml' },
    { regex: /(\d+\.?\d*)\s*(gallon|gallons)/gi, type: 'volume', unit: 'gallons', key: 'gallons' },
    
    // Temperature
    { regex: /(\d+\.?\d*)\s*(°?c|celsius|celcius)/gi, type: 'temperature', unit: 'celsius', key: 'celsius' },
    { regex: /(\d+\.?\d*)\s*(°?f|fahrenheit)/gi, type: 'temperature', unit: 'fahrenheit', key: 'fahrenheit' },
    
    // Currency
    { regex: /(\d+\.?\d*)\s*(\$|usd|dollar|dollars)/gi, type: 'currency', unit: 'USD', key: 'usd' },
    { regex: /(\d+\.?\d*)\s*(pkr|rupee|rupees)/gi, type: 'currency', unit: 'PKR', key: 'pkr' },
    { regex: /(\d+\.?\d*)\s*(inr|₹|indian rupee|indian rupees)/gi, type: 'currency', unit: 'INR', key: 'inr' },
    { regex: /(\d+\.?\d*)\s*(cny|yuan|renminbi|chinese yuan)/gi, type: 'currency', unit: 'CNY', key: 'cny' },
    { regex: /(\d+\.?\d*)\s*(eur|€|euro|euros)/gi, type: 'currency', unit: 'EUR', key: 'eur' },
    { regex: /(\d+\.?\d*)\s*(gbp|£|pound sterling|british pound)/gi, type: 'currency', unit: 'GBP', key: 'gbp' },
    { regex: /(\d+\.?\d*)\s*(jpy|¥|japanese yen)/gi, type: 'currency', unit: 'JPY', key: 'jpy' }
  ];
  
  // Find all matches
  patterns.forEach(pattern => {
    const matches = [...text.matchAll(pattern.regex)];
    matches.forEach(match => {
      const value = parseFloat(match[1]);
      conversions.push({
        value: value,
        type: pattern.type,
        unit: pattern.unit,
        key: pattern.key,
        originalText: match[0]
      });
    });
  });
  
  return conversions;
}

async function convertText() {
  const inputText = document.getElementById('inputText').value;
  const resultsDiv = document.getElementById('results');
  
  let resultsHTML = '<h3>Conversion Results:</h3>';
  let foundAny = false;

  // FIRST: Check for standalone math expressions
  const mathResult = calculateMath(inputText);
  if (mathResult !== null && inputText.replace(/\s+/g, '').match(/^[0-9+\-*/().]+$/)) {
    resultsHTML += `<p><strong>Math Calculation:</strong> ${inputText} = ${mathResult}</p>`;
    foundAny = true;
  }

  // FIND ALL CONVERSIONS IN THE TEXT
  const conversions = findAllConversions(inputText);
  
  if (conversions.length > 0) {
    foundAny = true;
    
    for (const conv of conversions) {
      resultsHTML += `<p><strong>Found: ${conv.originalText}</strong></p>`;
      
      switch (conv.type) {
        case 'length':
          if (conv.key === 'miles') {
            const km = conversionFunctions['miles-km'](conv.value);
            resultsHTML += `<p>→ ${conv.value} miles = ${km.toFixed(2)} km</p>`;
          }
          else if (conv.key === 'km') {
            const miles = conversionFunctions['km-miles'](conv.value);
            resultsHTML += `<p>→ ${conv.value} km = ${miles.toFixed(2)} miles</p>`;
          }
          else if (conv.key === 'feet') {
            const inches = conversionFunctions['feet-inches'](conv.value);
            const cm = conversionFunctions['feet-cm'](conv.value);
            const meters = conversionFunctions['feet-meters'](conv.value);
            resultsHTML += `<p>→ ${conv.value} feet = ${inches.toFixed(2)} inches</p>`;
            resultsHTML += `<p>→ ${conv.value} feet = ${cm.toFixed(2)} cm</p>`;
            resultsHTML += `<p>→ ${conv.value} feet = ${meters.toFixed(2)} meters</p>`;
          }
          else if (conv.key === 'inches') {
            const cm = conversionFunctions['inches-cm'](conv.value);
            const feet = conversionFunctions['inches-feet'](conv.value);
            resultsHTML += `<p>→ ${conv.value} inches = ${cm.toFixed(2)} cm</p>`;
            resultsHTML += `<p>→ ${conv.value} inches = ${feet.toFixed(2)} feet</p>`;
          }
          break;
          
        case 'weight':
          if (conv.key === 'kg') {
            const pounds = conversionFunctions['kg-pounds'](conv.value);
            const grams = conversionFunctions['kg-grams'](conv.value);
            resultsHTML += `<p>→ ${conv.value} kg = ${pounds.toFixed(2)} pounds</p>`;
            resultsHTML += `<p>→ ${conv.value} kg = ${grams.toFixed(2)} grams</p>`;
          }
          else if (conv.key === 'pounds') {
            const kg = conversionFunctions['pounds-kg'](conv.value);
            resultsHTML += `<p>→ ${conv.value} pounds = ${kg.toFixed(2)} kg</p>`;
          }
          break;
          
        case 'volume':
          if (conv.key === 'cups') {
            const ml = conversionFunctions['cups-ml'](conv.value);
            resultsHTML += `<p>→ ${conv.value} cups = ${ml.toFixed(2)} ml</p>`;
          }
          else if (conv.key === 'gallons') {
            const liters = conversionFunctions['gallons-liters'](conv.value);
            const ml = conversionFunctions['gallons-ml'](conv.value);
            resultsHTML += `<p>→ ${conv.value} gallons = ${liters.toFixed(2)} liters</p>`;
            resultsHTML += `<p>→ ${conv.value} gallons = ${ml.toFixed(2)} ml</p>`;
          }
          else if (conv.key === 'ml') {
            const liters = conversionFunctions['ml-liters'](conv.value);
            const gallons = conversionFunctions['ml-gallons'](conv.value);
            resultsHTML += `<p>→ ${conv.value} ml = ${liters.toFixed(3)} liters</p>`;
            resultsHTML += `<p>→ ${conv.value} ml = ${gallons.toFixed(4)} gallons</p>`;
          }
          break;
          
        case 'temperature':
          if (conv.key === 'celsius') {
            const fahrenheit = conversionFunctions['celsius-fahrenheit'](conv.value);
            resultsHTML += `<p>→ ${conv.value}°C = ${fahrenheit.toFixed(1)}°F</p>`;
          }
          else if (conv.key === 'fahrenheit') {
            const celsius = conversionFunctions['fahrenheit-celsius'](conv.value);
            resultsHTML += `<p>→ ${conv.value}°F = ${celsius.toFixed(1)}°C</p>`;
          }
          break;
          
        case 'currency':
          if (conv.key === 'usd') {
            const rates = await getLiveCurrencyRates('USD');
            resultsHTML += `<p>→ ${conv.value} USD = ${(conv.value * rates.EUR).toFixed(2)} EUR</p>`;
            resultsHTML += `<p>→ ${conv.value} USD = ${(conv.value * rates.GBP).toFixed(2)} GBP</p>`;
            resultsHTML += `<p>→ ${conv.value} USD = ${(conv.value * rates.JPY).toFixed(2)} JPY</p>`;
            resultsHTML += `<p>→ ${conv.value} USD = ${(conv.value * rates.PKR).toFixed(2)} PKR</p>`;
            resultsHTML += `<p>→ ${conv.value} USD = ${(conv.value * rates.INR).toFixed(2)} INR</p>`;
            resultsHTML += `<p>→ ${conv.value} USD = ${(conv.value * rates.CNY).toFixed(2)} CNY</p>`;
          }
          else if (conv.key === 'inr') {
            const rates = await getLiveCurrencyRates('INR');
            resultsHTML += `<p>→ ${conv.value} INR = ${(conv.value * rates.USD).toFixed(2)} USD</p>`;
            resultsHTML += `<p>→ ${conv.value} INR = ${(conv.value * rates.EUR).toFixed(2)} EUR</p>`;
            resultsHTML += `<p>→ ${conv.value} INR = ${(conv.value * rates.GBP).toFixed(2)} GBP</p>`;
            resultsHTML += `<p>→ ${conv.value} INR = ${(conv.value * rates.PKR).toFixed(2)} PKR</p>`;
          }
          else if (conv.key === 'pkr') {
            const rates = await getLiveCurrencyRates('PKR');
            resultsHTML += `<p>→ ${conv.value} PKR = ${(conv.value * rates.USD).toFixed(2)} USD</p>`;
            resultsHTML += `<p>→ ${conv.value} PKR = ${(conv.value * rates.EUR).toFixed(2)} EUR</p>`;
            resultsHTML += `<p>→ ${conv.value} PKR = ${(conv.value * rates.INR).toFixed(2)} INR</p>`;
          }
          else if (conv.key === 'eur') {
            const rates = await getLiveCurrencyRates('EUR');
            resultsHTML += `<p>→ ${conv.value} EUR = ${(conv.value * rates.USD).toFixed(2)} USD</p>`;
            resultsHTML += `<p>→ ${conv.value} EUR = ${(conv.value * rates.GBP).toFixed(2)} GBP</p>`;
            resultsHTML += `<p>→ ${conv.value} EUR = ${(conv.value * rates.INR).toFixed(2)} INR</p>`;
          }
          else if (conv.key === 'gbp') {
            const rates = await getLiveCurrencyRates('GBP');
            resultsHTML += `<p>→ ${conv.value} GBP = ${(conv.value * rates.USD).toFixed(2)} USD</p>`;
            resultsHTML += `<p>→ ${conv.value} GBP = ${(conv.value * rates.EUR).toFixed(2)} EUR</p>`;
            resultsHTML += `<p>→ ${conv.value} GBP = ${(conv.value * rates.INR).toFixed(2)} INR</p>`;
          }
          else if (conv.key === 'jpy') {
            const rates = await getLiveCurrencyRates('JPY');
            resultsHTML += `<p>→ ${conv.value} JPY = ${(conv.value * rates.USD).toFixed(2)} USD</p>`;
            resultsHTML += `<p>→ ${conv.value} JPY = ${(conv.value * rates.EUR).toFixed(2)} EUR</p>`;
          }
          else if (conv.key === 'cny') {
            const rates = await getLiveCurrencyRates('CNY');
            resultsHTML += `<p>→ ${conv.value} CNY = ${(conv.value * rates.USD).toFixed(2)} USD</p>`;
            resultsHTML += `<p>→ ${conv.value} CNY = ${(conv.value * rates.EUR).toFixed(2)} EUR</p>`;
          }
          break;
      }
      resultsHTML += `<br>`;
    }
  }

  if (!foundAny) {
    resultsHTML += '<p>No conversions or calculations found. Try: "12 inches", "2+2", "5 kg", "$100", "1 gallon"</p>';
  }
  
  resultsDiv.innerHTML = resultsHTML;
}
