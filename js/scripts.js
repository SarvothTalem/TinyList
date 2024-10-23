function parseArmyList(inputText) {
    console.log("Parsing input...");

    const output = [];
    const sections = [
        { name: "Characters", label: "CHARACTERS", is_character: true },
        { name: "Battleline", label: "BATTLELINE", is_character: false },
        { name: "Dedicated Transports", label: "DEDICATED TRANSPORTS", is_character: false },
        { name: "Other Datasheets", label: "OTHER DATASHEETS", is_character: false },
        { name: "Allied Units", label: "ALLIED UNITS", is_character: false }
    ];

    const lines = inputText.split("\n").filter(line => line.trim());
    if (!lines[0] || typeof lines[0] !== "string") {
        console.error("Invalid army name. Check the input format.");
        return "Error: Invalid army name. Please check the input format.";
    }

    let armyName = lines[0].trim();
    output.push(`${armyName}`);

    let currentSection = null;

    const splitSections = inputText.split("\n\n");

    for (const section of splitSections) {
        if (sections.some(sec => sec.label === section)) {
            currentSection = sections.find(sec => sec.label === section);
            continue;
        }

        const unitLines = section.split("\n").filter(line => line.trim());
        if (unitLines.length) {
            const unitName = unitLines[0].split(" (")[0].trim();
            let totalModels = 0;

            const isCharacter = currentSection?.is_character;
            if (isCharacter) {
                totalModels = 1;  // Ensure characters are always 1 model
            }

            for (const line of unitLines.slice(1)) {
                const match = line.match(/(\d+)x/);
                if (match && !isCharacter) {
                    totalModels += parseInt(match[1]);
                }
            }

            output.push(`${unitName
