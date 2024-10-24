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

    let output = parseArmyList(input);
    console.log("Output generated before post-processing:", output);  // Check if the parsing works

    output = postProcessOutput(output);  // Post-process the output

    document.getElementById("output").textContent = output;  // Display the output in the <pre> element
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

    // Push the formatted army name and faction only once
    output.push(`${armyName} ${pointsInfo}`);
    output.push(factionInfo);

    console.log("Initial output:", output);

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

            const isCharacter = currentSection?.is_character;
            if (isCharacter) {
                totalModels = 1;
            }

            // Parse each unit's line
            for (const line of unitLines.slice(1)) {
                console.log("Processing line: ", line);  // Log each line being processed

                if (line.includes("Enhancement:")) {
                    enhancement = line.split("Enhancement:")[1].trim();
                }

                const match = line.match(/(\d+)x/);
                if (match) {
                    console.log("Matched a model line:", line);
                    const isExcluded = isExcludedWeapon(line);  // Call the function and check for exclusions
                    console.log("Is this line excluded?", isExcluded);
                    if (!isCharacter && !isExcluded) {
                        totalModels += parseInt(match[1]);
                    }
                }
            }

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
    return weapon_exclude_list.some(weapon => {
        const lowerCaseWeapon = weapon.toLowerCase();
        const regex = new RegExp(`\\b${lowerCaseWeapon}\\b`);  // Use word boundary to ensure full word match
        return regex.test(lowerCaseLine);  // Test for full word match
    });
}

// Post-process the final output to remove the last line, any repeated headers, duplicate army names/factions, and lines 3 and 4
function postProcessOutput(output) {
    const outputLines = output.split("\n").filter(line => line.trim());
    
    // Remove headers like "CHARACTERS", "BATTLELINE", etc.
    const headers = ["CHARACTERS", "BATTLELINE", "DEDICATED TRANSPORTS", "OTHER DATASHEETS", "ALLIED UNITS"];
    let filteredLines = outputLines.filter(line => !headers.includes(line.trim()));

    // Remove the last line, which is typically the "Exported with App Version" line
    filteredLines.pop();

    // Remove any duplicate army name or faction from the list
    const firstLine = filteredLines[0];
    const factionLine = filteredLines[1];

    // Filter out any occurrences of the first line (army name) or the second line (faction)
    filteredLines = filteredLines.filter((line, index) => {
        if (index > 1 && (line === firstLine || line === factionLine)) {
            return false;  // Skip duplicates of the army name and faction
        }
        return true;
    });

    // Remove lines 3 and 4 (index 2 and 3)
    filteredLines = filteredLines.filter((line, index) => {
        return index !== 2 && index !== 3;
    });

    return filteredLines.join("\n");
}
