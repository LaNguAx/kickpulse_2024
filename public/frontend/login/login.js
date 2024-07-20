document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", function(event) {
        if (!validateEmail(emailInput.value)) {
            event.preventDefault();
            alert("Invalid email address. Please enter a valid email address.");
        } else if (!validatePassword(passwordInput.value)) {
            event.preventDefault();
            alert("Password must be at least 8 characters long and contain only English letters and numbers.");
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return re.test(String(password));
    }
});

