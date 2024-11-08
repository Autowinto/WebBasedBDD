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
	inconsistencies.concat(checkGivenWhenThen())
	console.log(getEditorLines())
	
	return inconsistencies
}

/**
 * @returns {ScenarioInconsistency[]} An array of ScenarioInconsistency objects
 */
function checkGivenWhenThen() {
	let inconsistencies = []
	
	
	
	return inconsistencies
}

function getEditorLines() {
	const ace = getCurrentAceEditor()
	return ace.getValue().split("\n")
}