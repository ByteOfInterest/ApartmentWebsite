function addressAutocomplete(containerElement, callback, options) {
    const MIN_ADDRESS_LENGTH = 3;
    const DEBOUNCE_DELAY = 300;
    let currentTimeout = null;
    let currentPromiseReject = null;
  
    // Create container for input element
    const inputContainerElement = document.createElement("div");
    inputContainerElement.setAttribute("class", "input-container");
    containerElement.appendChild(inputContainerElement);
  
    // Create input element
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", options.placeholder);
    inputContainerElement.appendChild(inputElement);
  
    /* Process a user input: */
    inputElement.addEventListener("input", function (e) {
      const currentValue = this.value;
  
      // Cancel previous timeout
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
  
      // Cancel previous request promise
      if (currentPromiseReject) {
        currentPromiseReject({
          canceled: true
        });
      }
  
      // Skip empty or short address strings
      if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
        return false;
      }
  
      /* Call the Address Autocomplete API with a delay */
      currentTimeout = setTimeout(() => {
        currentTimeout = null;
  
        /* Create a new promise and send geocoding request */
        const promise = new Promise((resolve, reject) => {
          currentPromiseReject = reject;
  
          // Get an API Key from https://myprojects.geoapify.com
          const apiKey = "17f4d8284a0842f78467c4e8075f65d7";
  
          var requestOptions = {
            method: 'GET',
          };
          
          fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=Mosco&apiKey=17f4d8284a0842f78467c4e8075f65d7", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        });
  
        promise.then(
          (data) => {
            // Here we get address suggestions
            console.log(data);
            callback(data); // Trigger the callback
          },
          (err) => {
            if (!err.canceled) {
              console.log(err);
            }
          }
        );
      }, DEBOUNCE_DELAY);
    });
  }
  
  // Call the autocomplete function
  addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
    console.log("Selected option:");
    console.log(data);
  }, {
    placeholder: "Enter an address here"
  });

// Function to initialize counter with a limit
function initializeCounter(increaseButtonId, decreaseButtonId, inputId, maxCount) {
  const increaseButton = document.getElementById(increaseButtonId);
  const decreaseButton = document.getElementById(decreaseButtonId);
  const peopleCountInput = document.getElementById(inputId);
  let peopleCount = parseInt(peopleCountInput.value, 10);

  // Initialize the buttons based on the count
  decreaseButton.disabled = peopleCount === 0;
  increaseButton.disabled = peopleCount >= maxCount;

  increaseButton.addEventListener('click', () => {
      if (peopleCount < maxCount) {
          peopleCount++;
          peopleCountInput.value = peopleCount;
          decreaseButton.disabled = false;
          if (peopleCount === maxCount) {
              increaseButton.disabled = true;
          }
      }
  });

  decreaseButton.addEventListener('click', () => {
      if (peopleCount > 0) {
          peopleCount--;
          peopleCountInput.value = peopleCount;
          increaseButton.disabled = false;
          if (peopleCount === 0) {
              decreaseButton.disabled = true;
          }
      }
  });

  // Handle manual input and Shift key to move to next input
  peopleCountInput.addEventListener('blur', () => {
      // Validate input when focus is lost
      let inputValue = parseInt(peopleCountInput.value, 10);
      if (isNaN(inputValue) || inputValue < 0) {
          inputValue = 0;
      }
      if (inputValue > maxCount) {
          inputValue = maxCount;
      }
      peopleCountInput.value = inputValue;
      peopleCount = inputValue;
      decreaseButton.disabled = peopleCount === 0;
      increaseButton.disabled = peopleCount >= maxCount;
  });

  peopleCountInput.addEventListener('keydown', (event) => {
      if (event.key === 'Shift') {
          // Move to the next input when Shift is pressed
          event.preventDefault();
          const nextInput = peopleCountInput.nextElementSibling;
          if (nextInput && nextInput.tagName === 'INPUT') {
              nextInput.focus();
          }
      }
  });
}

// Initialize counters with a maximum limit of 50
initializeCounter('adults-increase', 'adults-decrease', 'adults-count', 50);
initializeCounter('children-increase', 'children-decrease', 'children-count', 50);
