// Config page JS

console.log('config.js loaded!');

window.initConfigPage = function() {
  function setupConfigTabs() {
    const tabButtons = document.querySelectorAll('.config-tab');
    const foodTab = document.getElementById('config-food-tab');
    const sensorsTab = document.getElementById('config-sensors-tab');
    if (!tabButtons.length || !foodTab || !sensorsTab) return;

    // Force initial state: show food, hide sensors
    foodTab.classList.remove('d-none');
    sensorsTab.classList.add('d-none');
    tabButtons.forEach(b => b.classList.remove('active'));
    tabButtons[0].classList.add('active');

    tabButtons.forEach(btn => {
      btn.onclick = function() {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab === 'food') {
          foodTab.classList.remove('d-none');
          sensorsTab.classList.add('d-none');
        } else {
          sensorsTab.classList.remove('d-none');
          foodTab.classList.add('d-none');
        }
      };
    });
  }

  // Modal logic (use modal from HTML inside main-content)
  function showAddFoodModal() {
    console.log('showAddFoodModal called');
    const mainContent = document.getElementById('main-content');
    const modal = mainContent ? mainContent.querySelector('#addFoodItemModal') : null;
    if (!modal) return;
    modal.style.display = 'flex';
    // Attach close logic
    const closeModal = () => { modal.style.display = 'none'; };
    modal.querySelector('.config-modal-close').onclick = closeModal;
    modal.querySelector('.config-modal-cancel').onclick = closeModal;
    modal.querySelector('.config-modal-backdrop').onclick = closeModal;
    modal.querySelector('form').onsubmit = function(e) {
      e.preventDefault();
      // You can handle form data here
      closeModal();
    };
  }

  setupConfigTabs();

  // Remove any previous event listener to avoid duplicates
  if (window._configAddBtnHandler) {
    document.body.removeEventListener('click', window._configAddBtnHandler);
  }
  window._configAddBtnHandler = function(e) {
    const btn = e.target.closest('.config-add-btn');
    if (btn && btn.textContent.includes('Food')) {
      console.log('Add Food Item button clicked!');
      showAddFoodModal();
    }
  };
  document.body.addEventListener('click', window._configAddBtnHandler);
};

// If loaded on a full page load, auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initConfigPage);
} else {
  window.initConfigPage();
}
