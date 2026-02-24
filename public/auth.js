const Auth = {
    getToken() {
        return localStorage.getItem('pulsive_token');
    },
    saveToken(token) {
        localStorage.setItem('pulsive_token', token);
    },
    logout() {
        localStorage.removeItem('pulsive_token');
        localStorage.removeItem('pulsive_user');
        window.location.reload();
    },
    getUser() {
        const user = localStorage.getItem('pulsive_user');
        return user ? JSON.parse(user) : null;
    },
    isLoggedIn() {
        return !!this.getToken();
    },
    getHeaders() {
        const token = this.getToken();
        const user = this.getUser();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
        if (user && user.apiKey) {
            headers['X-API-KEY'] = user.apiKey;
        }
        return headers;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');

    // Check for errors in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        alert('Authentication failed. Please try again.');
    }

    if (!Auth.isLoggedIn()) {
        if (loginModal) loginModal.style.display = 'flex';
    } else {
        const user = Auth.getUser();
        if (user) {
            const profileBadge = document.getElementById('user-profile');
            if (profileBadge) {
                profileBadge.style.display = 'flex';
                const avatarImg = document.getElementById('user-avatar');
                const nameSpan = document.getElementById('user-name');
                if (avatarImg) avatarImg.src = user.avatar || 'https://github.com/identicons/pulse.png';
                if (nameSpan) nameSpan.textContent = user.username;

                // Toggle Dropdown
                const menu = document.getElementById('profile-menu');
                if (menu) {
                    profileBadge.addEventListener('click', (e) => {
                        e.stopPropagation();
                        menu.classList.toggle('active');
                    });

                    // Close dropdown when clicking outside
                    document.addEventListener('click', () => {
                        menu.classList.remove('active');
                    });
                }
            }
        }
    }
});
