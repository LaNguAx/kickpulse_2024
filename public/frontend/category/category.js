import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';

class Category {

  categoryProductsContainer;
  filtersBtn;
  filtersModal;
  filtersModalObj;
  applyFiltersBtn;

  selectedFilters = [];

  constructor() {
    this.filtersBtn = document.querySelector('#filters-btn');
    this.filtersModal = document.querySelector('#filters-modal');
    this.filtersModalObj = new bootstrap.Modal(document.getElementById('filters-modal'), {
      keyboard: false
    });
    this.applyFiltersBtn = document.querySelector('#apply-filters-btn');
    this.categoryProductsContainer = document.querySelector('.category-products');

    this.initCategoryEventListeners();
  }

  initCategoryEventListeners() {

    this.filtersBtn.addEventListener('click', this.handleFiltersBtnClick.bind(this));
    this.applyFiltersBtn.addEventListener('click', this.handleApplyFiltersBtnClick.bind(this));
  }

  handleFiltersBtnClick(e) {

  }

  async handleApplyFiltersBtnClick(e) {


    const checkedFilters = [...document.querySelectorAll('.filter:checked')];

    Main.renderSpinner(this.categoryProductsContainer, true);
    const response = await fetch(`/api/categories/products/${this.filtersModal.getAttribute('data-category-id')}`);
    if (!response.ok)
      throw new Error('Failed getting products for category');
    const result = await response.json();

    const products = result.data;

    const filters = checkedFilters.map(filter => filter.getAttribute('id'));


    const filteredProducts = products.filter(product => {

      if (filters.find(filter => filter == product.brand.name) || filters.find(filter => filter.toLowerCase() == product.gender) || filters.find(filter => product.sizes.find(size => size == filter))) {
        return product;
      }

    })

    Main.renderSpinner(this.categoryProductsContainer, false);

    if (checkedFilters.length == 0) {
      this.filtersModalObj.hide();
      this.renderProducts(products);
      return;
    }

    console.log(filteredProducts)
    if (filteredProducts.length == 0) {
      this.resetFilters();
      Main.renderMessage(this.categoryProductsContainer, true, 'No products found..', 'beforebegin');

      setTimeout(() =>
        Main.renderMessage(this.categoryProductsContainer, false, 'No products found..', 'beforebegin'), 1500);

      this.filtersModalObj.hide();
      return;
    }

    this.filtersModalObj.hide();

    this.renderProducts(filteredProducts);

    Main.renderSpinner(this.categoryProductsContainer, false);
  }

  renderProducts(products) {
    let HTML = '';
    products.forEach(product => {
      HTML += `
        <div class="col product-card" data-product-id="${product._id}">
            <div class="card h-100">
                <button type="button"
                    class="btn nav-link p-0 border-0 h-100 d-flex flex-column align-items-center"
                    data-bs-toggle="modal" data-bs-target="#quick-view-modal">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body text-center p-2 d-flex flex-column mt-auto">
                            <h5 class="card-title flex-grow-1 d-flex align-items-center justify-content-center">
                                ${product.name}</h5>
                            <strong class="d-block mt-2">Quick View</strong>
                        </div>
                </button>
            </div>
            </div >
        `;
    });

    this.categoryProductsContainer.innerHTML = '';
    this.categoryProductsContainer.insertAdjacentHTML('afterbegin', HTML);
  }


  resetFilters() {
    const checkedFilters = [...document.querySelectorAll('.filter:checked')];
    checkedFilters.forEach(filter => filter.checked = false);
  }

}


Main.initComponents([Header, QuickView, Category]);

Main.hidePreLoader();
