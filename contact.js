document.addEventListener('DOMContentLoaded', function() {
    // Get the contact form element
    const contactForm = document.getElementById('contact-form');
    // Get the confirmation popup element
    const confirmationPopup = document.getElementById('confirmation-popup');
    // Get the close button element
    const closeButton = document.querySelector('#confirmation-popup .close-button');
    
    // Add event listener to the form submission
    contactForm.addEventListener('submit', function(event) {
        // Prevent the actual form submission
        event.preventDefault();
        
        // Show the confirmation popup
        confirmationPopup.classList.add('show');
        
        // You can also reset the form here if desired
        // contactForm.reset();
    });
    
    // Add event listener to the close button
    closeButton.addEventListener('click', function() {
        // Hide the confirmation popup
        confirmationPopup.classList.remove('show');
    });
});

