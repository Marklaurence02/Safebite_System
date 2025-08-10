// js/user.js

// Mock user data
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', dateCreated: '2025-06-01', password: 'alicepass' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Active', dateCreated: '2025-06-02', password: 'bobpass' },
  { id: 3, name: 'Carol Lee', email: 'carol@example.com', status: 'Inactive', dateCreated: '2025-06-03', password: 'carolpass' },
  { id: 4, name: 'David Kim', email: 'david@example.com', status: 'Active', dateCreated: '2025-06-04', password: 'davidpass' }
];
let editingUserId = null;

// Admin password for demo
const ADMIN_PASSWORD = '123456789';
let pendingUserAction = null; // {type: 'add'|'edit', user: {}}

function renderUserTable() {
  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;
  const search = document.getElementById('userSearch').value.toLowerCase();
  const status = document.getElementById('userStatusFilter').value;
  const dateStart = document.getElementById('userDateStart').value;
  const dateEnd = document.getElementById('userDateEnd').value;
  let filtered = users.filter(u => {
    let match = true;
    if (search) {
      match = u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
    }
    if (match && status) {
      match = u.status === status;
    }
    if (match && dateStart) {
      match = u.dateCreated >= dateStart;
    }
    if (match && dateEnd) {
      match = u.dateCreated <= dateEnd;
    }
    return match;
  });
  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="5" style="text-align:center;color:#888;padding:32px;">No users found.</td></tr>`
    : filtered.map(u => `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.dateCreated}</td>
        <td>${u.status}</td>
        <td>
          <button class="action-btn edit" data-id="${u.id}">Edit</button>
          <button class="action-btn delete" data-id="${u.id}">Delete</button>
        </td>
      </tr>
    `).join('');
}

function handleUserFilters() {
  renderUserTable();
}

function openUserModal(editUser) {
  const modal = document.getElementById('userModal');
  const form = document.getElementById('userForm');
  document.getElementById('userModalTitle').textContent = editUser ? 'Edit User' : 'Add User';
  form.reset();
  editingUserId = null;
  // Show/hide password fields
  const passwordGroups = form.querySelectorAll('.password-group');
  const passwordInput = form.querySelector('#userPassword');
  const currentPasswordInput = form.querySelector('#userCurrentPassword');
  const currentPasswordLabel = form.querySelector('#userCurrentPasswordLabel');
  if (editUser) {
    editingUserId = editUser.id;
    document.getElementById('userId').value = editUser.id;
    document.getElementById('userName').value = editUser.name;
    document.getElementById('userEmail').value = editUser.email;
    document.getElementById('userStatus').value = editUser.status;
    document.getElementById('userDateCreated').value = editUser.dateCreated;
    // Show both password groups
    passwordGroups.forEach(g => g.style.display = '');
    if (passwordInput) passwordInput.required = false;
    setTimeout(() => {
      if (currentPasswordInput && currentPasswordLabel) {
        currentPasswordInput.style.display = '';
        currentPasswordLabel.style.display = '';
        currentPasswordInput.value = editUser.password || '';
      }
    }, 0);
  } else {
    document.getElementById('userDateCreated').value = new Date().toISOString().slice(0, 10);
    // Only show new password group
    passwordGroups.forEach(g => g.style.display = '');
    if (currentPasswordInput && currentPasswordLabel) {
      currentPasswordInput.style.display = 'none';
      currentPasswordLabel.style.display = 'none';
      currentPasswordInput.value = '';
    }
    if (passwordInput) passwordInput.required = true;
  }
  if (passwordInput) passwordInput.value = '';
  modal.style.display = 'flex';
}

function closeUserModal() {
  document.getElementById('userModal').style.display = 'none';
  editingUserId = null;
}

function handleUserFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('userId').value;
  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const status = document.getElementById('userStatus').value;
  const dateCreated = document.getElementById('userDateCreated').value;
  const passwordInput = document.getElementById('userPassword');
  const password = passwordInput ? passwordInput.value : '';
  let changedFields = [];
  let oldUser = users.find(u => u.id === editingUserId);
  if (editingUserId) {
    // Edit
    users = users.map(u => {
      if (u.id === editingUserId) {
        const updated = { id: editingUserId, name, email, status, dateCreated };
        if (password) updated.password = password;
        else if (u.password) updated.password = u.password;
        // Track changes
        if (oldUser) {
          if (oldUser.email !== email) changedFields.push('email');
          if (password && oldUser.password !== password) changedFields.push('password');
          if (oldUser.name !== name) changedFields.push('name');
          if (oldUser.status !== status) changedFields.push('status');
        }
        return updated;
      }
      return u;
    });
    // Log to activity log if any changes
    if (typeof window.addActivityLogEntry === 'function' && changedFields.length > 0) {
      const details = `Updated: ${changedFields.join(', ')} at ${new Date().toLocaleString()}`;
      window.addActivityLogEntry({ user: name, type: 'edit', details });
    }
  } else {
    // Add
    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { id: newId, name, email, status, dateCreated };
    if (password) newUser.password = password;
    users.push(newUser);
    // Log add
    if (typeof window.addActivityLogEntry === 'function') {
      window.addActivityLogEntry({ user: name, type: 'add', details: `User created at ${new Date().toLocaleString()}` });
    }
  }
  renderUserTable();
  closeUserModal();
}

// Remove admin password modal logic. Use prompt instead.
// Remove showAdminPassModal, closeAdminPassModal, handleAdminPassFormSubmit, patchedAddUserBtn, patchedEditUserBtn.
// Patch add/edit triggers to use prompt.
function addUserWithAdminPass() {
  const pass = window.prompt('Enter admin password to proceed:');
  if (pass === ADMIN_PASSWORD) {
    openUserModal();
    const nameInput = document.getElementById('userName');
    if (nameInput) nameInput.focus();
  } else if (pass !== null) {
    alert('Incorrect password.');
  }
}
function editUserWithAdminPass(user) {
  const pass = window.prompt('Enter admin password to proceed:');
  if (pass === ADMIN_PASSWORD) {
    openUserModal(user);
    const nameInput = document.getElementById('userName');
    if (nameInput) nameInput.focus();
  } else if (pass !== null) {
    alert('Incorrect password.');
  }
}

function initUserManager() {
  renderUserTable();
  document.getElementById('addUserBtn').onclick = addUserWithAdminPass;
  document.getElementById('cancelUserBtn').onclick = closeUserModal;
  document.getElementById('userForm').onsubmit = handleUserFormSubmit;
  document.getElementById('userTableBody').onclick = function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.getAttribute('data-id'));
    if (btn.classList.contains('edit')) {
      const user = users.find(u => u.id === id);
      editUserWithAdminPass(user);
    } else if (btn.classList.contains('delete')) {
      const pass = window.prompt('Enter admin password to delete this user:');
      if (pass === ADMIN_PASSWORD) {
        if (confirm('Delete this user?')) {
          users = users.filter(u => u.id !== id);
          renderUserTable();
        }
      } else if (pass !== null) {
        alert('Incorrect password.');
      }
    }
  };
  document.getElementById('userSearch').oninput = handleUserFilters;
  document.getElementById('userStatusFilter').onchange = handleUserFilters;
  document.getElementById('userDateStart').onchange = handleUserFilters;
  document.getElementById('userDateEnd').onchange = handleUserFilters;
  // Close modal on outside click
  document.getElementById('userModal').onclick = e => {
    if (e.target === document.getElementById('userModal')) closeUserModal();
  };
  // Show/hide password toggle for new password
  const toggleBtn = document.getElementById('toggleUserPassword');
  const passwordInput = document.getElementById('userPassword');
  const icon = document.getElementById('toggleUserPasswordIcon');
  if (toggleBtn && passwordInput && icon) {
    toggleBtn.onclick = function() {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = '\u{1F441}\u{FE0E}';
        toggleBtn.setAttribute('aria-label', 'Hide password');
      } else {
        passwordInput.type = 'password';
        icon.textContent = '\u{1F441}';
        toggleBtn.setAttribute('aria-label', 'Show password');
      }
    };
  }
  // Show/hide password toggle for current password
  const toggleCurrentBtn = document.getElementById('toggleCurrentUserPassword');
  const currentPasswordInput = document.getElementById('userCurrentPassword');
  const currentIcon = document.getElementById('toggleCurrentUserPasswordIcon');
  if (toggleCurrentBtn && currentPasswordInput && currentIcon) {
    toggleCurrentBtn.style.display = '';
    toggleCurrentBtn.onclick = function() {
      if (currentPasswordInput.type === 'password') {
        currentPasswordInput.type = 'text';
        currentIcon.textContent = '\u{1F441}\u{FE0E}';
        toggleCurrentBtn.setAttribute('aria-label', 'Hide current password');
      } else {
        currentPasswordInput.type = 'password';
        currentIcon.textContent = '\u{1F441}';
        toggleCurrentBtn.setAttribute('aria-label', 'Show current password');
      }
    };
  }
}

window.initUserManager = initUserManager; 