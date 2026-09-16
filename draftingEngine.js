const DraftingEngine = {
    calculatePattern(m, easeVal) {
        const B = m.B || 36.0;
        const W = m.W || 28.0;
        const H = m.H || 38.0;
        const BW = m.BW || 16.5;
        const WH = m.WH || 8.0;
        const BWidth = m.BWidth || 14.0;
        const CWidth = m.CWidth || 13.0;
        const S = m.S || 5.0;
        const E = typeof easeVal === 'number' ? easeVal : 1.0;

        // Vertical Reference Depths (Inches)
        const dNape = 2.0;
        const dBustBase = B <= 40.0 ? (0.5 * BW + 0.375) : (0.5 * BW + 0.625);
        const deltaYScye = E > 1.25 ? 0.5 * (E - 1.25) : 0;
        const dBustAdj = dNape + dBustBase + deltaYScye;
        const dWaist = dNape + BW;
        const dHip = dWaist + WH;

        // Neckline Dimensions
        const BNW = ((B / 8.0) + 1.25) / 2.0;
        const FNW = BNW;
        const FND = BNW + 0.75;

        // --- BACK BODICE ---
        const backCenterLine = 3.0;
        const backNeckPt = { x: backCenterLine + BNW, y: dNape };
        const backShoulderLen = S + 0.5; // Includes 0.5" shoulder dart
        const backShoulderPt = { x: backNeckPt.x + backShoulderLen, y: dNape + 1.25 };
        const backAcrossPt = { x: backCenterLine + (0.5 * BWidth), y: dNape + (dBustBase * 0.5) };
        const backBustPt = { x: backCenterLine + (0.25 * B) + (0.25 * E), y: dBustAdj };
        const backWaistPt = { x: backCenterLine + (0.25 * W) + (0.25 * E) + 1.0, y: dWaist };
        const backHipPt = { x: backCenterLine + (0.25 * H) + (0.25 * E), y: dHip };
        
        const backWaistDartX = backCenterLine + (0.5 * BWidth * 0.85);
        const backShoulderDartMid = {
            x: backNeckPt.x + (backShoulderLen * 0.45),
            y: backNeckPt.y + (1.25 * 0.45)
        };

        // --- FRONT BODICE ---
        const frontCenterLine = backBustPt.x + 8.5 + (0.25 * B) + (0.25 * E);
        const frontNeckPt = { x: frontCenterLine - FNW, y: dNape };
        const frontShoulderPt = { x: frontCenterLine - FNW - S, y: dNape + 1.5 };
        const frontAcrossPt = { x: frontCenterLine - (0.5 * CWidth), y: dNape + (dBustBase * 0.55) };
        const frontBustPt = { x: frontCenterLine - ((0.25 * B) + (0.25 * E)), y: dBustAdj };
        const frontWaistPt = { x: frontCenterLine - ((0.25 * W) + (0.25 * E) + 1.0), y: dWaist };
        const frontHipPt = { x: frontCenterLine - ((0.25 * H) + (0.25 * E)), y: dHip };

        const apexX = frontCenterLine - (0.25 * CWidth * 1.05);
        const apexY = dBustAdj + 0.75;

        return {
            depths: { dNape, dBustAdj, dWaist, dHip },
            back: {
                centerLine: backCenterLine,
                napePt: { x: backCenterLine, y: dNape + 0.375 },
                neckPt: backNeckPt,
                shoulderPt: backShoulderPt,
                acrossPt: backAcrossPt,
                bustPt: backBustPt,
                waistPt: backWaistPt,
                hipPt: backHipPt,
                waistDart: { 
                    x: backWaistDartX, 
                    topY: dBustAdj + 1.0, 
                    bottomY: dWaist + 5.0, 
                    width: 1.0 
                },
                shoulderDart: {
                    start: backShoulderDartMid,
                    width: 0.5,
                    length: 3.25,
                    targetX: backShoulderDartMid.x - 0.25,
                    targetY: backShoulderDartMid.y + 3.25
                }
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
                waistDart: { 
                    x: apexX, 
                    topY: apexY + 1.25, 
                    bottomY: dWaist + 4.0, 
                    width: 1.0 
                }
            }
        };
    }
};
