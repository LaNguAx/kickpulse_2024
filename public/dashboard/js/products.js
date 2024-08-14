import Main from '../../frontend/main.js';
class Products {
  productsTab;
  addProductTab;
  productsContainer;
  addProductContainer;
  formAddProduct;
  feedbackAddProduct;
  feedbackMessage;
  spinner;
  suppliersOption;
  categoriesOption;

  editProductForm;
  editProductContainer;

  editSuppliersOption;
  editCategoriesOption;

  searchForm;
  searchInput;
  searchBtn;
  searchOptions;
  searchModal;
  searchModalContent;
  searchModalObj;



  paginationContainer;
  products = [];


  constructor() {
    this.productsTab = document.querySelector('.all-products-tab');
    this.addProductTab = document.querySelector('.add-product-tab');
    this.productsContainer = document.querySelector('.products');
    this.addProductContainer = document.querySelector('.add-product');
    this.formAddProduct = document.querySelector('.add-product-form');
    this.feedbackAddProduct = document.querySelector('.feedback-add-product');
    this.spinner = document.querySelector('.spinner-border');
    this.feedbackMessage = document.querySelector('.feedback-message');
    this.suppliersOption = document.querySelector('#suppliers-option');
    this.categoriesOption = document.querySelector('#category-option');
    this.paginationContainer = document.querySelector('.pagination');
    this.searchModalContainer = document.querySelector('#searchModal').querySelector('.modal-body');

    this.editProductContainer = document.querySelector('.edit-product');
    this.editProductForm = document.querySelector('.edit-product-form');
    this.editSuppliersOption = this.editProductForm.querySelector('#suppliers-option');
    this.editCategoriesOption = this.editProductForm.querySelector('#category-option');


    this.searchForm = document.querySelector('.search-form');
    this.searchInput = this.searchForm.querySelector('input');
    this.searchBtn = this.searchForm.querySelector('button');
    this.searchOptions = this.searchForm.querySelector('#searchOptions');

    this.searchModal = document.querySelector('#searchModal');
    this.searchModalContent = this.searchModal.querySelector('.modal-body');
    this.searchModalObj = new bootstrap.Modal(this.searchModal, {
      keyboard: false
    });


    this.loadProducts();
    this.initEventListeners();
  }

  initEventListeners() {

    this.searchInput.addEventListener('keyup', this.handleSearchInputChange.bind(this));
    this.searchForm.addEventListener('submit', this.handleSearchClick.bind(this));


    this.productsTab.addEventListener('click', async (e) => {
      if (e.target.classList.contains('active')) return;

      this.highlightTab(e);
      this.showProducts(e);

      this.renderSpinner(this.productsContainer, true);
      const loaded = await this.loadProducts();
      this.renderSpinner(this.productsContainer, false);
      this.renderProducts(loaded);

      this.resetPagination();
      this.paginationContainer.classList.remove('hidden');

    });

    this.addProductTab.addEventListener('click', (e) => {
      // if (e.target.classList.contains('active')) return;
      this.highlightTab(e);
      this.showAddProduct(e);

    });

    this.productsContainer.addEventListener('click', async (e) => {
      if (e.target.closest('.delete-product')) {
        this.deleteProduct(e);
        return;
      }

      if (e.target.closest('.edit-product-btn')) {
        await this.editProduct(e);
        return;
      }

    });

    this.searchModalContainer.addEventListener('click', async (e) => {
      if (e.target.closest('.delete-product')) {
        this.deleteProduct(e);
        this.searchModalObj.hide();
        this.searchInput.value = '';
        this.searchOptions.innerHTML = '';

        return;
      }

      if (e.target.closest('.edit-product-btn')) {
        await this.editProduct(e);
        this.searchModalObj.hide();
        this.searchInput.value = '';
        this.searchOptions.innerHTML = '';
        return;
      }

    });


    this.formAddProduct.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.formAddProduct);
      const form = Object.fromEntries(formData.entries());

      const validatedForm = this.validateForm(form, e);

