import Cart from './cart.js';
import Search from './search.js';
import User from './user.js';
import QuickView from './quickView.js';

class Header {
  cart;
  search;
  user;
  quickView;
  constructor() {
    this.cart = new Cart();
    this.search = new Search();
    this.user = new User();
    this.quickView = new QuickView();
  }

  get Cart() {
    return this.cart;
  }

  get Search() {
    return this.search;
  }

  get User() {
    return this.user;
  }
  get QuickView() {
    return this.quickView;
  }
}

export default Header;
