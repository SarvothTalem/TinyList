let weapon_exclude_list = [];

// Load the weapon exclusion list from the JSON file dynamically
fetch('js/exclusion_list.json')
  .then(response => response.json())
  .then(data => {
    weapon_exclude_list = data.map(item => item.toLowerCase());  // Convert list to lowercase for case-insensitive matching
    console.log("Weapon exclusion list loaded:", weapon_exclude_list);
  })
  .catch(error => console.error('Error loading the exclusion list:', error));

// Define the parseList function
function parseList() {
    alert("Button clicked!");

    const input = document.getElementById("input").value;
    console.log("Input received:", input);  // Check if input is being passed correctly
    
    if (!input.trim()) {
        alert("Please enter a valid army list.");
        return;
    }

    const output = parseArmyList(input);
    console.log("Output generated:", output);  // Check if the parsing works

    document.getElementById("output").textContent = output;  // Display the output in the <pre> element
}

// Define the parseArmyList function
function parseArmyList(inputText) {
    console.log("Parsing input...");

    // Filter out empty lines and the "Exported with App Version" line
    const lines = inputText
        .split("\n")
        .filter(line => line.trim() && !line.startsWith("Exported with App Version"));

    console.log("Filtered lines:", lines);  // Check if the exported line is properly removed

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

    // Combine the relevant faction information (lines 1, 2, and 4) without repeating headers
    const factionInfo = `${lines[1]?.trim() || ""} - ${lines[2]?.trim() || ""} - ${lines[4]?.trim() || ""}`;
    
    const output = [];
    output.push(`${armyName} ${pointsInfo}`);
    output.push(factionInfo);

    console.log("Initial output:", output);

    let currentSection = null;
    const sections = [
        { name: "Characters", label: "CHARACTERS", is_character: true },
        { name: "Battleline", label: "BATTLELINE", is_character: false },
        { name: "Dedicated Transports", label: "DEDICATED TRANSPORTS", is_character: false },
        { name: "Other Datasheets", label: "OTHER DATASHEETS", is_character: false },
        { name: "Allied Units", label: "ALLIED UNITS", is_character: false }
    ];

    let processingSection = false;
    for (const line of lines) {
        // Check if the line is a section header
        const sectionHeader = sections.find(sec => sec.label === line.trim());
        if (sectionHeader) {
            currentSection = sectionHeader;
            processingSection = true;
            continue;
        }

        if (!processingSection || !currentSection) continue;  // Skip lines before a section starts

        const unitLines = line.split("\n").filter(l => l.trim());
        if (unitLines.length) {
            const unitName = unitLines[0].split(" (")[0].trim();
            let enhancement = "";
            let totalModels = 0;

            // For characters, don't show model count
            const isCharacter = currentSection.is_character;
            if (isCharacter) {
                totalModels = 1;
            }

            // Parse each unit's line, strictly excluding weapon lines
            for (const unitLine of unitLines.slice(1)) {
                if (isExcludedWeapon(unitLine)) {
                    console.log("Skipping excluded weapon line:", unitLine);  // Skip weapon lines
                    continue;
                }

                console.log("Processing line: ", unitLine);  // Log each line being processed

                if (unitLine.includes("Enhancement:")) {
                    enhancement = unitLine.split("Enhancement:")[1].trim();
                }

                const match = unitLine.match(/(\d+)x/);
                if (match) {
                    console.log("Matched a model line:", unitLine);
                    if (!isCharacter) {
                        totalModels += parseInt(match[1]);
                    }
                }
            }

            // Only display model count for non-characters
            const finalUnitName = enhancement ? `${unitName} w/ ${enhancement}` : unitName;
            if (isCharacter) {
                output.push(finalUnitName);  // For characters, do not show model count
            } else {
                output.push(totalModels > 0 ? `${finalUnitName} x${totalModels}` : finalUnitName);
            }
        }
    }

    console.log("Final output: ", output);

    return output.join("\n");
}

// Helper function to check if a line contains an excluded weapon
function isExcludedWeapon(line) {
    const lowerCaseLine = line.toLowerCase();  // Convert line to lowercase for case-insensitive matching
    const isExcluded = weapon_exclude_list.some(weapon => {
        const lowerCaseWeapon = weapon.toLowerCase();
        const regex = new RegExp(`\\b${lowerCaseWeapon}\\b`);  // Use word boundary to ensure full word match
        return regex.test(lowerCaseLine);  // Test for full word match
    });

    return isExcluded;
}
