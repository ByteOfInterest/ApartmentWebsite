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

// Function to initialize counter
function initializeCounter(increaseButtonId, decreaseButtonId, inputId) {
  const increaseButton = document.getElementById(increaseButtonId);
  const decreaseButton = document.getElementById(decreaseButtonId);
  const peopleCountInput = document.getElementById(inputId);
  let peopleCount = parseInt(peopleCountInput.value, 10);

  increaseButton.addEventListener('click', () => {
      peopleCount++;
      peopleCountInput.value = peopleCount;
      decreaseButton.disabled = false;
  });

  decreaseButton.addEventListener('click', () => {
      if (peopleCount > 0) {
          peopleCount--;
          peopleCountInput.value = peopleCount;
          if (peopleCount === 0) {
              decreaseButton.disabled = true;
          }
      }
  });
}

// Initialize counters
initializeCounter('adults-increase', 'adults-decrease', 'adults-count');
initializeCounter('children-increase', 'children-decrease', 'children-count');
