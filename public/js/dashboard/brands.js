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
    this.brandsTab.addEventListener('click', async (e) => {
      this.highlightTab(e);
      this.showBrands(e);

      this.renderSpinner(this.brandsContainer, true);
      const brands = await this.loadBrands();

      this.renderSpinner(this.brandsContainer, false);

      this.renderBrands(brands);
    });

    this.addBrandTab.addEventListener('click', (e) => {
      this.highlightTab(e);
      this.showAddBrand(e);
    });

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
  highlightTab(e) {
    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));

    e.target.classList.toggle('active');
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
    try {
      const response = await fetch(`/api/brands/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      return result.data;
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
    data.forEach((brand) => {
      const brandElement = document.createElement('div');
      brandElement.className = 'col-md-3 col-sm-6 col-12 mb-4';
      brandElement.innerHTML = `
        <div class="card position-relative" data-brand-id="${brand._id}">
          <button type="button" class="btn btn-outline-danger delete-brand">X</button>
          <div class="card-body">
            <h5 class="card-title">${brand.name}</h5>
            <p class="card-text">Brand ID: ${brand._id}</p>
          </div>
           <button type="button" class="btn btn-outline-secondary">
                <i class="bi bi-pencil-square"></i>
                <span class="visually-hidden">Edit Brand</span>
              </button>

        </div>`;
      this.brandsContainer.appendChild(brandElement);
    });
  }

  async addBrand(brand) {
    this.feedbackMessage.classList.toggle('hidden');

    this.renderSpinner(this.feedbackMessage, true);
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

      this.renderSpinner(this.feedbackMessage, false);
      this.showMessage('Successfully added brand!');

      this.formAddBrand.reset();

    } catch (error) {
      console.log(error);
      this.showMessage('Error adding brand..');
      this.renderSpinner();
    }
  }

  async deleteBrand(e) {
    this.renderSpinner(this.brandsContainer, true);
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

      const brands = await this.loadBrands();

      this.renderSpinner(this.brandsContainer, false);
      this.renderBrands(brands);

    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Brands();
});
