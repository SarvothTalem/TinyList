function parseList() {
    const input = document.getElementById("input").value;

    // Your existing parsing function (updated for your needs)
    const output = parseArmyList(input);  // Using the function we've worked on
    document.getElementById("output").textContent = output;
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

// Include the latest parsing logic here (based on the parser we worked on)
function parseArmyList(inputText) {
    const output = [];
    const sections = [
        { name: "Characters", label: "CHARACTERS", is_character: true },
        { name: "Battleline", label: "BATTLELINE", is_character: false },
        { name: "Dedicated Transports", label: "DEDICATED TRANSPORTS", is_character: false },
        { name: "Other Datasheets", label: "OTHER DATASHEETS", is_character: false },
        { name: "Allied Units", label: "ALLIED UNITS", is_character: false }
    ];

    const lines = inputText.split("\n").filter(line => line.trim());
    let armyName = lines[0].trim();
    let pointsInfo = "";
    if (armyName.includes("(") && armyName.includes(")")) {
        pointsInfo = armyName.slice(armyName.index("("), armyName.index(")") + 1);
        armyName = armyName.slice(0, armyName.index("(")).trim();
    }
    const factionInfo = `${lines[1].trim()} - ${lines[2].trim()} - ${lines[4].trim()}`;

    output.push(`${armyName} ${pointsInfo}`);
    output.push(factionInfo);

    let currentSection = null;
    for (const section of sections) {
        if (inputText.includes(section.label)) {
            currentSection = section;
        }
    }

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

            for (const line of unitLines.slice(1)) {
                if (line.includes("Enhancement:")) {
                    enhancement = line.split("Enhancement:")[1].trim();
                }
                const match = line.match(/(\d+)x/);
                if (match && !weapon_exclude_list.some(weapon => line.includes(weapon))) {
                    totalModels += parseInt(match[1]);
                }
            }

            const finalUnitName = enhancement ? `${unitName} w/ ${enhancement}` : unitName;
            output.push(totalModels > 0 ? `${finalUnitName} x${totalModels}` : finalUnitName);
        }
    }

    return output.join("\n");
}
