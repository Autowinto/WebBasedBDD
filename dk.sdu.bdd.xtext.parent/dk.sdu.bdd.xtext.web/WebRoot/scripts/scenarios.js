/**
 * @typedef {Object} ScenarioInconsistency
 * @property {number} line
 * @property {string} message
 */

/**
 * @returns {ScenarioInconsistency[]} An array of ScenarioInconsistency objects
 */
function identifyScenarioInconsistencies() {
	let inconsistencies = []

	inconsistencies = inconsistencies.concat(checkGivenWhenThen(getEditorLines()))
	inconsistencies = inconsistencies.concat(checkDuplicateSteps(getEditorLines()))
	inconsistencies = inconsistencies.concat(checkAndUsage(getEditorLines()))
	console.log(inconsistencies)

	return inconsistencies
}

/**
 * @param {string[]} lines The lines of the current editor
 * @returns {ScenarioInconsistency} An array of ScenarioInconsistency objects
 */
function checkGivenWhenThen(lines) {
	const errors = [];
	let foundGiven = false;
	let foundWhen = false;

	lines.forEach((line, index) => {
		const trimmed = line.trim();
		if (trimmed.startsWith("Given")) {
			if (foundWhen || foundGiven) {
				errors.push({
					line: index + 1,
					message: "Found 'Given' after 'When' or 'Then'. 'Given' should come first.",
				});
			}
			foundGiven = true;
		} else if (trimmed.startsWith("When")) {
			if (!foundGiven) {
				errors.push({
					line: index + 1,
					message: "'When' must follow a 'Given'.",
				});
			}
			foundWhen = true;
		} else if (trimmed.startsWith("Then")) {
			if (!foundWhen) {
				errors.push({
					line: index + 1,
					message: "'Then' must follow a 'When'.",
				});
			}
		}
	});

	return errors;
}

/**
 * @param {string[]} lines The lines of the current editor
 * @returns {ScenarioInconsistency} An array of ScenarioInconsistency objects
 */
function checkDuplicateSteps(lines) {
	const errors = [];
	let lastKeyword = null;

	lines.forEach((line, index) => {
		const trimmed = line.trim();
		const keyword = trimmed.split(" ")[0];

		if (["Given", "When", "Then", "And"].includes(keyword)) {
			if (keyword === lastKeyword) {
				errors.push({
					line: index + 1,
					message: `Duplicate step keyword '${keyword}' found on consecutive lines.`,
				});
			}
			lastKeyword = keyword;
		}
	});

	return errors;
}

/**
 * @param {string[]} lines The lines of the current editor
 * @returns {ScenarioInconsistency} An array of ScenarioInconsistency objects
 */
function checkAndUsage(lines) {
	const errors = [];

	lines.forEach((line, index) => {
		const trimmed = line.trim();
		if (trimmed.startsWith("And")) {
			const previousLine = lines[index - 1]?.trim() || "";
			if (
				!["Given", "When", "Then", "And"].some((keyword) =>
					previousLine.startsWith(keyword)
				)
			) {
				errors.push({
					line: index + 1,
					message: "'And' must follow a 'Given', 'When', or 'Then' step.",
				});
			}
		}
	});

	return errors;
}

/**
 * 
 * @returns {string[]} An array of strings representing the lines in the current editor
 */
function getEditorLines() {
	const ace = getCurrentAceEditor()

	return ace.getValue().split("\n")
}

