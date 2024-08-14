import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';
import FormValidator from '../formValidator.js';

class Register {

    registerFormContainer;
    registerForm;

    constructor() {
        this.registerFormContainer = document.querySelector('.register-form');
        this.registerForm = this.registerFormContainer.querySelector('form');

        this.initRegisterEventListeners();
    }

    initRegisterEventListeners() {
        this.registerForm.addEventListener('submit', this.handleRegisterFormSubmit.bind(this));
    }

    async handleRegisterFormSubmit(e) {
        e.preventDefault();
        if (!this.registerForm.checkValidity())
            return;
        const formData = new FormData(this.registerForm);
        const form = Object.fromEntries(formData.entries());


        await this.registerUser(form);
    }


    async registerUser(form) {
        const registerBtn = this.registerForm.querySelector('button');

        try {
            Main.renderSpinner(registerBtn, true);

            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            Main.renderSpinner(registerBtn, false);

            console.log('User registered successfully:', data);

            // Display success message to the user
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.innerHTML = 'Registration successful!<br>Redirecting to your profile...';
            this.registerForm.prepend(successMessage);
            setTimeout(() => {
                successMessage.remove();
                window.location.href = '/profile';
            }, 1000);

        } catch (error) {
            Main.renderSpinner(registerBtn, false);

            console.error('Error during registration:', error);

            // Display error message to the user
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.innerHTML = `${error.message}<br>Please choose a different email.`;
            this.registerForm.prepend(errorMessage);
            setTimeout(() => errorMessage.remove(), 2000);
        }
    }
}


Main.initComponents([Header, Register, FormValidator]);

Main.hidePreLoader();