      this.addProduct(validatedForm);
    });

    this.suppliersOption.addEventListener('change', async (e) =>
      await this.handleSupplierChange(e)
    );
    this.categoriesOption.addEventListener('change', async (e) =>
      await this.handleCategoriesChange(e)
    );
    this.editSuppliersOption.addEventListener('change', async (e) =>
      await this.handleSupplierChange(e)
    );
    this.editCategoriesOption.addEventListener('change', async (e) =>
      await this.handleCategoriesChange(e)
    );



    this.editProductForm.addEventListener('submit', this.handleEditProductFormSubmit.bind(this));


    this.paginationContainer.addEventListener('click', this.handlePaginationContainerClick.bind(this));
  }


  handleSearchClick(e) {
    e.preventDefault();


    if (this.products.length == 0 || this.searchInput.value.length == 0) {

      Main.renderMessage(document.querySelector('#searchInput').parentElement, true, 'No products found..', 'afterbegin');
      setTimeout(() => Main.renderMessage(document.querySelector('#searchInput').parentElement, false), 1000);
      return;
    }

    this.searchModalObj.show();

    this.searchModalContent.innerHTML = '';
    this.renderSearchProducts(this.products, 99999);

  }

  async handleSearchInputChange(e) {
    const searchQuery = this.searchInput.value;

    if (searchQuery.length < 3)
      return;


    await this.delay(200);

    const products = await this.getProducts();

    // Create a case-insensitive regex from the search query
    const regex = new RegExp(searchQuery, 'i');

    // Filter products by matching the name with the regex
    const filteredByName = products.filter(product => regex.test(product.name));

    // Handle the filtered products (e.g., update the UI)
    console.log(filteredByName); // For debugging, to see the filtered results


    this.updateDataList(filteredByName);

    this.products = filteredByName;
  }

  updateDataList(products) {
    this.searchOptions.innerHTML = '';
    products.forEach(product => this.searchOptions.insertAdjacentHTML('beforeend', `<option value="${product.name}">`));
  }


  async getProducts() {
    try {
      const response = await fetch(`/api/products/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      this.products = result.data;
      return result.data;
    } catch (error) {
      console.error(`Error loading products\nError message: ${error}`);
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  renderSearchProducts(data, limit = 6) {

    data.forEach((product, idx) => {

      if (idx >= limit) return;

      const productElement = document.createElement('div');
      const subCategories = [];
      product.category.subcategories.forEach((subcat) =>
        subCategories.push(subcat.name)
      );

      // const response = await fetch('/api/products/');

      productElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      productElement.innerHTML = `
        <div class="card position-relative" data-product-id="${product._id}">
          <button type="button" class="btn btn-outline-danger delete-product">X</button>
          <img src="${product.image}" class="card-img-top" alt="${product.name
        }" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">Price: $${product.price}</p>
            <p class="card-text">Sizes: ${product.sizes.join(', ')}</p>
            <p class="card-text">Quantity: ${product.quantity}</p>
            <p class="card-text">Supplier: ${product.supplier.name}</p>
            <p class="card-text">Brand: ${product.brand.name}</p>
            <p class="card-text">Category: ${product.category.name}</p>
            <p class="card-text">
                  Sub Categories: ${subCategories.length != 0 ? subCategories.join(', ') : ''
        }
                </p>
            <p class="card-text">Gender: ${product.gender}</p>
          </div>
          <button type="button" class="btn btn-outline-secondary edit-product-btn">
                <i class="bi bi-pencil-square"></i>
                <span class="visually-hidden">Edit Category</span>
              </button>
        </div>`;
      this.searchModalContent.appendChild(productElement);
    });
  }



  async handlePaginationContainerClick(e) {
    if (!e.target.closest('.page-link')) return;

    await this.changePage(e);
  }

  resetPagination() {
    [...document.querySelectorAll('.page-link')].forEach(el => el.classList.remove('active'));
    [...document.querySelectorAll('.page-link')][0].classList.add('active');
  }
  async changePage(e) {
    const productsPerPage = 6; // Number of products per page
    const currentPage = e.target.getAttribute('data-page'); // The page you want to retrieve (e.g., 3rd page)

    [...document.querySelectorAll('.page-link')].forEach(el => el.classList.remove('active'));
    e.target.classList.add('active');


    // Calculate start and end indices
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    console.log(this.products);
    // Get products for the current page
    const productsOnPage = this.products.slice(startIndex, endIndex);
    console.log(productsOnPage)
    this.renderProducts(productsOnPage);

  }

  async editProduct(e) {
    const productId = e.target.closest('.card').getAttribute('data-product-id');
    this.hideAll();
    // remove tab highlighting 
    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));




    this.editSuppliersOption.selectedIndex = 0;
    this.editCategoriesOption.selectedIndex = 0;
    this.editProductForm.querySelector('#gender-option').selectedIndex = 0;
    this.editProductForm.setAttribute('data-product-id', productId);

    const brandsSelect = this.editProductContainer.querySelector('#brand-option').innerHTML = `<option value="" disabled selected>Please select a brand</option>`

    this.editProductContainer.classList.remove('hidden');


    const product = await this.getProduct(productId);

    await this.updateFormData(product);
  }

  async updateFormData(product) {

    this.renderSpinner(this.editProductContainer.querySelector('#spinner-container'), true);

    console.log(product);
    // update name
    this.editProductForm.querySelector('input[name="name"]').value = product.name;

    // update sizes
    this.editProductForm.querySelector('input[name="sizes"]').value = product.sizes.join(',');

    // update price
    this.editProductForm.querySelector('input[name="price"]').value = product.price;

    // update quantity
    this.editProductForm.querySelector('input[name="quantity"]').value = product.quantity;

    // update description - assuming it's a textarea
    this.editProductForm.querySelector('textarea[name="description"]').value = product.description;

    // update image
    this.editProductForm.querySelector('input[name="image"]').value = product.image;

    // select matching supplier
    const suppliers = [...this.editSuppliersOption.querySelectorAll('option')].slice(1);
    let matchingSupplierIndex;
    suppliers.forEach((supplier, idx) => { if (supplier.getAttribute('value') == product.supplier.id) return matchingSupplierIndex = idx; });
    this.editSuppliersOption.selectedIndex = matchingSupplierIndex + 1;

    await this.handleSupplierChange({ target: this.editSuppliersOption });

    // select matching brand
    const brands = [...this.editProductContainer.querySelector('#brand-option').querySelectorAll('option')].slice(1);

    let matchingBrandIndex;
    brands.forEach((brand, idx) => { if (brand.getAttribute('value') == product.brand.id) return matchingBrandIndex = idx; });
    this.editProductContainer.querySelector('#brand-option').selectedIndex = matchingBrandIndex + 1;
    // this.editProductContainer.querySelector('#brand-option').dispatchEvent(new Event('change'));


    // select matching category/subcategories

    const categories = [...this.editProductContainer.querySelector('#category-option').querySelectorAll('option')].slice(1);

    let matchingCategoryIndex;
    categories.forEach((cat, idx) => { if (cat.getAttribute('value') == product.category.id) return matchingCategoryIndex = idx });

    this.editProductContainer.querySelector('#category-option').selectedIndex = matchingCategoryIndex + 1;


    await this.handleCategoriesChange({ target: this.editCategoriesOption });


    //toggle matching subcategories
    const subcategories = [...this.editCategoriesOption.closest('form').querySelector('.subcategories-container').querySelectorAll('input[type="checkbox"]')];

    subcategories.forEach((subcatEl, idx) => {
      const subcatValue = subcatEl.getAttribute('value');
      console.log(subcatValue)
      // Check if the current checkbox's value matches any subcategory ID
      const matchingSubcat = product.category.subcategories.find(subcat => subcat.id === subcatValue);

      if (matchingSubcat) {
        console.log('Matching Subcategory:', matchingSubcat);

        subcatEl.checked = true; // Set the checkbox as checked
      } else {
        subcatEl.checked = false; // Optional: Uncheck if not matching
      }
    });



    // setting gender
    const genderSelect = this.editProductContainer.querySelector('#gender-option');
    let matchingGenderIdx;

    const genders = [...genderSelect.querySelectorAll('option')].slice(1);
    genders.forEach((gender, idx) => {
      if (gender.value == product.gender) return matchingGenderIdx = idx;
    })
    genderSelect.selectedIndex = matchingGenderIdx + 1;


    this.renderSpinner(this.editProductContainer.querySelector('#spinner-container'), false);

  }

  async getProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const product = await response.json();
      return product.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
  async handleEditProductFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.editProductForm);
    const form = Object.fromEntries(formData.entries());

    const validatedForm = this.validateForm(form, e);

    await this.updateProduct(validatedForm, this.editProductForm.getAttribute('data-product-id'));
  }

  highlightTab(e) {
    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));
    e.target.classList.toggle('active');
  }


  validateForm(form, event) {
    // generate sizes array
    form.sizes = form.sizes.split(',').map((item) => item.trim());

    // supplier
    form.supplier = this.getSupplierData(event);

    // brand
    form.brand = this.getBrandData(event);
    //category
    form.category = this.getCategoryData(event);
    return form;
  }


  // YOU NEED TO MAKE THE EDIT PRODUCT WORK FOR ALL TYPES OF ELEMENTS AND THEN CONTINUE IMPLEMENTING THE EDITING SO U WONT HAVE DUPLICATE CODE..
  getSupplierData(e) {
    console.log(e.target);
    const selectElement = e.target.closest('.content-container').querySelector('#suppliers-option');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-supplier-name'),
    };
  }
  getCategoryData(e) {
    const selectedSubCategories = [];

    const selectElement = e.target.closest('.content-container').querySelector('#category-option');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const subCategoryCheckboxes = document.querySelectorAll(
      'input[data-subcategory-name]:checked'
    );

    subCategoryCheckboxes.forEach((checkbox) => {
      const subCategoryId = checkbox.value;
      const subCategoryName = checkbox.getAttribute('data-subcategory-name');

      selectedSubCategories.push({ name: subCategoryName, id: subCategoryId });
    });

    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-category-name'),
      subcategories: selectedSubCategories,
    };
  }
  getBrandData(e) {
    const selectElement = e.target.closest('.content-container').querySelector('#brand-option');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-brand-name'),
    };
  }

  async handleSupplierChange(event) {
    const brandsSelect = event.target.closest('form').querySelector('#brand-option');

    const selectedSupplierId = event.target.value;
    // getting the supplier's brands
    const response = await fetch(`/api/suppliers/${selectedSupplierId}/brands`);

    // if no brands found
    if (response.status == 404) {
      brandsSelect.innerHTML = '';
      brandsSelect.insertAdjacentHTML('beforeend',
        `<option value="" disabled selected>This supplier doesn't sell any brands</option>`
      );
      return;
    }
    const result = await response.json();
    const supplierBrands = result.data;

    // change the select of the brands according to selected supplier
    brandsSelect.innerHTML = `
    <option value="" disabled selected>Please select a brand</option>`;

    supplierBrands.forEach((brand) => {
      const optionElement = document.createElement('option');
      optionElement.innerText = brand.name;
      optionElement.value = brand.id;
      optionElement.setAttribute('data-brand-name', brand.name);

      brandsSelect.appendChild(optionElement);
    });
  }

  async handleCategoriesChange(e) {
    // get rid of all subcat containers for ambigous problems
    document.querySelectorAll('.subcategories-container').forEach(container => container.innerHTML = '');
    const selectedCategoryId = e.target.value;
    const subCategeoriesContainer = e.target.closest('form').querySelector(
      '.subcategories-container'
    );

    subCategeoriesContainer.innerHTML = '';
    // getting subcategories of selected category
    try {
      const response = await fetch(`/api/categories/${selectedCategoryId}`);
      const result = await response.json();
      const subCategories = result.data.subcategories;

      if (subCategories.length == 0) {
        subCategeoriesContainer.innerHTML = `<p>This category doesn't have sub categories.. </p>`
      }

      subCategeoriesContainer.insertAdjacentHTML('beforeend',
        `<label class="form label mb-2">Select Sub Category</label><br>`
      );
      subCategories.forEach((subcat) => {

        subCategeoriesContainer.insertAdjacentHTML('beforeend', `
        
              <input type="checkbox" class="btn-check" id="subcategory-${subcat._id}" autocomplete="off"
                data-subcategory-name="${subcat.name}" value="${subcat._id}">
              <label class="btn btn-outline-primary" for="subcategory-${subcat._id}">${subcat.name}</label><br><br>
          
          `)
      });
    } catch (e) {
      console.error(e);
      this.showMessage('Failed getting subcategories');
    }
  }

  renderSpinner(element, on = true) {
    const previousHTML = element.innerHTML;

    if (on)
      element.innerHTML = ` <div class="mt-5 mx-auto d-flex align-items-center justify-content-center">
        <div class="spinner-border text-center" role="status">
          <span class="sr-only display-4"></span>
        </div>
      </div>`;

    else element.innerHTML = '';

    return previousHTML;
  }

  showMessage(message) {
    this.feedbackMessage.innerHTML = `<p style="font-size:1.4rem;">${message}</p>`;
    setTimeout(() => {
      this.feedbackMessage.classList.toggle('hidden');
      this.feedbackMessage.innerHTML = '';
    }, 1000);
  }

  showProducts(e) {
    e.preventDefault();
    this.hideAll();
    this.productsContainer.classList.remove('hidden');
  }

  showAddProduct(e) {
    e.preventDefault();
    this.hideAll();

    this.suppliersOption.selectedIndex = 0;
    this.categoriesOption.selectedIndex = 0;
    this.addProductContainer.querySelector('#gender-option').selectedIndex = 0;

    const brandsSelect = this.addProductContainer.querySelector('#brand-option').innerHTML = `<option value="" disabled selected>Please select a brand</option>`

    this.addProductContainer.classList.remove('hidden');
  }

  hideAll() {
    document.querySelectorAll('.content-container').forEach(container => {
      if (!container.classList.contains('hidden')) container.classList.add('hidden');
    });
    document.querySelectorAll('.subcategories-container').forEach(container => container.innerHTML = '');

    this.paginationContainer.classList.add('hidden');

  }

  async loadProducts() {
    try {
      const response = await fetch(`/api/products/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      this.products = result.data;
      return result.data;
    } catch (error) {
      this.showMessage(`Error loading products\nError message: ${error}`);
    }
  }

  renderProducts(data, limit = 6) {
    this.productsContainer.innerHTML = '';
    if (data.length === 0) {
      this.productsContainer.innerHTML = `<h4>You don't have any products..</h4>`;
      return;
    }

    data.forEach((product, idx) => {

      if (idx >= limit) return;

      const productElement = document.createElement('div');
      const subCategories = [];
      product.category.subcategories.forEach((subcat) =>
        subCategories.push(subcat.name)
      );

      // const response = await fetch('/api/products/');

      productElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      productElement.innerHTML = `
        <div class="card position-relative" data-product-id="${product._id}">
          <button type="button" class="btn btn-outline-danger delete-product">X</button>
          <img src="${product.image}" class="card-img-top" alt="${product.name
        }" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">Price: $${product.price}</p>
            <p class="card-text">Sizes: ${product.sizes.join(', ')}</p>
            <p class="card-text">Quantity: ${product.quantity}</p>
            <p class="card-text">Supplier: ${product.supplier.name}</p>
            <p class="card-text">Brand: ${product.brand.name}</p>
            <p class="card-text">Category: ${product.category.name}</p>
            <p class="card-text">
                  Sub Categories: ${subCategories.length != 0 ? subCategories.join(', ') : ''
        }
                </p>
            <p class="card-text">Gender: ${product.gender}</p>
          </div>
          <button type="button" class="btn btn-outline-secondary edit-product-btn">
                <i class="bi bi-pencil-square"></i>
                <span class="visually-hidden">Edit Category</span>
              </button>
        </div>`;
      this.productsContainer.appendChild(productElement);
    });
  }

  async addProduct(product) {
    this.feedbackMessage.classList.toggle('hidden');
    this.renderSpinner(this.feedbackMessage, true);

    try {
      const response = await fetch(`/api/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();

      this.renderSpinner(this.feedbackMessage, false);

      this.showMessage('Successfully added product!');

      this.formAddProduct.reset();

      this.addProductTab.dispatchEvent(new Event('click'));


    } catch (error) {
      console.log(error);
      this.showMessage('Error adding product..');
      this.renderSpinner();
    }
  }

  async updateProduct(product, productId) {
    const feedBackMsgEdit = this.editProductContainer.querySelector('.feedback-message-edit');
    feedBackMsgEdit.classList.remove('hidden');
    this.renderSpinner(feedBackMsgEdit, true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify({ product, prodId: productId })
        ,
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();

      this.renderSpinner(feedBackMsgEdit, false);

      feedBackMsgEdit.innerHTML = `<p class="lean">Successfully updated product!</p>`

      setTimeout(() => {
        feedBackMsgEdit.classList.add('hidden');
        this.productsTab.dispatchEvent(new Event('click'));
        this.editProductForm.reset();
      }, 500);

    } catch (error) {
      console.log(error);

      feedBackMsgEdit.innerHTML = `<p class="lean">Error updating product!</p>`

      setTimeout(() => {
        feedBackMsgEdit.classList.add('hidden');
        this.productsTab.dispatchEvent(new Event('click'));
        this.editProductForm.reset();
      }, 500);

    }

  }

  async deleteProduct(e) {
    this.renderSpinner(this.productsContainer, true);

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

      const loaded = await this.loadProducts();
      this.renderSpinner(this.productsContainer, false);
      this.renderProducts(loaded);

    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', async () => {
  new Products();
});

function hidePreLoader() {
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  });
}

hidePreLoader();