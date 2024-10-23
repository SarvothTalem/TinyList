let weapon_exclude_list = [];

// Load the weapon exclusion list from the JSON file dynamically
fetch('js/exclusion_list.json')
  .then(response => response.json())
  .then(data => {
    weapon_exclude_list = data.map(item => item.toLowerCase()); // Convert list to lowercase for case-insensitive matching
    console.log("Weapon exclusion list loaded:", weapon_exclude_list);
  })
  .catch(error => console.error('Error loading the exclusion list:', error));

// Define the parseList function
function parseList() {
    alert("Button clicked!");

    const input = document.getElementById("input").value;
    console.log("Input received:", input);

    if (!input.trim()) {
        alert("Please enter a valid army list.");
        return;
    }

    const output = parseArmyList(input);
    console.log("Output generated:", output);

    document.getElementById("output").textContent = output;
}

// Define the parseArmyList function
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
    let pointsInfo = "";

    if (armyName.includes("(") && armyName.includes(")")) {
        pointsInfo = armyName.slice(armyName.indexOf("("), armyName.indexOf(")") + 1);
        armyName = armyName.slice(0, armyName.indexOf("(")).trim();
    }

    const factionInfo = `${lines[1]?.trim() || ""} - ${lines[2]?.trim() || ""} - ${lines[4]?.trim() || ""}`;

    output.push(`${armyName} ${pointsInfo}`);
    output.push(factionInfo);

    console.log("Initial output: ", output);

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
            let enhancement = "";
            let totalModels = 0;

            // For characters, always set totalModels to 1
            const isCharacter = currentSection?.is_character;
            if (isCharacter) {
                totalModels = 1;
            }

            // Parse each unit's line
            for (const line of unitLines.slice(1)) {
                if (line.includes("Enhancement:")) {
                    enhancement = line.split("Enhancement:")[1].trim();
                }

                const match = line.match(/(\d+)x/);
                // Ensure that we are not counting weapon lines as models
                if (match && !isCharacter && !isExcludedWeapon(line)) {
                    totalModels += parseInt(match[1]);
                }
            }

            // Combine unit name with enhancement and model count
            const finalUnitName = enhancement ? `${unitName} w/ ${enhancement}` : unitName;
            output.push(totalModels > 0 ? `${finalUnitName} x${totalModels}` : finalUnitName);
        }
    }

    console.log("Final output: ", output);

    return output.join("\n");
}

// Helper function to check if a line contains an excluded weapon
function isExcludedWeapon(line) {
    const lowerCaseLine = line.toLowerCase();  // Convert line to lowercase for case-insensitive matching
    return weapon_exclude_list.some(weapon => lowerCaseLine.includes(weapon));  // Check for partial matches
}
