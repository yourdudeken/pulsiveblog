const Auth = {
    getToken() {
        return localStorage.getItem('pulse_token');
    },
    saveToken(token) {
        localStorage.setItem('pulse_token', token);
    },
    logout() {
        localStorage.removeItem('pulse_token');
        localStorage.removeItem('pulse_user');
        window.location.reload();
    },
    getUser() {
        const user = localStorage.getItem('pulse_user');
        return user ? JSON.parse(user) : null;
    },
    isLoggedIn() {
        return !!this.getToken();
    },
    getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
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
        loginModal.style.display = 'flex';
    } else {
        const user = Auth.getUser();
        if (user) {
            const profileBadge = document.getElementById('user-profile');
            profileBadge.style.display = 'flex';
            document.getElementById('user-avatar').src = user.avatar || 'https://github.com/identicons/pulse.png';
            document.getElementById('user-name').textContent = user.username;

            // Toggle Dropdown
            const menu = document.getElementById('profile-menu');
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
});
