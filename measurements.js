const MeasurementsManager = {
    defaults: {
        B: 36.0,      // Bust
        W: 28.0,      // Waist
        H: 38.0,      // Hips
        BW: 16.5,     // Back Waist Length
        WH: 8.0,      // Waist to Hip Length
        BWidth: 14.0, // Back Width
        CWidth: 13.0, // Chest Width
        S: 5.0,       // Shoulder Length
        A: 23.0,      // Arm Length
        TA: 11.5      // Top Arm Circumference
    },

    currentUnit: 'inch',

    init() {
        this.renderInputs();
    },

    renderInputs() {
        const container = document.getElementById('measurements-inputs');
        container.innerHTML = '';

        for (const [key, val] of Object.entries(this.defaults)) {
            const displayVal = this.currentUnit === 'cm' ? (val * 2.54).toFixed(1) : val;
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label for="m-${key}">${key} (${this.currentUnit}):</label>
                <input type="number" id="m-${key}" data-key="${key}" value="${displayVal}" step="0.1">
            `;
            container.appendChild(div);
        }
    },

    getValuesInInches() {
        const values = {};
        const inputs = document.querySelectorAll('#measurements-inputs input');
        
        inputs.forEach(input => {
            const key = input.dataset.key;
            let val = parseFloat(input.value) || 0;
            if (this.currentUnit === 'cm') {
                val = val / 2.54; // Convert back to inches for pure math engine
            }
            values[key] = val;
        });
        return values;
    }
};
