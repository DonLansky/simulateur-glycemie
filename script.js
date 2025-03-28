const coefficients = {
    jeune: [0.015, -0.01, 4.2],
    adulte: [0.018, -0.008, 4.5],
    senior: [0.02, -0.005, 4.8]
};

function calculerGlycemie() {
    // Récupération des valeurs
    const profil = document.getElementById('profil').value;
    const bpm = parseFloat(document.getElementById('bpm').value);
    const spo2 = parseFloat(document.getElementById('spo2').value);
    
    // Vérification des entrées
    if (!profil || !bpm || !spo2) {
        alert("Veuillez remplir tous les champs!");
        return;
    }

    // Calcul
    const [coeffBpm, coeffSpo2, base] = coefficients[profil];
    let glycemie = (coeffBpm * bpm) + (coeffSpo2 * spo2) + base;
    
    // Limitation à 7.2 mmol/L
    glycemie = Math.min(glycemie, 7.2);
    const mgdl = glycemie * 18;

    // Affichage
    document.getElementById('mmolValue').textContent = glycemie.toFixed(1);
    document.getElementById('mgValue').textContent = mgdl.toFixed(1);
    document.getElementById('resultat').classList.remove('hidden');
    
    // Génération des conseils
    genererConseils(glycemie);
}

function genererConseils(glycemie) {
    let html = '';
    if (glycemie < 3.9) {
        html = `
            <div class="alert alert-danger">
                <h5><i class="bi bi-exclamation-triangle"></i> Hypoglycémie</h5>
                <ul>
                    <li>Consommer 15g de sucre rapide</li>
                    <li>Contrôler après 15 minutes</li>
                    <li>Consulter un médecin si besoin</li>
                </ul>
            </div>
        `;
    } else if (glycemie <= 5.5) {
        html = `
            <div class="alert alert-success">
                <h5><i class="bi bi-check-circle"></i> Valeur normale</h5>
                <ul>
                    <li>Maintenir une alimentation équilibrée</li>
                    <li>Exercice physique régulier</li>
                </ul>
            </div>
        `;
    } else {
        html = `
            <div class="alert alert-warning">
                <h5><i class="bi bi-exclamation-circle"></i> Valeur élevée</h5>
                <ul>
                    <li>Réduire les sucres rapides</li>
                    <li>Consulter un médecin</li>
                    <li>Surveiller régulièrement</li>
                </ul>
            </div>
        `;
    }
    document.getElementById('conseils').innerHTML = html;
}

function reset() {
    document.getElementById('formGlycemie').reset();
    document.getElementById('resultat').classList.add('hidden');
}

// Événements
document.getElementById('formGlycemie').addEventListener('submit', function(e) {
    e.preventDefault();
    calculerGlycemie();
});
