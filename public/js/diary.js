let editTargetId = null;
let deleteTargetId = null;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

async function loadDiary() {
  const sort = document.getElementById('sortOrder').value;
  const res = await Auth.apiFetch('/api/diary?sort=' + sort);
  const entries = await res.json();
  const container = document.getElementById('entries');
  container.innerHTML = '';

  if (!entries.length) {
    container.innerHTML = '<div class="empty-state"><p>No entries yet. Write your first thought above!</p></div>';
    return;
  }

  entries.forEach((entry, i) => {
    const card = document.createElement('article');
    card.className = 'entry-card';
    card.dataset.id = entry._id;
    card.style.animationDelay = (i * 0.05) + 's';

    card.innerHTML = `
      <div class="entry-header">
        <strong>${formatDate(entry.createdAt)}</strong>
      </div>
      <p class="entry-content"></p>
      <div class="entry-buttons">
        <button class="btn btn-sm btn-info" data-action="edit">Edit</button>
        <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
      </div>
    `;

    card.querySelector('.entry-content').textContent = entry.content;
    card.querySelector('[data-action="edit"]').addEventListener('click', () => openEdit(entry));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => openDelete(entry._id));

    container.appendChild(card);
  });
}

async function addEntry() {
  const content = document.getElementById('content').value.trim();
  if (!content) return;

  const res = await Auth.apiFetch('/api/diary', {
    method: 'POST',
    body: JSON.stringify({ content })
  });

  if (res.ok) {
    document.getElementById('content').value = '';
    Auth.showToast('Entry saved');
    loadDiary();
  }
}

function openEdit(entry) {
  editTargetId = entry._id;
  document.getElementById('editContent').value = entry.content;
  document.getElementById('editModal').classList.remove('hidden');
}

function closeEdit() {
  editTargetId = null;
  document.getElementById('editModal').classList.add('hidden');
}

async function saveEdit() {
  const content = document.getElementById('editContent').value.trim();
  if (!content || !editTargetId) return;

  const res = await Auth.apiFetch('/api/diary/' + editTargetId, {
    method: 'PUT',
    body: JSON.stringify({ content })
  });

  if (res.ok) {
    closeEdit();
    Auth.showToast('Entry updated');
    loadDiary();
  }
}

function openDelete(id) {
  deleteTargetId = id;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDelete() {
  deleteTargetId = null;
  document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  const card = document.querySelector('.entry-card[data-id="' + deleteTargetId + '"]');
  if (card) card.classList.add('removing');

  setTimeout(async () => {
    await Auth.apiFetch('/api/diary/' + deleteTargetId, { method: 'DELETE' });
    closeDelete();
    Auth.showToast('Entry deleted');
    loadDiary();
  }, 300);
}

async function init() {
  const user = await Auth.requireAuth();
  if (!user) return;

  Auth.setupNavbar();

  document.getElementById('saveBtn').addEventListener('click', addEntry);
  document.getElementById('sortOrder').addEventListener('change', loadDiary);

  document.getElementById('confirmEdit').addEventListener('click', saveEdit);
  document.getElementById('cancelEdit').addEventListener('click', closeEdit);
  document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target.id === 'editModal') closeEdit();
  });

  document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
  document.getElementById('cancelDelete').addEventListener('click', closeDelete);
  document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') closeDelete();
  });

  await loadDiary();
}

init();
