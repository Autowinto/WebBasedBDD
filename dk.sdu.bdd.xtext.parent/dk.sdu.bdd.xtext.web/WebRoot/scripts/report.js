function openSummaryReport() {
  const summaryWindow = window.open("", "Summary Report", "width=600,height=400");

  const scenarioInconsistencies = identifyScenarioInconsistencies();

  const scenarioContent = scenarioInconsistencies.length > 0
      ? scenarioInconsistencies.map((inconsistency, index) => `
          <p>${index + 1}. Line ${inconsistency.line}: ${inconsistency.message}</p>
      `).join("")
      : "<p>No scenario inconsistencies found.</p>";

  const jsonContent = JSON.stringify(scenarioInconsistencies, null, 2);

  summaryWindow.document.write(`
    <html>
      <head>
        <title>Summary Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <h1>Summary Report</h1>
        <h2>Scenario Inconsistencies</h2>
        ${scenarioContent}
      </body>
    </html>
  `);

  summaryWindow.document.close();
}
