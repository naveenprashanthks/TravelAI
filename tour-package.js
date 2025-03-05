document.addEventListener('DOMContentLoaded', function() {
    // Currency conversion functionality
    initializeCurrencyConverter();
    
    // Initialize itinerary toggle functionality
    initializeItineraryToggles();
    
    // Initialize booking form validation
    initializeFormValidation();
    
    // Initialize participant dropdown
    initializeParticipantsDropdown();
});

/**
* Currency conversion functionality
* Allows users to toggle between different currencies
*/
function initializeCurrencyConverter() {
    try {
        // Exchange rates (relative to USD)
        const exchangeRates = {
            'USD': 1,
            'INR': 83,
            'EUR': 0.92,
            'GBP': 0.79
        };
        
        // Currency symbols
        const currencySymbols = {
            'USD': '$',
            'INR': '₹',
            'EUR': '€',
            'GBP': '£'
        };
        
        // Default currency
        let currentCurrency = 'INR';
        let originalPrice = 0;
        
        // Find the currency and amount elements
        const currencyElement = document.querySelector('.currency');
        const amountElement = document.querySelector('.amount');
        const currencySelector = document.querySelector('.currency-selector') || createCurrencySelector();
        
        if (currencyElement && amountElement) {
            // Store the original USD price
            originalPrice = parseFloat(amountElement.textContent.replace(/,/g, ''));
            
            // Initially convert to INR
            updatePriceDisplay('INR');
            
            // Set up currency selection change event
            if (currencySelector) {
                currencySelector.addEventListener('change', function(e) {
                    updatePriceDisplay(e.target.value);
                });
            }
        } else {
            throw new Error('Price elements not found in the DOM.');
        }
        
        // Function to create currency selector if it doesn't exist
        function createCurrencySelector() {
            const selector = document.createElement('select');
            selector.className = 'currency-selector';
            
            Object.keys(exchangeRates).forEach(currency => {
                const option = document.createElement('option');
                option.value = currency;
                option.textContent = currency;
                if (currency === currentCurrency) {
                    option.selected = true;
                }
                selector.appendChild(option);
            });
            
            // Insert after the price display
            if (amountElement && amountElement.parentNode) {
                amountElement.parentNode.insertBefore(selector, amountElement.nextSibling);
            }
            
            return selector;
        }
        
        // Function to update price display based on selected currency
        function updatePriceDisplay(currency) {
            if (!exchangeRates[currency]) {
                throw new Error(`Exchange rate for ${currency} not found`);
            }
            
            currentCurrency = currency;
            
            // Convert price to selected currency
            const convertedPrice = originalPrice * exchangeRates[currency];
            
            // Format according to appropriate locale
            let formattedPrice;
            switch (currency) {
                case 'INR':
                    formattedPrice = convertedPrice.toLocaleString('en-IN');
                    break;
                case 'EUR':
                case 'GBP':
                    formattedPrice = convertedPrice.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    break;
                default:
                    formattedPrice = convertedPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
            }
            
            // Update the currency symbol and amount
            currencyElement.textContent = currencySymbols[currency];
            amountElement.textContent = formattedPrice;
            
            console.log(`Price converted to ${currency} successfully.`);
        }
    } catch (error) {
        console.error('Currency conversion error:', error.message);
        alert('There was an error with the currency conversion. Please refresh the page or contact support.');
    }
}

/**
* Itinerary toggle functionality
* Allows users to expand and collapse itinerary day details
*/
function initializeItineraryToggles() {
    try {
        const itineraryDays = document.querySelectorAll('.itinerary-day');
        
        if (itineraryDays.length === 0) {
            console.warn('No itinerary days found in the document.');
            return;
        }
        
        itineraryDays.forEach(day => {
            const heading = day.querySelector('h3, h4') || day.querySelector('.day-title');
            const content = day.querySelector('.day-content');
            
            if (!heading || !content) {
                console.warn('Invalid itinerary day structure:', day);
                return;
            }
            
            // Add toggle indicator to heading
            const indicator = document.createElement('span');
            indicator.className = 'toggle-indicator';
            indicator.textContent = ' [-]';
            heading.appendChild(indicator);
            
            // Set up click handler
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', function() {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    indicator.textContent = ' [-]';
                } else {
                    content.style.display = 'none';
                    indicator.textContent = ' [+]';
                }
            });
        });
        
        console.log('Itinerary toggle functionality initialized successfully.');
    } catch (error) {
        console.error('Error initializing itinerary toggles:', error.message);
    }
}

