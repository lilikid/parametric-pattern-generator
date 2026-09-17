/**
 * Dynamic SVG Render Engine with Visual Trueing Indicators
 */

export function renderPatternSVG(draftData, scale = 20) {
  const d = draftData;
  const w = (d.dimensions.totalWidth + 4) * scale;
  const h = (d.dimensions.totalHeight + 6) * scale;
  const ox = 2 * scale;
  const oy = 2 * scale;

  const px = (val) => ox + val * scale;
  const py = (val) => oy + val * scale;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="background:#fff;">`;
  
  svg += `
    <style>
      .grid-line { stroke: #e0e0e0; stroke-dasharray: 4,4; stroke-width: 1; }
      .pattern-line { stroke: #111111; stroke-width: 2; fill: none; }
      .trued-line { stroke: #0275d8; stroke-width: 2; fill: none; }
      .guide-line { stroke: #d9534f; stroke-dasharray: 3,3; stroke-width: 1.5; fill: none; }
      .point { fill: #d9534f; }
      .check-pass { fill: #2e7d32; font-weight: bold; }
      .label { font-family: sans-serif; font-size: 11px; fill: #333; }
    </style>
  `;

  const lines = d.lines;
  const back = d.back;
  const front = d.front;

  // Grid Lines
  svg += `<line class="grid-line" x1="${px(lines.cb)}" y1="${py(lines.bustLineY)}" x2="${px(lines.cf)}" y2="${py(lines.bustLineY)}" />`;
  svg += `<line class="grid-line" x1="${px(lines.cb)}" y1="${py(lines.waistLineY)}" x2="${px(lines.cf)}" y2="${py(lines.waistLineY)}" />`;
  svg += `<line class="grid-line" x1="${px(lines.cb)}" y1="${py(lines.hipLineY)}" x2="${px(lines.cf)}" y2="${py(lines.hipLineY)}" />`;

  // Center Back / Center Front
  svg += `<line class="pattern-line" x1="${px(lines.cb)}" y1="${py(lines.topLineY)}" x2="${px(lines.cb)}" y2="${py(lines.hipLineY)}" />`;
  svg += `<line class="pattern-line" x1="${px(lines.cf)}" y1="${py(lines.topLineY)}" x2="${px(lines.cf)}" y2="${py(front.waistCenterPoint.y)}" />`;

  // --- BACK SHOULDER SEAM & DART TRUEING ---
  // Assuming back points 3, 4, 1, and 2 are provided in back data structure
  const p3 = back.shDartInner || { x: back.neckPoint.x + 1.5, y: back.neckPoint.y };
  const p4 = back.shDartOuter || { x: back.neckPoint.x + 2.2, y: back.neckPoint.y };
  const apex = back.shDartApex || { x: p3.x + 0.3, y: p3.y + 2.5 };
  
  // Baseline points 1 and 2 across the dart opening base
  const pt1 = back.dartBasePoint1 || { x: p3.x, y: p3.y + 0.25 };
  const pt2 = back.dartBasePoint2 || { x: p4.x, y: p4.y + 0.25 };

  // Back Shoulder Lines & Dart Legs
  svg += `<line class="trued-line" x1="${px(back.neckPoint.x)}" y1="${py(back.neckPoint.y)}" x2="${px(p3.x)}" y2="${py(p3.y)}" />`;
  svg += `<line class="trued-line" x1="${px(p3.x)}" y1="${py(p3.y)}" x2="${px(apex.x)}" y2="${py(apex.y)}" />`;
  svg += `<line class="trued-line" x1="${px(apex.x)}" y1="${py(apex.y)}" x2="${px(p4.x)}" y2="${py(p4.y)}" />`;
  svg += `<line class="trued-line" x1="${px(p4.x)}" y1="${py(p4.y)}" x2="${px(back.shoulderPoint.x)}" y2="${py(back.shoulderPoint.y)}" />`;

  // VISIBLE RED LINE 1-2 ACROSS DART BASE
  svg += `<line class="guide-line" x1="${px(pt1.x)}" y1="${py(pt1.y)}" x2="${px(pt2.x)}" y2="${py(pt2.y)}" />`;

  // --- FRONT SHOULDER SEAM & DART TRUEING ---
  svg += `<line class="trued-line" x1="${px(front.neckPoint.x)}" y1="${py(front.neckPoint.y)}" x2="${px(front.dartInnerLeg.x)}" y2="${py(front.dartInnerLeg.y)}" />`;
  svg += `<line class="trued-line" x1="${px(front.dartInnerLeg.x)}" y1="${py(front.dartInnerLeg.y)}" x2="${px(front.dartFoldPeak.x)}" y2="${py(front.dartFoldPeak.y)}" />`;
  svg += `<line class="trued-line" x1="${px(front.dartFoldPeak.x)}" y1="${py(front.dartFoldPeak.y)}" x2="${px(front.dartOuterLeg.x)}" y2="${py(front.dartOuterLeg.y)}" />`;
  svg += `<line class="trued-line" x1="${px(front.dartOuterLeg.x)}" y1="${py(front.dartOuterLeg.y)}" x2="${px(front.shoulderPoint.x)}" y2="${py(front.shoulderPoint.y)}" />`;

  // Closed Shoulder Straight Trueing Reference
  svg += `<line class="guide-line" x1="${px(front.neckPoint.x)}" y1="${py(front.neckPoint.y)}" x2="${px(front.shoulderPoint.x)}" y2="${py(front.shoulderPoint.y)}" />`;

  // Dart Legs to Bust Apex
  svg += `<line class="pattern-line" x1="${px(front.dartInnerLeg.x)}" y1="${py(front.dartInnerLeg.y)}" x2="${px(front.trueBustPoint.x)}" y2="${py(front.trueBustPoint.y)}" />`;
  svg += `<line class="pattern-line" x1="${px(front.dartOuterLeg.x)}" y1="${py(front.dartOuterLeg.y)}" x2="${px(front.trueBustPoint.x)}" y2="${py(front.trueBustPoint.y)}" />`;

  // --- NECKLINES ---
  const backNeck = `M ${px(lines.cb)} ${py(lines.topLineY)} Q ${px(back.neckPoint.x - 0.5)} ${py(lines.topLineY + 0.5)}, ${px(back.neckPoint.x)} ${py(back.neckPoint.y)}`;
  svg += `<path class="pattern-line" d="${backNeck}" />`;

  const frontNeck = `M ${px(front.neckPoint.x)} ${py(front.neckPoint.y)} Q ${px(front.neckPoint.x)} ${py(front.baseOfNeck.y)}, ${px(front.baseOfNeck.x)} ${py(front.baseOfNeck.y)}`;
  svg += `<path class="pattern-line" d="${frontNeck}" />`;

  // --- FRONT ARMHOLE CURVE ---
  const frontArmhole = `M ${px(front.shoulderPoint.x)} ${py(front.shoulderPoint.y)}
                        Q ${px(front.spCpMidpoint.x)} ${py(front.spCpMidpoint.y)}, ${px(front.chestPoint.x)} ${py(front.chestPoint.y)}
                        Q ${px(front.armhole45Point.x)} ${py(front.armhole45Point.y)}, ${px(front.underarmPoint.x)} ${py(front.underarmPoint.y)}`;
  svg += `<path class="trued-line" d="${frontArmhole}" />`;

  // Side Seam Curve
  const sideSeamPath = `M ${px(front.underarmPoint.x)} ${py(lines.bustLineY)}
                        Q ${px(front.underarmPoint.x)} ${py(lines.trueBustLineY)}, ${px(front.waistSideX)} ${py(lines.waistLineY)}`;
  svg += `<path class="trued-line" d="${sideSeamPath}" />`;

  // --- VERIFICATION BOX ---
  const checks = d.qualityChecks;
  svg += `
    <g transform="translate(${px(lines.cb + 0.5)}, ${py(lines.hipLineY + 0.5)})">
      <rect width="280" height="75" fill="#f8f9fa" stroke="#ccc" rx="4" />
      <text x="10" y="20" class="label" style="font-weight:bold;">Pattern Verification Checks:</text>
      <text x="10" y="42" class="label">Shoulder Lengths Match: <tspan class="check-pass">${checks.shoulderSeamsMatch ? 'PASS ✓' : 'FAIL ✗'}</tspan> (${checks.netBackShoulderLength}" / ${checks.netFrontShoulderLength}")</text>
      <text x="10" y="60" class="label">Side Seam Alignment Delta: <tspan class="check-pass">${checks.sideSeamDelta < 0.1 ? 'PASS ✓' : 'ADJUST ⚠'}</tspan> (${checks.sideSeamDelta}")</text>
    </g>
  `;

  svg += `</svg>`;
  return svg;
}
