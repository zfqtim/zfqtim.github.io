

function toggleDarkMode() {
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const gradesForm = document.querySelector('.grades-form');

    body.classList.toggle('dark-mode');
    sidebar.classList.toggle('dark-mode');
    main.classList.toggle('dark-mode');
    gradesForm.classList.toggle('dark-mode');
}

function saveGrades(subject, grades, average) {
    const subjectData = {
        grades: grades,
        average: average
    };

    localStorage.setItem(subject, JSON.stringify(subjectData));
}

function loadGrades(subject) {
    const subjectDataString = localStorage.getItem(subject);

    if (subjectDataString) {
        const subjectData = JSON.parse(subjectDataString);
        return {
            grades: subjectData.grades,
            average: subjectData.average
        };
    }

    return null;
}

function selectSubject(subject) {
    const buttons = document.querySelectorAll('.subject-button');
    buttons.forEach(button => button.classList.remove('selected'));

    const main = document.getElementById('main');
    main.innerHTML = '';
    main.style.marginLeft = '200px';
    main.style.opacity = '1';
    main.style.transform = 'translateY(0)';

    const heading = document.createElement('h1');
    heading.textContent = subject;
    main.appendChild(heading);

    const gradesForm = document.createElement('div');
    gradesForm.className = 'grades-form';

    const subjectData = loadGrades(subject);

    for (let i = 1; i <= 4; i++) {
        const label = document.createElement('label');
        label.textContent = `Note ${i}:`;

        const input = document.createElement('input');
        input.type = 'text';
        input.pattern = '^\\d*\\.?\\d*$';
        input.title = 'Bitte gib eine gültige Note ein.';
        input.maxLength = '4';
        input.placeholder = ' z.B. 3.5';

        if (subjectData) {
            input.value = subjectData.grades[i - 1].toString();
        }

        label.appendChild(input);
        gradesForm.appendChild(label);
    }

    const calculateButton = document.createElement('button');
    calculateButton.textContent = 'Durchschnitt berechnen';
    calculateButton.onclick = () => calculateAverage(subject);

    const averageParagraph = document.createElement('p');
    averageParagraph.id = 'average';

    if (subjectData) {
        averageParagraph.innerText = `Durchschnitt: ${subjectData.average.toFixed(2)}`;
    }

    gradesForm.appendChild(calculateButton);
    gradesForm.appendChild(averageParagraph);

    main.appendChild(gradesForm);

    const selectedButton = document.querySelector(`.subject-button:contains('${subject}')`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }

    // Trigger Animationen
    setTimeout(() => {
        gradesForm.style.opacity = '1';
        gradesForm.style.transform = 'translateY(0)';
    }, 200);
}

function calculateAverage(subject) {
    const gradeInputs = document.querySelectorAll('.grades-form input');
    const grades = Array.from(gradeInputs)
        .map(input => parseFloat(input.value.replace(',', '.')))
        .filter(value => !isNaN(value) && value >= 1 && value <= 6);

    if (grades.length === 0) {
        document.getElementById('average').innerText = 'Bitte gebe gültige Noten ein.';
        return;
    }

    const average = grades.reduce((total, grade) => total + grade, 0) / grades.length;

    // Speichere die Noten und den Durchschnitt im Local Storage
    saveGrades(subject, grades, average);

    document.getElementById('average').innerText = `Durchschnitt: ${average.toFixed(2)}`;
}

// Funktion zum Anzeigen des Login-Overlays
function showLoginOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
}

// Funktion zum Ausblenden des Login-Overlays
// Funktion zum Ausblenden des Login-Overlays
function hideLoginOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.opacity = '0';  // Setze die Opazität auf 0, um die Animation zu starten

    // Füge eine Verzögerung hinzu, um sicherzustellen, dass die Animation abgeschlossen ist
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);  // Ändere die Zeit entsprechend der Dauer deiner CSS-Animation
}

// Füge diese Funktionen hinzu, um das Modal zu steuern
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function login() {
    // Füge hier die Anmelde-Logik hinzu
    // Beispiel: Überprüfe Benutzername und Passwort
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Führe hier die Anmeldeüberprüfung durch
    // Beispiel: Wenn die Anmeldung erfolgreich ist, schließe das Modal
    // Wenn die Anmeldung fehlschlägt, zeige eine Fehlermeldung oder mache nichts
    if (username === 'example' && password === 'password') {
        closeLoginModal();
        // Hier könntest du weitere Aktionen nach erfolgreicher Anmeldung durchführen
    } else {
        alert('Falscher Benutzername oder Passwort.');
    }
}

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
                closeLoginModal();
                // Nach erfolgreicher Anmeldung das Overlay ausblenden
                hideLoginOverlay();
            } else {
                // Bei fehlerhafter Anmeldung Fehlermeldung anzeigen
                loginMessage.textContent = data.message;
            }
        } catch (error) {
            console.error('Fehler bei der Anmeldung:', error);
        }
    });

    registerButton.addEventListener('click', () => {
        showRegistrationForm();
    });

    // Beim Laden der Seite das Login-Overlay anzeigen
    showLoginOverlay();
});

function showRegistrationForm() {
    const registrationFormContainer = document.getElementById('registrationFormContainer');
    


    // Hier kannst du zusätzlichen Code hinzufügen, um das Registrierungsformular anzuzeigen
    // Zum Beispiel könntest du das display-Attribut auf 'block' setzen
    
    // Beispiel:
    registrationFormContainer.innerHTML = '<p>Hier könnte dein Registrierungsformular stehen.</p>';
}