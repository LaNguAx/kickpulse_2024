import Main from './main.js';
import Cart from './cart.js';

class User {

  loginModal;
  registerModal;
  loginModalObj;
  registerModalObj;

  switchSignInBtn;
  switchSignUpBtn;


  loginForm;
  registerForm;

  constructor() {
    // Selecting the login and register modals
    this.loginModal = document.querySelector('#loginModal');
    this.registerModal = document.querySelector('#registerModal');
    if (!this.loginModal || !this.registerModal) return;

    this.loginForm = this.loginModal.querySelector('form');
    this.registerForm = this.registerModal.querySelector('form');

    // Initializing the modals using Bootstrap's modal class
    this.loginModalObj = new bootstrap.Modal(this.loginModal, {
      keyboard: false
    });

    this.registerModalObj = new bootstrap.Modal(this.registerModal, {
      keyboard: false
    });



    this.switchSignInBtn = document.querySelector('#switch-signin');
    this.switchSignUpBtn = document.querySelector('#switch-signup');

    this.initUserEventListeners();
  }

  initUserEventListeners() {
    this.switchSignUpBtn.addEventListener('click', this.switchModals.bind(this));
    this.switchSignInBtn.addEventListener('click', this.switchModals.bind(this));

    this.loginForm.addEventListener('submit', this.handleLoginFormSubmit.bind(this));
    this.registerForm.addEventListener('submit', this.handleRegisterFormSubmit.bind(this));
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


  switchModals(e) {
    const modal = e.target.getAttribute('data-modal-name');
    this.hideModals();
    if (modal == 'login') {
      setTimeout(() => this.loginModalObj.show(), 200);

    } else {
      setTimeout(() => this.registerModalObj.show(), 200);
    }
  }

  hideModals() {
    this.loginModalObj.hide();
    this.registerModalObj.hide();
  }

}

export default User;
