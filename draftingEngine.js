const SVGRenderer = {
    SCALE: 18, // 1 inch = 18 pixels for screen display

    render(data, options) {
        this.clearLayers();
        if (options.showGrid) this.drawBackgroundGrid(options.unit);
        if (options.showBaseLines) this.drawBaseLines(data.depths);
        
        this.drawPatternOutlines(data);
        if (options.showSewingDarts) this.drawSewingDarts(data);
        if (options.showSA) this.drawSeamAllowances(data);
        
        this.drawCalibrationBox();
    },

    clearLayers() {
        const layers = ['layer-bg-grid', 'layer-baselines', 'layer-construction', 'layer-sewing-darts', 'layer-net-pattern', 'layer-seam-allowance', 'layer-markers', 'layer-annotations'];
        layers.forEach(id => document.getElementById(id).innerHTML = '');
    },

    drawBackgroundGrid(unit) {
        const layer = document.getElementById('layer-bg-grid');
        const step = unit === 'cm' ? (2.54 / 2.54) * this.SCALE : 1.0 * this.SCALE; // 1 unit grid
        
        let pathStr = '';
        for (let x = 0; x < 1200; x += step) {
            pathStr += `M ${x} 0 V 900 `;
        }
        for (let y = 0; y < 900; y += step) {
            pathStr += `M 0 ${y} H 1200 `;
        }
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathStr);
        path.setAttribute('class', 'grid-minor');
        layer.appendChild(path);
    },

    drawBaseLines(depths) {
        const layer = document.getElementById('layer-baselines');
        const lines = [
            { name: 'Nape Line', y: depths.dNape },
            { name: 'Bust Line', y: depths.dBustAdj },
            { name: 'Waist Line', y: depths.dWaist },
            { name: 'Hip Line', y: depths.dHip }
        ];

        lines.forEach(l => {
            const yPx = l.y * this.SCALE;
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            path.setAttribute('x1', '20'); path.setAttribute('y1', yPx);
            path.setAttribute('x2', '1150'); path.setAttribute('y2', yPx);
            path.setAttribute('class', 'base-line');
            layer.appendChild(path);
        });
    },

    drawPatternOutlines(data) {
        const layer = document.getElementById('layer-net-pattern');
        const S = this.SCALE;

        // Draft Back Outer Contour Path
        const backPath = `M ${data.back.originX * S} ${data.depths.dNape * S} ` +
                         `L ${data.back.shoulderX * S} ${data.back.shoulderY * S} ` +
                         `L ${data.back.upX * S} ${data.back.upY * S} ` +
                         `L ${data.back.hpX * S} ${data.depths.dHip * S}`;

        // Draft Front Outer Contour Path
        const frontPath = `M ${data.front.originX * S} ${data.depths.dNape * S} ` +
                          `L ${data.front.shoulderX * S} ${data.front.shoulderY * S} ` +
                          `L ${data.front.upX * S} ${data.front.upY * S} ` +
                          `L ${data.front.hpX * S} ${data.depths.dHip * S}`;

        [backPath, frontPath].forEach(d => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.setAttribute('class', 'pattern-net');
            layer.appendChild(path);
        });
    },

    drawSewingDarts(data) {
        const layer = document.getElementById('layer-sewing-darts');
        const S = this.SCALE;

        // Front Retracted Sewing Dart Vector
        const dartPath = `M ${(data.front.apex.x - 0.5) * S} ${(data.depths.dWaist) * S} ` +
                         `L ${data.front.apex.x * S} ${(data.front.sewingApex.y) * S} ` +
                         `L ${(data.front.apex.x + 0.5) * S} ${(data.depths.dWaist) * S}`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', dartPath);
        path.setAttribute('class', 'sewing-dart');
        layer.appendChild(path);

        // Render True Apex Target Marker
        const markerLayer = document.getElementById('layer-markers');
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', data.front.apex.x * S);
        circle.setAttribute('cy', data.front.apex.y * S);
        circle.setAttribute('r', 4);
        circle.setAttribute('class', 'apex-marker');
        markerLayer.appendChild(circle);
    },

    drawSeamAllowances(data) {
        const layer = document.getElementById('layer-seam-allowance');
        const S = this.SCALE;
        const saOffset = 0.5 * S; // 0.5 inch offset

        const saPath = `M ${(data.back.originX) * S - saOffset} ${(data.depths.dNape) * S - saOffset} ` +
                       `H ${(data.back.hpX) * S + saOffset} ` +
                       `V ${(data.depths.dHip) * S + saOffset}`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', saPath);
        path.setAttribute('class', 'seam-allowance');
        layer.appendChild(path);
    },

    drawCalibrationBox() {
        const layer = document.getElementById('layer-annotations');
        const S = this.SCALE;
        const boxSize = 4 * S; // 4" x 4" Calibration Square
        const x = 950, y = 50;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x); rect.setAttribute('y', y);
        rect.setAttribute('width', boxSize); rect.setAttribute('height', boxSize);
        rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#000'); rect.setAttribute('stroke-width', '1.5');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + 10); text.setAttribute('y', y + 25);
        text.setAttribute('class', 'text-annotation');
        text.textContent = 'PRINT TEST: 4" x 4"';

        layer.appendChild(rect);
        layer.appendChild(text);
    }
};
