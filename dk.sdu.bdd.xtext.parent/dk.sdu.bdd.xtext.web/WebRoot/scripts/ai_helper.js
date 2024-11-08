function getScenarioText(scenario) {
    let entitiesTextLines = scenario.querySelectorAll(".ace_line");
    text = ""
    entitiesTextLines.forEach(line => {
        let lineText = line.innerText;
        if (lineText) {
			text += lineText
        }
    })
    return text
};