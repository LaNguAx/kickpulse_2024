import Main from '../../frontend/main.js';

class Facebook {

  tabsContainer;


  constructor() {

    this.getAccessToken().then(() => {
      // Fetch the page ID and Page Access Token
      this.getPageAccessToken().then(({ pageId, pageAccessToken }) => {
        this.pageId = pageId;
        this.pageAccessToken = pageAccessToken;
        console.log('Page ID:', this.pageId);
        console.log('Page Access Token:', this.pageAccessToken);

        // Load products to populate the dropdown
        this.loadProducts().then(() => {
          document.getElementById('facebookPostForm').addEventListener('submit', this.createFacebookPost.bind(this));
        });
      });
    });

    this.tabsContainer = document.querySelector('.tabs-container');
    this.initFacebookEventListeners();


  }

  initFacebookEventListeners() {
    this.tabsContainer.addEventListener('click', this.handleTabClick.bind(this));

  }

  async handleTabClick(e) {
    const charts = [...document.querySelectorAll('.facebook-api-container')];
    const tabs = [...document.querySelectorAll('.tab')];
    if (e.target.classList.contains('active'))
      return;

    if (e.target.getAttribute('data-container') == 'post-on-facebook') {
      console.log(e);
      charts.forEach(chart => chart.classList.add('hidden'));
      document.querySelector('#post-on-facebook').classList.remove('hidden');
      tabs.forEach(tab => tab.classList.remove('active'));
      e.target.closest('.tab').classList.add('active')

      return;
    }
    else if (e.target.getAttribute('data-container') == 'show-posts') {
      charts.forEach(chart => chart.classList.add('hidden'));
      document.querySelector('#show-posts').classList.remove('hidden');
      tabs.forEach(tab => tab.classList.remove('active'));
      e.target.closest('.tab').classList.add('active');


      await this.loadPagePosts();
      return;

    }


  }
  async loadPagePosts() {
    const postsContainer = document.querySelector('#show-posts');

    try {
      Main.renderSpinner(postsContainer, true); // Show spinner
      const response = await fetch(`https://graph.facebook.com/v12.0/${this.pageId}/posts?access_token=${this.pageAccessToken}&fields=message,created_time,full_picture,id`);
      const data = await response.json();
      Main.renderSpinner(postsContainer, false); // Hide spinner

      if (data && data.data) {
        postsContainer.innerHTML = ''; // Clear any existing posts

        data.data.forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'post-item';
          postElement.innerHTML = `
            <div class="card mb-4 shadow-sm">
              <div class="row g-0">
                ${post.full_picture ? `
                  <div class="col-md-4">
                    <img src="${post.full_picture}" class="img-fluid rounded-start" alt="Post image" style="height: 100%; object-fit: cover;">
                  </div>
                ` : ''}
                <div class="col-md-8">
                  <div class="card-body">
                    <p class="card-text mb-2">${post.message ? post.message.split('\n')[0] : 'No content available'}</p>
                    <div class="card-text">
                      ${post.message && post.message.includes('Product Name:') ? `<p><strong>Product Name:</strong> ${post.message.split('Product Name:')[1].split('\n')[0]}</p>` : ''}
                      ${post.message && post.message.includes('Price:') ? `<p><strong>Price:</strong> ${post.message.split('Price:')[1].split('\n')[0]}</p>` : ''}
                      ${post.message && post.message.includes('Available Sizes:') ? `<p><strong>Available Sizes:</strong> ${post.message.split('Available Sizes:')[1].split('\n')[0]}</p>` : ''}
                    </div>
                    <p class="card-text"><small class="text-muted">Posted on: ${new Date(post.created_time).toLocaleString()}</small></p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                      <a href="https://www.facebook.com/${post.id}" target="_blank" class="btn btn-primary btn-sm">View Post</a>
                      <button class="btn btn-danger btn-sm delete-post-btn" data-post-id="${post.id}">Delete Post</button>
                      <small class="text-muted">Facebook</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          postsContainer.appendChild(postElement);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-post-btn').forEach(button => {
          button.addEventListener('click', this.deletePost.bind(this));
        });

      } else {
        Main.renderSpinner(postsContainer, false);
        Main.renderMessage(postsContainer, true, 'No posts found for this page.', 'beforeend');
        setTimeout(() => Main.renderMessage(postsContainer, false), 2000);

        throw new Error('No posts found for this page.');
      }
    } catch (error) {
      Main.renderSpinner(postsContainer, false);
      Main.renderMessage(postsContainer, true, `Failed to load posts: ${error.message}`, 'beforeend');
      setTimeout(() => Main.renderMessage(postsContainer, false), 2000);

      console.error('Error loading page posts:', error);
      // alert('Error loading page posts');
    }
  }

  async deletePost(event) {
    const postId = event.target.getAttribute('data-post-id');
    // const confirmDelete = confirm('Are you sure you want to delete this post?');

    // if (!confirmDelete) return;

    const postsContainer = document.querySelector('#show-posts');

    try {
      Main.renderSpinner(postsContainer, true); // Show spinner during delete request
      const response = await fetch(`https://graph.facebook.com/v12.0/${postId}?access_token=${this.pageAccessToken}`, {
        method: 'DELETE'
      });

      Main.renderSpinner(postsContainer, false); // Hide spinner after request completes

      if (response.ok) {
        Main.renderMessage(postsContainer, true, 'Post deleted successfully!', 'beforeend');
        setTimeout(() => Main.renderMessage(postsContainer, false), 2000);
        event.target.closest('.post-item').remove(); // Remove the post from the DOM
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      Main.renderSpinner(postsContainer, false); // Hide spinner if there's an error
      Main.renderMessage(postsContainer, true, `Failed to delete post: ${error.message}`, 'beforeend');
      setTimeout(() => Main.renderMessage(postsContainer, false), 2000);

      console.error('Error deleting post:', error);
      // alert('Error deleting post');
    }
  }






