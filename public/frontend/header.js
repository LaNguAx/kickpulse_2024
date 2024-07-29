import Cart from './cart.js';
import Search from './search.js';

class Header {
  cart;
  search;
  constructor() {
    this.cart = new Cart();
    this.search = new Search();
  }

  get Cart() {
    return this.cart;
  }

  get Search() {
    return this.search;
  }

}

export default Header;
