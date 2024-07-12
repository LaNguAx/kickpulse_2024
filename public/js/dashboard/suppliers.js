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
    this.suppliersTab.addEventListener('click', (e) => {
      this.showSuppliers(e);
      this.loadSuppliers();
    });
    this.addSupplierTab.addEventListener('click', (e) =>
      this.showAddSupplier(e)
    );
    this.suppliersContainer.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-supplier')) return;
      else this.deleteSupplier(e);
    });
    this.formAddSupplier.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.formAddSupplier);
      const validatedForm = Object.fromEntries(formData.entries());
      // form validation
      this.addSupplier(validatedForm);
    });
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

  async loadSuppliers() {
    this.suppliersContainer.innerHTML = `
      <div class="mt-5 mx-auto">
        <div class="spinner-border text-center" role="status">
          <span class="sr-only display-4">Loading...</span>
        </div>
      </div>`;

    try {
      const response = await fetch(`/api/suppliers/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      const data = result.data;
      this.renderSuppliers(data);
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
      supplierElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      supplierElement.innerHTML = `
        <div class="card position-relative" data-supplier-id="${supplier._id}">
          <button type="button" class="btn btn-outline-danger delete-supplier">X</button>
          <div class="card-body">
            <h5 class="card-title">${supplier.name}</h5>
            <p class="card-text"><strong>Location:</strong> ${
              supplier.location
            }</p>
            <p class="card-text"><strong>Brands:</strong> ${supplier.brands.join(
              ', '
            )}</p>
          </div>
        </div>`;
      this.suppliersContainer.appendChild(supplierElement);
    });
  }

  async addSupplier(supplier) {
    this.renderSpinner();
    try {
      const response = await fetch(`/api/suppliers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier),
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Failed getting response');
      this.showMessage('Successfully added supplier!');
      this.renderSpinner();
      this.formAddSupplier.reset();
    } catch (error) {
      console.log(error);
      this.showMessage('Error adding supplier..');
      this.renderSpinner();
    }
  }

  async deleteSupplier(e) {
    const supplierId = e.target.closest('.card').dataset.supplierId;
    this.suppliersContainer.innerHTML = `
      <div class="mt-5 mx-auto">
        <div class="spinner-border text-center" role="status">
          <span class="sr-only display-4">Loading...</span>
        </div>
      </div>`;
    try {
      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed getting response');
      const result = await response.json();
      const data = result.data;
      this.loadSuppliers();
      e.target.closest('.col-md-4.col-sm-6').remove();
    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Suppliers();
});
