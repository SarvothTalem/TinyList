function parseList() {
    let input = document.getElementById('armyList').value;

    // Create an object to store the parsed sections
    let parsedList = {
        "Army Name": "",
        "Faction": "",
        "Characters": "",
        "Battleline": "",
        "Dedicated Transport": "",
        "Other Datasheets": "",
        "Allied Units": ""
    };

    // Extract Army Name and Points
    const armyNameMatch = input.match(/^(.*) \((\d+) points\)/i);
    if (armyNameMatch) {
        parsedList["Army Name"] = armyNameMatch[1].trim();
    }

    // Extract Faction
    const factionMatch = input.match(/^(.+)\n(.+) \((\d+) points\)\n(.+)/i);
    if (factionMatch) {
        parsedList["Faction"] = `${factionMatch[1].trim()}, ${factionMatch[2].trim()}`;
    }

    // Define sections and their labels
    const sections = [
        { name: "Characters", label: "CHARACTERS" },
        { name: "Battleline", label: "BATTLELINE" },
        { name: "Dedicated Transport", label: "DEDICATED TRANSPORTS" },
        { name: "Other Datasheets", label: "OTHER DATASHEETS" },
        { name: "Allied Units", label: "ALLIED UNITS" }
    ];

    // Loop through each section and extract the corresponding entries
    sections.forEach(section => {
        const regex = new RegExp(`${section.label}:([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
        const sectionMatch = regex.exec(input);

        if (sectionMatch && sectionMatch[1]) {
            // Clean up section: remove points and equipment
            let cleanSection = sectionMatch[1]
                .replace(/\(\d+\s*points\)/gi, '') // Remove points
                .replace(/•\s*\d+x\s*.*/gi, '')    // Remove equipment lines (e.g., "• 1x Chainsword")
                .trim();

            parsedList[section.name] = cleanSection;
        }
    });

    // Format the output
    let output = `Army Name: ${parsedList["Army Name"]}\nFaction: ${parsedList["Faction"]}\n\n`;

    sections.forEach(section => {
        if (parsedList[section.name].trim()) {
            output += `${section.name}:\n${parsedList[section.name]}\n\n`;
        }
    });

    // Display the parsed and cleaned-up army list
    document.getElementById('output').textContent = output.trim();
}
