const MeasurementsManager = {
    // Map internal keys to friendly full labels
    definitions: {
        B: { label: 'Bust Circumference', default: 36.0 },
        W: { label: 'Waist Circumference', default: 28.0 },
        H: { label: 'Hip Circumference', default: 38.0 },
        BW: { label: 'Back Waist Length', default: 16.5 },
        WH: { label: 'Waist-to-Hip Length', default: 8.0 },
        BWidth: { label: 'Across Back Width', default: 14.0 },
        CWidth: { label: 'Across Chest Width', default: 13.0 },
        S: { label: 'Shoulder Length', default: 5.0 },
        A: { label: 'Arm Length', default: 23.0 },
        TA: { label: 'Top Arm Circumference', default: 11.5 }
    },

    currentUnit: 'inch',

    init() {
        this.renderInputs();
    },

    renderInputs() {
        const container = document.getElementById('measurements-inputs');
        container.innerHTML = '';

        for (const [key, item] of Object.entries(this.definitions)) {
            const displayVal = this.currentUnit === 'cm' ? (item.default * 2.54).toFixed(1) : item.default;
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label for="m-${key}">${item.label} (${this.currentUnit}):</label>
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
                val = val / 2.54; // Convert to inches for underlying geometry engine
            }
            values[key] = val;
        });
        return values;
    }
};
