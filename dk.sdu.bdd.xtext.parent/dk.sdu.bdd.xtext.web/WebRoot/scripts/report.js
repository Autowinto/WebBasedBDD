async function openSummaryReport() {
    // Open a new window for the summary report
    const summaryWindow = window.open("", "Summary Report", "width=600,height=400");
  
    // Get content from the current editor for display in the summary
    const editor = getCurrentAceEditor(); // Assuming this function gets the active editor
    const content = editor ? editor.getValue() : "No content available"; // Get content or default message
  
    // Write the content to the new window
    summaryWindow.document.write(`
      <html>
        <head><title>Summary Report</title></head>
        <body>
          <h1>Summary Report</h1>
          <p>${content}</p> <!-- Display the retrieved content -->
          <button onclick="downloadReport()">Download Report</button> <!-- Download button -->
          <script>
            function downloadReport() {
              const blob = new Blob([\`${content}\`], { type: 'text/plain' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'Summary_Report.txt';
              link.click();
              URL.revokeObjectURL(link.href); // Clean up URL object
            }
          </script>
        </body>
      </html>
    `);
  }
  
  