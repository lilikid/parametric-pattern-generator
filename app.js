document.addEventListener('DOMContentLoaded', () => {
    MeasurementsManager.init();

    function updateAndRender() {
        const measurements = MeasurementsManager.getValuesInInches();
        const ease = parseFloat(document.getElementById('ease-preset').value);
        
        const patternData = DraftingEngine.calculatePattern(measurements, ease);
        
        const displayOptions = {
            unit: document.getElementById('unit-system').value,
            showGrid: document.getElementById('toggle-grid').checked,
            showBaseLines: document.getElementById('toggle-baselines').checked,
            showSewingDarts: document.getElementById('toggle-sewing-darts').checked,
            showSA: document.getElementById('toggle-sa').checked
        };

        SVGRenderer.render(patternData, displayOptions);
    }

    // Event Listeners
    document.getElementById('unit-system').addEventListener('change', (e) => {
        MeasurementsManager.currentUnit = e.target.value;
        MeasurementsManager.renderInputs();
        updateAndRender();
    });

    document.getElementById('btn-render').addEventListener('click', updateAndRender);
    
    document.getElementById('sidebar').addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            updateAndRender();
        }
    });

    document.getElementById('btn-print').addEventListener('click', () => {
        window.print();
    });

    // Initial Render on Page Load
    updateAndRender();
});
