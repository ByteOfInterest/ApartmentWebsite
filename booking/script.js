function addressAutocomplete(containerElement, callback, options) {
  const MIN_ADDRESS_LENGTH = 3;
  const DEBOUNCE_DELAY = 300;
  let currentTimeout;
  let currentPromiseReject;
  let currentItems;
  let focusedItemIndex = -1;

  // Create container for input element
  const inputContainerElement = document.createElement("div");
  inputContainerElement.setAttribute("class", "input-container");
  containerElement.appendChild(inputContainerElement);

  // Create input element
  const inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  inputContainerElement.appendChild(inputElement);

  // Create clear button
  const clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  inputContainerElement.appendChild(clearButton);

  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = '';
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });

  inputElement.addEventListener("input", function(e) {
    const currentValue = this.value;

    if (!currentValue) {
      clearButton.classList.remove("visible");
    } else {
      clearButton.classList.add("visible");
    }

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

    // Skip short address strings
    if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
      closeDropDownList();
      return false;
    }

    // Call the Address Autocomplete API with a delay
    currentTimeout = setTimeout(() => {
      currentTimeout = null;
      const promise = new Promise((resolve, reject) => {
        currentPromiseReject = reject;
        const apiKey = "17f4d8284a0842f78467c4e8075f65d7";
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${apiKey}`;

        fetch(url)
          .then(response => {
            currentPromiseReject = null;
            if (response.ok) {
              response.json().then(data => resolve(data));
            } else {
              response.json().then(data => reject(data));
            }
          });
      });

      promise.then((data) => {
        currentItems = data.results;
        closeDropDownList();

        // Create dropdown list
        const autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "autocomplete-items");
        inputContainerElement.appendChild(autocompleteItemsElement);

        data.results.forEach((result, index) => {
          const itemElement = document.createElement("div");
          itemElement.innerHTML = result.formatted;
          autocompleteItemsElement.appendChild(itemElement);

          itemElement.addEventListener("click", function(e) {
            inputElement.value = currentItems[index].formatted;
            callback(currentItems[index]);
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

  // Handle keyboard navigation
  inputElement.addEventListener("keydown", function(e) {
    const autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      const itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.keyCode == 40) { // Down arrow
        e.preventDefault();
        focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 38) { // Up arrow
        e.preventDefault();
        focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : itemElements.length - 1;
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 13) { // Enter key
        e.preventDefault();
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else if (e.keyCode == 40) { // Reopen dropdown on down arrow
      const event = document.createEvent('Event');
      event.initEvent('input', true, true);
      inputElement.dispatchEvent(event);
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    items[index].classList.add("autocomplete-active");
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

  // Close dropdown when clicking outside
  document.addEventListener("click", function(e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      const event = document.createEvent('Event');
      event.initEvent('input', true, true);
      inputElement.dispatchEvent(event);
    }
  });

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
}

// Initialize the autocomplete
addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
  console.log("Selected option: ", data);
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

// Function to dynamically update age fields based on the number of children
function initializeCounter(increaseButtonId, decreaseButtonId, inputId, maxCount) {
  const increaseButton = document.getElementById(increaseButtonId);
  const decreaseButton = document.getElementById(decreaseButtonId);
  const peopleCountInput = document.getElementById(inputId);
  const ageContainer = document.getElementById('children-age-container');
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
          updateAgeFields(peopleCount, ageContainer);
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
          updateAgeFields(peopleCount, ageContainer);
      }
  });

  peopleCountInput.addEventListener('input', function(e) {
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
      updateAgeFields(peopleCount, ageContainer);
  });
}

// Function to dynamically update age fields based on the number of children
function updateAgeFields(count, container) {
  container.innerHTML = '';  // Clear the container
  if (count > 0) {
      for (let i = 1; i <= count; i++) {
          const ageInputDiv = document.createElement('div');
          ageInputDiv.setAttribute('class', 'age-input-container');
          const label = document.createElement('label');
          label.setAttribute('for', `child-age-${i}`);
          label.textContent = `Child ${i} age:`;

          const ageInput = document.createElement('input');
          ageInput.setAttribute('type', 'number');
          ageInput.setAttribute('id', `child-age-${i}`);
          ageInput.setAttribute('name', `child-age-${i}`);
          ageInput.setAttribute('min', '0');
          ageInput.setAttribute('max', '17');
          ageInput.setAttribute('placeholder', 'Age');

          ageInputDiv.appendChild(label);
          ageInputDiv.appendChild(ageInput);
          container.appendChild(ageInputDiv);
      }
  }
}

// Initialize the children counter with a max limit of 50
initializeCounter('children-increase', 'children-decrease', 'children-count', 50);

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