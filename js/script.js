function parseList() {
    let input = document.getElementById('armyList').value;

    // Create an object to store the parsed sections
    let parsedList = {
        "Army Name": "",
        "Faction": "",
        "Characters": "",
        "Battleline": "",
        "Dedicated Transport": "",
        "Other": "",
        "Allies": ""
    };

    // Use regex to extract the Army Name and Faction
    const armyNameMatch = input.match(/Army Name:\s*(.*)/);
    const factionMatch = input.match(/Faction:\s*(.*)/);

    if (armyNameMatch) parsedList["Army Name"] = armyNameMatch[1];
    if (factionMatch) parsedList["Faction"] = factionMatch[1];

    // Define the sections to parse
    const sections = ["Characters", "Battleline", "Dedicated Transport", "Other", "Allies"];

    // Loop through each section and extract relevant entries
    sections.forEach(section => {
        const regex = new RegExp(`${section}:([\\s\\S]*?)(?=\\n\\n|\\n${sections.join('|')}:|$)`, 'gi');
        const sectionMatch = regex.exec(input);

        if (sectionMatch && sectionMatch[1]) {
            // Clean up the section by removing points and equipment using regex
            let cleanSection = sectionMatch[1]
                .replace(/\(\d+ points\)/g, '') // Remove points like "(100 points)"
                .replace(/,?\s*with.*$/gm, '')  // Remove equipment starting with "with..."
                .trim();

            parsedList[section] = cleanSection;
        }
    });

    // Format the parsed result into readable output
    let output = `Army Name: ${parsedList["Army Name"]}\nFaction: ${parsedList["Faction"]}\n\n`;

    sections.forEach(section => {
        if (parsedList[section].trim()) {
            output += `${section}:\n${parsedList[section]}\n\n`;
        }
    });

    // Display the parsed and cleaned up army list
    document.getElementById('output').textContent = output.trim();
}
