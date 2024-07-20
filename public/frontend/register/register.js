document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");

    form.addEventListener("submit", function(event) {
        let valid = true;
        let errorMessage = "";

        // Validate first name
        if (!isValidName(firstNameInput.value)) {
            valid = false;
            errorMessage += "First name must be at least two characters long and not contain numbers.\n";
            firstNameInput.focus();
        }

        // Validate last name
        if (!isValidName(lastNameInput.value)) {
            valid = false;
            errorMessage += "Last name must be at least two characters long and not contain numbers.\n";
            lastNameInput.focus();
        }

        // Validate phone number
        if (!isValidPhoneNumber(phoneInput.value)) {
            valid = false;
            errorMessage += "Phone number must be exactly 9 digits and contain no letters or symbols.\n";
            phoneInput.focus();
        }

        // Validate email
        if (!isValidEmail(emailInput.value)) {
            valid = false;
            errorMessage += "Invalid email address.\n";
            emailInput.focus();
        }

        if (!valid) {
            alert(errorMessage);
            event.preventDefault();
        }
    });

    function isValidName(name) {
        return name.length >= 2 && /^[A-Za-zא-ת]+$/.test(name);
    }

    function isValidPhoneNumber(phone) {
        return /^\d{9}$/.test(phone);
    }

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});

