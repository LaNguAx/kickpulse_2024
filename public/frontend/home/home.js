import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';

class Home {

    recentProducts;
    genderLinks;
    constructor() {
        this.recentProducts = document.querySelector('.recent-products');
        this.genderLinks = document.querySelector('.gender-links');

        this.fixVideoPosition();
        this.initHomeEventListeners();
    }

    initHomeEventListeners() {
        this.genderLinks.addEventListener('click', this.handleGenderLinksClick.bind(this));
    }

    fixVideoPosition() {
        const video = document.querySelector('video');
        if (!video || !video.parentElement) return;
        video.parentElement.removeAttribute('style');
    }


    async handleGenderLinksClick(e) {

        // if a gender link was clicked
        if (e.target.closest('.gender-link')) {
            e.preventDefault();
            await this.handleGenderLinkClick(e);
            return;
        }
    }

    async handleGenderLinkClick(e) {

        try {
            const target = e.target;
            if (target.classList.contains('active'))
                return;

            const genderLinks = document.querySelectorAll('.gender-link');

            const gender = target.getAttribute('data-gender');

            Main.renderSpinner(this.recentProducts, true);
            const productsByGender = await this.getProductsByGender(gender);
            Main.renderSpinner(this.recentProducts, false);

            // if there were any products by gender
            genderLinks.forEach(link => link.classList.remove('active'));
            this.renderProducts(productsByGender);
            target.classList.add('active');
        }
        catch (e) {
            Main.renderSpinner(this.recentProducts, false);

            console.error(e);
            if (Main.messageVisible) return;
            Main.renderMessage(this.recentProducts, true, e, 'beforebegin');
            setTimeout(() => {
                Main.renderMessage(this.recentProducts, false);
            }, 2000);
        }

    }

    async getProductsByGender(gender) {

        const response = await fetch(`/api/products/gender/${gender}`);
        if (!response.ok)
            throw new Error((await response.json()).message);

        const { data: products } = await response.json();

        return products;
    }


    renderProducts(products) {
        let HTML = '';
        products.forEach(product => {
            HTML += `
            <div class="col product-card" data-product-id="${product._id}">
                <div class="card h-100">
                    <button type="button"
                        class="btn nav-link p-0 border-0 h-100 d-flex flex-column align-items-center"
                        data-bs-toggle="modal" data-bs-target="#quick-view-modal">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body text-center p-2 d-flex flex-column mt-auto">
                                <h5 class="card-title flex-grow-1 d-flex align-items-center justify-content-center">
                                    ${product.name}</h5>
                                <strong class="d-block mt-2">Quick View</strong>
                            </div>
                    </button>
                </div>
                </div >
            `;
        });

        this.recentProducts.innerHTML = '';
        this.recentProducts.insertAdjacentHTML('afterbegin', HTML);
    }


}

Main.initComponents([Header, QuickView, Home]);

Main.hidePreLoader();


