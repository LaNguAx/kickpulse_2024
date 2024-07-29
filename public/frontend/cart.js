class Cart {

  cart;
  cartBtn;
  cartModal;
  cartModalObj;

  constructor() {
    this.cartModal = document.querySelector('#cart-modal');
    this.cartBtn = document.querySelector('#cart-btn');
    this.cart = Cart.getCart();

    this.cartModalObj = new bootstrap.Modal(document.getElementById('cart-modal'), {
      keyboard: false
    });


    this.initHeaderEventListeners();
  }

  initHeaderEventListeners() {
    this.cartModal.addEventListener('click', this.handleCartModalClick.bind(this));
    this.cartBtn.addEventListener('click', this.renderCart.bind(this));
  }

  handleCartModalClick(e) {

    if (e.target.closest('.btn-delete-cart-item')) {
      this.deleteCartItem(e);
      return;
    }

  }

  static addToCart(product) {

    const {
      _id,
      size,
      quantity,
    } = product


    const cartItem = {
      _id: product._id,
      title: product.title,
      img: product.img,
      size: product.size,
      quantity: product.quantity,
      price: product.price
    }

    this.cart = Cart.getCart();
    const productExistsIndex = this.cart.findIndex(prod => prod._id == _id && prod.size == size);

    if (productExistsIndex > -1)
      this.cart[productExistsIndex].quantity += quantity;
    else
      this.cart.push(cartItem);

    Cart.updateCart(this.cart);
    console.log('cart updated', this.cart);


  }

  renderCart(e) {

    // getting latest cart data
    this.cart = Cart.getCart();
    const table = this.cartModal.querySelector('tbody');
    table.innerHTML = '';

    if (this.cart.length == 0) {
      this.cartModal.querySelector('.modal-footer > span').classList.remove('hidden');
      this.cartModal.querySelector('.modal-footer > span').innerText = 'Your cart is empty..';
      this.cartModal.querySelector('.cart-total').innerText = `$0.00`;

      return;
    }

    this.cartModal.querySelector('.modal-footer > span').classList.add('hidden');
    let total = 0;
    this.cart.forEach(item => {

      table.insertAdjacentHTML('beforeend', `
          <tr data-product-id="${item._id}" data-product-quantity="${item.quantity}" data-product-size="${item.size}">
                <td><img src="${item.img}" class="img-fluid" alt="${item.title}"
                              style="width: 50px; height: auto;"></td>
                         <td>${item.title}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price}</td>
                                <td>${item.size}</td>
                                <td><button type="button" class="btn btn-outline-danger btn-sm btn-delete-cart-item">&times;</button></td>
                      </tr>`);

      total += item.price * item.quantity;
    })

    const formattedTotal = total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    this.cartModal.querySelector('.cart-total').innerText = formattedTotal;

  }


  deleteCartItem(e) {
    const row = e.target.closest('tr');
    const productId = row.getAttribute('data-product-id');
    const quantity = row.getAttribute('data-product-quantity');
    const size = row.getAttribute('data-product-size');

    this.cart = Cart.getCart();
    const newCart = this.cart.filter(item => !(item._id === productId && item.size === size));

    Cart.updateCart(newCart);
    this.renderCart();


    this.cartModal.querySelector('.modal-footer > span').classList.remove('hidden');
    this.cartModal.querySelector('.modal-footer > span').innerText = `Product was sucessfully removed`;

    // msg.classList.add('me-auto', 'fs-5');
    setTimeout(() => {
      this.cartModalObj.hide();

      // Main.renderMessage(this.cartModal.querySelector('.modal-footer'), false, '', '');
    }, 1500);



  }


  findProductInCart(id, qty, size) {

    this.cart = Cart.getCart();
    const indexOfProduct = this.cart.findIndex(prod => prod._id == productId && prod.size == size);

    return indexOfProduct;
  }

  static getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  static updateCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cart = Cart.getCart();
  }

}


export default Cart;