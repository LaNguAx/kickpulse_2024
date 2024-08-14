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
  formEditCategory;
  editCategoryContainer;

  constructor() {
    this.categoriesTab = document.querySelector('.all-categories-tab');
    this.addCategoryTab = document.querySelector('.add-category-tab');
    this.categoriesContainer = document.querySelector('.categories');
    this.addCategoryContainer = document.querySelector('.add-category');
    this.formAddCategory = document.querySelector('.add-category-form');
    this.feedbackAddCategory = document.querySelector('.feedback-add-category');
    this.spinner = document.querySelector('.spinner-border');
    this.feedbackMessage = document.querySelector('.feedback-message');
    this.addSubCategoryBtn = document.querySelectorAll('.add-subcategory-btn');

    this.formEditCategory = document.querySelector('.edit-category-form');
    this.editCategoryContainer = document.querySelector('.edit-category');

    this.initEventListeners();
  }

  initEventListeners() {

    this.formEditCategory.addEventListener('submit', async e => {
      e.preventDefault();

      const validatedForm = this.validateForm(e);

      //laroz al hakayam velhapes bahadash im lo nimza ze omer shemanehel mahak et ha tat categoria izarih limhok muzarim shela
      //CONTINUE HERE U NEED TO DELETE SUB CATEGORIES PRODUCTS WHEN SAVING, DAMNN THIS IS HARD.
      // IT PROLLY NEEDS TO HAPPEN ON THE BACK END 

      this.updateCategory(validatedForm);


    })

    this.categoriesTab.addEventListener('click', async (e) => {
      if (e.target.classList.contains('active')) return;

      this.highlightTab(e);
      this.showCategories(e);
      document.querySelectorAll('.subcategory-input-container:not(.hidden)').forEach(el => el.remove());


      this.renderSpinner(this.categoriesContainer, true);
      const categories = await this.loadCategories();

      this.renderSpinner(this.categoriesContainer, false);

      this.renderCategories(categories);

    });

    this.addCategoryTab.addEventListener('click', (e) => {
      if (e.target.classList.contains('active')) return;

      this.highlightTab(e);
      document.querySelectorAll('.subcategory-input-container:not(.hidden)').forEach(el => el.remove());

      this.showAddCategory(e);
    });

    this.categoriesContainer.addEventListener('click', async (e) => {
      if (e.target.closest('.delete-category')) {
        this.deleteCategory(e);
      }

      if (e.target.closest('.edit-category-btn')) {

        await this.editCategory(e);

      }

    });

    this.formAddCategory.addEventListener('submit', (e) => {
      e.preventDefault();

      const validatedForm = this.validateForm(e);

      this.addCategory(validatedForm);
    });

    this.formAddCategory.addEventListener('click', (e) => {
      // if delete subcategory button is pressed
      if (e.target.classList.contains('delete-subcategory')) {
        this.deleteSubCategory(e);
        return;
      }
    });

    this.formEditCategory.addEventListener('click', async (e) => {
      // if delete subcategory button is pressed
      if (e.target.classList.contains('delete-subcategory')) {
        await this.deleteSubCategory(e);
        return;
      }
    });


    this.addSubCategoryBtn.forEach(el =>
      el.addEventListener('click', (e) =>
        this.addSubCategory(e))
    )

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


  async editCategory(e) {
    const categoryId = e.target.closest('.card').getAttribute('data-category-id');
    this.formEditCategory.setAttribute('data-category-id', categoryId)
    const prevHTML = this.renderSpinner(this.categoriesContainer, true);
    const category = await this.getCategory(categoryId);

    // remove tab highlighting 
    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));
    this.hideAll();
    //end 

    this.categoriesContainer.innerHTML = prevHTML;
    this.editCategoryContainer.classList.remove('hidden');

    this.formEditCategory.querySelector('input[name="name"]').value = category.name;
    category.subcategories.forEach(subcat => {
      const generatedField = this.addSubCategory({ target: this.formEditCategory });
      const input = generatedField.querySelector('input[name="subcategory-name"]');

      input.value = subcat.name;

      input.setAttribute('data-subcategory-id', subcat._id);
    });
  }


  highlightTab(e) {
    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));
    e.target.classList.toggle('active');
  }
  showCategories(e) {


    this.hideAll();
    this.categoriesContainer.classList.remove('hidden');
  }

  showAddCategory(e) {
    this.hideAll();
    this.addCategoryContainer.classList.remove('hidden');
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

  hideAll() {
    document.querySelectorAll('.content-container').forEach(container => {
      if (!container.classList.contains('hidden')) container.classList.add('hidden');
    });
  }

  validateForm(e) {
    const formData = new FormData(e.target.closest('form'));
    const form = Object.fromEntries(formData.entries());

    const subcategoryInputs = e.target.closest('form').querySelectorAll(
      'input[name="subcategory-name"]'
    );

    const subCategories = [];
    subcategoryInputs.forEach((subcat) => {
      const id = subcat.getAttribute('data-subcategory-id');

      const subCatObj = { name: subcat.value };
      if (id) subCatObj._id = id;

      subCategories.push(subCatObj);
    });

    // remove first element because of the hidden trick I did with the HTML
    subCategories.splice(0, 1);

    const CategoryObj = {
      name: form.name,
      _id: e.target.closest('form').getAttribute('data-category-id'),
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
            <button type="button" class="btn btn-outline-secondary edit-category-btn">
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

      this.resetForm(this.formAddCategory);

    } catch (error) {
      console.log(error);
      this.showMessage('Error adding category..');
    }
  }

  resetForm(form) {
    form.reset();
    document.querySelectorAll('.subcategory-input-container:not(.hidden)').forEach(el => el.remove());
  }

  async updateCategory(category) {
    const categoryId = this.formEditCategory.getAttribute('data-category-id');

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      // this.renderSpinner(this.feedbackMessage, false);

      // this.showMessage('Successfully updated category!');

      this.formEditCategory.reset();

      this.categoriesTab.dispatchEvent(new Event('click'));

    } catch (error) {
      console.log(error);
      this.showMessage('Error adding category..');
    }
  }

  addSubCategory(e) {
    const subCategoryElement = e.target.closest('form').querySelector(
      '.subcategory-input-container'
    );
    const clonedElement = subCategoryElement.cloneNode(true);
    clonedElement.classList.toggle('hidden');
    const formBtnsContainer = e.target.closest('form').querySelector('.form-btns-container');
    formBtnsContainer.insertAdjacentElement('beforebegin', clonedElement);
    return clonedElement;
  }

  async deleteSubCategory(e) {
    e.target.closest('.subcategory-input-container').remove();
  }


  async getCategory(id) {
    try {
      const response = await fetch(`/api/categories/${id}`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      return result.data;
    } catch (error) {
      this.showMessage(`Error loading category\nError message: ${error}`);
    }
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

      // this.categoriesTab.dispatchEvent(new Event('click'));
    } catch (error) {
      console.log(error);
    }
  }
}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Categories();
});


function hidePreLoader() {
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  });
}

hidePreLoader();

