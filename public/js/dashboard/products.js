class Products {
  productsTab;
  addProductTab;
  productsContainer;
  addProductContainer;
  formAddProduct;
  feedbackAddProduct;
  feedbackMessage;
  spinner;

  constructor() {
    this.productsTab = document.querySelector('.all-products-tab');
    this.addProductTab = document.querySelector('.add-product-tab');
    this.productsContainer = document.querySelector('.products');
    this.addProductContainer = document.querySelector('.add-product');
    this.formAddProduct = document.querySelector('.add-product-form');
    this.feedbackAddProduct = document.querySelector('.feedback-add-product');
    this.spinner = document.querySelector('.spinner-border');
    this.feedbackMessage = document.querySelector('.feedback-message');

    this.initEventListeners();
  }

  initEventListeners() {
    this.productsTab.addEventListener('click', (e) => {
      this.showProducts(e);
      this.loadProducts();
    });

    this.addProductTab.addEventListener('click', (e) => this.showAddProduct(e));

    this.productsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-product')) {
        this.deleteProduct(e);
      }
    });

    this.formAddProduct.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.formAddProduct);
      const form = Object.fromEntries(formData.entries());

      const validatedForm = this.validateForm(form);

      this.addProduct(validatedForm);
    });
  }

  validateForm(form) {
    // generate sizes array
    form.sizes = form.sizes.split(',').map((item) => item.trim());

    // supplier
    form.supplier = this.getSupplierData();

    // brand
    form.brand = this.getBrandData();
    //category
    form.category = this.getCategoryData();

    return form;
  }

  getSupplierData() {
    const selectElement = document.getElementById('suppliers-option');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-supplier-name'),
    };
  }
  getCategoryData() {
    const selectElement = document.getElementById('category-option');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-category-name'),
    };
  }
  getBrandData() {
    const selectElement = document.getElementById('brand-option');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-brand-name'),
    };
  }

  renderSpinner() {
    this.spinner.classList.toggle('hidden');
  }

  showMessage(message) {
    this.feedbackMessage.classList.toggle('hidden');
    this.feedbackMessage.innerHTML = `<p style="font-size:1.4rem;">${message}</p>`;
    setTimeout(() => {
      this.feedbackMessage.classList.toggle('hidden');
    }, 5000);
  }

  showProducts(e) {
    e.preventDefault();
    this.productsContainer.classList.remove('hidden');
    this.addProductContainer.classList.add('hidden');
  }

  showAddProduct(e) {
    e.preventDefault();
    this.addProductContainer.classList.remove('hidden');
    this.productsContainer.classList.add('hidden');
  }

  async loadProducts() {
    this.productsContainer.innerHTML = `
      <div class="mt-5 mx-auto">
        <div class="spinner-border text-center" role="status">
          <span class="sr-only display-4">Loading...</span>
        </div>
      </div>`;

    try {
      const response = await fetch(`/api/products/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      this.renderProducts(result.data);
    } catch (error) {
      this.showMessage(`Error loading products\nError message: ${error}`);
    }
  }

  renderProducts(data) {
    this.productsContainer.innerHTML = '';
    if (data.length === 0) {
      this.productsContainer.innerHTML = `<h4>You don't have any products..</h4>`;
      return;
    }

    data.forEach((product) => {
      const productElement = document.createElement('div');
      productElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      productElement.innerHTML = `
        <div class="card position-relative" data-product-id="${product._id}">
          <button type="button" class="btn btn-outline-danger delete-product">X</button>
          <img src="${product.image}" class="card-img-top" alt="${
        product.name
      }" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">Price: $${product.price}</p>
            <p class="card-text">Sizes: ${product.sizes.join(', ')}</p>
            <p class="card-text">Quantity: ${product.quantity}</p>
            <p class="card-text">Supplier: ${product.supplier.name}</p>
            <p class="card-text">Brand: ${product.brand}</p>
            <p class="card-text">Category: ${product.category}</p>
            <p class="card-text">Gender: ${product.gender}</p>
          </div>
        </div>`;
      this.productsContainer.appendChild(productElement);
    });
  }

  async addProduct(product) {
    this.renderSpinner();
    try {
      const response = await fetch(`/api/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      console.log(product);

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      this.showMessage('Successfully added product!');
      this.renderSpinner();
      this.formAddProduct.reset();
    } catch (error) {
      console.log(error);
      this.showMessage('Error adding product..');
      this.renderSpinner();
    }
  }

  async deleteProduct(e) {
    const productId = e.target.closest('.card').dataset.productId;
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      this.loadProducts();
      e.target.closest('.col-md-4.col-sm-6').remove();
    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Products();
});
