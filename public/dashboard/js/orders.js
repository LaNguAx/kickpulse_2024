import Main from "../../frontend/main.js";
class Orders {
  ordersTab;
  suppliedOrderTab;
  ordersContainer;
  suppliedOrdersContainer

  searchForm;
  searchInput;
  searchBtn;
  searchOptions;
  searchModal;
  searchModalContent;
  searchModalObj;
  orders = [];

  groupByModal;
  groupByBtn;
  groupByModalContent;
  groupByModalObj;


  constructor() {
    this.ordersTab = document.querySelector('.all-orders-tab');
    this.suppliedOrderTab = document.querySelector('.supplied-order-tab');
    this.ordersContainer = document.querySelector('.orders');
    this.suppliedOrdersContainer = document.querySelector('.supplied-order');


    this.searchForm = document.querySelector('.search-form');
    this.searchInput = this.searchForm.querySelector('input');
    this.searchBtn = this.searchForm.querySelector('button');
    this.searchOptions = this.searchForm.querySelector('#searchOptions');

    this.searchModal = document.querySelector('#searchModal');
    this.searchModalContent = this.searchModal.querySelector('.modal-body');
    this.searchModalObj = new bootstrap.Modal(this.searchModal, {
      keyboard: false
    });

    this.groupByModal = document.querySelector('#groupByEmailModal');
    this.groupByBtn = document.querySelector('#groupByShowBtn');
    this.groupByModalContent = this.groupByModal.querySelector('.modal-body');
    this.groupByModalObj = new bootstrap.Modal(this.groupByModal, {
      keyboard: false
    });


    this.initEventListeners();
  }

  initEventListeners() {
    this.ordersTab.addEventListener('click', this.handleOrdersTabClick.bind(this));
    this.suppliedOrderTab.addEventListener('click', this.handleSuppliedOrdersTabClick.bind(this));

    this.ordersContainer.addEventListener('click', this.handleOrdersContainerClick.bind(this));
    this.searchModalContent.addEventListener('click', this.handleOrdersContainerClick.bind(this));
    this.groupByModalContent.addEventListener('click', this.handleOrdersContainerClick.bind(this));

    this.searchInput.addEventListener('keyup', this.handleSearchInputChange.bind(this));
    this.searchForm.addEventListener('submit', this.handleSearchClick.bind(this));
    this.groupByBtn.addEventListener('click', this.handleGroupByBtnClick.bind(this));

  }

  // GROUPBY START
  async handleGroupByBtnClick(e) {
    e.preventDefault();

    try {
      // Fetch grouped orders from the API
      const response = await fetch('/api/orders/groupby');
      if (!response.ok) throw new Error('Failed to fetch grouped orders.');

      const { data: groupedOrders } = await response.json();

      // Log the grouped orders for debugging
      console.log('Grouped Orders:', groupedOrders);

      // Render the grouped orders to the UI
      this.renderGroupedOrders(groupedOrders);
      this.groupByModalObj.show();

    } catch (error) {
      console.error('Error fetching grouped orders:', error);
    }
  }

  renderGroupedOrders(groupedOrders) {
    // Clear existing content in the modal
    this.groupByModalContent.innerHTML = '';

    // Loop through the grouped orders data
    Object.keys(groupedOrders).forEach((email, idx) => {
      // Create a section for each email
      const emailSection = document.createElement('div');
      emailSection.className = 'email-group mb-5';
      emailSection.innerHTML = `<h4>Email: ${groupedOrders[email]._id}</h4>`;

      // Create a row to contain all orders under this email
      const ordersRow = document.createElement('div');
      ordersRow.className = 'row';
      console.log(email);

      // Loop through the orders for this email
      groupedOrders[email].orders.forEach((order) => {
        // Create the order card
        const orderElement = document.createElement('div');
        orderElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
        orderElement.innerHTML = `
          <div class="card position-relative" data-order-id="${order._id}">
            ${order.supplied ? '<h5 class="text-center p-1">SUPPLIED</h5>' : `
            <button type="button" class="btn btn-outline-danger delete-order">X</button>`}
            <div class="card-body">
              <h5 class="card-title">Order ID: ${order._id}</h5>
              <p class="card-text"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
              <p class="card-text"><strong>Email:</strong> ${order.email}</p>
              <p class="card-text"><strong>Address:</strong> ${order.address}</p>
              <p class="card-text"><strong>Country:</strong> ${order.country}</p>
              <p class="card-text"><strong>Zip:</strong> ${order.zip}</p>
              <p class="card-text"><strong>CC Name:</strong> ${order.paymentDetails.ccName}</p>
              <p class="card-text"><strong>CC Number:</strong> ${order.paymentDetails.ccNumber}</p>
              <p class="card-text"><strong>CC Expiration:</strong> ${order.paymentDetails.ccExpiration}</p>
              <p class="card-text"><strong>CC CVV:</strong> ${order.paymentDetails.ccCvv}</p>
              <h6 class="card-subtitle mb-2 text-muted">Cart Items</h6>
              <ul class="list-group list-group-flush mb-3">
                ${order.cart.map(item => `
                  <li class="list-group-item">
                    <strong>${item.title}</strong> - Size: ${item.size}, Qty: ${item.quantity}, Price: $${item.price}
                  </li>
                `).join('')}
              </ul>
              <h6 class="card-subtitle mb-2 text-muted">Total: $${order.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h6>
              <h6 class="card-subtitle mb-2 text-muted">Ordered By: ${order.orderedBy || 'Temp User'}</h6>
            </div>
            ${order.supplied ? '<h5 class="text-center p-1">SUPPLIED</h5>' : `
            <button type="button" class="btn btn-outline-primary supplied-order-btn">
              <i class="bi bi-check-circle"></i>
              <span class="visually-hidden">Supplied Order</span>
            </button>`}
          </div>
        `;
        ordersRow.appendChild(orderElement);
      });

      // Append the orders row to the email section
      emailSection.appendChild(ordersRow);

      // Append the email section to the modal content
      this.groupByModalContent.appendChild(emailSection);
    });
  }

