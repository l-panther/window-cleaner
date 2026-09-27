
  const form = document.getElementById('quote-form');
  const submitBtn = form?.querySelector('button[type="submit"]');

  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popupMessage');
  const closePopupButton = document.getElementById('closePopupButton');

  const srErrors = document.getElementById('sr-errors');

  const messageEl = document.getElementById('message');
  const countEl = document.getElementById('count');

  /* ---------- Character counter ---------- */
  messageEl?.addEventListener('input', () => {
    if (countEl) countEl.textContent = String(messageEl.value.length);
  });

  /* ---------- Popup ---------- */
  function openPopup() {
    popup.hidden = false;
    popupMessage.focus();
  }
  function closePopup() {
    popup.hidden = true;
    form.focus();
  }
  closePopupButton?.addEventListener('click', closePopup);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !popup.hidden) closePopup();
  });

  /* ---------- Field config ---------- */
  const fields = {
    name: document.getElementById('name'),
    message: document.getElementById('message'),
  };

  const validators = {
    name(value) {
      const v = value.trim();
      if (!v) return 'Please enter your name.';
      if (v.length < 2) return 'Name must be at least 2 characters.';
      if (!/^[A-Za-z\s]+$/.test(v)) return 'Name can only contain letters and spaces.';
      return '';
    },
    message(value) {
      const v = value.trim();
      if (!v) return 'Please enter a message.';
      if (v.length < 10) return 'Message must be at least 10 characters.';
      if (v.length > 200) return 'Message cannot exceed 200 characters.';
      return '';
    },
  };

  function setFieldError(name, message) {
    const field = fields[name];
    const errorEl = document.getElementById(`error-${name}`);
    if (!field || !errorEl) return;

    if (message) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    } else {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
    }
  }

  function validateField(name) {
    const field = fields[name];
    if (!field) return true;
    const error = validators[name](field.value);
    setFieldError(name, error);
    return !error;
  }

  const fieldNames = Object.keys(fields);

  fieldNames.forEach((name) => {
    const field = fields[name];
    field?.addEventListener('blur', () => validateField(name));
    field?.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(name);
    });
  });

  function validateAll() {
    let isValid = true;
    const messages = [];

    fieldNames.forEach((name) => {
      const fieldIsValid = validateField(name);
      if (!fieldIsValid) {
        isValid = false;
        const errorEl = document.getElementById(`error-${name}`);
        if (errorEl) messages.push(errorEl.textContent);
      }
    });

    if (!isValid) {
      // Announce to screen reader users without an on-screen panel
      srErrors.hidden = false;
      srErrors.textContent = `Please fix the following: ${messages.join(' ')}`;

      const firstInvalidName = fieldNames.find((name) => fields[name]?.classList.contains('error'));
      if (firstInvalidName) fields[firstInvalidName]?.focus();
    } else {
      srErrors.hidden = true;
      srErrors.textContent = '';
    }

    return isValid;
  }

  // Simulated server round trip (fake site — no real endpoint)
  function fakeServerSubmit(payload) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true }), 800);
    });
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    submitBtn?.classList.add('is-loading');
    submitBtn?.setAttribute('disabled', 'true');

    const payload = Object.fromEntries(new FormData(form).entries());
    const result = await fakeServerSubmit(payload);

    submitBtn?.classList.remove('is-loading');
    submitBtn?.removeAttribute('disabled');

    if (result.ok) {
      popupMessage.textContent = 'Message sent successfully';
      openPopup();
      form.reset();
      if (countEl) countEl.textContent = '0';
      fieldNames.forEach((name) => setFieldError(name, ''));
      srErrors.hidden = true;
      srErrors.textContent = '';
    } else {
      popup.classList.add('popup--error');
      popupMessage.textContent = 'Something went wrong. Please try again.';
      openPopup();
    }
  });