let weapon_exclude_list = [];

// Load the weapon exclusion list from the JSON file dynamically
fetch('js/exclusion_list.json')
  .then(response => response.json())
  .then(data => {
    weapon_exclude_list = data;
    console.log("Weapon exclusion list loaded:", weapon_exclude_list);  // Check if the list is loaded
  })
  .catch(error => console.error('Error loading the exclusion list:', error));

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

    // Split the input into lines and remove blank lines
    const lines = inputText.split("\n").filter(line => line.trim());
    let armyName = lines[0].trim();
    let pointsInfo = "";
    
    // Extract points from the army name
    if (armyName.includes("(") && armyName.includes(")")) {
        pointsInfo = armyName.slice(armyName.indexOf("("), armyName.index(")") + 1);
        armyName = armyName.slice(0, armyName.index("(")).trim();
    }

    // Get the faction information
    const factionInfo = `${lines[1].trim()} - ${lines[2].trim()} - ${lines[4].trim()}`;

    // Add army name and faction info to output
    output.push(`${armyName} ${pointsInfo}`);
    output.push(factionInfo);

    console.log("Initial output: ", output);

    let currentSection = null;
    
    // Process sections of the input
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

            // Parse each unit's line
            for (const line of unitLines.slice(1)) {
                if (line.includes("Enhancement:")) {
                    enhancement = line.split("Enhancement:")[1].trim();
                }

                const match = line.match(/(\d+)x/);
                if (match && !weapon_exclude_list.some(weapon => line.includes(weapon))) {
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
