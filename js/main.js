/* ================================= 
  Helper Functions
==================================== */

function hide(e) {
    e.style.display = 'none';
}

function show(e) {
    e.style.display = 'block';
}

function getInputLabel(input) {
    return input.previousSibling.previousSibling;
}

/* ================================= 
  Creat Elements Functions
==================================== */

function creatTitleInput() {
    var filedset = document.getElementsByTagName('fieldset')[0]; 
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'other-title';
    input.name = 'user_title';
    input.placeholder = 'Your Title';
    filedset.appendChild(input);
}

function createTotalPrice() {
    var activities = document.querySelector('.activities');
    var h3 = document.createElement('h3');
    h3.id = 'total';
    activities.appendChild(h3);
}

function createErrorMsg(id, text, legend) {
    var p = document.createElement('p');
    p.className = 'error';
    p.id = id;
    p.innerText = text;
    legend.parentNode.insertBefore(p, legend.nextSibling);
}

/* ================================= 
  Main Functions
==================================== */

// Check Job Role section of the form:
    // Create a text field when the "Other" option is selected from the "Job Role" drop down menu.
    // Remove the text field when the "Other" option isn't selected.
function getUserTitle() {
    var title = document.getElementById('title');
    var titleOptions = title.nextSibling.querySelectorAll('a');
    title.nextElementSibling.style.width = title.offsetWidth;

    for (var i = 0; i < titleOptions.length; i++) {
        titleOptions[i].addEventListener('click', titleOptionClickEvent);
    }
    
    function titleOptionClickEvent() {
        var titleInput = document.getElementById('other-title');
        var title = document.getElementById('title');

        if (this.getAttribute('value') === 'other') {
            if (!titleInput) {
               creatTitleInput();
            }
        } else {
            if (titleInput) {
                titleInput.parentNode.removeChild(titleInput);
            }
        }
    }
}


// Check T-Shirt Info section of the form:
    // Hide the T-Shirt color menu.
    // Sanitize the color options text.
    // Only display the options that match the design selected in the "Design" menu.
function getTshirtDesign() {
    var size = document.getElementById('size');
    var design = document.getElementById('design');
    var designOptions = design.nextSibling.querySelectorAll('a');
    var color = document.getElementById('color');
    var colorDiv = document.getElementById('colors-js-puns');
    var colorOptions = color.nextSibling.querySelectorAll('a');
    var colorUl= color.nextSibling.children[0];
    var colorOptionsValues = {};
    var displayColorOptions;
    var sanitizedValue;

    // Hide color menu
    hide(colorDiv);

    for (var i = 0; i < colorOptions.length; ++i) {
        colorOptionsValues[colorOptions[i].getAttribute('value')] = colorOptions[i].innerText;
    }

    for (i = 0; i < designOptions.length; i++) {
        designOptions[i].addEventListener('click', designClickEvent);
    }

    

    function designClickEvent() {
        if (this.getAttribute('value') === 'Select Theme') {
            hide(colorDiv);
        } else {
            displayColorOptions = [];
            // Remove all color options
            while (colorUl.children.length > 0) {
                colorUl.removeChild(colorUl.children[0]);
            }
            // Finds the color options elements that contains part of the design selected option text and push them to displayColorOptions
            for (var key in colorOptionsValues) {
                if (colorOptionsValues.hasOwnProperty(key)) {
                    if (colorOptionsValues[key].indexOf(this.innerText.substr(8)) > -1) { 
                        displayColorOptions.push(key);
                    }
                }
            }
            // Sanitize the innerText of the displayColorOptions elements and appends them to color menu
            for (i = 0; i < displayColorOptions.length; i++) {
                sanitizedValue = sanitizeStr(colorOptionsValues[displayColorOptions[i]]);
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.setAttribute('value', displayColorOptions[i]);
                a.innerText = sanitizedValue;
                a.href = '#';
                a.addEventListener('click', optionClickEvent);
                li.appendChild(a);
                color.nextSibling.children[0].appendChild(li);
            }
            var colorOptions = color.nextSibling.querySelectorAll('a');
            color.setAttribute('value', colorOptions[0].getAttribute('value'));
            color.innerText = colorOptions[0].innerText;
            colorDiv.style.display = 'inline';
        }
    }

    function sanitizeStr(str) {
        var regex = /\(+.+\)/;
        var substr = str.match(regex);
        str = str.replace(' ' + substr, '');
        return str;
    }
}

// Check Activities section of the form:
    // As a user selects activities to register for:
        // Disable all selection of a workshop at the same date and time.
        // Create a running total with the amount of all the selected activities.
