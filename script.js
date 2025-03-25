// Coefficients adaptés pour le Mali
const coefficients = {
    'jeune_actif': [0.08, -0.06, 4.8],
    'adulte': [0.1, -0.05, 5.2],
    'senior': [0.12, -0.04, 5.8]
};

function getInterpretation(glycemie) {
    if (glycemie < 3.9) return {
        level: 'danger',
        message: 'Hypoglycémie possible',
        details: 'Une glycémie < 3.9 mmol/L peut indiquer une hypoglycémie. Symptômes possibles : étourdissements, sueurs, confusion. Consommez une source de sucre rapide et consultez un médecin rapidement.',
        recommendations: [
            'Consommer 15g de sucre rapide (jus, bonbons)',
            'Contrôler à nouveau après 15 minutes',
            'Consulter un médecin si les symptômes persistent'
        ]
    };
    
    if (glycemie <= 5.5) return {
        level: 'success',
        message: 'Glycémie normale',
        details: 'Votre estimation se situe dans la plage normale pour une mesure à jeun (3,9 - 5,5 mmol/L).',
        recommendations: [
            'Maintenir une alimentation équilibrée',
            'Pratiquer une activité physique régulière',
            'Faire des bilans sanguins annuels'
        ]
    };
    
    if (glycemie <= 6.9) return {
        level: 'warning',
        message: 'Pré-diabète possible',
        details: 'Votre estimation (5,6 - 6,9 mmol/L à jeun) suggère un état de pré-diabète. Cette condition est réversible avec des mesures adaptées.',
        recommendations: [
            'Consultation médicale recommandée',
            'Réduire les sucres rapides et les graisses saturées',
            'Augmenter l\'activité physique (30 min/jour)',
            'Surveiller régulièrement votre glycémie'
        ]
    };
    
    return {
        level: 'danger',
        message: 'Diabète probable',
        details: 'Une estimation ≥ 7,0 mmol/L à jeun peut indiquer un diabète. Un diagnostic médical est nécessaire pour confirmer (test HbA1c ou glycémie à jeun répétée).',
        recommendations: [
            'Consultation médicale URGENTE',
            'Bilan complet (HbA1c, glycémie)',
            'Mise en place d\'un suivi médical régulier',
            'Adaptation de l\'alimentation et activité physique'
        ]
    };
}

document.getElementById('glycemieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bpm = parseFloat(document.getElementById('bpm').value);
    const spo2 = parseFloat(document.getElementById('spo2').value);
    const profil = document.getElementById('profil').value;
    
    // Calcul
    const [a, b, c] = coefficients[profil];
    const glycemie = (a * bpm) + (b * spo2) + c;
    const interpretation = getInterpretation(glycemie);
    
    // Affichage
    document.getElementById('resultValue').textContent = glycemie.toFixed(1);
    document.getElementById('profilUsed').textContent = 
        profil.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Interprétation médicale
    const recommendationsHtml = interpretation.recommendations.map(r => `<li>${r}</li>`).join('');
    document.getElementById('interpretation').innerHTML = `
        <div class="alert alert-${interpretation.level}">
            <h4>${interpretation.message} (${glycemie.toFixed(1)} mmol/L)</h4>
            <p>${interpretation.details}</p>
            
            <p class="mb-1"><strong>Valeurs de référence :</strong></p>
            <ul class="small">
                <li>Normal (à jeun) : 3,9 - 5,5 mmol/L</li>
                <li>Post-prandial (2h après repas) : < 7,8 mmol/L</li>
                <li>Pré-diabète (à jeun) : 5,6 - 6,9 mmol/L</li>
                <li>Diabète (à jeun) : ≥ 7,0 mmol/L</li>
            </ul>
            
            <p class="mb-1 mt-2"><strong>Recommandations :</strong></p>
            <ul>${recommendationsHtml}</ul>
            
            <hr>
            <small class="text-muted">Cette estimation est fournie à titre informatif uniquement et ne remplace pas une consultation médicale.</small>
        </div>
    `;
    
    document.getElementById('resultContainer').classList.remove('d-none');
    document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
});

function resetForm() {
    document.getElementById('glycemieForm').reset();
    document.getElementById('resultContainer').classList.add('d-none');
}