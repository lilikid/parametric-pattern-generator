const SVGRenderer = {
    SCALE: 22,

    render(data, options) {
        if (!data || !data.back || !data.front) return;
        
        this.clearLayers();
        const unit = (options && options.unit) ? options.unit : 'inch';
        
        if (!options || options.showGrid !== false) this.drawBackgroundGrid(unit);
        if (!options || options.showBaseLines !== false) this.drawBaseLines(data.depths);
        
        this.drawPatternOutlines(data);
        if (!options || options.showSewingDarts !== false) this.drawSewingDarts(data);
        if (options && options.showSA) this.drawSeamAllowances(data);
        
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
        if (!layer) return;
        
        const step = (unit === 'cm' ? 1.0 / 2.54 : 1.0) * this.SCALE;
        let pathStr = '';
        for (let x = 0; x < 1200; x += step) { pathStr += `M ${x} 0 V 850 `; }
        for (let y = 0; y < 850; y += step) { pathStr += `M 0 ${y} H 1200 `; }
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathStr);
        path.setAttribute('stroke', '#e2e8f0');
        path.setAttribute('stroke-width', '0.5');
        path.setAttribute('fill', 'none');
        layer.appendChild(path);
    },

    drawBaseLines(depths) {
        const layer = document.getElementById('layer-baselines');
        if (!layer) return;
        
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
            line.setAttribute('x2', '1100'); line.setAttribute('y2', yPx);
            line.setAttribute('stroke', '#cbd5e1');
            line.setAttribute('stroke-dasharray', '4 4');
            layer.appendChild(line);
        });
    },

    drawPatternOutlines(data) {
        const layer = document.getElementById('layer-net-pattern');
        if (!layer) return;
        
        const S = this.SCALE;
        const b = data.back;
        const f = data.front;

        // --- BACK BODICE PATH ---
        // Center back down -> Hip -> Waist -> Bust -> Armscye curve -> Shoulder -> Back Neck curve -> Center Back top
        const backPath = `M ${b.centerLine * S} ${b.napePt.y * S} ` +
            `L ${b.centerLine * S} ${data.depths.dHip * S} ` +
            `L ${b.hipPt.x * S} ${data.depths.dHip * S} ` +
            `L ${b.waistPt.x * S} ${b.waistPt.y * S} ` +
            `L ${b.bustPt.x * S} ${b.bustPt.y * S} ` +
            `C ${b.acrossPt.x * S} ${b.bustPt.y * S}, ${b.acrossPt.x * S} ${b.acrossPt.y * S}, ${b.shoulderPt.x * S} ${b.shoulderPt.y * S} ` +
            `L ${b.neckPt.x * S} ${b.neckPt.y * S} ` +
            `Q ${b.neckPt.x * S} ${b.napePt.y * S}, ${b.centerLine * S} ${b.napePt.y * S} Z`;

        // --- FRONT BODICE PATH ---
        // Center front down -> Hip -> Waist -> Bust -> Armscye curve -> Shoulder -> Front Neck curve -> Center Front neck low
        const frontPath = `M ${f.centerLine * S} ${f.neckLowPt.y * S} ` +
            `L ${f.centerLine * S} ${data.depths.dHip * S} ` +
            `L ${f.hipPt.x * S} ${data.depths.dHip * S} ` +
            `L ${f.waistPt.x * S} ${f.waistPt.y * S} ` +
            `L ${f.bustPt.x * S} ${f.bustPt.y * S} ` +
            `C ${f.acrossPt.x * S} ${f.bustPt.y * S}, ${f.acrossPt.x * S} ${f.acrossPt.y * S}, ${f.shoulderPt.x * S} ${f.shoulderPt.y * S} ` +
            `L ${f.neckPt.x * S} ${f.neckPt.y * S} ` +
            `C ${f.neckPt.x * S} ${f.neckLowPt.y * S}, ${f.centerLine * S - 0.5 * S} ${f.neckLowPt.y * S}, ${f.centerLine * S} ${f.neckLowPt.y * S} Z`;

        [backPath, frontPath].forEach(d => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.setAttribute('stroke', '#0f172a');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            layer.appendChild(path);
        });
    },

    drawSewingDarts(data) {
        const layer = document.getElementById('layer-sewing-darts');
        if (!layer) return;
        
        const S = this.SCALE;
        const f = data.front;
        const b = data.back;

        // Front Waist Dart
        const frontDartStr = `M ${(f.apex.x - 0.625) * S} ${data.depths.dWaist * S} ` +
                             `L ${f.sewingApex.x * S} ${f.sewingApex.y * S} ` +
                             `L ${(f.apex.x + 0.625) * S} ${data.depths.dWaist * S} ` +
                             `L ${f.apex.x * S} ${(data.depths.dWaist + 4.0) * S} Z`;

        // Back Waist Dart
        const backDartStr = `M ${(b.dart.x - b.dart.width / 2) * S} ${data.depths.dWaist * S} ` +
                            `L ${b.dart.x * S} ${b.dart.topY * S} ` +
                            `L ${(b.dart.x + b.dart.width / 2) * S} ${data.depths.dWaist * S} ` +
                            `L ${b.dart.x * S} ${b.dart.bottomY * S} Z`;

        [frontDartStr, backDartStr].forEach(dStr => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', dStr);
            path.setAttribute('stroke', '#2563eb');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('stroke-dasharray', '3 3');
            path.setAttribute('fill', 'none');
            layer.appendChild(path);
        });

        // Apex Marker
        const markerLayer = document.getElementById('layer-markers');
        if (markerLayer) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', f.apex.x * S);
            circle.setAttribute('cy', f.apex.y * S);
            circle.setAttribute('r', 4);
            circle.setAttribute('fill', '#ef4444');
            markerLayer.appendChild(circle);
        }
    },

    drawSeamAllowances(data) {
        const layer = document.getElementById('layer-seam-allowance');
        if (!layer) return;
        
        const S = this.SCALE;
        const offset = 0.5 * S;
        const b = data.back;
        const f = data.front;

        // Back Outer Bounds Offset
        const backSA = `M ${(b.centerLine) * S - offset} ${(data.depths.dNape) * S - offset} ` +
                       `H ${(b.bustPt.x) * S + offset} ` +
                       `V ${(data.depths.dHip) * S + offset} ` +
                       `H ${(b.centerLine) * S - offset} Z`;

        // Front Outer Bounds Offset
        const frontSA = `M ${(f.centerLine) * S + offset} ${(data.depths.dNape) * S - offset} ` +
                        `H ${(f.bustPt.x) * S - offset} ` +
                        `V ${(data.depths.dHip) * S + offset} ` +
                        `H ${(f.centerLine) * S + offset} Z`;

        [backSA, frontSA].forEach(saStr => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', saStr);
            path.setAttribute('stroke', '#94a3b8');
            path.setAttribute('stroke-dasharray', '2 2');
            path.setAttribute('fill', 'none');
            layer.appendChild(path);
        });
    },

    drawCalibrationBox() {
        const layer = document.getElementById('layer-annotations');
        if (!layer) return;
        
        const S = this.SCALE;
        const boxSize = 4 * S;
        const x = 900, y = 30;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x); rect.setAttribute('y', y);
        rect.setAttribute('width', boxSize); rect.setAttribute('height', boxSize);
        rect.setAttribute('fill', 'none'); 
        rect.setAttribute('stroke', '#000'); 
        rect.setAttribute('stroke-width', '1');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + 5); 
        text.setAttribute('y', y + 20);
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#000');
        text.textContent = 'TEST BOX: 4" x 4"';

        layer.appendChild(rect);
        layer.appendChild(text);
    }
};
