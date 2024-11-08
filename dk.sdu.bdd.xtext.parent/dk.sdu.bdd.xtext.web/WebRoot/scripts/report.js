function openSummaryReport() {
    // Open a new window for the summary report
    const summaryWindow = window.open("", "Summary Report", "width=600,height=400");

    // Get content from the current editor for display in the summary
    const editor = getCurrentAceEditor(); // Assuming this function gets the active editor
    const content = editor ? editor.getValue() : "No content available";

    // Extract inconsistency comments from the code
    const inconsistencyComments = extractInconsistencyComments(content);

    // Create the HTML content for the summary report
    const reportContent = inconsistencyComments.length > 0
        ? inconsistencyComments.map((comment, index) => `<p>${index + 1}. ${comment}</p>`).join("")
        : "<p>No inconsistency notes found.</p>";

    // Write the content to the new window
    summaryWindow.document.write(`
      <html>
        <head><title>Summary Report</title></head>
        <body>
          <h1>Summary Report</h1>
          ${reportContent} <!-- Display extracted comments -->
        </body>
      </html>
    `);
}

// Function to extract inconsistency comments from the code
function extractInconsistencyComments(code) {
    // Define a pattern to detect comments starting with "NOTE:" or a similar marker
    const commentPattern = /\/\/\s*NOTE:.*$/gm;
    const matches = code.match(commentPattern) || [];
    return matches.map(comment => comment.trim());
}
// NOTE: Inconsistency detected at line 42. Reason: Missing semicolon.
// NOTE: Potential logic error on line 58. Suggestion: Check conditional logic.