function getActivities() {
    var activities = document.querySelectorAll('.activities input');

    // Add event listener to every activity option
    for (var i = 0; i < activities.length; i++) {
        activities[i].addEventListener('click', activitiesEvent);
    }

    function activitiesEvent() {
        var price = getPrice(this.parentNode.innerText);
        if (this.checked === true) {
            // When the activity box is checked
            updateTotalPrice(price);
            updateActivities(this, true);
        } else {
            // When the activity box is unchecked
            updateTotalPrice(-price);
            updateActivities(this, false);
        }  
    }

    function updateActivities(e, disable) {
        var activities = document.querySelectorAll('.activities input');
        var thisTime = getTime(e.parentNode.innerText);
        var activityTime;

        for (var i = 0; i < activities.length; i++) {
            activityTime = getTime(activities[i].parentNode.innerText);
            if (activityTime && activities[i].name !== e.name && thisTime === activityTime) {
                if (disable) {
                    activities[i].disabled = true;
                    activities[i].parentNode.style.color = '#999';
                } else {
                    activities[i].disabled = false;
                    activities[i].parentNode.style.color = '#000';
                }
            }
        }
    }

    function updateTotalPrice(price) {
        var h3 = document.getElementById('total');
        
        if(h3.innerText !== '') {
            var currentAmount = getPrice(h3.innerText);
            if (currentAmount + price > 0) {
                h3.innerText = 'Total: $' + (currentAmount + price);
            } else {
                h3.innerText = '';
            }
        } else {
            h3.innerText = 'Total: $' + price;
        }
    }

    function getPrice(str) {
        var regex = /\d{3}/;
        var price = parseInt(str.match(regex));
        return price;
    }

    function getTime(str) {
        var regex = /(\d{1,2}(p|a)m-\d{1,2}(p|a)m)/;
        var time = str.match(regex);
        if (time) {
            return time[0];
        }
    }

    // Creat h3 for total price
    createTotalPrice();
}

// Check Payment Info section of the form:
    // Display payment sections based on chosen payment option.
    // If "Credit Card" selected, validate the credit card number while the user is typing.
function getPaymentMethod() {
    var select = document.getElementById('payment');
    var selectOptions = select.nextSibling.querySelectorAll('a');
    var creditCard = document.getElementById('credit-card');
    var creditCardNum = document.getElementById('cc-num');
    var paypal = document.getElementById('paypal');
    var bitcoin = document.getElementById('bitcoin');

    // Hide all the payment methods
    hide(creditCard);
    hide(paypal);
    hide(bitcoin);

    // Show the selected payment method
    for (var i = 0; i < selectOptions.length; i++) {
        selectOptions[i].addEventListener('click', selectOptionsClickEvent);
    } 
    function selectOptionsClickEvent() {
        if (this.getAttribute('value') === 'select_method') {
            hide(creditCard);
            hide(paypal);
            hide(bitcoin);
        } else if (this.getAttribute('value') === 'credit card') {
            show(creditCard);
            hide(paypal);
            hide(bitcoin);
        } else if (this.getAttribute('value') === 'paypal') {
            hide(creditCard);
            show(paypal); 
            hide(bitcoin);
        } else if (this.getAttribute('value') === 'bitcoin') {
            hide(creditCard);
            hide(paypal);
            show(bitcoin);
        }
    }

    // Validate the credit card number while user is typing
    creditCardNum.onkeyup = function() {
        var val = this.value;
        var label = getInputLabel(creditCardNum);
        if (isNaN(val) || val.length < 13 || val.length > 19) {
            validCreditCard = false;
            label.style.color = 'red';
            label.innerText = 'Card Number: (Invalid number)';
        } else {
            var lastDigit = parseInt(val.substr(-1));
            var mathArray = [];
            var total = 0;
            val = val.slice(0, -1);
            val = val.split('').reverse();
            for (var i = 0; i < val.length; i ++) {          
                if(i % 2 === 0) {
                    val[i] = parseInt(val[i]) * 2;
                    if(val[i] > 9) {
                        val[i] = val[i] - 9;
                    }
                    mathArray.push(val[i]);
                } else {
                    mathArray.push(parseInt(val[i]));
                }
            }
            for (i = 0; i < mathArray.length; i++) {
                total += mathArray[i];
            }
            if ((total + lastDigit) % 10 === 0) {
                validCreditCard = true;
                label.style.color = '#000';
                label.innerText = 'Card Number:';
            } else {
                validCreditCard = false;
                label.style.color = 'red';
                label.innerText = 'Card Number: (Invalid number)';
            }
        } 
    };
}

// Form validation. Display error messages and don't let the user submit the form if any of these validation errors exist:
    // Name field is empty.
    // Email is not valid.
    // If "other" option is selected and the "other-title" input field is empty.
    // T-Shirt design not selected
    // Even not one activity was checked.
    // Payment option not selected.
    // If "Credit card" is the selected payment option:
        // Credit Card number is not valid.
        // Zip Code is not valid.
        // CVV is not valid.  
