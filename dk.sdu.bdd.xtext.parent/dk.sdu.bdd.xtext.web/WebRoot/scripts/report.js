function openSummaryReport() {
  const summaryWindow = window.open("", "Summary Report", "width=600,height=400");

  function refreshContent() {
    const scenarioInconsistencies = identifyScenarioInconsistencies();

    const scenarioContent = scenarioInconsistencies.length > 0
        ? scenarioInconsistencies.map((inconsistency, index) => `
            <p>${index + 1}. Line ${inconsistency.line}: ${inconsistency.message}</p>
        `).join("")
        : "<p>No scenario inconsistencies found.</p>";

    summaryWindow.document.body.innerHTML = `
      <h2>Summary Report</h2> <h3>(keyboard shortcut ctrl+alt+s)</h3> 
      <button id="refreshButton">Refresh</button>
      <h2>Scenario Inconsistencies</h2>
      ${scenarioContent}
    `;

    summaryWindow.document.getElementById('refreshButton').onclick = refreshContent;
  }

  refreshContent();
  summaryWindow.document.close();
}

window.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.altKey && event.key === 's') {
    event.preventDefault(); // Prevent the default action if needed
    openSummaryReport();
  }
});
