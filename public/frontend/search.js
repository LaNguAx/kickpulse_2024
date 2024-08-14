import Main from './main.js';

class Search {

  searchForm;
  searchInput;
  searchBtn;
  searchOptions;
  searchModal;
  searchModalContent;
  searchModalObj;

  products = [];

  constructor() {

    this.searchForm = document.querySelector('.search-form');
    this.searchInput = this.searchForm.querySelector('input');
    this.searchBtn = this.searchForm.querySelector('button');
    this.searchOptions = this.searchForm.querySelector('#searchOptions');

    this.searchModal = document.querySelector('#searchModal');
    this.searchModalContent = this.searchModal.querySelector('.modal-body');
    this.searchModalObj = new bootstrap.Modal(this.searchModal, {
      keyboard: false
    });


    this.initSearchEventListeners();
  }

  initSearchEventListeners() {

    this.searchInput.addEventListener('keyup', this.handleSearchInputChange.bind(this));
    this.searchForm.addEventListener('submit', this.handleSearchClick.bind(this));

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
    // Create a container for the recent products with Bootstrap grid layout
    const recentProductsContainer = document.createElement('div');
    recentProductsContainer.className = 'recent-products row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 g-3 justify-content-center';

    data.forEach((product, idx) => {

      if (idx >= limit) return;

      const productElement = document.createElement('div');
      productElement.className = 'col product-card';
      productElement.setAttribute('data-product-id', product._id);
      productElement.innerHTML = `
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
           `;

      recentProductsContainer.appendChild(productElement);
    });

    // Clear existing content in the modal and append the recent products container
    this.searchModalContent.innerHTML = '';
    this.searchModalContent.appendChild(recentProductsContainer);
    this.searchModal.querySelector('#numOfFoundProducts').innerHTML = `Number of found products: ${data.length}`;
  }



}


export default Search;