class Main {

  header;

  spinner;
  spinnerVisible = false;
  message;
  messageVisible = false;



  static renderSpinner(element, on = true) {

    if (this.spinnerVisible && on) return;

    if (!on) {
      element.classList.remove('hidden');
      this.spinner.remove();
      this.spinnerVisible = false;
      return;
    }

    element.classList.add('hidden');

    this.spinner = document.createElement('div');
    this.spinner.classList.add('spinner', 'd-flex', 'justify-content-center', 'my-2');
    this.spinner.innerHTML = `<div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
         </div>`;
    element.insertAdjacentElement('beforebegin', this.spinner);

    this.spinnerVisible = true;

  }


  static renderMessage(element, on = true, msg = '', option = '') {


    if (this.messageVisible && on) return;

    if (!on) {
      this.message.remove();
      this.messageVisible = false;
      return;
    }


    this.message = document.createElement('div');
    this.message.classList.add('message', 'd-flex', 'justify-content-center', 'my-2');
    this.message.innerHTML = `<span class="lean">${msg}</span>`;
    element.insertAdjacentElement(option, this.message);

    this.messageVisible = true;

    return this.message;
  }

  static hidePreLoader() {
    window.addEventListener('load', function () {
      const preloader = document.getElementById('preloader');
      preloader.style.display = 'none';
    });
  }

  static initComponents(components) {
    document.addEventListener('DOMContentLoaded', async () => {

      // fix header margin
      const header = document.querySelector('header');
      if (header) {
        const headerHeight = header.offsetHeight;

        const content = document.querySelector('.content');
        if (content && content.children[1]) {
          content.children[1].style.marginTop = `${headerHeight}px`;
        }
      }

      // load js components
      components.forEach(async Component => {
        await new Component();
      });

    });

  }
}

export default Main;