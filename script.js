const coefficients = {
    'jeune_actif': { base: 4.4, bpm: 0.025, spo2: 0.015, repas: 0.1 },
    'adulte': { base: 5.0, bpm: 0.03, spo2: 0.02, repas: 0.12 },
    'senior': { base: 5.4, bpm: 0.035, spo2: 0.025, repas: 0.15 }
};

function calculGlycemie(profil, bpm, spo2, repas) {
    const coeff = coefficients[profil];
    const randomFactor = (Math.random() * 0.4) - 0.2; // ±0.2 mmol/L
    
    let valeur = coeff.base + 
                (bpm * coeff.bpm * 0.15) + 
                ((100 - spo2) * coeff.spo2 * 0.25) + 
                (repas * coeff.repas * 0.35) + 
                randomFactor;

    // Application des seuils maliens avec ajustement âge
    let valeurAjustee = valeur * (profil === 'senior' ? 1.05 : 1);
    return Math.min(7.1, Math.max(4.4, valeurAjustee));
}

function getConseils(glycemie) {
    const conseilsBase = [
        "Consultation médicale trimestrielle",
        "Boire 1.5L d'eau/jour minimum",
        "30 minutes de marche quotidienne"
    ];

    if(glycemie < 4.4) {
        return {
            niveau: 'Vigilance hypoglycémie',
            conseils: [
                "Jus de fruit (150ml) ou 3 morceaux de sucre",
                "Mesure de contrôle après 15 minutes",
                ...conseilsBase
            ]
        };
    } 
    else if(glycemie <= 6.0) {
        return {
            niveau: 'Niveau normal',
            conseils: [
                "Maintenir alimentation équilibrée",
                "Privilégier fibres et protéines",
                ...conseilsBase
            ]
        };
    }
    else {
        return {
            niveau: 'Surveillance nécessaire',
            conseils: [
                "Réduire les glucides rapides",
                "Activité physique modérée quotidienne",
                "Contrôle HbA1c recommandé",
                ...conseilsBase
            ]
        };
    }
}

document.getElementById('glycemieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profil = document.getElementById('profil').value;
    const bpm = parseFloat(document.getElementById('bpm').value) || 75;
    const spo2 = parseFloat(document.getElementById('spo2').value) || 97;
    const repas = parseFloat(document.getElementById('repas').value) || 4;

    const glycemie = calculGlycemie(profil, bpm, spo2, repas);
    const conseils = getConseils(glycemie);

    // Affichage des résultats
    document.getElementById('resultValue').textContent = glycemie.toFixed(1);
    document.getElementById('mgValue').textContent = Math.round(glycemie * 18);

    // Mise à jour de l'interprétation
    document.getElementById('interpretation').innerHTML = `
        <div class="alert ${glycemie < 4.4 ? 'alert-danger' : glycemie <=6 ? 'alert-success' : 'alert-warning'}">
            <h5><i class="bi ${glycemie < 4.4 ? 'bi-exclamation-triangle' : 'bi-check-circle'}"></i> 
            ${conseils.niveau}</h5>
            <p class="mb-2">Paramètres physiologiques :</p>
            <ul class="small">
                <li>Oxygénation : ${spo2 >=95 ? 'Bonne' : 'À améliorer'} (${spo2}%)</li>
                <li>Activité cardiaque : ${bpm > 100 ? 'Élevée' : bpm < 60 ? 'Basse' : 'Normale'} (${bpm} BPM)</li>
                <li>Dernier repas : ${repas < 2 ? 'Récent' : repas < 4 ? 'Modéré' : 'Lointain'}</li>
            </ul>
        </div>
    `;

    // Génération des recommandations
    document.getElementById('recommendations').innerHTML = `
        <div class="mt-3">
            ${conseils.conseils.map(c => `
                <div class="d-flex align-items-start mb-2">
                    <i class="bi bi-arrow-right-circle me-2 text-primary"></i>
                    <span>${c}</span>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById('resultContainer').classList.remove('d-none');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

function resetForm() {
    document.getElementById('glycemieForm').reset();
    document.getElementById('resultContainer').classList.add('d-none');
}
