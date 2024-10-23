function parseList() {
    const input = document.getElementById('armyList').value;
    const unitsSection = document.getElementById('unitsSection');
    unitsSection.innerHTML = ''; // Clear any previous output

    // Regex to match unit headers and display them
    const unitRegex = /(?:\n\n)([A-Za-z\s]+)\n/g;
    let match;
    while (match = unitRegex.exec(input)) {
        const unitName = match[1].trim();

        // Create a new div to display the unit name and model count input
        const unitDiv = document.createElement('div');
        const unitLabel = document.createElement('label');
        const unitInput = document.createElement('input');
        unitLabel.innerText = `${unitName}: `;
        unitInput.type = 'number';
        unitInput.placeholder = 'Enter model count';
        unitInput.id = `modelCount_${unitName.replace(/\s+/g, '_')}`;  // Unique ID for the input

        unitDiv.appendChild(unitLabel);
        unitDiv.appendChild(unitInput);
        unitsSection.appendChild(unitDiv);
    }
}

function generateExport() {
    const input = document.getElementById('armyList').value;
    const exportedList = document.getElementById('exportedList');
    exportedList.innerHTML = ''; // Clear any previous output

    const unitRegex = /(?:\n\n)([A-Za-z\s]+)\n/g;
    let match;
    let exportContent = '';

    while (match = unitRegex.exec(input)) {
        const unitName = match[1].trim();
        const unitId = `modelCount_${unitName.replace(/\s+/g, '_')}`;
        const modelCount = document.getElementById(unitId).value || 1;  // Default to 1 if no input

        exportContent += `${unitName} x${modelCount}\n`;
    }

    exportedList.innerText = exportContent.trim();
}
