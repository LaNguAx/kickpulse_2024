class Brands {
  brandsTab;
  addBrandTab;
  brandsContainer;
  addBrandContainer;
  formAddBrand;
  feedbackAddBrand;
  feedbackMessage;
  spinner;

  constructor() {
    this.brandsTab = document.querySelector('.all-brands-tab');
    this.addBrandTab = document.querySelector('.add-brand-tab');
    this.brandsContainer = document.querySelector('.brands');
    this.addBrandContainer = document.querySelector('.add-brand');
    this.formAddBrand = document.querySelector('.add-brand-form');
    this.feedbackAddBrand = document.querySelector('.feedback-add-brand');
    this.spinner = document.querySelector('.spinner-border');
    this.feedbackMessage = document.querySelector('.feedback-message');

    this.initEventListeners();
  }

  initEventListeners() {
    this.brandsTab.addEventListener('click', (e) => {
      this.showBrands(e);
      this.loadBrands();
    });

    this.addBrandTab.addEventListener('click', (e) => this.showAddBrand(e));

    this.brandsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-brand')) {
        this.deleteBrand(e);
      }
    });

    this.formAddBrand.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.formAddBrand);
      const form = Object.fromEntries(formData.entries());

      this.addBrand(form);
    });
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

  showBrands(e) {
    e.preventDefault();
    this.brandsContainer.classList.remove('hidden');
    this.addBrandContainer.classList.add('hidden');
  }

  showAddBrand(e) {
    e.preventDefault();
    this.addBrandContainer.classList.remove('hidden');
    this.brandsContainer.classList.add('hidden');
  }

  async loadBrands() {
    this.brandsContainer.innerHTML = `
      <div class="mt-5 mx-auto">
        <div class="spinner-border text-center" role="status">
          <span class="sr-only display-4">Loading...</span>
        </div>
      </div>`;

    try {
      const response = await fetch(`/api/brands/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      this.renderBrands(result.data);
    } catch (error) {
      this.showMessage(`Error loading brands\nError message: ${error}`);
    }
  }

  renderBrands(data) {
    this.brandsContainer.innerHTML = '';
    if (data.length === 0) {
      this.brandsContainer.innerHTML = `<h4>You don't have any brands..</h4>`;
      return;
    }
    console.log(data);
    data.forEach((brand) => {
      const brandElement = document.createElement('div');
      brandElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      brandElement.innerHTML = `
        <div class="card position-relative" data-brand-id="${brand._id}">
          <button type="button" class="btn btn-outline-danger delete-brand">X</button>
          <div class="card-body">
            <h5 class="card-title">${brand.name}</h5>
            <p class="card-text">Brand ID: ${brand._id}</p>
          </div>
        </div>`;
      this.brandsContainer.appendChild(brandElement);
    });
  }

  async addBrand(brand) {
    this.renderSpinner();
    try {
      const response = await fetch(`/api/brands/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brand),
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      this.showMessage('Successfully added brand!');
      this.renderSpinner();
      this.formAddBrand.reset();
    } catch (error) {
      console.log(error);
      this.showMessage('Error adding brand..');
      this.renderSpinner();
    }
  }

  async deleteBrand(e) {
    const brandId = e.target.closest('.card').dataset.brandId;
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      this.loadBrands();
      e.target.closest('.col-md-4.col-sm-6').remove();
    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Brands();
});
