// Original Webflow interactions remain local. Forms use our own endpoints.
document.addEventListener('submit', async function (event) {
  var form = event.target.closest('form[data-migrated-form]');
  if (!form) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!form.reportValidity() || form.dataset.submitting === 'true') return;
  var wrapper = form.closest('.w-form');
  var success = wrapper && wrapper.querySelector('.w-form-done');
  var failure = wrapper && wrapper.querySelector('.w-form-fail');
  var button = form.querySelector('[type="submit"]');
  var label = button.value;
  if (failure) failure.style.display = 'none';
  if (success) success.style.display = 'none';
  form.dataset.submitting = 'true';
  button.disabled = true;
  button.value = button.dataset.wait || 'Please wait...';
  try {
    var response = await fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    var result = await response.json().catch(function () { return {}; });
    if (!response.ok || result.ok !== true) throw new Error(result.error || 'Online requests are not connected yet. Please call (209) 366-2319.');
    form.style.display = 'none';
    if (success) { success.style.display = 'block'; success.tabIndex = -1; success.focus(); }
  } catch (error) {
    if (failure) {
      failure.textContent = error.message || 'Unable to send your request. Please call (209) 366-2319.';
      failure.style.display = 'block';
      failure.tabIndex = -1;
      failure.focus();
    }
  } finally {
    form.dataset.submitting = 'false';
    button.disabled = false;
    button.value = label;
  }
}, true);

document.addEventListener('click', function (event) {
  var preferences = event.target.closest('a[href="#consent-preferences"]');
  if (preferences && window.Termly && window.Termly.openConsentPreferences) {
    event.preventDefault();
    window.Termly.openConsentPreferences();
  }
});
