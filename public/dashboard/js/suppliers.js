class Suppliers {
  suppliersTab;
  addSupplierTab;
  suppliersContainer;
  addSupplierContainer;
  formAddSupplier;
  feedbackAddSupplier;
  feedbackMessage;
  spinner;
  locationsSelect;
  countriesLoaded = false;

  constructor() {
    this.suppliersTab = document.querySelector('.all-suppliers-tab');
    this.addSupplierTab = document.querySelector('.add-supplier-tab');
    this.suppliersContainer = document.querySelector('.suppliers');
    this.addSupplierContainer = document.querySelector('.add-supplier');
    this.formAddSupplier = document.querySelector('.add-supplier-form');
    this.feedbackAddSupplier = document.querySelector('.feedback-add-supplier');
    this.spinner = document.querySelector('.spinner-border');
    this.feedbackMessage = document.querySelector('.feedback-message');
    this.locationsSelect = document.querySelector('select[name="location"]');
    this.initEventListeners();
  }

  initEventListeners() {
    this.suppliersTab.addEventListener('click', async (e) => {

      if (e.target.classList.contains('active')) return;
      this.highlightTab(e);
      this.showSuppliers(e);
      this.renderSpinner(this.suppliersContainer, true);
      const loaded = await this.loadSuppliers();
      this.renderSpinner(this.suppliersContainer, false);
      this.renderSuppliers(loaded);


    });
    this.addSupplierTab.addEventListener('click', (e) => {
      if (e.target.classList.contains('active')) return;
      this.highlightTab(e);
      this.showAddSupplier(e);
    }
    );

    this.suppliersContainer.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-supplier')) return;
      else this.deleteSupplier(e);
    });
    this.formAddSupplier.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.formAddSupplier);
      const form = Object.fromEntries(formData.entries());
      // form validation

      const brands = this.validateForm();
      if (!brands) return;

      form.brands = brands;
      form.location = this.locationsSelect.value;

      const validatedForm = form;
      this.addSupplier(validatedForm);
    });
  }

  validateForm() {
    const selectedBrands = [];

    // Get all checkboxes with name "brands"
    const brandCheckboxes = document.querySelectorAll(
      'input[name="brands"]:checked'
    );

    brandCheckboxes.forEach((checkbox) => {
      const brandId = checkbox.value;
      const brandName = checkbox.getAttribute('data-brand-name');

      selectedBrands.push({ id: brandId, name: brandName });
    });

    if (selectedBrands.length === 0) {
      this.showMessage('Please select a brand!')
      return false;
    }

    return selectedBrands;
  }

  highlightTab(e) {
    if (e.target.classList.contains('active')) return;

    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));
    e.target.classList.toggle('active');
  }

  showSuppliers(e) {
    this.suppliersContainer.classList.remove('hidden');
    this.addSupplierContainer.classList.add('hidden');
  }

  async showAddSupplier(e) {
    this.addSupplierContainer.classList.remove('hidden');
    this.suppliersContainer.classList.add('hidden');

    // if user already loaded countries then skip
    if (this.countriesLoaded) return;

    const response = await fetch(`https://restcountries.com/v3.1/all`);
    if (!response.ok) {
      this.locationsSelect.insertAdjacentHTML('beforeend', `<option value="undefined">Failed to get countries! Reload page..</option>`);
    }
    else {
      const countries = await response.json();
      const countryNames = countries.map(country => country.name.common);
      countryNames.sort((a, b) => a.localeCompare(b));
      countryNames.forEach(country => {
        this.locationsSelect.insertAdjacentHTML('beforeend', `
          <option value="${country}">${country}  </option>
        `);

      })
    }

    this.countriesLoaded = true;
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
      this.feedbackMessage.classList.remove('hidden');
      this.feedbackMessage.innerHTML = '';
    }, 1000);
  }

  async loadSuppliers() {
    try {
      const response = await fetch(`/api/suppliers/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      return result.data;
    } catch (error) {
      this.suppliersContainer.innerHTML =
        '<h4>Failed fetching suppliers..</h4>';
      this.showMessage(`Error loading suppliers\nError message: ${error}`);
    }
  }

  renderSuppliers(data) {
    this.suppliersContainer.innerHTML = '';
    if (data.length == 0) {
      this.suppliersContainer.innerHTML = `<h4>You don't have any suppliers..</h4>`;
      return;
    }

    data.forEach((supplier) => {
      const supplierElement = document.createElement('div');
      const supplierBrands = [];
      supplier.brands.forEach((brand) => {
        supplierBrands.push(brand.name);
      });
      supplierElement.className = 'col-md-3 col-sm-6 col-12 mb-4';
      supplierElement.innerHTML = `
        <div class="card position-relative" data-supplier-id="${supplier._id}">
          <button type="button" class="btn btn-outline-danger delete-supplier">X</button>
          <div class="card-body">
            <h5 class="card-title">${supplier.name}</h5>
            <p class="card-text"><strong>Location:</strong> ${supplier.location
        }</p>
            <p class="card-text"><strong>Brands:</strong> ${supplierBrands.length == 0 ? `                <p>Supplier doesn't have brands..<br>Please add some first</p>
` : supplierBrands.join(', ')}</p>
          </div>
        </div>`;
      this.suppliersContainer.appendChild(supplierElement);
    });
  }

  async addSupplier(supplier) {
    // this.feedbackMessage.classList.toggle('hidden');
    this.renderSpinner(this.feedbackMessage, true);

    try {
      const response = await fetch(`/api/suppliers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier),
      });

      await response.json();

      if (!response.ok) throw new Error('Failed getting response');

      this.renderSpinner(this.feedbackMessage, false);

      this.showMessage('Successfully added supplier!');

      this.formAddSupplier.reset();

    } catch (error) {
      console.log(error);
      this.renderSpinner(this.feedbackMessage, true);
      this.showMessage('Error adding supplier..');
      // this.renderSpinner(this.feedbackMessage, true);

    }
  }

  async deleteSupplier(e) {
    this.renderSpinner(this.suppliersContainer, true);

    const supplierId = e.target.closest('.card').dataset.supplierId;
    try {
      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      await response.json();
      if (!response.ok) throw new Error('Failed getting response');


      const loaded = await this.loadSuppliers();
      this.renderSpinner(this.suppliersContainer, false);
      this.renderSuppliers(loaded);

    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Suppliers();
});
