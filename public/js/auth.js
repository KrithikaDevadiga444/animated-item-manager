const Auth = {
  async apiFetch(url, options = {}) {
    const headers = { ...options.headers };
    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers
    });
    return res;
  },

  async getUser() {
    const res = await this.apiFetch('/api/auth/me');
    if (!res.ok) return null;
    return res.json();
  },

  async requireAuth(redirectTo = '/login.html') {
    const user = await this.getUser();
    if (!user) {
      window.location.href = redirectTo;
      return null;
    }
    return user;
  },

  async logout() {
    await this.apiFetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login.html';
  },

  setupNavbar(containerId = 'navbar') {
    const nav = document.getElementById(containerId);
    if (!nav) return;

    this.getUser().then(user => {
      const userEl = nav.querySelector('.user-badge');
      const logoutBtn = nav.querySelector('.btn-logout');
      if (user && userEl) {
        userEl.innerHTML = 'Signed in as <strong>' + this.escapeHtml(user.username) + '</strong>';
      }
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.logout());
      }
    });
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  showToast(message, duration = 2800) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast hidden';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add('hidden'), duration);
  }
};
