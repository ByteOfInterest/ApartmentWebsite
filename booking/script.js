function addressAutocomplete(containerElement, callback, options) {

  const MIN_ADDRESS_LENGTH = 3;
  const DEBOUNCE_DELAY = 300;

  // create container for input element
  const inputContainerElement = document.createElement("div");
  inputContainerElement.setAttribute("class", "input-container");
  containerElement.appendChild(inputContainerElement);

  // create input element
  const inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  inputContainerElement.appendChild(inputElement);

  // add input field clear button
  const clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = '';
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  inputContainerElement.appendChild(clearButton);

  /* We will call the API with a timeout to prevent unneccessary API activity.*/
  let currentTimeout;

  /* Save the current request promise reject function. To be able to cancel the promise when a new request comes */
  let currentPromiseReject;

  /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
  let focusedItemIndex;

  /* Process a user input: */
  inputElement.addEventListener("input", function(e) {
    const currentValue = this.value;

    /* Close any already open dropdown list */
    closeDropDownList();


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

    if (!currentValue) {
      clearButton.classList.remove("visible");
    }

    // Show clearButton when there is a text
    clearButton.classList.add("visible");

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

        const apiKey = config.apiKey;

        var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${apiKey}`;

        fetch(url)
          .then(response => {
            currentPromiseReject = null;

            // check if the call was successful
            if (response.ok) {
              response.json().then(data => resolve(data));
            } else {
              response.json().then(data => reject(data));
            }
          });
      });

      promise.then((data) => {
        // here we get address suggestions
        currentItems = data.results;

        /*create a DIV element that will contain the items (values):*/
        const autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "autocomplete-items");
        inputContainerElement.appendChild(autocompleteItemsElement);

        /* For each item in the results */
        data.results.forEach((result, index) => {
          /* Create a DIV element for each element: */
          const itemElement = document.createElement("div");
          /* Set formatted address as item value */
          itemElement.innerHTML = result.formatted;
          autocompleteItemsElement.appendChild(itemElement);

          /* Set the value for the autocomplete text field and notify: */
          itemElement.addEventListener("click", function(e) {
            inputElement.value = currentItems[index].formatted;
            callback(currentItems[index]);
            /* Close the list of autocompleted values: */
            closeDropDownList();
          });
        });

      }, (err) => {
        if (!err.canceled) {
          console.log(err);
        }
      });
    }, DEBOUNCE_DELAY);
  });

  /* Add support for keyboard navigation */
  inputElement.addEventListener("keydown", function(e) {
    var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      var itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 38) {
        e.preventDefault();

        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 13) {
        /* If the ENTER key is pressed and value as selected, close the list*/
        e.preventDefault();
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else {
      if (e.keyCode == 40) {
        /* Open dropdown list again */
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        inputElement.dispatchEvent(event);
      }
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].formatted;
    callback(currentItems[index]);
  }

  function closeDropDownList() {
    const autocompleteItemsElement = inputContainerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      inputContainerElement.removeChild(autocompleteItemsElement);
    }

    focusedItemIndex = -1;
  }

  function addIcon(buttonElement) {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svgElement.setAttribute('viewBox', "0 0 24 24");
    svgElement.setAttribute('height', "24");

    const iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    iconElement.setAttribute('fill', 'currentColor');
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }
  
    /* Close the autocomplete dropdown when the document is clicked. 
      Skip, when a user clicks on the input field */
  document.addEventListener("click", function(e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      // open dropdown list again
      var event = document.createEvent('Event');
      event.initEvent('input', true, true);
      inputElement.dispatchEvent(event);
    }
  });
}

addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
  console.log("Selected option: ");
  console.log(data);
}, {
  placeholder: "Adjon meg egy címet"
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

// Initialize counters with a maximum limit of 10
initializeCounter('adults-increase', 'adults-decrease', 'adults-count', 10);
initializeCounter('children-increase', 'children-decrease', 'children-count', 10);

// Function to handle adults count (no age inputs involved)
function handleAdultsCounter() {
  const increaseButton = document.getElementById('adults-increase');
  const decreaseButton = document.getElementById('adults-decrease');
  const adultsCountInput = document.getElementById('adults-count');
  const maxCount = 10;
  let adultsCount = parseInt(adultsCountInput.value, 10);

  increaseButton.addEventListener('click', () => {
      if (adultsCount < maxCount) {
          adultsCount++;
          adultsCountInput.value = adultsCount;
          decreaseButton.disabled = adultsCount === 0;
          increaseButton.disabled = adultsCount === maxCount;
      }
  });

  decreaseButton.addEventListener('click', () => {
      if (adultsCount > 0) {
          adultsCount--;
          adultsCountInput.value = adultsCount;
          decreaseButton.disabled = adultsCount === 0;
          increaseButton.disabled = adultsCount === maxCount;
      }
  });
}

// Function to handle children count and dynamically add/remove age fields
function handleChildrenCounter() {
  const increaseButton = document.getElementById('children-increase');
  const decreaseButton = document.getElementById('children-decrease');
  const childrenCountInput = document.getElementById('children-count');
  const ageContainer = document.getElementById('children-age-container');
  const maxCount = 10;
  let childrenCount = parseInt(childrenCountInput.value, 10);

  increaseButton.addEventListener('click', () => {
      if (childrenCount < maxCount) {
          childrenCount++;
          childrenCountInput.value = childrenCount;
          decreaseButton.disabled = childrenCount === 0;
          increaseButton.disabled = childrenCount === maxCount;
          updateAgeFields(childrenCount, ageContainer);
      }
  });

  decreaseButton.addEventListener('click', () => {
      if (childrenCount > 0) {
          childrenCount--;
          childrenCountInput.value = childrenCount;
          decreaseButton.disabled = childrenCount === 0;
          increaseButton.disabled = childrenCount === maxCount;
          updateAgeFields(childrenCount, ageContainer);
      }
  });
}

// Function to update children age fields
function updateAgeFields(count, container) {
  container.innerHTML = ''; // Clear existing fields
  for (let i = 1; i <= count; i++) {
      const ageField = document.createElement('div');
      ageField.className = 'age-field';
      ageField.innerHTML = `
          <label for="child-age-${i}">Gyermek ${i} életkora:</label>
          <input type="number" id="child-age-${i}" class="child-age-input" min="0" max="17" placeholder="Életkor">
      `;
      container.appendChild(ageField);
  }
}

// Initialize separate counters
handleAdultsCounter();
handleChildrenCounter();

// Calendar code
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");

const currdate = document
    .querySelector(".calendar-current-date");

const prenexIcons = document
    .querySelectorAll(".calendar-navigation span");

// Array of month names
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// Function to generate the calendar
const manipulate = () => {

    // Get the first day of the month
    let dayone = new Date(year, month, 1).getDay();

    // Get the last date of the month
    let lastdate = new Date(year, month + 1, 0).getDate();

    // Get the day of the last date of the month
    let dayend = new Date(year, month, lastdate).getDay();

    // Get the last date of the previous month
    let monthlastdate = new Date(year, month, 0).getDate();

    // Variable to store the generated calendar HTML
    let lit = "";

    // Loop to add the last dates of the previous month
    for (let i = dayone; i > 0; i--) {
        lit +=
            `<li class="inactive">${monthlastdate - i + 1}</li>`;
    }

    // Loop to add the dates of the current month
    for (let i = 1; i <= lastdate; i++) {

        // Check if the current date is today
        let isToday = i === date.getDate()
            && month === new Date().getMonth()
            && year === new Date().getFullYear()
            ? "active"
            : "";
        lit += `<li class="${isToday}">${i}</li>`;
    }

    // Loop to add the first dates of the next month
    for (let i = dayend; i < 6; i++) {
        lit += `<li class="inactive">${i - dayend + 1}</li>`
    }

    // Update the text of the current date element 
    // with the formatted current month and year
    currdate.innerText = `${months[month]} ${year}`;

    // update the HTML of the dates element 
    // with the generated calendar
    day.innerHTML = lit;
}

manipulate();

// Attach a click event listener to each icon
prenexIcons.forEach(icon => {

    // When an icon is clicked
    icon.addEventListener("click", () => {

        // Check if the icon is "calendar-prev"
        // or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        // Check if the month is out of range
        if (month < 0 || month > 11) {

            // Set the date to the first day of the 
            // month with the new year
            date = new Date(year, month, new Date().getDate());

            // Set the year to the new year
            year = date.getFullYear();

            // Set the month to the new month
            month = date.getMonth();
        }

        else {

            // Set the date to the current date
            date = new Date();
        }

        // Call the manipulate function to 
        // update the calendar display
        manipulate();
    });
});

// Generate a random 5-digit security code
function generateSecurityCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Ensure the DOM is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  // Display the security code
  const securityCode = generateSecurityCode();
  document.getElementById('security-code-display').textContent = securityCode;

  // Optional: Pre-fill the hidden input field for validation on the server
  document.getElementById('security-code').setAttribute('data-actual-code', securityCode);
});

// Attach a submit event to validate the security code
document.querySelector('form').addEventListener('submit', function (event) {
  const userCode = document.getElementById('security-code').value;
  const actualCode = document.getElementById('security-code-display').textContent;

  if (userCode !== actualCode) {
      event.preventDefault();
      alert('Hibás biztonsági kód! Próbálja újra.');
  }
});