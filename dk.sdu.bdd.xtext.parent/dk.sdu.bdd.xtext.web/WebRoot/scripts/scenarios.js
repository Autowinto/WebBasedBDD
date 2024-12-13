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

	const lines = getEditorLines()
	return inconsistencies.concat(
		checkUnusedEntities(lines),
	)
}

/**
 * @param {string[]} lines The lines of the current editor
 * @returns {ScenarioInconsistency[]} An array of ScenarioInconsistency objects
 */
function checkUnusedEntities(lines) {
  const entityDeclarations = {};
  const usedEntities = new Set();
	const unusedSteps = [];

  lines.forEach((line) => {
    if (line.includes("entity")) {
      const entityMatch = line.match(/entity (\w+)/);
      if (entityMatch) {
        const entity = entityMatch[1];

				// If the entity has already been declared, set error
				console.log(entity, entityDeclarations[entity])
				if (entityDeclarations[entity]) {
					unusedSteps.push({line: 1, message: `Duplicate Entity: '${entity}' has already been declared.`});
				}
        entityDeclarations[entity] = { actions: [], states: [], properties: [] };
      }
    } else if (line.includes("actions:")) {
      const actions = line.match(/actions:\s*(.+)/)[1].split(",").map((a) => a.trim());
      const lastEntity = Object.keys(entityDeclarations).at(-1);
      entityDeclarations[lastEntity].actions.push(...actions);
    } else if (line.includes("properties:")) {
      const properties = line.match(/properties:\s*(.+)/)[1].split(",").map((p) => p.trim());
      const lastEntity = Object.keys(entityDeclarations).at(-1);
      entityDeclarations[lastEntity].properties.push(...properties);
    } else if (line.includes("states:")) {
      const states = line.match(/states:\s*(.+)/)[1].split(",").map((s) => s.trim());
      const lastEntity = Object.keys(entityDeclarations).at(-1);
      entityDeclarations[lastEntity].states.push(...states);
    }
  });

	console.log(entityDeclarations)

	getScenarios().forEach((scenario) => {
		scenario.forEach((line) => {
			Object.keys(entityDeclarations).forEach((entity) => {
				if (line.includes(entity)) {
					usedEntities.add(entity);
					["actions", "properties", "states"].forEach((key) => {
						entityDeclarations[entity][key].forEach((item) => {
							if (line.includes(item)) usedEntities.add(`${entity}.${item}`);
						});
					});
				}
			});
		})
	})
	

  Object.entries(entityDeclarations).forEach(([entity, details]) => {
		console.log(entityDeclarations)
		if (!usedEntities.has(entity)) {
			lineNumber = lines.findIndex((line) => line.includes(entity)) + 1;
			unusedSteps.push({line: lineNumber, message: `Unused Entity: Entity '${entity}' is not used in a scenario`});
    }
    ["actions", "properties", "states"].forEach((key) => {
			details[key].forEach((item) => {
				console.log(entity, item)
				if (!usedEntities.has(`${entity}.${item}`)) {
					unusedSteps.push({line: 1, message: `Unused Item: '${item}' of '${entity}' is unused.`});
        }
      });
    });
  });
	
  return unusedSteps;
}

/**
 * @returns {[string[]]}
 */
function getScenarios() {
	const lines = getEditorLines()
	const scenarios = []
	let scenario = []

	lines.forEach((line) => {
		if (line.startsWith("Scenario:")) {
			scenario = []
			scenarios.push(scenario)
		}
		scenario.push(line)
	})

	return scenarios
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

