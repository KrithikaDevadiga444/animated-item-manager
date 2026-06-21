let meta = { categories: [], statuses: [] };
let deleteTargetId = null;
let searchTimeout = null;

function statusClass(status) {
  if (status === 'Needed') return 'badge-needed';
  if (status === 'Purchased') return 'badge-purchased';
  return 'badge-in-use';
}

function fillSelect(select, options, includeAll) {
  select.innerHTML = '';
  if (includeAll) {
    const opt = document.createElement('option');
    opt.value = 'all';
    opt.textContent = 'All';
    select.appendChild(opt);
  }
  options.forEach(val => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = val;
    select.appendChild(opt);
  });
}

function populateDropdowns() {
  ['category', 'status', 'filterCategory', 'filterStatus', 'editCategory', 'editStatus'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const isFilter = id.startsWith('filter');
    const options = id.toLowerCase().includes('category') ? meta.categories : meta.statuses;
    fillSelect(el, options, isFilter);
    if (!isFilter && id === 'category') el.value = 'Other';
    if (!isFilter && id === 'status') el.value = 'Needed';
  });
}

async function loadMeta() {
  const res = await Auth.apiFetch('/api/items/meta');
  meta = await res.json();
  populateDropdowns();
}

function buildQuery() {
  const params = new URLSearchParams();
  const search = document.getElementById('search').value.trim();
  const category = document.getElementById('filterCategory').value;
  const status = document.getElementById('filterStatus').value;
  const sortBy = document.getElementById('sortBy').value;

  if (search) params.set('search', search);
  if (category !== 'all') params.set('category', category);
  if (status !== 'all') params.set('status', status);
  params.set('sortBy', sortBy);
  params.set('sortOrder', sortBy === 'name' || sortBy === 'category' ? 'asc' : 'desc');

  return params.toString();
}

async function loadStats() {
  const res = await Auth.apiFetch('/api/items/stats');
  const stats = await res.json();
  const grid = document.getElementById('statsGrid');
  grid.innerHTML = '';

  if (!stats.length) {
    grid.innerHTML = '<div class="empty-state"><p>No items yet — add your first one below!</p></div>';
    return;
  }

  stats.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.style.animationDelay = (i * 0.05) + 's';
    card.innerHTML = `
      <div class="count">${s.count}</div>
      <div class="label">${Auth.escapeHtml(s._id)}</div>
      <div class="qty">${s.totalQty} total qty</div>
    `;
    grid.appendChild(card);
  });
}

async function loadItems() {
  const res = await Auth.apiFetch('/api/items?' + buildQuery());
  const items = await res.json();
  const list = document.getElementById('itemsList');
  list.innerHTML = '';

  if (!items.length) {
    list.innerHTML = '<div class="empty-state"><p>No items match your filters.</p></div>';
    return;
  }

  items.forEach((item, i) => {
    const card = document.createElement('article');
    card.className = 'item-card';
    card.dataset.id = item._id;
    card.style.animationDelay = (i * 0.04) + 's';

    const date = new Date(item.createdAt).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    card.innerHTML = `
      <div class="item-card-header">
        <h3>${Auth.escapeHtml(item.name)}</h3>
        <span class="badge">Qty: ${item.quantity}</span>
      </div>
      <div class="item-meta">
        <span class="badge badge-category">${Auth.escapeHtml(item.category)}</span>
        <span class="badge ${statusClass(item.status)}">${Auth.escapeHtml(item.status)}</span>
      </div>
      ${item.notes ? `<p class="item-notes">${Auth.escapeHtml(item.notes)}</p>` : ''}
      <p class="item-date">Added ${date}</p>
      <div class="item-actions">
        <button class="btn btn-sm btn-info" data-action="edit">Edit</button>
        <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
      </div>
    `;

    card.querySelector('[data-action="edit"]').addEventListener('click', () => openEdit(item));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => openDelete(item));

    list.appendChild(card);
  });
}

async function refresh() {
  await Promise.all([loadItems(), loadStats()]);
}

function openEdit(item) {
  document.getElementById('editId').value = item._id;
  document.getElementById('editName').value = item.name;
  document.getElementById('editCategory').value = item.category;
  document.getElementById('editQuantity').value = item.quantity;
  document.getElementById('editStatus').value = item.status;
  document.getElementById('editNotes').value = item.notes || '';
  document.getElementById('editModal').classList.remove('hidden');
}

function closeEdit() {
  document.getElementById('editModal').classList.add('hidden');
}

function openDelete(item) {
  deleteTargetId = item._id;
  document.getElementById('deleteMessage').textContent =
    'Remove "' + item.name + '" from your inventory? This cannot be undone.';
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDelete() {
  deleteTargetId = null;
  document.getElementById('deleteModal').classList.add('hidden');
}

async function init() {
  const user = await Auth.requireAuth();
  if (!user) return;

  Auth.setupNavbar();
  await loadMeta();

  document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await Auth.apiFetch('/api/items', {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        quantity: parseInt(document.getElementById('quantity').value, 10) || 1,
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value
      })
    });

    if (res.ok) {
      e.target.reset();
      document.getElementById('quantity').value = 1;
      document.getElementById('category').value = 'Other';
      document.getElementById('status').value = 'Needed';
      Auth.showToast('Item added!');
      await refresh();
    }
  });

  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const res = await Auth.apiFetch('/api/items/' + id, {
      method: 'PUT',
      body: JSON.stringify({
        name: document.getElementById('editName').value,
        category: document.getElementById('editCategory').value,
        quantity: parseInt(document.getElementById('editQuantity').value, 10),
        status: document.getElementById('editStatus').value,
        notes: document.getElementById('editNotes').value
      })
    });

    if (res.ok) {
      closeEdit();
      Auth.showToast('Item updated');
      await refresh();
    }
  });

  document.getElementById('cancelEdit').addEventListener('click', closeEdit);
  document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target.id === 'editModal') closeEdit();
  });

  document.getElementById('confirmDelete').addEventListener('click', async () => {
    if (!deleteTargetId) return;
    const card = document.querySelector('.item-card[data-id="' + deleteTargetId + '"]');
    if (card) card.classList.add('removing');

    setTimeout(async () => {
      await Auth.apiFetch('/api/items/' + deleteTargetId, { method: 'DELETE' });
      closeDelete();
      Auth.showToast('Item deleted');
      await refresh();
    }, 300);
  });

  document.getElementById('cancelDelete').addEventListener('click', closeDelete);
  document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') closeDelete();
  });

  ['filterCategory', 'filterStatus', 'sortBy'].forEach(id => {
    document.getElementById(id).addEventListener('change', loadItems);
  });

  document.getElementById('search').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadItems, 300);
  });

  await refresh();
}

init();
