import Main from './main.js';

class Search {

  searchForm;
  searchInput;
  searchBtn;
  constructor() {

    this.searchForm = document.querySelector('.search-form');
    this.searchInput = this.searchForm.querySelector('input');
    this.searchBtn = this.searchForm.querySelector('button');

    this.initSearchEventListeners();
  }

  initSearchEventListeners() {
    this.searchForm.addEventListener('submit', this.handleSearchClick.bind(this));
  }

  handleSearchClick(e) {
    e.preventDefault();
    console.log(this.searchInput.value)
  }


}


export default Search;