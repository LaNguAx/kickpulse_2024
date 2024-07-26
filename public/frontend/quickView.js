import Main from './main.js';
import Cart from './cart.js';

class QuickView {

  quickViewModal;
  quickViewModalForm;
  quickViewModalObj;
  constructor() {
    this.quickViewModal = document.querySelector('#quick-view-modal');
    this.quickViewModalForm = this.quickViewModal.querySelector('.add-to-cart-form');
    this.quickViewModalObj = new bootstrap.Modal(document.getElementById('quick-view-modal'), {
      keyboard: false
    });

    this.initQuickViewEventListeners();
  }

  initQuickViewEventListeners() {
    document.body.addEventListener('click', this.bodyClickDispatcher.bind(this));
    this.quickViewModal.addEventListener('click', this.handleQuickViewModalClick.bind(this));
    this.quickViewModalForm.addEventListener('submit', this.handleQuickViewModalForm.bind(this));
  }

  async bodyClickDispatcher(e) {

    // if a product was clicked
    if (e.target.closest('.product-card')) {
      await this.openProductQuickView(e);
      return;
    }

  }

  handleQuickViewModalClick(e) {

  }

  handleQuickViewModalForm(e) {
    e.preventDefault();

    Cart.addToCart(e);

    Main.renderMessage(this.quickViewModalForm, true, 'Product was added to your cart!', 'beforeend');
    setTimeout(() => {

      this.quickViewModalObj.hide();
      Main.renderMessage(this.quickViewModalForm, false, '', 'beforeend');
      this.quickViewModalForm.reset();
    }, 1500);

  }


  async openProductQuickView(e) {
    const product = e.target.closest('.product-card');
    const id = product.getAttribute('data-product-id');

    await this.updateProductQuickView(id);

  }

  async updateProductQuickView(id) {
    try {
      // Render spinner and load product
      const modalBody = this.quickViewModal.querySelector('.modal-body');
      Main.renderSpinner(modalBody, true);
      const product = await this.getProduct(id);
      Main.renderSpinner(modalBody, false);

      this.quickViewModalForm.setAttribute('data-product-id', product._id);

      const pTitle = this.quickViewModal.querySelector('.product-modal-title');
      const pDescription = this.quickViewModal.querySelector('.product-modal-description');
      const pPrice = this.quickViewModal.querySelector('.product-modal-price');
      const pSize = this.quickViewModal.querySelector('#size-option');
      const pQuantity = this.quickViewModal.querySelector('#quantity-option');

      pTitle.innerText = product.name;
      pDescription.innerText = product.description;
      pPrice.innerHTML = `<strong>${product.price}$</strong>`;

    } catch (err) {
      console.log(err);
    }

  }

  async getProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed getting product!');
      const result = await response.json();

      return result.data;

    } catch (err) {
      console.log(err);
    }
  }

}

export default QuickView;