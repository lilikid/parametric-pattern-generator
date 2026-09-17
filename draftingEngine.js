// Helper to visually render any drafting point and its label on the SVG
function drawDraftingPoint(container, point) {
    // 1. Draw point marker (circle)
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', '3.5');
    circle.setAttribute('fill', '#c25e6f');
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', '1.5');
    container.appendChild(circle);

    // 2. Draw point label text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', point.x + 8);
    text.setAttribute('y', point.y - 4);
    text.setAttribute('fill', '#c25e6f');
    text.setAttribute('font-family', 'Montserrat');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '700');
    text.textContent = point.label;
    container.appendChild(text);
}
