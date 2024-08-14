import Main from '../../frontend/main.js';

class Branches {

  tabsContainer;
  addBranchForm;
  branchesContainer;
  autocomplete;

  constructor() {
    this.tabsContainer = document.querySelector('.tabs-container');
    this.addBranchForm = document.querySelector('#addBranchForm');
    this.branchesContainer = document.querySelector('.all-branches-container');

    // Initialize the Google Places Autocomplete
    this.initAutocomplete();

    this.initBranchesEventListeners();
  }

  initBranchesEventListeners() {
    this.tabsContainer.addEventListener('click', this.handleTabClick.bind(this));
    this.addBranchForm.addEventListener('submit', this.handleAddBranchFormSubmit.bind(this));
    this.branchesContainer.addEventListener('click', this.handleBranchesContainerClick.bind(this));
  }

  async handleBranchesContainerClick(e) {
    if (e.target.closest('.delete-branch-btn')) {
      await this.deleteBranch(e.target.closest('.delete-branch-btn').getAttribute('data-branch-id'));
      return;
    }
  }

  async deleteBranch(branchId) {
    try {
      // Show a loading spinner
      Main.renderSpinner(this.branchesContainer, true);

      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      // Hide the loading spinner
      Main.renderSpinner(this.branchesContainer, false);

      if (response.ok) {
        Main.renderMessage(this.branchesContainer, true, 'Branch deleted successfully!', 'beforeend');
        setTimeout(() => Main.renderMessage(this.branchesContainer, false), 2000);

        await this.loadBranches();

      } else {
        Main.renderMessage(this.branchesContainer, true, `Failed to delete branch: ${result.message}`, 'beforeend');
        setTimeout(() => Main.renderMessage(this.branchesContainer, false), 2000);
      }
    } catch (error) {
      Main.renderSpinner(this.branchesContainer, false);
      Main.renderMessage(this.branchesContainer, true, `Error: ${error.message}`, 'beforeend');
      setTimeout(() => Main.renderMessage(this.branchesContainer, false), 2000);
      console.error('Error deleting branch:', error);
    }
  }

  async loadBranches() {
    const branchesContainer = document.querySelector('.all-branches-container .row');
    try {
      Main.renderSpinner(branchesContainer, true);

      const response = await fetch('/api/branches');
      const result = await response.json();

      Main.renderSpinner(branchesContainer, false);

      if (result.data.length == 0) {
        branchesContainer.innerHTML = '';
        branchesContainer.innerHTML = `<h4>You don't have any branches yet..</h4>`;
        return;
      }

      if (response.ok && result.data) {
        branchesContainer.innerHTML = ''; // Clear existing branches

        result.data.forEach(branch => {
          const branchElement = document.createElement('div');
          branchElement.className = 'col-md-4 col-sm-6 mb-4';
          branchElement.innerHTML = `
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${branch.name}</h5>
                <p class="card-text">
                  <strong>Location:</strong> ${branch.location}<br>
                  <strong>Created At:</strong> ${new Date(branch.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div class="card-footer text-center">
                <button class="btn btn-danger delete-branch-btn" data-branch-id="${branch._id}">Delete Branch</button>
              </div>
            </div>
          `;
          branchesContainer.appendChild(branchElement);
        });

      } else {
        Main.renderMessage(branchesContainer, true, 'Failed to load branches.', 'beforeend');
        setTimeout(() => Main.renderMessage(branchesContainer, false), 2000);
      }
    } catch (error) {
      Main.renderSpinner(branchesContainer, false);
      Main.renderMessage(branchesContainer, true, `Error: ${error.message}`, 'beforeend');
      setTimeout(() => Main.renderMessage(branchesContainer, false), 2000);
      console.error('Error loading branches:', error);
    }
  }

  initAutocomplete() {
    const branchLocation = document.getElementById('branchLocation');

    this.autocomplete = new google.maps.places.Autocomplete(branchLocation, {
      types: ['geocode'], // Or you can use 'address'
      componentRestrictions: { country: 'us' }, // Optionally restrict to a specific country
    });

    // Bias the autocomplete object to the user's geographical location if available.
    this.autocomplete.setFields(['address_component', 'geometry']);

    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  }

  fillInAddress() {
    const place = this.autocomplete.getPlace();
    console.log('Selected place:', place);
  }

  async handleTabClick(e) {
    const charts = [...document.querySelectorAll('.branches')];
    const tabs = [...document.querySelectorAll('.tab')];
    if (e.target.classList.contains('active')) return;

    if (e.target.getAttribute('data-container') == 'all-branches') {
      charts.forEach(chart => chart.classList.add('hidden'));
      document.querySelector('.container.all-branches-container').classList.remove('hidden');
      tabs.forEach(tab => tab.classList.remove('active'));
      e.target.closest('.tab').classList.add('active');

      await this.loadBranches();
      return;
    } else if (e.target.getAttribute('data-container') == 'add-branch') {
      charts.forEach(chart => chart.classList.add('hidden'));
      document.querySelector('.container.add-branch-container').classList.remove('hidden');
      tabs.forEach(tab => tab.classList.remove('active'));
      e.target.closest('.tab').classList.add('active');
      return;
    }
  }

  async handleAddBranchFormSubmit(event) {
    event.preventDefault();

    const branchData = {
      name: this.addBranchForm.name.value,
      location: this.addBranchForm.location.value
    };

    try {
      // Show a loading spinner
      Main.renderSpinner(this.addBranchForm, true);

      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(branchData)
      });

      const result = await response.json();

      // Hide the loading spinner
      Main.renderSpinner(this.addBranchForm, false);

      if (response.ok) {
        Main.renderMessage(this.addBranchForm, true, 'Branch added successfully!', 'beforeend');
        setTimeout(() => Main.renderMessage(this.addBranchForm, false), 2000);

        // Optionally, reset the form fields
        this.addBranchForm.reset();

        this.tabsContainer.querySelector('.all-branches-tab').click();

      } else {
        Main.renderMessage(this.addBranchForm, true, `Failed to add branch: ${result.message}`, 'beforeend');
        setTimeout(() => Main.renderMessage(this.addBranchForm, false), 2000);
      }
    } catch (error) {
      Main.renderSpinner(this.addBranchForm, false);
      Main.renderMessage(this.addBranchForm, true, `Error: ${error.message}`, 'beforeend');
      setTimeout(() => Main.renderMessage(this.addBranchForm, false), 2000);
      console.error('Error adding branch:', error);
    }
  }
}



function initBranches() {
  window.addEventListener('load', function () {
    new Branches();
  });
}
initBranches();

// Main.initComponents([initBranches]);
Main.hidePreLoader();
