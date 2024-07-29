import Main from '../main.js';
import Header from '../header.js';
import Cart from '../cart.js';

class Product {

  form;
  addToCartBtn;
  checkoutBtn;

  redirectToCheckout = false;

  constructor() {
    this.form = document.querySelector('.add-to-cart-form');
    this.addToCartBtn = this.form.querySelector('.add-to-cart-btn');
    this.checkoutBtn = document.querySelector('.checkout-btn');
    this.initProductEventListeners();
  }

  initProductEventListeners() {
    this.form.addEventListener('submit', this.handleProductFormSubmit.bind(this));
    this.checkoutBtn.addEventListener('click', this.handleCheckoutClick.bind(this));
  }

  handleCheckoutClick(e) {
    e.preventDefault();
    this.redirectToCheckout = true;
    this.form.requestSubmit();
  }

  handleProductFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const productId = form.getAttribute('data-product-id');
    const title = form.closest('.modal-body').parentElement.querySelector('.product-title').innerText;
    const price = parseInt(form.closest('.modal-body').parentElement.querySelector('.product-price').innerText);
    console.log(parseInt(form.closest('.modal-body').parentElement.querySelector('.product-price').innerText));
    const img = form.closest('.modal-body').parentElement.parentElement.querySelector('img').getAttribute('src');
    const size = form.querySelector('#size-option').value;
    const quantity = parseInt(form.querySelector('#quantity-option').value, 10);


    const product = {
      _id: productId,
      title,
      img,
      size,
      quantity,
      price
    }


    Cart.addToCart(product);

    if (this.redirectToCheckout) {
      this.redirectToCheckout = false;
      window.location.href = '/checkout';
      return;
    }

    Main.renderMessage(this.form, true, 'Product was added to your cart!', 'beforeend');
    setTimeout(() => {

      Main.renderMessage(this.form, false);

    }, 1500);



  }

}


Main.initComponents([Header, Product]);

Main.hidePreLoader();
