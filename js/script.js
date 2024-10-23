function parseList() {
    let input = document.getElementById('armyList').value;

    // Example simplification: Remove unnecessary text, group duplicates, and abbreviate
    let parsedList = input
        .replace(/(\bpoints\b.*)$/gm, '')  // Remove point breakdowns
        .replace(/\(.*?\)/g, '')           // Remove all text within parentheses
        .replace(/Unit:\s+/g, '')          // Remove "Unit:" prefix
        .replace(/[\n]{2,}/g, '\n');       // Remove extra line breaks

    document.getElementById('output').textContent = parsedList.trim();
}
