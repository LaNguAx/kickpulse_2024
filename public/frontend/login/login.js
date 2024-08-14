import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';
import FormValidator from '../formValidator.js';

class Login {
    loginFormContainer;
    loginForm;

    constructor() {
        this.loginFormContainer = document.querySelector('.form-signin');
        this.loginForm = this.loginFormContainer.querySelector('form');

        this.initLoginEventListeners();

    }
    initLoginEventListeners() {
        this.loginForm.addEventListener('submit', this.handleLoginFormSubmit.bind(this));
    }
    async handleLoginFormSubmit(e) {
        e.preventDefault();
        if (!this.loginForm.checkValidity())
            return;

        const formData = new FormData(this.loginForm);
        const form = Object.fromEntries(formData.entries());

        console.log(form)

        await this.loginUser(form);
    }

    async loginUser(form) {
        const loginBtn = this.loginForm.querySelector('button');
        try {
            Main.renderSpinner(loginBtn, true);
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();
            Main.renderSpinner(loginBtn, false);

            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.innerHTML = 'Login successful!<br>Redirecting to your profile...';
            this.loginForm.prepend(successMessage);

            setTimeout(() => window.location.href = '/profile', 1000);

        } catch (error) {
            Main.renderSpinner(loginBtn, false);
            console.error('Error during login:', error);
            // Display error message to the user
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.textContent = error.message;
            this.loginForm.prepend(errorMessage);
            setTimeout(() => errorMessage.remove(), 2000);
        }
    }

}


Main.initComponents([Header, Login, FormValidator]);

Main.hidePreLoader();
