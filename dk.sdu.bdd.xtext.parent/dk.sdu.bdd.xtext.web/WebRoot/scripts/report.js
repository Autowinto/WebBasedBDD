function openSummaryReport() {

    const summaryWindow = window.open("", "Summary Report", "width=600,height=400");

    const scenarioInconsistencies = identifyScenarioInconsistencies();

    const scenarioContent = scenarioInconsistencies.length > 0
        ? scenarioInconsistencies.map((inconsistency, index) => `
            <p>${index + 1}. Line ${inconsistency.line}: ${inconsistency.message}</p>
        `).join("")
        : "<p>No scenario inconsistencies found.</p>";

    summaryWindow.document.write(`
      <html>
        <head><title>Summary Report</title></head>
        <body>
          <h1>Summary Report</h1>
          <h2>Scenario Inconsistencies</h2>
          ${scenarioContent}
        </body>
      </html>
    `);
}
