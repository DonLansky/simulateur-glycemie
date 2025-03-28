// Coefficients optimisés pour le Mali (RGPH5)
const coefficients = {
    'jeune_actif': [0.072, -0.052, 0.11, 4.5],  // [bpm, spo2, jeune, base]
    'adulte': [0.085, -0.045, 0.14, 5.0],
    'senior': [0.093, -0.038, 0.17, 5.3]
};

let currentUnit = 'mmol';
let currentGlycemie = 0;

function toggleUnits() {
    currentUnit = currentUnit === 'mmol' ? 'mg' : 'mmol';
    updateResultDisplay();
}

function updateResultDisplay() {
    const valueElement = document.getElementById('resultValue');
    const unitElement = document.getElementById('unitDisplay');
    const toggleTextElement = document.getElementById('toggleUnitText');
    
    if (currentUnit === 'mmol') {
        valueElement.textContent = currentGlycemie.toFixed(1);
        unitElement.textContent = 'mmol/L';
        toggleTextElement.textContent = 'mg/dL';
    } else {
        valueElement.textContent = (currentGlycemie * 18).toFixed(1);
        unitElement.textContent = 'mg/dL';
        toggleTextElement.textContent = 'mmol/L';
    }
    
    updateInterpretation();
}

function updateInterpretation() {
    const glycemie = currentUnit === 'mmol' ? currentGlycemie : currentGlycemie * 18;
    const interpretation = getInterpretation(glycemie);
    const recommendationsHtml = interpretation.recommendations.map(r => `<li>${r}</li>`).join('');
    
    document.getElementById('interpretation').innerHTML = `
        <div class="alert alert-${interpretation.level}">
            <h4><i class="bi ${interpretation.icon}"></i> ${interpretation.message}</h4>
            <p>${interpretation.details}</p>
            <ul class="small">${recommendationsHtml}</ul>
        </div>
    `;
}

function getInterpretation(glycemie) {
    const value = currentUnit === 'mmol' ? glycemie : glycemie / 18;
    
    if (value < 3.9) return {
        level: 'danger',
        icon: 'bi-exclamation-triangle',
        message: 'Hypoglycémie possible',
        details: `Glycémie estimée très basse (${value.toFixed(1)} mmol/L / ${(value*18).toFixed(1)} mg/dL).`,
        recommendations: [
            'Consommer 15g de sucre rapide',
            'Contrôler après 15 minutes',
            'Consulter si symptômes persistent'
        ]
    };
    
    if (value <= 5.5) return {
        level: 'success',
        icon: 'bi-check-circle',
        message: 'Glycémie normale',
        details: `Dans la plage normale (${value.toFixed(1)} mmol/L / ${(value*18).toFixed(1)} mg/dL).`,
        recommendations: [
            'Maintenir habitudes saines',
            'Activité physique régulière'
        ]
    };
    
    if (value <= 6.9) return {
        level: 'warning',
        icon: 'bi-exclamation-circle',
        message: 'Pré-diabète possible',
        details: `Niveau élevé (${value.toFixed(1)} mmol/L / ${(value*18).toFixed(1)} mg/dL).`,
        recommendations: [
            'Surveiller alimentation',
            'Consulter un médecin'
        ]
    };
    
    return {
        level: 'danger',
        icon: 'bi-heart-pulse',
        message: 'Diabète probable',
        details: `Niveau très élevé (${value.toFixed(1)} mmol/L / ${(value*18).toFixed(1)} mg/dL).`,
        recommendations: [
            'Consultation médicale urgente',
            'Bilan sanguin complet'
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
    currentGlycemie = (a * bpm) + (b * spo2) + (c * jeune) + d;
    
    document.getElementById('profilUsed').textContent = 
        document.getElementById('profil').options[document.getElementById('profil').selectedIndex].text;
    
    updateResultDisplay();
    document.getElementById('resultContainer').classList.remove('d-none');
    document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
});

function resetForm() {
    document.getElementById('glycemieForm').reset();
    document.getElementById('resultContainer').classList.add('d-none');
}
