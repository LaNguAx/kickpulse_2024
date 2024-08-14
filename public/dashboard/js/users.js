import Main from '../../frontend/main.js';
class Users {

  usersTable;
  viewOrdersModal;
  viewOrdersModalContent;
  viewOrdersModalObj;



  searchForm;
  searchInput;
  searchBtn;
  searchOptions;
  searchModal;
  searchModalContent;
  searchModalObj;

  users = [];


  constructor() {
    this.searchForm = document.querySelector('.search-form');
    this.searchInput = this.searchForm.querySelector('input');
    this.searchBtn = this.searchForm.querySelector('button');
    this.searchOptions = this.searchForm.querySelector('#searchOptions');

    this.searchModal = document.querySelector('#searchModal');
    this.searchModalContent = this.searchModal.querySelector('.modal-body');
    this.searchModalObj = new bootstrap.Modal(this.searchModal, {
      keyboard: false
    });


    this.usersTable = document.querySelector('.users .col-12');
    this.viewOrdersModal = document.querySelector('#viewOrdersModal');
    this.viewOrdersModalContent = this.viewOrdersModal.querySelector('.modal-body');
    this.viewOrdersModalObj = new bootstrap.Modal(this.viewOrdersModal, {
      keyboard: false
    });


    this.initUserEventListeners();

  }

  initUserEventListeners() {
    this.searchInput.addEventListener('keyup', this.handleSearchInputChange.bind(this));
    this.searchForm.addEventListener('submit', this.handleSearchClick.bind(this));


    this.usersTable.addEventListener('click', this.handleUsersTableClick.bind(this));
    this.searchModalContent.addEventListener('click', this.handleUsersTableClick.bind(this));

  }

  async handleUsersTableClick(e) {

    this.searchInput.value = '';
    if (e.target.closest('.view-orders-btn')) {
      await this.viewUserOrders(e.target.closest('tr').getAttribute('data-user-id'));
      this.searchModalObj.hide();
      return;
    }

    if (e.target.closest('.change-role-btn')) {
      await this.changeUserRole(e.target.closest('tr').getAttribute('data-user-id'));
      this.searchModalObj.hide();
      return;
    }

    if (e.target.closest('.delete-user-btn')) {
      await this.deleteUser(e.target.closest('tr').getAttribute('data-user-id'));
      this.searchModalObj.hide();
      return;
    }
  }

  async renderUsers() {
    try {
      Main.renderSpinner(this.usersTable, true);
      // Fetch the users
      this.users = await this.getUsers();
      Main.renderSpinner(this.usersTable, false);

      // Select the container where the users table will be rendered
      const usersContainer = document.querySelector('.users .col-12');

      // Clear any existing content
      usersContainer.innerHTML = '';

      // Create the table structure
      const table = document.createElement('table');
      table.className = 'table table-striped';

      // Create the table header
      const thead = document.createElement('thead');
      thead.innerHTML = `
      <tr>
        <th scope="col">#</th>
        <th scope="col">First Name</th>
        <th scope="col">Last Name</th>
        <th scope="col">Email</th>
        <th scope="col">Orders</th>
        <th scope="col">Role</th>
        <th scope="col">Actions</th>
      </tr>
    `;
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement('tbody');

      this.users.forEach((user, index) => {
        const userRow = document.createElement('tr');
        userRow.setAttribute('data-user-id', user.email);

        userRow.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.orders.length} orders</td>
        <td id="user-role" data-role="${user.role ? true : false}">${user.role ? 'Admin' : 'User'}</td>
        <td>
          <button class="btn btn-info btn-sm view-orders-btn">View Orders</button>
          <button class="btn btn-warning btn-sm change-role-btn">Change Role</button>
          <button class="btn btn-danger btn-sm delete-user-btn">Delete</button>
        </td>
      `;

        tbody.appendChild(userRow);
      });

      // Append the body to the table
      table.appendChild(tbody);

      // Append the table to the container
      usersContainer.appendChild(table);

    } catch (e) {
      Main.renderSpinner(this.usersTable, false);

      console.error(e);
    }
  }

  // ORDERS START

  async viewUserOrders(userId) {
    await this.getUserOrders(userId);
  }

  async getUserOrders(userId) {
    try {
      this.viewOrdersModalObj.show();
      Main.renderSpinner(this.viewOrdersModalContent, true);

      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user orders!');
      const { data: user } = await response.json();
      const { orders: orderIDs } = user;
      console.log('User Orders:', orderIDs);


      let orders = [];
      for (const orderID of orderIDs) {
        const response = await fetch(`/api/orders/${orderID}`);
        if (!response.ok) throw new Error('Failed to fetch orders..');
        const { data: order } = await response.json();
        orders.push(order);
      }

      Main.renderSpinner(this.viewOrdersModalContent, false);

      this.renderUserOrders(orders);

    } catch (error) {
      console.error(`Error fetching user orders\nError message: ${error}`);
    }

  }

  renderUserOrders(orders) {
    // Clear existing content in the view orders modal
    this.viewOrdersModalContent.innerHTML = '';

    if (orders.length === 0) {
      const noOrdersMessage = document.createElement('p');
      noOrdersMessage.className = 'text-muted';
      noOrdersMessage.textContent = 'This user has not placed any orders yet.';
      this.viewOrdersModalContent.appendChild(noOrdersMessage);
      return;
    }

    // Create the table structure
    const table = document.createElement('table');
    table.className = 'table table-striped table-hover';

    // Create the table header
    const thead = document.createElement('thead');
    thead.className = 'table-dark';
    thead.innerHTML = `
      <tr>
        <th scope="col">Order ID</th>
        <th scope="col">Date</th>
        <th scope="col">Items</th>
        <th scope="col">Total</th>
        <th scope="col">Status</th>
      </tr>
    `;
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');

    orders.forEach(order => {
      const orderRow = document.createElement('tr');

      const itemsContent = order.cart.map(item => `
        <div class="d-flex align-items-center mb-2">
          <img src="${item.img}" alt="${item.title}" class="img-fluid me-3" style="width: 50px; height: 50px;">
          <div>
            <strong>${item.quantity} x ${item.title}</strong><br>
            Size: ${item.size}<br>
            Price: $${item.price.toFixed(2)}
          </div>
        </div>
      `).join('');

      orderRow.innerHTML = `
        <td>${order._id}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>${itemsContent}</td>
        <td>$${Number(order.total).toFixed(2)}</td>
        <td>${order.supplied ? 'Supplied' : 'Pending'}</td>
      `;

      tbody.appendChild(orderRow);
    });

    // Append the body to the table
    table.appendChild(tbody);

    // Append the table to the view orders modal content
    this.viewOrdersModalContent.appendChild(table);
  }



  // ORDERS END


  // DELETE USER START

  async deleteUser(email) {
    try {
      Main.renderSpinner(this.usersTable, true);
      const response = await fetch(`/api/users/${email}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const result = await response.json();
      Main.renderSpinner(this.usersTable, false);
      if (result.success) {
        // console.log(`User with email ${email} deleted successfully.`);
        // // Optionally, remove the user from the UI or refresh the user list
        // // Example: document.querySelector(`[data-user-id="${email}"]`).remove();

        await this.renderUsers();
        Main.renderMessage(this.usersTable, true);


      } else {
        console.error(`Error deleting user: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error deleting user: ${error.message}`);
    }
  }

  // DELETE USER END


  // CHANGE USER ROLE START

  async changeUserRole(userId) {
    let userRole = document.querySelector('#user-role').getAttribute('data-role');
    if (userRole == 'true') userRole = true;
    else userRole = false;
    try {
      // Send a request to the server to update the user's role
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: userRole }),
      });