function enableSubmitEvent() {
    var enableSubmit = false;
    var errors = 0;
    var name = document.getElementById('name');
    var email = document.getElementById('mail');
    var mailRegex = /([a-zA-z0-9\._]+@+[a-zA-Z0-9]+\.+(com|net|org|co.il|co.uk))/;
    var title = document.getElementById('title');
    var otherTitle = document.getElementById('other-title');
    var design = document.getElementById('design');
    var activities = document.querySelectorAll('.activities input');
    var unchecked = 0;
    var payment = document.getElementById('payment');
    var label;
    var legend;
    var errorMsg;

    label = getInputLabel(name);
    if (!isNaN(parseInt(name.value)) || name.value.length < 2) {
        label.style.color = 'red';
        label.innerText = 'Name: (Please provide your name - at least 2 character)';
        errors++;
    } else {
        label.style.color = '#000';
        label.innerText = 'Name:';
    }

    label = getInputLabel(email);
    if(!email.value.match(mailRegex)) {
        label.style.color = 'red';
        label.innerText = 'Email: (Please provide a valid email)';
        errors++;
    } else {
        label.style.color = '#000';
        label.innerText = 'Email:';
    }

    label = getInputLabel(title);
    if (title.getAttribute('value') === 'other') {
        if (otherTitle.value.length < 5 || !isNaN(parseInt(otherTitle.value))) {
            label.style.color = 'red';
            label.innerText = 'Job Role (should contain at least 5 character)';
            errors++;
        } else {
            label.style.color = '#000';
            label.innerText = 'Job Role';
        }
    } else {
        label.style.color = '#000';
        label.innerText = 'Job Role';
    }

    legend = design.parentNode.parentNode.childNodes[1];
    errorMsg = document.getElementById('design-error');
    if (design.getAttribute('value') === 'Select Theme') {
        legend.style.marginBottom = 0;
        if (!errorMsg) {
            createErrorMsg('design-error', 'Don\'t forget to pick a T-shirt', legend);
        }
        errors++;
    } else {
        if (errorMsg) {
            errorMsg.parentNode.removeChild(errorMsg);
            legend.style.marginBottom = '1.125em';
        }
    }

    for (var i = 0; i < activities.length; i++) {
        if (!activities[i].checked) {
            unchecked++;
        }
    }   
    legend = document.querySelector('.activities legend');
    errorMsg = document.getElementById('activities-error');
    if (unchecked === 7) {
        legend.style.marginBottom = 0;
        if (!errorMsg) {
            createErrorMsg('activities-error', 'Please select an activity', legend);
        }
        errors++;
    } else {
        if (errorMsg) {
            errorMsg.parentNode.removeChild(errorMsg);
            legend.style.marginBottom = '1.125em';
        }
    }

    label = getInputLabel(payment);
    if (payment.getAttribute('value') === 'select_method') {
        label.style.color = 'red';
        label.innerText = 'I\'m going to pay with: (Please select payment method)';
        errors++;
    } else if (payment.getAttribute('value') === 'credit card') {
        label.style.color = '#000';
        label.innerText = 'I\'m going to pay with:';
        var creditCardNum = document.getElementById('cc-num');
        var ccLabel = getInputLabel(creditCardNum);
        var zipCode = document.getElementById('zip');
        var zipLabel = getInputLabel(zipCode);
        var cvv = document.getElementById('cvv');
        var cvvLabel = getInputLabel(cvv);
        if (!validCreditCard) {
            ccLabel.style.color = 'red';
            ccLabel.innerText = 'Card Number: (Invalid number)';
            errors++;
        } else {
            ccLabel.style.color = '#000';
            ccLabel.innerText = 'Card Number:';
        }
        if (zipCode.value.length < 5) {
            zipLabel.style.color = 'red';
            zipLabel.innerText = 'Zip Code: (Invalid)';
            errors++;
        } else {
            zipLabel.style.color = '#000';
            zipLabel.innerText = 'Zip Code:';
        }
        if (cvv.value.length !== 3 || isNaN(parseInt(cvv.value))) {
            cvvLabel.style.color = 'red';
            cvvLabel.innerText = 'CVV: (Invalid)';
            errors++;
        } else {
            cvvLabel.style.color = '#000';
            cvvLabel.innerText = 'CVV:';
        }
    } else {
        label.style.color = '#000';
        label.innerText = 'I\'m going to pay with:';
    }

    if (errors === 0) {
        enableSubmit = true;
    }
    return enableSubmit;
}


var inputName = document.getElementById('name');
var validCreditCard = false;
var submitButton = document.querySelector('form button[type="submit"]');

// Let the user submit the form if "enableSubmitEvent" return "true".
submitButton.onclick = function() {
    return enableSubmitEvent();
};

// Focus on name field if is not empty.
if (!inputName.value) {
    inputName.focus();
}

getUserTitle();
getTshirtDesign();
getActivities();
getPaymentMethod();