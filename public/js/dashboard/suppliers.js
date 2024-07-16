class Suppliers {
  suppliersTab;
  addSupplierTab;
  suppliersContainer;
  addSupplierContainer;
  formAddSupplier;
  feedbackAddSupplier;
  feedbackMessage;
  spinner;

  constructor() {
    this.suppliersTab = document.querySelector('.all-suppliers-tab');
    this.addSupplierTab = document.querySelector('.add-supplier-tab');
    this.suppliersContainer = document.querySelector('.suppliers');
    this.addSupplierContainer = document.querySelector('.add-supplier');
    this.formAddSupplier = document.querySelector('.add-supplier-form');
    this.feedbackAddSupplier = document.querySelector('.feedback-add-supplier');
    this.spinner = document.querySelector('.spinner-border');
    this.feedbackMessage = document.querySelector('.feedback-message');
    this.initEventListeners();
  }

  initEventListeners() {
    this.suppliersTab.addEventListener('click', async (e) => {
      this.highlightTab(e);
      this.showSuppliers(e);

      this.renderSpinner(this.suppliersContainer, true);
      const loaded = await this.loadSuppliers();
      this.renderSpinner(this.suppliersContainer, false);
      this.renderSuppliers(loaded);


    });
    this.addSupplierTab.addEventListener('click', (e) => {
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
    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));
    e.target.classList.toggle('active');
  }

  showSuppliers(e) {
    e.preventDefault();
    this.suppliersContainer.classList.remove('hidden');
    this.addSupplierContainer.classList.add('hidden');
  }

  showAddSupplier(e) {
    e.preventDefault();
    this.addSupplierContainer.classList.remove('hidden');
    this.suppliersContainer.classList.add('hidden');
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
            <p class="card-text"><strong>Brands:</strong> ${supplierBrands.join(
          ', '
        )}</p>
          </div>
        </div>`;
      this.suppliersContainer.appendChild(supplierElement);
    });
  }

  async addSupplier(supplier) {

    this.feedbackMessage.classList.toggle('hidden');
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
      this.showMessage('Error adding supplier..');
      this.renderSpinner();
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
