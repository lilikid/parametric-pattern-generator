const SVGRenderer = {
    SCALE: 24, // Scale factor: 1 inch = 24 SVG display pixels

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
        layers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
    },

    drawBackgroundGrid(unit) {
        const layer = document.getElementById('layer-bg-grid');
        const step = (unit === 'cm' ? 1.0 / 2.54 : 1.0) * this.SCALE;
        
        let pathStr = '';
        for (let x = 0; x < 1200; x += step) { pathStr += `M ${x} 0 V 900 `; }
        for (let y = 0; y < 900; y += step) { pathStr += `M 0 ${y} H 1200 `; }
        
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
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '20'); line.setAttribute('y1', yPx);
            line.setAttribute('x2', '1150'); line.setAttribute('y2', yPx);
            line.setAttribute('class', 'base-line');
            layer.appendChild(line);
        });
    },

    drawPatternOutlines(data) {
        const layer = document.getElementById('layer-net-pattern');
        const S = this.SCALE;
        const b = data.back;
        const f = data.front;

        // BACK PATTERN (Closed Path)
        const backPathStr = `M ${b.napePt.x * S} ${b.napePt.y * S} ` +
            `Q ${(b.napePt.x + b.neckPt.x)/2 * S} ${b.napePt.y * S} ${b.neckPt.x * S} ${b.neckPt.y * S} ` +
            `L ${b.shoulderPt.x * S} ${b.shoulderPt.y * S} ` +
            `Q ${b.acrossPt.x * S} ${b.acrossPt.y * S} ${b.bustPt.x * S} ${b.bustPt.y * S} ` +
            `L ${b.waistPt.x * S} ${b.waistPt.y * S} ` +
            `L ${b.hipPt.x * S} ${data.depths.dHip * S} ` +
            `L ${b.centerLine * S} ${data.depths.dHip * S} Z`;

        // FRONT PATTERN (Closed Path)
        const frontPathStr = `M ${f.neckLowPt.x * S} ${f.neckLowPt.y * S} ` +
            `Q ${f.neckLowPt.x * S} ${f.neckPt.y * S} ${f.neckPt.x * S} ${f.neckPt.y * S} ` +
            `L ${f.shoulderPt.x * S} ${f.shoulderPt.y * S} ` +
            `Q ${f.acrossPt.x * S} ${f.acrossPt.y * S} ${f.bustPt.x * S} ${f.bustPt.y * S} ` +
            `L ${f.waistPt.x * S} ${f.waistPt.y * S} ` +
            `L ${f.hipPt.x * S} ${data.depths.dHip * S} ` +
            `L ${f.centerLine * S} ${data.depths.dHip * S} Z`;

        [backPathStr, frontPathStr].forEach(d => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.setAttribute('class', 'pattern-net');
            layer.appendChild(path);
        });
    },

    drawSewingDarts(data) {
        const layer = document.getElementById('layer-sewing-darts');
        const S = this.SCALE;
        const f = data.front;

        // Front Retracted Sewing Dart
        const dartPathStr = `M ${(f.apex.x - 0.75) * S} ${(data.depths.dWaist) * S} ` +
                            `L ${f.sewingApex.x * S} ${f.sewingApex.y * S} ` +
                            `L ${(f.apex.x + 0.75) * S} ${(data.depths.dWaist) * S}`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', dartPathStr);
        path.setAttribute('class', 'sewing-dart');
        layer.appendChild(path);

        // Target marker for True Apex
        const markerLayer = document.getElementById('layer-markers');
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', f.apex.x * S);
        circle.setAttribute('cy', f.apex.y * S);
        circle.setAttribute('r', 5);
        circle.setAttribute('class', 'apex-marker');
        markerLayer.appendChild(circle);
    },

    drawSeamAllowances(data) {
        const layer = document.getElementById('layer-seam-allowance');
        const S = this.SCALE;
        const offset = 0.5 * S; // 0.5 inch SA offset
        const b = data.back;

        const saStr = `M ${(b.centerLine) * S - offset} ${(data.depths.dNape) * S - offset} ` +
                      `H ${(b.hipPt.x) * S + offset} ` +
                      `V ${(data.depths.dHip) * S + offset} ` +
                      `H ${(b.centerLine) * S - offset} Z`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', saStr);
        path.setAttribute('class', 'seam-allowance');
        layer.appendChild(path);
    },

    drawCalibrationBox() {
        const layer = document.getElementById('layer-annotations');
        const S = this.SCALE;
        const boxSize = 4 * S; // 4" x 4" Box
        const x = 750, y = 40;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x); rect.setAttribute('y', y);
        rect.setAttribute('width', boxSize); rect.setAttribute('height', boxSize);
        rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#000'); rect.setAttribute('stroke-width', '1.5');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + 10); text.setAttribute('y', y + 30);
        text.setAttribute('class', 'text-annotation');
        text.textContent = 'PRINT TEST: 4" x 4" BOX';

        layer.appendChild(rect);
        layer.appendChild(text);
    }
};
