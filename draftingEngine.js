const DraftingEngine = {
    calculatePattern(m, E) {
        // 1. Scye depth adjustment
        const deltaYScye = E > 1.25 ? 0.5 * (E - 1.25) : 0;

        // 2. Vertical Base Reference Depths
        const dNape = 2.0; // Start 2 inches from canvas top
        const dBustBase = m.B <= 40.0 ? (0.5 * m.BW + 0.375) : (0.5 * m.BW + 0.625);
        const dBustAdj = dNape + dBustBase + deltaYScye;
        const dWaist = dNape + m.BW;
        const dHip = dWaist + m.WH;

        // 3. Neckline Dimensions
        const BNW = ((m.B / 8.0) + 1.25) / 2.0;
        const FNW = BNW - 0.25;
        const FND = 3.0; // Front neck drop

        // 4. BACK BODICE BLOCK (Origin X: 3.0 inches)
        const backOriginX = 3.0;
        const backCenterLine = backOriginX;
        const backNeckPt = { x: backOriginX + BNW, y: dNape - 0.75 };
        const backShoulderPt = { x: backNeckPt.x + m.S, y: dNape + 1.25 };
        const backAcrossPt = { x: backOriginX + (0.5 * m.BWidth), y: dNape + (dBustBase * 0.5) };
        const backBustPt = { x: backOriginX + (0.25 * m.B) + (0.25 * E), y: dBustAdj };
        const backWaistPt = { x: backOriginX + (0.25 * m.W) + (0.25 * E) + 1.0, y: dWaist }; // +1" back dart
        const backHipPt = { x: backOriginX + (0.25 * m.H) + (0.25 * E), y: dHip };

        // 5. FRONT BODICE BLOCK (Origin X: 22.0 inches)
        const frontOriginX = 22.0;
        const frontCenterLine = frontOriginX + (0.25 * m.B) + (0.25 * E);
        const frontNeckPt = { x: frontCenterLine - FNW, y: dNape };
        const frontShoulderPt = { x: frontNeckPt.x - m.S, y: dNape + 1.75 };
        const frontAcrossPt = { x: frontCenterLine - (0.5 * m.CWidth), y: dNape + (dBustBase * 0.5) };
        const frontBustPt = { x: frontOriginX, y: dBustAdj };
        const frontWaistPt = { x: frontOriginX + 0.5, y: dWaist };
        const frontHipPt = { x: frontOriginX, y: dHip };

        // Apex Point & Sewing Dart Coordinates
        const apexX = frontCenterLine - (0.25 * m.CWidth);
        const apexY = dBustAdj + 1.5;
        const retractedApexY = apexY + 0.8;

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
                hipPt: backHipPt
            },
            front: {
                centerLine: frontCenterLine,
                neckTopPt: { x: frontCenterLine, y: dNape },
                neckLowPt: { x: frontCenterLine, y: dNape + FND },
                neckPt: frontNeckPt,
                shoulderPt: frontShoulderPt,
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
