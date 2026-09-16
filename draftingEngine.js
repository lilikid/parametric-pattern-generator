// 1. Calculate Dynamic Dart Angle Width (WDart)
const bustDifference = m.B - 32.0;
const wDart = 2.5 + (Math.max(0, bustDifference) / 2.0) * 0.25;

// 2. Calculate Dart Line X-Coordinate (XDart_Line) from Center Front
const xDartLine = 0.25 * m.CWidth;

// 3. True Anatomic Apex Position
const apexPt = {
    x: frontCenter - xDartLine,
    y: depths.dBustAdj + 2.0 // Dropped 2.0" below armscye bust line level
};

// 4. Dynamic Chest Point X Position
const dartWidthAtChestLevel = wDart * 0.4; // Proportionate width at upper chest
const xChest = (0.5 * m.CWidth) + dartWidthAtChestLevel;
