const SVGRenderer = {
    SCALE: 22, // 22 pixels per inch

    render(data, options) {
        if (!data || !data.back || !data.front) return;
        
        this.clearLayers();
        const unit = (options && options.unit) ? options.unit : 'inch';
        
        if (!options || options.showGrid !== false) {
            this.drawBackgroundGrid(unit, options.showSubdivisions !== false);
        }
        if (!options || options.showBaseLines !== false) {
            this.drawBaseLines(data.depths, data.back.centerLine, data.front.centerLine);
        }
        
        this.drawPatternOutlines(data);
        if (!options || options.showSewingDarts !== false) this.drawSewingDarts(data);
        if (!options || options.showApex !== false) this.drawApexMarker(data.front.apex);
        if (options && options.showSA) this.drawSeamAllowances(data);
        
        this.drawAnnotationsAndMarkers(data);
        this.drawCalibrationBox();
    },

    clearLayers() {
        const layers = ['layer-bg-grid', 'layer-baselines', 'layer-construction', 'layer-sewing-darts', 'layer-net-pattern', 'layer-seam-allowance', 'layer-markers', 'layer-annotations'];
        layers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
    },

    drawBackgroundGrid(unit, showSubdivisions) {
        const layer = document.getElementById('layer-bg-grid');
        if (!layer) return;

        let minorStep, majorStep;
        if (unit === 'cm') {
            minorStep = (1.0 / 2.54) * this.SCALE; // 1 cm
            majorStep = (5.0 / 2.54) * this.SCALE; // 5 cm
        } else {
            minorStep = (0.125) * this.SCALE;     // 1/8 inch
            majorStep = (1.0) * this.SCALE;       // 1 inch
        }

        let minorPath = '';
        let majorPath = '';

        for (let x = 0; x <= 1200; x += minorStep) {
            const isMajor = Math.abs(x % majorStep) < 0.1 || Math.abs(majorStep - (x % majorStep)) < 0.1;
            if (isMajor) {
                majorPath += `M ${x} 0 V 850 `;
            } else if (showSubdivisions) {
                minorPath += `M ${x} 0 V 850 `;
            }
        }

        for (let y = 0; y <= 850; y += minorStep) {
            const isMajor = Math.abs(y % majorStep) < 0.1 || Math.abs(majorStep - (y % majorStep)) < 0.1;
            if (isMajor) {
                majorPath += `M 0 ${y} H 1200 `;
            } else if (showSubdivisions) {
                minorPath += `M 0 ${y} H 1200 `;
            }
        }

        if (showSubdivisions && minorPath !== '') {
            const pathMinor = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathMinor.setAttribute('d', minorPath);
            pathMinor.setAttribute('stroke', '#f1f5f9');
            pathMinor.setAttribute('stroke-width', '0.5');
            pathMinor.setAttribute('fill', 'none');
            layer.appendChild(pathMinor);
        }

        if (majorPath !== '') {
            const pathMajor = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathMajor.setAttribute('d', majorPath);
            pathMajor.setAttribute('stroke', '#cbd5e1');
            pathMajor.setAttribute('stroke-width', '1.0');
            pathMajor.setAttribute('fill', 'none');
            layer.appendChild(pathMajor);
        }
    },

    drawBaseLines(depths, backCenter, frontCenter) {
        const layer = document.getElementById('layer-baselines');
        if (!layer) return;
        
        const lines = [
            { name: 'NAPE LINE', y: depths.dNape },
            { name: 'BUST LINE', y: depths.dBustAdj },
            { name: 'WAIST LINE', y: depths.dWaist },
            { name: 'HIP LINE', y: depths.dHip }
        ];

        lines.forEach(l => {
            const yPx = l.y * this.SCALE;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '40'); line.setAttribute('y1', yPx);
            line.setAttribute('x2', '1100'); line.setAttribute('y2', yPx);
            line.setAttribute('stroke', '#64748b');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '6 4');
            layer.appendChild(line);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', '45');
            label.setAttribute('y', yPx - 4);
            label.setAttribute('font-size', '9');
            label.setAttribute('font-weight', '600');
            label.setAttribute('fill', '#475569');
            label.textContent = l.name;
            layer.appendChild(label);
        });
    },

    drawPatternOutlines(data) {
        const layer = document.getElementById('layer-net-pattern');
        if (!layer) return;
        
        const S = this.SCALE;
        const b = data.back;
        const f = data.front;

        const backPath = `M ${b.centerLine * S} ${b.napePt.y * S} ` +
            `L ${b.centerLine * S} ${data.depths.dHip * S} ` +
            `L ${b.hipPt.x * S} ${data.depths.dHip * S} ` +
            `L ${b.waistPt.x * S} ${b.waistPt.y * S} ` +
            `L ${b.bustPt.x * S} ${b.bustPt.y * S} ` +
            `C ${b.acrossPt.x * S} ${b.bustPt.y * S}, ${b.acrossPt.x * S} ${b.acrossPt.y * S}, ${b.shoulderPt.x * S} ${b.shoulderPt.y * S} ` +
            `L ${b.neckPt.x * S} ${b.neckPt.y * S} ` +
            `Q ${b.centerLine * S + (b.neckPt.x - b.centerLine) * S * 0.4} ${b.napePt.y * S}, ${b.centerLine * S} ${b.napePt.y * S} Z`;

        const frontPath = `M ${f.centerLine * S} ${f.neckLowPt.y * S} ` +
            `L ${f.centerLine * S} ${data.depths.dHip * S} ` +
            `L ${f.hipPt.x * S} ${data.depths.dHip * S} ` +
            `L ${f.waistPt.x * S} ${f.waistPt.y * S} ` +
            `L ${f.bustPt.x * S} ${f.bustPt.y * S} ` +
            `C ${f.acrossPt.x * S} ${f.bustPt.y * S}, ${f.acrossPt.x * S} ${f.acrossPt.y * S}, ${f.shoulderPt.x * S} ${f.shoulderPt.y * S} ` +
            `L ${f.neckPt.x * S} ${f.neckPt.y * S} ` +
            `C ${f.neckPt.x * S} ${f.neckLowPt.y * S}, ${f.centerLine * S - (f.centerLine - f.neckPt.x) * S * 0.8} ${f.neckLowPt.y * S}, ${f.centerLine * S} ${f.neckLowPt.y * S} Z`;

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

        const frontDartStr = `M ${(f.waistDart.x - f.waistDart.width / 2) * S} ${data.depths.dWaist * S} ` +
                             `L ${f.waistDart.x * S} ${f.waistDart.topY * S} ` +
                             `L ${(f.waistDart.x + f.waistDart.width / 2) * S} ${data.depths.dWaist * S} ` +
                             `L ${f.waistDart.x * S} ${f.waistDart.bottomY * S} Z`;

        const backWaistDartStr = `M ${(b.waistDart.x - b.waistDart.width / 2) * S} ${data.depths.dWaist * S} ` +
                                 `L ${b.waistDart.x * S} ${b.waistDart.topY * S} ` +
                                 `L ${(b.waistDart.x + b.waistDart.width / 2) * S} ${data.depths.dWaist * S} ` +
                                 `L ${b.waistDart.x * S} ${b.waistDart.bottomY * S} Z`;

        const sDart = b.shoulderDart;
        const halfW = sDart.width / 2;
        const backShoulderDartStr = `M ${(sDart.start.x - halfW) * S} ${sDart.start.y * S} ` +
                                    `L ${sDart.targetX * S} ${sDart.targetY * S} ` +
                                    `L ${(sDart.start.x + halfW) * S} ${sDart.start.y * S}`;

        [frontDartStr, backWaistDartStr, backShoulderDartStr].forEach(dStr => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', dStr);
            path.setAttribute('stroke', '#2563eb');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('stroke-dasharray', '3 3');
            path.setAttribute('fill', 'none');
            layer.appendChild(path);
        });
    },

    drawApexMarker(apex) {
        const markerLayer = document.getElementById('layer-markers');
        if (!markerLayer) return;
        const S = this.SCALE;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', apex.x * S);
        circle.setAttribute('cy', apex.y * S);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', '#ef4444');
        markerLayer.appendChild(circle);
    },

    drawSeamAllowances(data) {
        const layer = document.getElementById('layer-seam-allowance');
        if (!layer) return;
        
        const S = this.SCALE;
        const sa = 0.5 * S;
        const b = data.back;
        const f = data.front;

        // Curved seam allowance for Back Neckline and Front Neckline
        const backSA = `M ${(b.centerLine) * S - sa} ${(b.napePt.y) * S - sa} ` +
                       `L ${(b.centerLine) * S - sa} ${(data.depths.dHip) * S + sa} ` +
                       `L ${(b.hipPt.x) * S + sa} ${(data.depths.dHip) * S + sa} ` +
                       `L ${(b.waistPt.x) * S + sa} ${(b.waistPt.y) * S} ` +
                       `L ${(b.bustPt.x) * S + sa} ${(b.bustPt.y) * S} ` +
                       `C ${(b.acrossPt.x) * S + sa} ${(b.bustPt.y) * S}, ${(b.acrossPt.x) * S + sa} ${(b.acrossPt.y) * S}, ${(b.shoulderPt.x) * S + sa} ${(b.shoulderPt.y) * S - sa} ` +
                       `L ${(b.neckPt.x) * S} ${(b.neckPt.y) * S - sa} ` +
                       `Q ${(b.centerLine * S + (b.neckPt.x - b.centerLine) * S * 0.4)} ${(b.napePt.y * S - sa)}, ${(b.centerLine) * S - sa} ${(b.napePt.y) * S - sa} Z`;

        const frontSA = `M ${(f.centerLine) * S + sa} ${(f.neckLowPt.y) * S} ` +
                        `L ${(f.centerLine) * S + sa} ${(data.depths.dHip) * S + sa} ` +
                        `L ${(f.hipPt.x) * S - sa} ${(data.depths.dHip) * S + sa} ` +
                        `L ${(f.waistPt.x) * S - sa} ${(f.waistPt.y) * S} ` +
                        `L ${(f.bustPt.x) * S - sa} ${(f.bustPt.y) * S} ` +
                        `C ${(f.acrossPt.x) * S - sa} ${(f.bustPt.y) * S}, ${(f.acrossPt.x) * S - sa} ${(f.acrossPt.y) * S}, ${(f.shoulderPt.x) * S - sa} ${(f.shoulderPt.y) * S - sa} ` +
                        `L ${(f.neckPt.x) * S} ${(f.neckPt.y) * S - sa} ` +
                        `C ${(f.neckPt.x) * S - sa} ${(f.neckLowPt.y) * S}, ${(f.centerLine * S - (f.centerLine - f.neckPt.x) * S * 0.8)} ${(f.neckLowPt.y) * S + sa}, ${(f.centerLine) * S + sa} ${(f.neckLowPt.y) * S} Z`;

        [backSA, frontSA].forEach(saStr => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', saStr);
            path.setAttribute('stroke', '#64748b');
            path.setAttribute('stroke-width', '1');
            path.setAttribute('stroke-dasharray', '3 3');
            path.setAttribute('fill', 'none');
            layer.appendChild(path);
        });
    },

    drawAnnotationsAndMarkers(data) {
        const layer = document.getElementById('layer-annotations');
        if (!layer) return;

        const S = this.SCALE;
        const f = data.front;
        const b = data.back;

        const backGrainX = (b.centerLine + 1.5) * S;
        const frontGrainX = (f.centerLine - 1.5) * S;
        const topY = (data.depths.dBustAdj + 0.5) * S;
        const bottomY = (data.depths.dWaist + 3.0) * S;

        [backGrainX, frontGrainX].forEach(gx => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', gx); line.setAttribute('y1', topY);
            line.setAttribute('x2', gx); line.setAttribute('y2', bottomY);
            line.setAttribute('stroke', '#475569');
            line.setAttribute('stroke-width', '1');
            layer.appendChild(line);
        });

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', f.centerLine * S + 8);
        text.setAttribute('y', (data.depths.dWaist) * S);
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#0284c7');
        text.setAttribute('transform', `rotate(90, ${f.centerLine * S + 8}, ${(data.depths.dWaist) * S})`);
        text.textContent = 'CENTER FRONT - PLACE ON FOLD';
        layer.appendChild(text);
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
