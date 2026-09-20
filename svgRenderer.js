const DraftingEngine = {
    calculatePattern(m, E) {
        // 1. Vertical Base Lines
        const dNape = 2.0;
        const dBustBase = m.B <= 40.0 ? (0.5 * m.BW + 0.375) : (0.5 * m.BW + 0.625);
        const deltaYScye = E > 1.25 ? 0.5 * (E - 1.25) : 0;
        const dBustAdj = dNape + dBustBase + deltaYScye;
        const dWaist = dNape + m.BW;
        const dHip = dWaist + m.WH;

        // 2. Proportional Calculations
        const BNW = ((m.B / 8.0) + 1.25) / 2.0;
        const FNW = BNW - 0.25;
        const FND = BNW + 0.5; // True front neck drop ratio

        // Bust Dart Width Calculation (approx 1/8th bust difference)
        const bustDartWidth = Math.max(1.5, (m.B - 32) * 0.125 + 1.5);

        // 3. BACK BODICE BLOCK (Origin X: 3.0 inches)
        const backOriginX = 3.0;
        const backCenterLine = backOriginX;
        const backNeckPt = { x: backCenterLine + BNW, y: dNape - 0.625 };
        const backShoulderPt = { x: backNeckPt.x + m.S, y: dNape + 1.0 };
        const backAcrossPt = { x: backCenterLine + (0.5 * m.BWidth), y: dNape + (dBustBase * 0.5) };
        const backBustPt = { x: backCenterLine + (0.25 * m.B) + (0.25 * E), y: dBustAdj };
        const backWaistPt = { x: backCenterLine + (0.25 * m.W) + (0.25 * E) + 1.0, y: dWaist };
        const backHipPt = { x: backCenterLine + (0.25 * m.H) + (0.25 * E), y: dHip };

        // Back Waist Dart
        const backDartX = backCenterLine + (BNW * 1.1);
        const backDartTopY = dBustAdj + 1.0;
        const backDartBottomY = dWaist + 4.0;

        // 4. FRONT BODICE BLOCK (Origin X: 22.0 inches)
        const frontOriginX = 22.0;
        const frontCenterLine = frontOriginX + (0.25 * m.B) + (0.25 * E);
        
        // Apex Setup
        const apexX = frontCenterLine - (0.25 * m.CWidth);
        const apexY = dBustAdj + 1.5;
        const retractedApexY = apexY + 0.8;

        // Front Neck & Shoulder with Bust Dart Gap
        const frontNeckPt = { x: frontCenterLine - FNW, y: dNape };
        const frontShoulderPt1 = { x: frontNeckPt.x - (m.S * 0.4), y: dNape + 0.5 };
        const frontShoulderPt2 = { x: frontShoulderPt1.x - bustDartWidth, y: dNape + 0.5 };
        const frontShoulderEndPt = { x: frontNeckPt.x - m.S - bustDartWidth, y: dNape + 1.5 };

        const frontAcrossPt = { x: frontCenterLine - (0.5 * m.CWidth), y: dNape + (dBustBase * 0.5) };
        const frontBustPt = { x: frontOriginX, y: dBustAdj };
        const frontWaistPt = { x: frontOriginX + 0.75, y: dWaist };
        const frontHipPt = { x: frontOriginX, y: dHip };

        return {
            depths: { dNape, dBustAdj, dWaist, dHip },
            back: {
                centerLine: backCenterLine,
                napePt: { x: backCenterLine, y: dNape },
                neckPt: backNeckPt,
                shoulderPt: backShoulderPt,
                acrossPt: backAcrossPt,
                bustPt: backBustPt,
                waistPt: backWaistPt,
                hipPt: backHipPt,
                dart: { x: backDartX, topY: backDartTopY, bottomY: backDartBottomY, width: 1.0 }
            },
            front: {
                centerLine: frontCenterLine,
                neckTopPt: { x: frontCenterLine, y: dNape },
                neckLowPt: { x: frontCenterLine, y: dNape + FND },
                neckPt: frontNeckPt,
                shoulder1: frontShoulderPt1,
                shoulder2: frontShoulderPt2,
                shoulderEnd: frontShoulderEndPt,
                acrossPt: frontAcrossPt,
                bustPt: frontBustPt,
                waistPt: frontWaistPt,
                hipPt: frontHipPt,
                apex: { x: apexX, y: apexY },
                sewingApex: { x: apexX, y: retractedApexY }
            }
        };
    }
};
