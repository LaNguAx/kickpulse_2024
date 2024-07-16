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
    this.categoriesTab.addEventListener('click', async (e) => {
      this.highlightTab(e);
      this.showCategories(e);

      this.renderSpinner(this.categoriesContainer, true);
      const categories = await this.loadCategories();

      this.renderSpinner(this.categoriesContainer, false);

      this.renderCategories(categories);

    });

    this.addCategoryTab.addEventListener('click', (e) => {
      this.highlightTab(e);
      this.showAddCategory(e);
    });

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
    try {
      const response = await fetch(`/api/categories/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      return result.data;
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
    data.forEach((category) => {
      const categoryElement = document.createElement('div');
      const subCategories = category.subcategories
        .map((subcat) => subcat.name)
        .join(', ');

      categoryElement.className = 'col-md-3 col-sm-6 col-12 mb-4';
      categoryElement.innerHTML = `
        <div class="card position-relative" data-category-id="${category._id}">
          <button type="button" class="btn btn-outline-danger delete-category">X</button>
          <div class="card-body">
            <h5 class="card-title">${category.name}</h5>
            <p class="card-text">Category ID: ${category._id}</p>
            <p class="card-text"><strong>Sub Categories:</strong> ${subCategories}</p>

            </div>
            <button type="button" class="btn btn-outline-secondary">
                <i class="bi bi-pencil-square"></i>
                <span class="visually-hidden">Edit Category</span>
              </button>
        </div>`;
      this.categoriesContainer.appendChild(categoryElement);
    });
  }

  async addCategory(category) {
    this.feedbackMessage.classList.toggle('hidden');

    this.renderSpinner(this.feedbackMessage, true);
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
      this.renderSpinner(this.feedbackMessage, false);

      this.showMessage('Successfully added category!');

      this.formAddCategory.reset();
      this.formAddCategory.querySelectorAll('.subcategory-input-container:not(.hidden)').forEach(el => el.remove());

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
    e.target.closest('.subcategory-input-container').remove();
  }

  async deleteCategory(e) {
    this.renderSpinner(this.categoriesContainer, true);
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

      const categories = await this.loadCategories();

      this.renderSpinner(this.categoriesContainer, false);

      this.renderCategories(categories);

    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Categories();
});
