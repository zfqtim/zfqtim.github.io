document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerButton = document.getElementById('registerButton');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                hideLoginOverlay();
            } else {
                loginMessage.textContent = data.message;
            }
        } catch (error) {
            console.error('Fehler bei der Anmeldung:', error);
        }
    });

    registerButton.addEventListener('click', () => {
        const loginContainer = document.querySelector('.login-container');
        loginContainer.innerHTML = `
            <h2>Registrieren</h2>
            <form id="registerForm">
                <label for="registerUsername">Benutzername:</label>
                <input type="text" id="registerUsername" required>

                <label for="registerPassword">Passwort:</label>
                <input type="password" id="registerPassword" required>

                <button type="submit">Registrieren</button>
            </form>
            <p id="registerMessage" class="error-message"></p>
        `;

        const registerForm = document.getElementById('registerForm');
        const registerMessage = document.getElementById('registerMessage');

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Anmeldung erfolgreich!'); // Füge diese Zeile hinzu
                    closeLoginModal();
                    hideLoginOverlay();
                } else {
                    loginMessage.textContent = data.message;
                }
            } catch (error) {
                console.error('Fehler bei der Registrierung:', error);
            }
        });
    });

    showLoginOverlay();
});

// Funktion zum Ausblenden des Login-Overlays
function hideLoginOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}
