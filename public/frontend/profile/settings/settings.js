import Main from '../../main.js';
import Header from '../../header.js';
import FormValidator from '../../formValidator.js'

class Settings {
  settingsForm;
  settingsFormBtn;

  newEmailCheckbox;

  constructor() {

    this.settingsForm = document.querySelector('#settings-form');
    this.settingsFormBtn = this.settingsForm.querySelector('button[type="submit"]');
    this.newEmailCheckbox = this.settingsForm.querySelector('#newEmailCheckbox');

    this.initSettingsEventListeners();
  }
  initSettingsEventListeners() {

    this.settingsForm.addEventListener('submit', this.handleSettingsFormSubmit.bind(this));
    this.newEmailCheckbox.addEventListener('change', this.handleCheckboxChange.bind(this));
  }


  handleCheckboxChange(e) {
    const newEmail = this.settingsForm.querySelector('#email');

    if (e.target.checked) {
      newEmail.parentElement.classList.remove('hidden');
      newEmail.removeAttribute('disabled');
    }
    else {
      newEmail.parentElement.classList.add('hidden');
      newEmail.setAttribute('disabled', 'disabled');
    }
  }

  async handleSettingsFormSubmit(e) {
    e.preventDefault();
    if (!this.settingsForm.checkValidity())
      return;

    const formData = new FormData(this.settingsForm);
    const form = Object.fromEntries(formData.entries());

    form.email = this.settingsForm.querySelector('#currentEmail').value;

    if (this.newEmailCheckbox.checked)
      form.newEmail = this.settingsForm.querySelector('#email').value;

    await this.updateUser(form);
  }


  async updateUser(user) {
    console.log(user);
    try {
      Main.renderSpinner(this.settingsFormBtn, true);
      const response = await fetch('/profile/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message);
      }

      const data = await response.json();
      Main.renderSpinner(this.settingsFormBtn, false);
      console.log('User updated successfully:', data);

      Main.renderMessage(this.settingsForm, true, 'Updated your information successfully.', 'beforeend');
      setTimeout(() => window.location.href = '/profile', 1000);

    } catch (error) {
      Main.renderSpinner(this.settingsFormBtn, false);

      console.error('Error updating user:', error);
      Main.renderMessage(this.settingsForm, true, error.message, 'beforeend');
      setTimeout(() => Main.renderMessage(this.settingsForm, false), 1000);

    }
  }
}


Main.initComponents([Header, FormValidator, Settings]);

Main.hidePreLoader();
