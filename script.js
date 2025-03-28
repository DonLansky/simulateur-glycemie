const coefficients = {
    'jeune_actif': { base: 4.8, bpm: 0.025, spo2: -0.03, repas: 0.12 },
    'adulte': { base: 5.2, bpm: 0.03, spo2: -0.04, repas: 0.15 },
    'senior': { base: 5.6, bpm: 0.035, spo2: -0.05, repas: 0.18 }
};

function calculGlycemie(profil, bpm, spo2, repas) {
    const coeff = coefficients[profil];
    let valeur = coeff.base + 
                (bpm * coeff.bpm) + 
                ((100 - spo2) * coeff.spo2) + 
                (repas * coeff.repas);
    
    // Limiter à 7 mmol/L (126 mg/dL)
    return Math.min(7, Math.max(3.5, valeur));
}

function getConseils(glycemie) {
    const conseilsBase = [
        "Contrôle médical trimestriel",
        "Hydratation régulière (1.5L/jour)",
        "Marche 30 min/jour minimum"
    ];

    if(glycemie < 4) return {
        niveau: 'Alerte hypoglycémie',
        conseils: [
            "15g de sucre rapide (3 morceaux)",
            "Contrôler après 15 minutes",
            ...conseilsBase
        ]
    };
    
    if(glycemie <= 6) return {
        niveau: 'Normal',
        conseils: [
            "Repas équilibrés (légumes 50%)",
            "Privilégier les céréales complètes",
            ...conseilsBase
        ]
    };

    return {
        niveau: 'Surveillance requise',
        conseils: [
            "Réduire les sucres ajoutés",
            "Activité physique quotidienne",
            "Test HbA1c recommandé",
            ...conseilsBase
        ]
    };
}

document.getElementById('glycemieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profil = document.getElementById('profil').value;
    const bpm = parseFloat(document.getElementById('bpm').value) || 75;
    const spo2 = parseFloat(document.getElementById('spo2').value) || 97;
    const repas = parseFloat(document.getElementById('repas').value) || 4;

    const glycemie = calculGlycemie(profil, bpm, spo2, repas);
    const conseils = getConseils(glycemie);

    // Affichage
    document.getElementById('resultValue').textContent = glycemie.toFixed(1);
    document.getElementById('mgValue').textContent = Math.round(glycemie * 18);
    
    document.getElementById('interpretation').innerHTML = `
        <div class="alert ${glycemie < 4 ? 'alert-danger' : glycemie <=6 ? 'alert-success' : 'alert-warning'}">
            <h5><i class="bi ${glycemie < 4 ? 'bi-exclamation-triangle' : 'bi-check-circle'}"></i> 
            ${conseils.niveau}</h5>
            <p class="mb-1">Tendances métaboliques :</p>
            <ul class="small">
                <li>Circulation sanguine : ${spo2 >=95 ? 'Optimale' : 'À surveiller'}</li>
                <li>Stress cardiovasculaire : ${bpm > 100 ? 'Élevé' : 'Normal'}</li>
            </ul>
        </div>
    `;

    document.getElementById('recommendations').innerHTML = `
        <ul class="list-group">
            ${conseils.conseils.map(c => `
                <li class="list-group-item d-flex align-items-center">
                    <i class="bi bi-check2-circle me-2 text-primary"></i>
                    ${c}
                </li>
            `).join('')}
        </ul>
    `;

    document.getElementById('resultContainer').classList.remove('d-none');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

function resetForm() {
    document.getElementById('glycemieForm').reset();
    document.getElementById('resultContainer').classList.add('d-none');
}
