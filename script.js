// Coefficients ajustés pour ne jamais dépasser 7.2 mmol/L (130 mg/dL)
const coefficients = {
    'jeune_actif': [0.018, -0.012, 0.04, 4.3],
    'adulte': [0.022, -0.01, 0.05, 4.8],
    'senior': [0.025, -0.008, 0.06, 5.0]
};

function getInterpretation(glycemie) {
    const mgValue = (glycemie * 18).toFixed(1);
    
    if (glycemie < 3.9) return {
        level: 'danger',
        icon: 'bi-exclamation-triangle',
        message: 'Hypoglycémie possible',
        details: `Votre estimation (${glycemie.toFixed(1)} mmol/L | ${mgValue} mg/dL) est en dessous des valeurs normales.`,
        recommendations: [
            'Consommer immédiatement 15g de glucides rapides (jus, sucre)',
            'Contrôler à nouveau après 15 minutes',
            'Consulter un médecin si les symptômes persistent',
            'Éviter les activités risquées (conduite, machines)'
        ]
    };
    
    if (glycemie <= 5.5) return {
        level: 'success',
        icon: 'bi-check-circle',
        message: 'Glycémie normale',
        details: `Votre estimation (${glycemie.toFixed(1)} mmol/L | ${mgValue} mg/dL) se situe dans la plage normale.`,
        recommendations: [
            'Maintenir une alimentation équilibrée',
            'Pratiquer une activité physique régulière',
            'Contrôler votre glycémie annuellement',
            'Boire suffisamment d\'eau'
        ]
    };
    
    if (glycemie <= 6.9) return {
        level: 'warning',
        icon: 'bi-exclamation-circle',
        message: 'Glycémie élevée',
        details: `Votre estimation (${glycemie.toFixed(1)} mmol/L | ${mgValue} mg/dL) est au-dessus de la normale.`,
        recommendations: [
            'Réduire les sucres rapides et graisses saturées',
            'Augmenter l\'activité physique (30 min/jour)',
            'Consulter un médecin pour un bilan',
            'Surveiller régulièrement votre glycémie'
        ]
    };
    
    return {
        level: 'danger',
        icon: 'bi-heart-pulse',
        message: 'Glycémie très élevée',
        details: `Votre estimation (${glycemie.toFixed(1)} mmol/L | ${mgValue} mg/dL) nécessite une attention médicale.`,
        recommendations: [
            'Consultation médicale URGENTE',
            'Bilan complet (HbA1c, glycémie à jeun)',
            'Adapter immédiatement votre alimentation',
            'Éviter tout stress inutile'
        ]
    };
}

document.getElementById('glycemieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bpm = parseFloat(document.getElementById('bpm').value);
    const spo2 = parseFloat(document.getElementById('spo2').value);
    const jeune = parseFloat(document.getElementById('jeune').value);
    const profil = document.getElementById('profil').value;
    
    const [a, b, c, d] = coefficients[profil];
    let glycemie = (a * bpm) + (b * spo2) + (c * jeune) + d;
    
    // Limitation stricte à 7.2 mmol/L (130 mg/dL)
    glycemie = Math.min(glycemie, 7.2);
    
    // Affichage double unité
    document.getElementById('resultValueMmol').textContent = glycemie.toFixed(1);
    document.getElementById('resultValueMg').textContent = (glycemie * 18).toFixed(1);
    
    document.getElementById('profilUsed').textContent = 
        document.getElementById('profil').options[document.getElementById('profil').selectedIndex].text;
    
    // Interprétation et conseils
    const interpretation = getInterpretation(glycemie);
    const recommendationsHtml = interpretation.recommendations.map(r => 
        `<li><i class="bi bi-arrow-right-short"></i> ${r}</li>`
    ).join('');
    
    document.getElementById('interpretation').innerHTML = `
        <div class="alert alert-${interpretation.level}">
            <h4><i class="bi ${interpretation.icon}"></i> ${interpretation.message}</h4>
            <p>${interpretation.details}</p>
            
            <p class="mb-1 mt-3"><strong>Conseils :</strong></p>
            <ul class="advice-list">${recommendationsHtml}</ul>
            
            <hr>
            <small class="text-muted">
                <i class="bi bi-info-circle"></i> Ces conseils ne remplacent pas un avis médical professionnel.
            </small>
        </div>
    `;
    
    document.getElementById('resultContainer').classList.remove('d-none');
    document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
});

function resetForm() {
    document.getElementById('glycemieForm').reset();
    document.getElementById('resultContainer').classList.add('d-none');
}
