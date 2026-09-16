const DraftingEngine = {
    calculatePattern(m, ease = 1.25) {
        const bustTotal = m.B + ease;
        const waistTotal = m.W + ease;
        const hipTotal = m.H + ease;

        const depths = {
            dNape: 1.5,
            dBustAdj: 1.5 + (m.BW * 0.55),
            dWaist: 1.5 + m.BW,
            dHip: 1.5 + m.BW + m.WH
        };

        const backCenter = 10; // X reference for Back Center Line
        const backWidth = (m.BWidth / 2) + (ease * 0.25);
        const backWaistDartDist = backWidth * 0.5; // Centered relative to back waist frame

        const back = {
            centerLine: backCenter,
            napePt: { x: backCenter, y: depths.dNape },
            neckPt: { x: backCenter + 2.5, y: depths.dNape - 0.75 },
            shoulderPt: { x: backCenter + m.S + 0.5, y: depths.dNape + 0.75 },
            acrossPt: { x: backCenter + (m.BWidth / 2), y: depths.dNape + (m.BW * 0.3) },
            bustPt: { x: backCenter + (bustTotal / 4) - 0.25, y: depths.dBustAdj },
            waistPt: { x: backCenter + (waistTotal / 4) + 0.5, y: depths.dWaist },
            hipPt: { x: backCenter + (hipTotal / 4) - 0.25, y: depths.dHip },
            waistDart: {
                x: backCenter + backWaistDartDist,
                width: 1.0,
                topY: depths.dBustAdj + 1.0,
                bottomY: depths.dWaist + (m.WH * 0.6)
            },
            shoulderDart: {
                start: { x: backCenter + 2.5 + (m.S * 0.5), y: depths.dNape },
                width: 0.5,
                targetX: backCenter + backWaistDartDist,
                targetY: depths.dBustAdj - 1.0
            }
        };

        const frontCenter = 32; // X reference for Front Center Line
        const bustSpan = Math.min(3.75, (m.B / 10) + 0.25); // Anatomically true Bust Point / Apex Distance from CF

        const front = {
            centerLine: frontCenter,
            neckLowPt: { x: frontCenter, y: depths.dNape + 2.75 },
            neckPt: { x: frontCenter - 2.5, y: depths.dNape - 0.75 },
            shoulderPt: { x: frontCenter - m.S - 0.25, y: depths.dNape + 0.85 },
            acrossPt: { x: frontCenter - (m.CWidth / 2), y: depths.dNape + (m.BW * 0.3) },
            bustPt: { x: frontCenter - (bustTotal / 4) - 0.25, y: depths.dBustAdj },
            waistPt: { x: frontCenter - (waistTotal / 4) - 0.5, y: depths.dWaist },
            hipPt: { x: frontCenter - (hipTotal / 4) - 0.25, y: depths.dHip },
            apex: { x: frontCenter - bustSpan, y: depths.dBustAdj },
            waistDart: {
                x: frontCenter - bustSpan,
                width: 1.25,
                topY: depths.dBustAdj + 1.0, // Retracted from Apex for sewing
                bottomY: depths.dWaist + (m.WH * 0.5)
            }
        };

        return { depths, back, front };
    }
};
