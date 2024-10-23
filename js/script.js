function parseList() {
    let input = document.getElementById('armyList').value;

    // Create an object to store the parsed sections
    let parsedList = {
        "Army Header": "", // This will store the Army Name and faction-related details
        "Characters": "",
        "Battleline": "",
        "Dedicated Transport": "",
        "Other Datasheets": "",
        "Allied Units": ""
    };

    // Extract Army Header (Line 1 + Lines 3-5)
    const armyHeaderMatch = input.match(/^(.*)\n\n(.*)\n(.*)\n(.*)/i);
    if (armyHeaderMatch) {
        // Combine Lines 3, 4, and 5 for output
        parsedList["Army Header"] = `${armyHeaderMatch[1].trim()}\n${armyHeaderMatch[2].trim()} - ${armyHeaderMatch[3].trim()} - ${armyHeaderMatch[4].trim()}`;
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
        const regex = new RegExp(`${section.label}([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
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

    // Format the output (Army Header + Sections)
    let output = `${parsedList["Army Header"]}\n\n`;

    sections.forEach(section => {
        if (parsedList[section.name].trim()) {
            output += `${section.name}:\n${parsedList[section.name]}\n\n`;
        }
    });

    // Display the parsed and cleaned-up army list
    document.getElementById('output').textContent = output.trim();
}
