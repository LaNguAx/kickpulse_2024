import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';
import Cart from '../cart.js';
import FormValidator from '../formValidator.js';

class Checkout {

  checkoutForm;
  checkoutCart;
  checkoutCartContainer;
  checkoutFieldsContainer;

  constructor() {
    this.checkoutCart = Cart.getCart();
    this.checkoutCartContainer = document.querySelector('#checkout-cart-container');
    this.checkoutForm = document.querySelector('#checkoutForm');
    this.checkoutFieldsContainer = document.querySelector('#checkout-fields-container');

    this.loadCountriesSelect();
    this.renderCheckoutCart();
    this.initCheckoutEventListeners();
  }

  initCheckoutEventListeners() {
    this.checkoutCartContainer.addEventListener('click', this.handleCheckoutCartContainerClick.bind(this));
    this.checkoutForm.addEventListener('submit', this.handleCheckoutFormSubmit.bind(this));
    this.initCCfields();
  }

  async loadCountriesSelect() {
    const countriesSelect = this.checkoutForm.querySelector('#country');

    try {
      // Fetch the countries from the API
      const response = await fetch('https://restcountries.com/v3.1/region/america');
      const countries = await response.json();

      // Clear existing options
      countriesSelect.innerHTML = '<option value="">Choose...</option>';

      // Populate the select element with countries
      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name.common;
        option.textContent = country.name.common;

        // Optionally, select "United States" by default
        if (country.name.common === 'United States') {
          option.selected = true;
        }

        countriesSelect.appendChild(option);
      });

    } catch (error) {
      console.error('Error loading countries:', error);
    }
  }

  handleCheckoutCartContainerClick(e) {
    if (e.target.closest('.btn-checkout-delete-cart-item')) {
      this.deleteCheckoutCartItem(e);
      return;
    }
  }

  async handleCheckoutFormSubmit(e) {
    e.preventDefault();

    if (!this.checkoutForm.checkValidity())
      return;

    if (this.checkoutCart.length == 0) {
      Main.renderMessage(this.checkoutFieldsContainer, true, `You can't checkout because you don't have any products..`, 'beforeend');
      setTimeout(() => Main.renderMessage(this.checkoutFieldsContainer, false), 1500);
      return;
    }

    const formData = new FormData(this.checkoutForm);
    const form = Object.fromEntries(formData.entries());

    this.checkoutCart = Cart.getCart();
    form.cart = this.checkoutCart;
    form.total = this.checkoutCart.reduce((total, item) => total + item.price * item.quantity, 0);

    await this.sendOrder(form);
  }

  async sendOrder(order) {
    try {
      Main.renderSpinner(this.checkoutFieldsContainer.querySelector('button[type="submit"]'), true);
      const response = await fetch(`/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      Main.renderSpinner(this.checkoutFieldsContainer.querySelector('button[type="submit"]'), false);

      // emptying the cart
      this.checkoutCart = [];
      Cart.updateCart(this.checkoutCart);

      window.location.href = '/thankyou'

    } catch (error) {
      Main.renderSpinner(this.checkoutFieldsContainer.querySelector('button[type="submit"]'), false);
      console.log(error);
    }
  }

  deleteCheckoutCartItem(e) {
    const row = e.target.closest('tr');
    const productId = row.getAttribute('data-product-id');
    const quantity = row.getAttribute('data-product-quantity');
    const size = row.getAttribute('data-product-size');

    this.checkoutCart = Cart.getCart();
    const newCart = this.checkoutCart.filter(item => !(item._id === productId && item.size === size));

    Cart.updateCart(newCart);
    this.renderCheckoutCart();
  }

  renderCheckoutCart() {
    const table = this.checkoutCartContainer.querySelector('tbody');
    table.innerHTML = '';

    this.checkoutCart = Cart.getCart();
    this.checkoutCartContainer.querySelector('.badge').innerText = this.checkoutCart.length;

    if (this.checkoutCart.length == 0) {
      table.parentElement.insertAdjacentHTML('beforebegin', `<p class="lean">Your cart is empty..</p>`);
      this.checkoutCartContainer.querySelector('.cart-total').innerText = `$0.00`;
      return;
    }

    let total = 0;
    this.checkoutCart.forEach(item => {
      table.insertAdjacentHTML('beforeend', `
        <tr data-product-id="${item._id}" data-product-quantity="${item.quantity}" data-product-size="${item.size}">
          <td><img src="${item.img}" class="img-fluid" alt="${item.title}" style="width: 50px; height: auto;"></td>
          <td style="font-size:0.85rem;">${item.title}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
          <td>${item.size}</td>
          <td><button type="button" class="btn btn-outline-danger btn-sm btn-checkout-delete-cart-item">&times;</button></td>
        </tr>`);

      total += item.price * item.quantity;
    });

    const formattedTotal = total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    this.checkoutCartContainer.parentElement.querySelector('.cart-total').innerText = formattedTotal;
  }

  initCCfields() {
    document.getElementById('cc-number').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    });

    document.getElementById('cc-cvv').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
  }
}

Main.initComponents([Header, QuickView, FormValidator, Checkout]);
Main.hidePreLoader();
