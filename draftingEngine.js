// --- LILINORA DRAFTING ENGINE: POINT-BY-POINT SEQUENCING ---

function generatePattern() {
    const patternGroup = document.getElementById('pattern-group');
    if (!patternGroup) return;
    patternGroup.innerHTML = '';

    const scaleFactor = 26; // Standard grid scale factor

    // ==========================================
    // BODICE DRAFTING SEQUENCE
    // ==========================================
    
    // Point 1: Center Back (CB) Top Anchor Origin (Independent)
    const CB_Top = {
        label: "CB",
        description: "Center Back Top Corner (Anchor Origin)",
        x: 50,
        y: 50,
        isIndependent: true
    };

    // Read input values from existing HTML elements safely
    const bustInput = document.getElementById('bust');
    const bustEaseInput = document.getElementById('bustEase');
    const backWaistInput = document.getElementById('backNeckToWaist');
    const backWaistEaseInput = document.getElementById('backNeckToWaistEase');

    const bustVal = (bustInput ? parseFloat(bustInput.value) : 34.5) + (bustEaseInput ? parseFloat(bustEaseInput.value) : 2.0);
    const backLengthVal = (backWaistInput ? parseFloat(backWaistInput.value) : 15.5) + (backWaistEaseInput ? parseFloat(backWaistEaseInput.value) : 0);

    const bodiceWidth = (bustVal / 4) * scaleFactor;
    const bodiceHeight = backLengthVal * scaleFactor;

    // Render Bodice Block
    drawPatternBlock(patternGroup, {
        name: `Bodice Block [${CB_Top.label}] (Bust: ${bustVal}")`,
        x: CB_Top.x,
        y: CB_Top.y,
        width: bodiceWidth,
        height: bodiceHeight,
        stroke: '#c25e6f',
        fill: 'rgba(194, 94, 111, 0.06)'
    });

    // ==========================================
    // OPTIONAL PIECES (Sleeve, Skirt, Trousers)
    // ==========================================
    const includeSleeve = document.getElementById('includeSleeve');
    if (includeSleeve && includeSleeve.value === 'yes') {
        const bicepInput = document.getElementById('bicep');
        const bicepEaseInput = document.getElementById('bicepEase');
        const sleeveLenInput = document.getElementById('sleeveLength');
        const sleeveLenEaseInput = document.getElementById('sleeveLengthEase');

        const bicepVal = (bicepInput ? parseFloat(bicepInput.value) : 11.5) + (bicepEaseInput ? parseFloat(bicepEaseInput.value) : 2.0);
        const sLenVal = (sleeveLenInput ? parseFloat(sleeveLenInput.value) : 23.0) + (sleeveLenEaseInput ? parseFloat(sleeveLenEaseInput.value) : 0);

        drawPatternBlock(patternGroup, {
            name: `Fitted Sleeve (Bicep: ${bicepVal}")`,
            x: CB_Top.x + bodiceWidth + 60,
            y: CB_Top.y,
            width: bicepVal * scaleFactor,
            height: sLenVal * scaleFactor,
            stroke: '#5c524f',
            fill: 'rgba(92, 82, 79, 0.05)'
        });
    }

    // ==========================================
    // RENDER VISUAL POINTS & LABELS
    // ==========================================
    // Call the point renderer here so it appears on top of the blocks
    drawDraftingPoint(patternGroup, CB_Top);
}

// Helper function to render pattern blocks onto the SVG canvas
function drawPatternBlock(container, piece) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', piece.x);
    rect.setAttribute('y', piece.y);
    rect.setAttribute('width', piece.width);
    rect.setAttribute('height', piece.height);
    rect.setAttribute('fill', piece.fill);
    rect.setAttribute('stroke', piece.stroke);
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('stroke-dasharray', '4');
    container.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', piece.x + 15);
    text.setAttribute('y', piece.y + 25);
    text.setAttribute('fill', '#2c2524');
    text.setAttribute('font-family', 'Montserrat');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', '600');
    text.textContent = piece.name;
    container.appendChild(text);
}

// Helper to visually render any drafting point and its label on the SVG
function drawDraftingPoint(container, point) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', '3.5');
    circle.setAttribute('fill', '#c25e6f');
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', '1.5');
    container.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', point.x + 8);
    text.setAttribute('y', point.y - 4);
    text.setAttribute('fill', '#c25e6f');
    text.setAttribute('font-family', 'Montserrat');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '700');
    text.textContent = point.label;
    container.appendChild(text);
}