      if (!response.ok) throw new Error('Failed to change user role.');

      const result = await response.json();

      if (result.success) {


        await this.renderUsers();

      } else {
        alert(`Failed to update user role: ${result.message}`);
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      alert(`Error changing user role: ${error.message}`);
    }
  }


  // CHANGE USER ROLE END

  handleSearchClick(e) {
    e.preventDefault();


    if (this.users.length == 0 || this.searchInput.value.length == 0) {

      Main.renderMessage(document.querySelector('#searchInput').parentElement, true, 'No users found..', 'afterbegin');
      setTimeout(() => Main.renderMessage(document.querySelector('#searchInput').parentElement, false), 1000);
      return;
    }
    this.searchModalObj.show();

    this.searchModalContent.innerHTML = '';
    this.renderSearchUsers(this.users, 99999);

  }

  async handleSearchInputChange(e) {
    const searchQuery = this.searchInput.value;

    if (searchQuery.length < 3)
      return;


    await this.delay(200);

    const users = await this.getUsers();

    // Create a case-insensitive regex from the search query
    const regex = new RegExp(searchQuery, 'i');

    // Filter users by matching the name with the regex
    const filteredByName = users.filter(user => regex.test(`${user.firstName} ${user.lastName}`));

    // Handle the filtered users (e.g., update the UI)
    console.log(filteredByName); // For debugging, to see the filtered results


    this.updateDataList(filteredByName);

    this.users = filteredByName;
  }

  updateDataList(users) {
    this.searchOptions.innerHTML = '';
    users.forEach(user => this.searchOptions.insertAdjacentHTML('beforeend', `<option value="${user.firstName} ${user.lastName}">`));
  }

  async getUser(userId) {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user!');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error loading user\nError message: ${error}`);
    }
  }


  async getUsers() {
    try {
      const response = await fetch(`/api/users/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      this.users = result.data;
      return result.data;
    } catch (error) {
      console.error(`Error loading products\nError message: ${error}`);
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  renderSearchUsers(data, limit = 6) {
    // Clear existing content in the modal
    this.searchModalContent.innerHTML = '';

    // Create the table structure
    const table = document.createElement('table');
    table.className = 'table table-striped';

    // Create the table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th scope="col">#</th>
        <th scope="col">First Name</th>
        <th scope="col">Last Name</th>
        <th scope="col">Email</th>
        <th scope="col">Orders</th>
        <th scope="col">Role</th>
        <th scope="col">Actions</th>
      </tr>
    `;
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');

    data.forEach((user, idx) => {
      if (idx >= limit) return;

      const userRow = document.createElement('tr');
      userRow.setAttribute('data-user-id', user.email);

      userRow.innerHTML = `
        <th scope="row">${idx + 1}</th>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.orders.length} orders</td>
        <td>${user.role ? 'Admin' : 'User'}</td>
        <td>
          <button class="btn btn-info btn-sm view-orders-btn" data-user-id="${user._id}">View Orders</button>
          <button class="btn btn-warning btn-sm change-role-btn" data-user-id="${user._id}">Change Role</button>
          <button class="btn btn-danger btn-sm delete-user-btn" data-user-id="${user._id}">Delete</button>
        </td>
      `;

      tbody.appendChild(userRow);
    });

    // Append the body to the table
    table.appendChild(tbody);

    // Append the table to the modal content
    this.searchModalContent.appendChild(table);
  }



}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Users();
});

function hidePreLoader() {
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  });
}

hidePreLoader();