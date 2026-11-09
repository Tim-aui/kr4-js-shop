const orderForm = document.querySelector('#order-form');
const formMessage = document.querySelector('#form-message');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

function showFieldError(field, message) {
  const error = document.querySelector('#' + field.id + '-error');

  field.classList.add('order-form__input--invalid');
  field.setAttribute('aria-invalid', 'true');

  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(field) {
  const error = document.querySelector('#' + field.id + '-error');

  field.classList.remove('order-form__input--invalid');
  field.removeAttribute('aria-invalid');

  if (error) {
    error.textContent = '';
  }
}

function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.classList.remove('form-message--error', 'form-message--success');
  formMessage.classList.add('form-message--' + type);
}

function clearFormMessage() {
  formMessage.textContent = '';
  formMessage.classList.remove('form-message--error', 'form-message--success');
}

function validateOrderForm() {
  const { name, email, phone, topic, product, agreement } = orderForm.elements;
  const invalidFields = [];

  [name, email, phone, topic, product, agreement].forEach((field) => {
    if (field) {
      clearFieldError(field);
    }
  });

  if (name.value.trim().length < 2) {
    showFieldError(name, 'Введите имя — не меньше 2 символов.');
    invalidFields.push(name);
  }

  if (email.value.trim() === '') {
    showFieldError(email, 'Введите e-mail.');
    invalidFields.push(email);
  } else if (!emailPattern.test(email.value.trim())) {
    showFieldError(email, 'Введите корректный e-mail, например example@mail.ru.');
    invalidFields.push(email);
  }

  if (phone.value.trim() === '') {
    showFieldError(phone, 'Введите номер телефона.');
    invalidFields.push(phone);
  } else if (!phonePattern.test(phone.value.trim())) {
    showFieldError(phone, 'Введите телефон в формате +7 (900) 000-00-00.');
    invalidFields.push(phone);
  }

  if (topic && topic.value === '') {
    showFieldError(topic, 'Выберите тему заявки.');
    invalidFields.push(topic);
  }

  if (product && product.value === '') {
    showFieldError(product, 'Выберите товар.');
    invalidFields.push(product);
  }

  if (!agreement.checked) {
    showFieldError(agreement, 'Необходимо согласие на обработку данных.');
    invalidFields.push(agreement);
  }

  return invalidFields;
}

if (orderForm && formMessage) {
  const submitButton = orderForm.querySelector('button[type="submit"]');

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalidFields = validateOrderForm();

    if (invalidFields.length > 0) {
      showFormMessage('Проверьте правильность заполнения полей формы.', 'error');
      invalidFields[0].focus();
      return;
    }

    const userName = orderForm.elements.name.value.trim();

    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    clearFormMessage();

    setTimeout(() => {
      orderForm.reset();
      showFormMessage('Спасибо, ' + userName + '! Ваша заявка подготовлена. Мы свяжемся с вами в ближайшее время.', 'success');
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить заявку';
    }, 1000);
  });

  orderForm.addEventListener('input', (event) => {
    if (event.target.getAttribute('aria-invalid') === 'true') {
      clearFieldError(event.target);
    }
  });

  orderForm.addEventListener('change', (event) => {
    if (event.target.getAttribute('aria-invalid') === 'true') {
      clearFieldError(event.target);
    }
  });

  orderForm.addEventListener('reset', () => {
    clearFormMessage();

    Array.from(orderForm.elements).forEach((field) => {
      if (field.id) {
        clearFieldError(field);
      }
    });
  });

  const productSelect = orderForm.elements.product;
  const preselected = new URLSearchParams(window.location.search).get('product');

  if (productSelect && preselected) {
    const option = productSelect.querySelector('option[value="' + Number(preselected) + '"]');

    if (option) {
      productSelect.value = option.value;
    }
  }
}