  // GROUPBY END


  // SEARCH STAR
  handleSearchClick(e) {
    e.preventDefault();

    if (this.orders.length == 0 || this.searchInput.value.length == 0) {

      Main.renderMessage(document.querySelector('#searchInput').parentElement, true, 'No orders found..', 'afterbegin');
      setTimeout(() => Main.renderMessage(document.querySelector('#searchInput').parentElement, false), 1000);
      return;
    }

    this.searchModalObj.show();

    this.searchModalContent.innerHTML = '';
    this.renderSearchOrders(this.orders, 99999);

  }


  async handleSearchInputChange(e) {
    const searchQuery = this.searchInput.value;

    if (searchQuery.length < 3)
      return;


    await this.delay(200);

    const orders = await this.getOrders();
    // Create a case-insensitive regex from the search query
    const regex = new RegExp(searchQuery, 'i');

    const orderEmails = [...new Set(orders.map(order => order.email))];
    // Filter orders by matching the name with the regex
    const filteredByOrder = orders.filter(order => regex.test(`${order.email}`));

    const filterEmails = orderEmails.filter(email => regex.test(`${email}`));

    this.updateDataList(filterEmails);
    this.orders = filteredByOrder;
    console.log(this.orders);
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateDataList(emails) {
    this.searchOptions.innerHTML = '';
    emails.forEach(email => this.searchOptions.insertAdjacentHTML('beforeend', `<option value="${email}">`));
  }

  renderSearchOrders(data, limit = 6) {
    // Clear existing content in the modal
    this.searchModalContent.innerHTML = '';

    // Check if there are any unfulfilled orders
    let hasUnfulfilledOrders = false;

    // Loop through the orders data
    data.forEach((order, idx) => {
      if (idx >= limit) return;


      // Create the order card
      const orderElement = document.createElement('div');
      orderElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      orderElement.innerHTML = `
                <div class="card position-relative" data-order-id="${order._id}">
      ${order.supplied ? '<h5 class="text-center p-1">SUPPLIED</h5>' : `                  <button type="button" class="btn btn-outline-danger delete-order">X</button>
`}
                <div class="card-body">
                    <h5 class="card-title">Order ID: ${order._id}</h5>
                    <p class="card-text"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
                    <p class="card-text"><strong>Email:</strong> ${order.email}</p>
                    <p class="card-text"><strong>Address:</strong> ${order.address}</p>
                    <p class="card-text"><strong>Country:</strong> ${order.country}</p>
                    <p class="card-text"><strong>Zip:</strong> ${order.zip}</p>
                    <p class="card-text"><strong>CC Name:</strong> ${order.paymentDetails.ccName}</p>
                    <p class="card-text"><strong>CC Number:</strong> ${order.paymentDetails.ccNumber}</p>
                    <p class="card-text"><strong>CC Expiration:</strong> ${order.paymentDetails.ccExpiration}</p>
                    <p class="card-text"><strong>CC CVV:</strong> ${order.paymentDetails.ccCvv}</p>
                    <h6 class="card-subtitle mb-2 text-muted">Cart Items</h6>
                    <ul class="list-group list-group-flush mb-3">
                      ${order.cart.map(item => `
                        <li class="list-group-item">
                          <strong>${item.title}</strong> - Size: ${item.size}, Qty: ${item.quantity}, Price: $${item.price}
                        </li>
                      `).join('')}
                    </ul>
                    <h6 class="card-subtitle mb-2 text-muted">Total: $${order.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h6>
                    <h6 class="card-subtitle mb-2 text-muted">Ordered By: ${order.orderedBy || 'Temp User'}</h6>
                  </div>
                       ${order.supplied ? '<h5 class="text-center p-1">SUPPLIED</h5>' : `                  <button type="button" class="btn btn-outline-primary supplied-order-btn">
                    <i class="bi bi-check-circle"></i>
                    <span class="visually-hidden">Supplied Order</span>
                  </button>
`}
                  
                </div>
            `;
      // Append the order card to the modal content
      this.searchModalContent.appendChild(orderElement);
    });
  }



  // SEARCH END


  async getOrders() {
    try {
      const response = await fetch(`/api/orders/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      this.orders = result.data;
      return result.data;
    } catch (error) {
      console.error(`Error loading products\nError message: ${error}`);
    }
  }




  async handleOrdersContainerClick(e) {
    this.searchInput.value = '';
    if (e.target.closest('.supplied-order-btn')) {
      try {
        await this.supplyOrder(e.target.closest('.card').getAttribute('data-order-id'));
        const orderElement = e.target.closest('.col-md-4');
        this.moveToSuppliedOrders(orderElement);
        this.searchModalObj.hide();
        this.groupByModalObj.hide();

        return;
      } catch (e) {
        console.error(e);
        return;
      }
    }

    if (e.target.closest('.delete-order')) {
      await this.deleteOrder(e.target.closest('.card').getAttribute('data-order-id'));
      this.searchModalObj.hide();
      this.groupByModalObj.hide();

      return;
    }


  }

  async deleteOrder(orderId) {
    this.renderSpinner(this.ordersContainer, true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();

      const orders = (await this.loadOrders()).filter(order => !order.supplied);

      this.renderSpinner(this.ordersContainer, false);

      this.renderOrders(orders);

      // this.ordersTab.dispatchEvent(new Event('click'));
    } catch (error) {
      console.log(error);
    }

  }

  async supplyOrder(orderId) {
    try {
      this.suppliedOrderTab.dispatchEvent(new Event('click'));
      const prevHTML = this.renderSpinner(this.suppliedOrdersContainer, true);
      const order = await this.getOrder(orderId);
      order.supplied = true;

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      this.renderSpinner(this.suppliedOrdersContainer, false);

      this.suppliedOrdersContainer.innerHTML = prevHTML;

      await this.renderSuppliedOrders();

    } catch (e) {
      // this.showMessage('Error supplying order..', e);
      console.error(e);
    }

  }


  async renderSuppliedOrders() {
    this.ordersContainer.innerHTML = '';
    const data = await this.loadOrders();

    if (data.length === 0) {
      this.ordersContainer.innerHTML = `<h4>You don't have any supplied orders..</h4>`;
      return;
    }

    const suppliedOrders = data.filter(order => order.supplied);

    if (suppliedOrders.length === 0) {
      this.ordersContainer.innerHTML = `<h4>You don't have any supplied orders..</h4>`;
      return;
    }

    suppliedOrders.forEach((order) => {
      const orderElement = document.createElement('div');
      orderElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      orderElement.innerHTML = `
        <div class="card position-relative" data-order-id="${order._id}">
          <button type="button" class="btn btn-outline-danger delete-order">X</button>
          <div class="card-body">
            <h5 class="card-title">Order ID: ${order._id}</h5>
            <p class="card-text"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
            <p class="card-text"><strong>Email:</strong> ${order.email}</p>
            <p class="card-text"><strong>Address:</strong> ${order.address}</p>
            <p class="card-text"><strong>Country:</strong> ${order.country}</p>
            <p class="card-text"><strong>Zip:</strong> ${order.zip}</p>
            <p class="card-text"><strong>CC Name:</strong> ${order.paymentDetails.ccName}</p>
            <p class="card-text"><strong>CC Number:</strong> ${order.paymentDetails.ccNumber}</p>
            <p class="card-text"><strong>CC Expiration:</strong> ${order.paymentDetails.ccExpiration}</p>
            <p class="card-text"><strong>CC CVV:</strong> ${order.paymentDetails.ccCvv}</p>
            <h6 class="card-subtitle mb-2 text-muted">Cart Items</h6>
            <ul class="list-group list-group-flush mb-3">
              ${order.cart.map(item => `
                <li class="list-group-item">
                  <strong>${item.title}</strong> - Size: ${item.size}, Qty: ${item.quantity}, Price: $${item.price}
                </li>
              `).join('')}
            </ul>
          </div>
          <button type="button" class="btn btn-outline-primary supplied-order-btn">
            <i class="bi bi-check-circle"></i>
            <span class="visually-hidden">Supplied Order</span>
          </button>
        </div>`;
      document.querySelector('.orders.content-container').appendChild(orderElement);
    });
  }
  moveToSuppliedOrders(orderElement) {

    const el = orderElement;
    orderElement.remove();

    this.suppliedOrdersContainer.querySelector('.feedback-message').insertAdjacentElement('beforebegin', el);
    el.querySelector('.supplied-order-btn').remove();
    el.querySelector('.delete-order').remove();

  }

  async getOrder(orderId) {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error loading order\nError message: ${error}`);
    }

  }

  async handleOrdersTabClick(e) {
    if (e.target.classList.contains('active')) return;

    this.highlightTab(e);
    this.showOrders(e);

    this.renderSpinner(this.ordersContainer, true);
    const orders = await this.loadOrders();

    const unsuppliedOrders = orders.filter(order => !order.supplied);

    this.renderSpinner(this.ordersContainer, false);

    this.renderOrders(unsuppliedOrders);
  }

  handleSuppliedOrdersTabClick(e) {
    if (e.target.classList.contains('active')) return;

    this.highlightTab(e);
    this.showAddOrder(e);
  }

  showOrders(e) {
    this.hideAll();
    this.ordersContainer.classList.remove('hidden');
  }

  showAddOrder(e) {
    this.hideAll();
    this.suppliedOrdersContainer.classList.remove('hidden');
  }


  highlightTab(e) {
    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));

    e.target.classList.toggle('active');
  }
  hideAll() {
    document.querySelectorAll('.content-container').forEach(container => {
      if (!container.classList.contains('hidden')) container.classList.add('hidden');
    });
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

  async loadOrders() {
    try {
      const response = await fetch(`/api/orders/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      return result.data;
    } catch (error) {
      this.showMessage(`Error loading orders\nError message: ${error}`);
    }
  }

  renderOrders(data) {
    this.ordersContainer.innerHTML = '';
    if (data.length === 0) {
      this.ordersContainer.innerHTML = `<h4>You don't have any unfulfilled orders..</h4>`;
      return;
    }
    data.forEach((order) => {
      if (!order.supplied) {
        const orderElement = document.createElement('div');
        orderElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
        orderElement.innerHTML = `
          <div class="card position-relative" data-order-id="${order._id}">
            <button type="button" class="btn btn-outline-danger delete-order">X</button>
            <div class="card-body">
              <h5 class="card-title">Order ID: ${order._id}</h5>
              <p class="card-text"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
              <p class="card-text"><strong>Email:</strong> ${order.email}</p>
              <p class="card-text"><strong>Address:</strong> ${order.address}</p>
              <p class="card-text"><strong>Country:</strong> ${order.country}</p>
              <p class="card-text"><strong>Zip:</strong> ${order.zip}</p>
              <p class="card-text"><strong>CC Name:</strong> ${order.paymentDetails.ccName}</p>
              <p class="card-text"><strong>CC Number:</strong> ${order.paymentDetails.ccNumber}</p>
              <p class="card-text"><strong>CC Expiration:</strong> ${order.paymentDetails.ccExpiration}</p>
              <p class="card-text"><strong>CC CVV:</strong> ${order.paymentDetails.ccCvv}</p>
              <h6 class="card-subtitle mb-2 text-muted">Cart Items</h6>
              <ul class="list-group list-group-flush mb-3">
                ${order.cart.map(item => `
                  <li class="list-group-item">
                    <strong>${item.title}</strong> - Size: ${item.size}, Qty: ${item.quantity}, Price: $${item.price}
                  </li>
                `).join('')}
              </ul>
              <h6 class="card-subtitle mb-2 text-muted">Total: $${order.cart.reduce((total, item) => total + item.price * item.quantity, 0)}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Ordered By: ${order.orderedBy || 'Temp User'}</h6>
            </div>
            <button type="button" class="btn btn-outline-primary supplied-order-btn">
              <i class="bi bi-check-circle"></i>
              <span class="visually-hidden">Supplied Order</span>
            </button>
          </div>`;
        document.querySelector('.orders.content-container').appendChild(orderElement);
      }
    });


  }

}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Orders();
});

function hidePreLoader() {
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  });
}

hidePreLoader();