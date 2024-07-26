class Main {

  spinner;
  message;
  static renderSpinner(element, on = true) {

    if (!on) {
      element.classList.remove('hidden');
      this.spinner.remove();
      return;
    }

    // const previousHTML = element.innerHTML;

    element.classList.add('hidden');

    this.spinner = document.createElement('div');
    this.spinner.classList.add('spinner', 'd-flex', 'justify-content-center', 'my-2');
    this.spinner.innerHTML = `<div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
         </div>`;
    element.insertAdjacentElement('beforebegin', this.spinner);

    // element.innerHTML = `
    //  <div class="d-flex justify-content-center">
    //     <div class="spinner-border" role="status">
    //       <span class="visually-hidden">Loading...</span>
    //      </div>
    //   </div>`;

    // return previousHTML;
  }


  static renderMessage(element, on = true, msg = '', option = '') {

    if (!on) {
      this.message.remove();
      return;
    }

    this.message = document.createElement('div');
    this.message.classList.add('message', 'd-flex', 'justify-content-center', 'my-2');
    this.message.innerHTML = `<span><strong>${msg}</strong></span>`;
    element.insertAdjacentElement(option, this.message);

    return this.message;
  }
}

export default Main;