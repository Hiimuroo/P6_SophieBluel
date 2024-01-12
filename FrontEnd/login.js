// Fonction pour mettre à jour la visibilité des boutons de connexion/déconnexion en fonction du token stocké localement

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const token = localStorage.getItem('token');
  
    function updateButtonVisibility() {
      if (token) {
        if (loginButton) loginButton.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
      } else {
        if (loginButton) loginButton.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
      }
    }
  
    if (loginButton) {
      loginButton.addEventListener('click', submitForm);
    }
  
// CONNEXION
  
    function submitForm() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
  
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => {
            if (!response.ok) {
                throw Error('Login incorrect. ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
  

            notificationMessage.textContent = 'Login validé ! Bienvenue.';
            notification.style.display = 'block';
  
            setTimeout(() => {
            notification.style.display = 'none';
            }, 1000);
  
  
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 1000);
  
            updateButtonVisibility();
        })
        .catch(error => {
            alert(error.message);
        });
    }
  
    updateButtonVisibility();
});


// DECONNEXION

function logout() {
    localStorage.removeItem('token');
  
    const loginButton = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
  
    if (loginButton) loginButton.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  
    window.location.reload();
  
  }