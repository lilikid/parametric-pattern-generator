/**
 * Dynamic Pattern Drafting Engine for Bodice Block
 * Fixed runtime reference error and fully integrated all trueing checks.
 */

export function calculateBodiceBlock(measurements, easeOptions = {}) {
  // 1. Extract Measurements & Apply Ease Settings
  const bustEase = easeOptions.bustEase ?? 2.0; // inches
  const waistEase = easeOptions.waistEase ?? 1.0;
  const hipEase = easeOptions.hipEase ?? 2.0;

  const bust = measurements.bust + bustEase;
  const waist = measurements.waist + waistEase;
  const hip = measurements.hip + hipEase;
  const backWidth = measurements.backWidth;
  const chestWidth = measurements.chestWidth;
  const shoulderLength = measurements.shoulderLength;
  const backNeckToWaist = measurements.backNeckToWaist;
  const waistToHip = measurements.waistToHip;

  // 2. Base Grid & Reference Lines
  const cb = 0;
  const totalWidth = bust / 2;
  const cf = totalWidth;

  const topLineY = 0;
  const bustLineY = backNeckToWaist * 0.5;
  const waistLineY = backNeckToWaist;
  const hipLineY = waistLineY + waistToHip;

  const neckWidth = ((bust / 8) + 1.25) / 2 - 0.25;
  let baseOfNeckDepth = bust > 42 ? 3.375 : (bust < 34 ? 2.75 : 3.0);
  let frontWaistDrop = bust > 42 ? 1.0 : 0.5;

  const baseOfNeckY = topLineY + baseOfNeckDepth;
  const chestLineY = bustLineY - ((bustLineY - baseOfNeckY) / 3);
  const trueBustLineY = bustLineY + 2.0;

  // Dynamic Bust Dart Width Calculation
  let bustDartWidth = 3.0 + ((bust - 36) / 2) * 0.25;
  bustDartWidth = Math.max(2.25, Math.min(4.0, bustDartWidth));

  // 3. Point Constructions

  // --- BACK BLOCK POINTS ---
  const backNeckPoint = { x: cb + neckWidth, y: topLineY };
  const backShoulderPoint = {
    x: cb + neckWidth + shoulderLength * Math.cos(15 * Math.PI / 180),
    y: topLineY + shoulderLength * Math.sin(15 * Math.PI / 180)
  };
  const backUnderarmPoint = { x: cb + (backWidth / 2) + 0.25, y: bustLineY };
  const backWaistSideX = backUnderarmPoint.x - 0.75;
  const backHipPoint = { x: cb + (hip / 4), y: hipLineY };

  // --- FRONT BLOCK POINTS ---
  const frontNeckPoint = { x: cf - neckWidth, y: topLineY };
  const baseOfNeckPoint = { x: cf, y: baseOfNeckY };

  const bustDartGuideX = cf - (chestWidth / 4);
  const trueBustPoint = { x: bustDartGuideX, y: trueBustLineY };

  // Front Shoulder Construction with Integrated Dart Trueing Check
  const frontShoulderAngle = 18 * (Math.PI / 180);
  
  const frontDartInnerLeg = {
    x: frontNeckPoint.x - 2.0 * Math.cos(frontShoulderAngle),
    y: frontNeckPoint.y + 2.0 * Math.sin(frontShoulderAngle)
  };

  const frontDartOuterLeg = {
    x: frontDartInnerLeg.x - bustDartWidth * Math.cos(frontShoulderAngle),
    y: frontDartInnerLeg.y + bustDartWidth * Math.sin(frontShoulderAngle)
  };

  const frontShoulderPoint = {
    x: frontNeckPoint.x - (shoulderLength + bustDartWidth) * Math.cos(frontShoulderAngle),
    y: frontNeckPoint.y + (shoulderLength + bustDartWidth) * Math.sin(frontShoulderAngle)
  };

  const dartFoldPeak = {
    x: (frontDartInnerLeg.x + frontDartOuterLeg.x) / 2,
    y: Math.min(frontDartInnerLeg.y, frontDartOuterLeg.y) - 0.35
  };

  // Chest & Armhole Guide Points
  const frontChestPoint = { x: cf - ((chestWidth / 2) + 0.75), y: chestLineY };
  const frontUnderarmPoint = { x: backUnderarmPoint.x, y: bustLineY };

  const spCpMidpoint = {
    x: (frontShoulderPoint.x + frontChestPoint.x) / 2 - 0.375,
    y: (frontShoulderPoint.y + frontChestPoint.y) / 2
  };

  const dropIntersection = { x: frontChestPoint.x, y: bustLineY };
  const frontArmhole45Point = {
    x: dropIntersection.x - 0.5 * Math.cos(Math.PI / 4),
    y: dropIntersection.y + 0.5 * Math.sin(Math.PI / 4)
  };

  // Waist & Side Seam Trueing
  const frontWaistSideX = frontUnderarmPoint.x + 0.5;
  const frontWaistCenterPoint = { x: cf, y: waistLineY + frontWaistDrop };

  // --- SEAM LENGTH TRUEING CHECKS ---
  const netBackShoulderLength = Math.hypot(
    backShoulderPoint.x - backNeckPoint.x,
    backShoulderPoint.y - backNeckPoint.y
  );
  const netFrontShoulderLength = Math.hypot(
    frontShoulderPoint.x - frontNeckPoint.x,
    frontShoulderPoint.y - frontNeckPoint.y
  ) - bustDartWidth;

  const shoulderSeamsMatch = Math.abs(netBackShoulderLength - netFrontShoulderLength) < 0.05;

  const backSideSeamLength = Math.hypot(backWaistSideX - backUnderarmPoint.x, waistLineY - bustLineY);
  const frontSideSeamLength = Math.hypot(frontWaistSideX - frontUnderarmPoint.x, waistLineY - bustLineY);
  const sideSeamDelta = Math.abs(backSideSeamLength - frontSideSeamLength);

  return {
    dimensions: { totalWidth, totalHeight: hipLineY },
    lines: {
      topLineY,
      chestLineY,
      bustLineY,
      trueBustLineY,
      waistLineY,
      hipLineY,
      cb,
      cf
    },
    qualityChecks: {
      shoulderSeamsMatch,
      netBackShoulderLength: netBackShoulderLength.toFixed(2),
      netFrontShoulderLength: netFrontShoulderLength.toFixed(2),
      sideSeamDelta: sideSeamDelta.toFixed(2)
    },
    back: {
      neckPoint: backNeckPoint,
      shoulderPoint: backShoulderPoint,
      underarmPoint: backUnderarmPoint,
      waistSideX: backWaistSideX,
      hipPoint: backHipPoint
    },
    front: {
      neckPoint: frontNeckPoint,
      baseOfNeck: baseOfNeckPoint,
      shoulderPoint: frontShoulderPoint,
      dartInnerLeg: frontDartInnerLeg,
      dartOuterLeg: frontDartOuterLeg,
      dartFoldPeak,
      chestPoint: frontChestPoint,
      spCpMidpoint,
      underarmPoint: frontUnderarmPoint,
      armhole45Point: frontArmhole45Point,
      trueBustPoint,
      waistCenterPoint: frontWaistCenterPoint,
      waistSideX: frontWaistSideX,
      hipPoint: { x: cf - ((hip / 4) + 1.25), y: hipLineY }
    }
  };
}
