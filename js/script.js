function parseList() {
    alert("Button clicked!");  // Already confirmed working
    
    // Get the input text from the textarea
    const input = document.getElementById("input").value;

    // Log the input to verify it's being captured correctly
    console.log("Input: ", input);

    // If input is empty or only spaces, alert the user
    if (!input.trim()) {
        alert("Please enter a valid army list.");
        return;
    }

    // Process the input text using the parseArmyList function
    const output = parseArmyList(input);
    
    // Log the output to verify it's being generated
    console.log("Output: ", output);

    // Display the parsed output in the <pre> element
    document.getElementById("output").textContent = output;
}

// Function to parse the army list input
function parseArmyList(inputText) {
    const output = [];
    const sections = [
        { name: "Characters", label: "CHARACTERS", is_character: true },
        { name: "Battleline", label: "BATTLELINE", is_character: false },
        { name: "Dedicated Transports", label: "DEDICATED TRANSPORTS", is_character: false },
        { name: "Other Datasheets", label: "OTHER DATASHEETS", is_character: false },
        { name: "Allied Units", label: "ALLIED UNITS", is_character: false }
    ];

    // Log that we're starting the parsing process
    console.log("Parsing input...");

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

    // Log the initial output (army name and faction info)
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

    // Log the final output before returning
    console.log("Final output: ", output);

    return output.join("\n");
}

// Weapon exclusion list
const weapon_exclude_list = [
    "Chainsword", "Laspistol", "Power weapon", "Bolt pistol", "Close combat weapon", 
    "Plasma pistol", "Hot-shot laspistol", "Lasgun", "Force weapon", "Absolvor bolt pistol", 
    "Reductor pistol", "Psychic Maelstrom", "Melta rifle", "Heavy bolt pistol", "Master-crafted power weapon",
    "Helix Gauntlet", "Boltgun", "Plasma gun", "Multi-melta", "Lascannon", "Heavy bolter", 
    "Sternguard bolt rifle", "Hot-shot lasgun", "Twin assault cannon", "Flamestorm cannon",
    "Storm bolter", "Exterminator autocannon", "Hunter-killer missile", "Castigator gatling cannon",
    "Victrix Honour Guard", "Chimera multi-laser"
];
