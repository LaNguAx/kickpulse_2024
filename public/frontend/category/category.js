import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';

class Category {

  filtersBtn;
  filtersModal;
  filtersModalObj;

  selectedFilters = [];

  constructor() {
    this.filtersBtn = document.querySelector('#filters-btn');
    this.filtersModal = document.querySelector('#filters-modal');
    this.filtersModalObj = new bootstrap.Modal(document.getElementById('filters-modal'), {
      keyboard: false
    });


    this.initCategoryEventListeners();
  }

  initCategoryEventListeners() {

    this.filtersBtn.addEventListener('click', this.handleFiltersBtnClick.bind(this));
  }

  handleFiltersBtnClick(e) {
    
  }

}


Main.initComponents([Header, QuickView, Category]);

Main.hidePreLoader();
