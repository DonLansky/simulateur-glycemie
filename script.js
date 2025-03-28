const coefficients = {
    'jeune_actif': { a: 0.015, b: -0.008, c: 0.03, base: 4.2 },
    'adulte': { a: 0.018, b: -0.006, c: 0.035, base: 4.5 },
    'senior': { a: 0.02, b: -0.005, c: 0.04, base: 4.8 }
};

const interpretations = {
    hypoglycemie: {
        title: 'Hypoglycémie détectée',
        class: 'alert-danger',
        icon: 'bi-exclamation-triangle-fill',
        details: 'Votre estimation glycémique est inférieure aux valeurs normales.',
        recommendations: [
            'Consommer 15g de glucides rapides (jus, sucre)',
            'Contrôle après 15 minutes',
            'Éviter les activités dangereuses',
            'Consulter un médecin si persistant'
        ]
    },
    normal: {
        title: 'Glycémie normale',
        class: 'alert-success',
        icon: 'bi-check-circle-fill',
        details: 'Votre glycémie se situe dans la plage normale.',
        recommendations: [
            'Maintenir une alimentation équilibrée',
            'Activité physique régulière',
            'Contrôle annuel recommandé',
            'Hydratation suffisante'
        ]
    },
    prediabete: {
        title: 'Niveau élevé',
        class: 'alert-warning',
        icon: 'bi-exclamation-octagon-fill',
        details: 'Votre glycémie est au-dessus de la normale.',
        recommendations: [
            'Réduire les sucres rapides',
            'Augmenter l\'activité physique',
            'Consultation médicale conseillée',
            'Surveillance régulière'
        ]
    },
    diabete: {
        title: 'Niveau critique',
        class: 'alert-danger',
        icon: 'bi-heartbreak-fill',
        details: 'Nécessite une attention médicale urgente.',
        recommendations: [
            'Consultation IMMÉDIATE',
            'Bilan sanguin complet',
            'Adapter l\'alimentation',
            'Surveillance accrue'
        ]
    }
};

function showError(message) {
    alert(`Erreur : ${message}`);
}

function calculateGlycemia(profil, bpm, spo2, jeune) {
    const { a, b, c, base } = coefficients[profil];
    let result = base + (a * bpm) + (b * spo2) + (c * jeune);
    return Math.min(result, 7.2); // Plafonnement à 7.2 mmol/L
}

function updateDisplay(glycemia) {
    const mmol = glycemia.toFixed(1);
    const mg = (glycemia * 18).toFixed(1);
    
    document.getElementById('resultMmol').textContent = mmol;
    document.getElementById('resultMg').textContent = mg;

    let interpretation;
    if (glycemia < 3.9) interpretation = interpretations.hypoglycemie;
    else if (glycemia <= 5.5) interpretation = interpretations.normal;
    else if (glycemia <= 6.9) interpretation = interpretations.prediabete;
    else interpretation = interpretations.diabete;

    const interpretationEl = document.getElementById('interpretation');
    interpretationEl.className = `alert ${interpretation.class}`;
    
    interpretationEl.innerHTML = `
        <h4><i class="bi ${interpretation.icon}"></i> ${interpretation.title}</h4>
        <p>${interpretation.details}</p>
        <div class="mt-3">
            <h5><i class="bi bi-lightbulb"></i> Recommandations :</h5>
            <ul class="list-group list-group-flush">
                ${interpretation.recommendations.map(r => `
                    <li class="list-group-item d-flex align-items-center">
                        <i class="bi bi-chevron-right me-2"></i>${r}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

document.getElementById('glycemieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profil = document.getElementById('profil').value;
    const bpm = document.getElementById('bpm').value;
    const spo2 = document.getElementById('spo2').value;
    const jeune = document.getElementById('jeune').value;

    if (!profil || !bpm || !spo2 || !jeune) {
        showError('Veuillez remplir tous les champs du formulaire');
        return;
    }

    const glycemia = calculateGlycemia(
        profil,
        parseFloat(bpm),
        parseFloat(spo2),
        parseFloat(jeune)
    );

    document.getElementById('profilUsed').textContent = 
        document.getElementById('profil').selectedOptions[0].text;

    updateDisplay(glycemia);
    document.getElementById('resultContainer').classList.remove('d-none');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

function resetForm() {
    document.getElementById('glycemieForm').reset();
    document.getElementById('resultContainer').classList.add('d-none');
}
