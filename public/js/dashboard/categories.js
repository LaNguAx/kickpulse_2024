class Categories {
  categoriesTab;
  addCategoryTab;
  categoriesContainer;
  addCategoryContainer;
  formAddCategory;
  feedbackAddCategory;
  feedbackMessage;
  spinner;
  addSubCategoryBtn;

  constructor() {
    this.categoriesTab = document.querySelector('.all-categories-tab');
    this.addCategoryTab = document.querySelector('.add-category-tab');
    this.categoriesContainer = document.querySelector('.categories');
    this.addCategoryContainer = document.querySelector('.add-category');
    this.formAddCategory = document.querySelector('.add-category-form');
    this.feedbackAddCategory = document.querySelector('.feedback-add-category');
    this.spinner = document.querySelector('.spinner-border');
    this.feedbackMessage = document.querySelector('.feedback-message');
    this.addSubCategoryBtn = document.querySelector('.add-subcategory-btn');

    this.initEventListeners();
  }

  initEventListeners() {
    this.categoriesTab.addEventListener('click', (e) => {
      this.showCategories(e);
      this.loadCategories();
    });

    this.addCategoryTab.addEventListener('click', (e) =>
      this.showAddCategory(e)
    );

    this.categoriesContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-category')) {
        this.deleteCategory(e);
      }
    });

    this.formAddCategory.addEventListener('submit', (e) => {
      e.preventDefault();

      const validatedForm = this.validateForm();

      this.addCategory(validatedForm);
    });

    this.formAddCategory.addEventListener('click', (e) => {
      // if delete subcategory button is pressed
      if (e.target.classList.contains('delete-subcategory')) {
        this.deleteSubCategory(e);
        return;
      }
    });

    this.addSubCategoryBtn.addEventListener('click', (e) =>
      this.addSubCategory(e)
    );
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

  showCategories(e) {
    e.preventDefault();
    this.categoriesContainer.classList.remove('hidden');
    this.addCategoryContainer.classList.add('hidden');
  }

  showAddCategory(e) {
    e.preventDefault();
    this.addCategoryContainer.classList.remove('hidden');
    this.categoriesContainer.classList.add('hidden');
  }

  async loadCategories() {
    this.categoriesContainer.innerHTML = `
      <div class="mt-5 mx-auto">
        <div class="spinner-border text-center" role="status">
          <span class="sr-only display-4">Loading...</span>
        </div>
      </div>`;

    try {
      const response = await fetch(`/api/categories/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      this.renderCategories(result.data);
    } catch (error) {
      this.showMessage(`Error loading categories\nError message: ${error}`);
    }
  }

  validateForm() {
    const formData = new FormData(this.formAddCategory);
    const form = Object.fromEntries(formData.entries());

    const subcategoryInputs = document.querySelectorAll(
      'input[name="subcategory-name"]'
    );

    const subCategories = [];
    subcategoryInputs.forEach((subcat) =>
      subCategories.push({ name: subcat.value })
    );

    // remove first element because of the hidden trick I did with the HTML
    subCategories.splice(0, 1);

    const CategoryObj = {
      name: form.name,
      subcategories: subCategories,
    };
    return CategoryObj;
  }

  renderCategories(data) {
    this.categoriesContainer.innerHTML = '';
    if (data.length === 0) {
      this.categoriesContainer.innerHTML = `<h4>You don't have any categories..</h4>`;
      return;
    }
    console.log(data);
    data.forEach((category) => {
      const categoryElement = document.createElement('div');
      const subCategories = category.subcategories
        .map((subcat) => subcat.name)
        .join(', ');

      categoryElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      categoryElement.innerHTML = `
        <div class="card position-relative" data-category-id="${category._id}">
          <button type="button" class="btn btn-outline-danger delete-category">X</button>
          <div class="card-body">
            <h5 class="card-title">${category.name}</h5>
            <p class="card-text">Category ID: ${category._id}</p>
            <p class="card-text"><strong>Sub Categories:</strong> ${subCategories}</p>

            </div>
        </div>`;
      this.categoriesContainer.appendChild(categoryElement);
    });
  }

  async addCategory(category) {
    this.renderSpinner();
    console.log(category);
    try {
      const response = await fetch(`/api/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      this.showMessage('Successfully added category!');
      this.renderSpinner();
      this.formAddCategory.reset();
    } catch (error) {
      console.log(error);
      this.showMessage('Error adding category..');
      this.renderSpinner();
    }
  }

  addSubCategory(e) {
    const subCategoryElement = document.querySelector(
      '.subcategory-input-container'
    );
    const clonedElement = subCategoryElement.cloneNode(true);
    clonedElement.classList.toggle('hidden');
    const formBtnsContainer = document.querySelector('.form-btns-container');
    formBtnsContainer.insertAdjacentElement('beforebegin', clonedElement);
  }

  deleteSubCategory(e) {
    console.log('hi');
    e.target.closest('.subcategory-input-container').remove();
  }

  async deleteCategory(e) {
    const categoryId = e.target.closest('.card').dataset.categoryId;
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      this.loadCategories();
      e.target.closest('.col-md-4.col-sm-6').remove();
    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Categories();
});