/**
* Form validation functionality
* Validates booking form inputs before submission
*/
function initializeFormValidation() {
    try {
        const bookingForm = document.querySelector('.booking-form') || document.getElementById('booking-form');
        
        if (!bookingForm) {
            console.warn('Booking form not found in the document.');
            return;
        }
        
        bookingForm.addEventListener('submit', function(event) {
            let isValid = true;
            const errorMessages = [];
            
            // Get form inputs
            const nameInput = bookingForm.querySelector('input[name="name"]');
            const emailInput = bookingForm.querySelector('input[name="email"]');
            const phoneInput = bookingForm.querySelector('input[name="phone"]');
            const dateInput = bookingForm.querySelector('input[name="tour-date"]');
            const participantsInput = bookingForm.querySelector('select[name="participants"]');
            
            // Clear previous error messages
            const existingErrors = bookingForm.querySelectorAll('.error-message');
            existingErrors.forEach(error => error.remove());
            
            // Validate name (if exists)
            if (nameInput && nameInput.value.trim() === '') {
                isValid = false;
                displayError(nameInput, 'Please enter your name');
                errorMessages.push('Name is required');
            }
            
            // Validate email (if exists)
            if (emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput.value.trim() === '') {
                    isValid = false;
                    displayError(emailInput, 'Please enter your email address');
                    errorMessages.push('Email is required');
                } else if (!emailRegex.test(emailInput.value.trim())) {
                    isValid = false;
                    displayError(emailInput, 'Please enter a valid email address');
                    errorMessages.push('Email is invalid');
                }
            }
            
            // Validate phone (if exists)
            if (phoneInput) {
                const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
                if (phoneInput.value.trim() !== '' && !phoneRegex.test(phoneInput.value.trim())) {
                    isValid = false;
                    displayError(phoneInput, 'Please enter a valid phone number');
                    errorMessages.push('Phone number is invalid');
                }
            }
            
            // Validate date (if exists)
            if (dateInput && dateInput.value === '') {
                isValid = false;
                displayError(dateInput, 'Please select a tour date');
                errorMessages.push('Tour date is required');
            }
            
            // Validate participants (if exists)
            if (participantsInput && participantsInput.value === '') {
                isValid = false;
                displayError(participantsInput, 'Please select number of participants');
                errorMessages.push('Number of participants is required');
            }
            
            // If validation fails, prevent form submission
            if (!isValid) {
                event.preventDefault();
                console.warn('Form validation failed:', errorMessages.join(', '));
            } else {
                console.log('Form validation successful');
                event.preventDefault(); // Prevent default to handle redirection manually
                window.location.href = 'end page.html'; // Redirect to end page
            }
        });
        
        // Function to display error message
        function displayError(inputElement, message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = '#ff3333';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '0.2rem';
            
            inputElement.style.borderColor = '#ff3333';
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
            
            // Reset styling when input changes
            inputElement.addEventListener('input', function() {
                inputElement.style.borderColor = '';
                if (errorElement.parentNode) {
                    errorElement.parentNode.removeChild(errorElement);
                }
            });
        }
        
        console.log('Form validation initialized successfully.');
    } catch (error) {
        console.error('Error initializing form validation:', error.message);
    }
}

/**
* Participants dropdown functionality
* Dynamically populates participant options based on package type
*/
function initializeParticipantsDropdown() {
    try {
        const participantsSelect = document.querySelector('select[name="participants"]');
        const packageTypeSelect = document.querySelector('select[name="package-type"]');
        
        if (!participantsSelect) {
            console.warn('Participants dropdown not found in the document.');
            return;
        }
        
        // Define participant options based on package type
        const participantOptions = {
            'default': [1, 2, 3, 4, 5, 6, 7, 8],
            'basic': [1, 2, 3, 4],
            'standard': [1, 2, 3, 4, 5, 6],
            'premium': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'family': [2, 3, 4, 5, 6],
            'group': [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        };
        
        // Function to update participant options
        function updateParticipantOptions(packageType) {
            // Clear existing options
            participantsSelect.innerHTML = '';
            
            // Add default empty option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select number of participants';
            participantsSelect.appendChild(defaultOption);
            
            // Get appropriate options array
            const options = participantOptions[packageType] || participantOptions.default;
            
            // Add new options
            options.forEach(count => {
                const option = document.createElement('option');
                option.value = count;
                option.textContent = count.toString();
                participantsSelect.appendChild(option);
            });
        }
        
        // Initial population
        updateParticipantOptions('default');
        
        // Update when package type changes (if package type selector exists)
        if (packageTypeSelect) {
            packageTypeSelect.addEventListener('change', function() {
                updateParticipantOptions(this.value || 'default');
            });
        }
        
        console.log('Participants dropdown initialized successfully.');
    } catch (error) {
        console.error('Error initializing participants dropdown:', error.message);
    }
}
