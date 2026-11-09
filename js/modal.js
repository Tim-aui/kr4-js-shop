const orderDialog = document.querySelector('#order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button[data-product]');
const closeDialogButton = document.querySelector('#close-order-dialog');
const selectedProductInput = document.querySelector('#selected-product');
const dialogProductName = document.querySelector('#order-dialog-product');

let lastTrigger = null;

function openOrderDialog(button) {
  const productName = button.dataset.product;

  selectedProductInput.value = productName;
  dialogProductName.textContent = productName;
  lastTrigger = button;

  const dialogMessage = orderDialog.querySelector('#form-message');
  if (dialogMessage) {
    dialogMessage.textContent = '';
    dialogMessage.classList.remove('form-message--error', 'form-message--success');
  }

  orderDialog.showModal();
}

if (orderDialog) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => openOrderDialog(button));
  });

  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });

  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });

  orderDialog.addEventListener('close', () => {
    if (lastTrigger) {
      lastTrigger.focus();
    }
  });
}