  async getAccessToken() {
    try {
      const response = await fetch('/api/token');
      const data = await response.json();
      this.accessToken = data.token;
      console.log('Access Token:', this.accessToken);
    } catch (error) {
      console.error('Error fetching access token:', error);
      alert('Error fetching access token');
    }
  }

  async getPageAccessToken() {
    try {
      const response = await fetch(`https://graph.facebook.com/me/accounts?access_token=${this.accessToken}`);
      const data = await response.json();

      if (data && data.data && data.data.length > 0) {
        // Assuming you want the first page ID and access token
        const page = data.data[0];
        return { pageId: page.id, pageAccessToken: page.access_token };
      } else {
        throw new Error('No pages found for this account.');
      }
    } catch (error) {
      console.error('Error fetching page access token:', error);
      alert('Error fetching page access token');
    }
  }

  async loadProducts() {
    try {
      const response = await fetch('/api/products'); // Adjust the endpoint as necessary
      const { data: products } = await response.json();

      console.log(products.length);
      const productSelect = document.getElementById('productSelect');
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = JSON.stringify(product); // Store the entire product object in the value
        option.textContent = product.name;
        productSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      // alert('Error fetching products');
    }
  }

  async createFacebookPost(event) {
    event.preventDefault();

    const formData = new FormData();
    let message = document.getElementById('postContent').value;

    const selectedProduct = JSON.parse(document.getElementById('productSelect').value);

    // Check which details to include in the post content
    if (document.getElementById('includeProductName').checked) {
      message += `\nProduct Name: ${selectedProduct.name}`;
    }
    if (document.getElementById('includeProductPrice').checked) {
      message += `\nPrice: $${selectedProduct.price.toFixed(2)}`;
    }
    if (document.getElementById('includeProductSizes').checked) {
      message += `\nAvailable Sizes: ${selectedProduct.sizes.join(', ')}`;
    }

    formData.append('message', message);
    formData.append('url', selectedProduct.image); // Use 'url' for direct image URL

    const url = `https://graph.facebook.com/v12.0/${this.pageId}/photos?access_token=${this.pageAccessToken}`;

    const facebookFormEl = document.querySelector('#facebookPostForm');
    try {
      Main.renderSpinner(facebookFormEl, true);

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('Facebook API Response:', result);
      Main.renderSpinner(facebookFormEl, false);

      if (response.ok && result.id) {
        Main.renderMessage(facebookFormEl, true, 'Post created successfully!', 'beforeend');
        setTimeout(() => Main.renderMessage(facebookFormEl, false), 2000);
      } else {
        Main.renderSpinner(facebookFormEl, false);
        Main.renderMessage(facebookFormEl, true, `Failed to create post: ${result.error.message}`, 'beforeend');
        setTimeout(() => Main.renderMessage(facebookFormEl, false), 2000);
      }
    } catch (error) {
      Main.renderSpinner(facebookFormEl, false);
      Main.renderMessage(facebookFormEl, true, error, 'beforeend');
      setTimeout(() => Main.renderMessage(facebookFormEl, false), 2000);
      console.error('Error posting to Facebook:', error);
      alert('Error posting to Facebook');
    }
  }

}

Main.initComponents([Facebook]);
Main.hidePreLoader();
