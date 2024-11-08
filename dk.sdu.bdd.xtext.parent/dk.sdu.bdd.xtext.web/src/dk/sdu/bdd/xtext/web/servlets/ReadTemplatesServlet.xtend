package dk.sdu.bdd.xtext.web.servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File
import java.io.IOException
import org.json.JSONArray
import org.json.JSONObject
import java.nio.file.Files
import java.nio.file.Paths

class ReadTemplatesServlet extends HttpServlet {

	private val templatesDirectory = "src/dk/sdu/bdd/xtext/web/servlets/templates"

    override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        val path = new File(templatesDirectory)
        
        // Check if the directory exists and is accessible
        if (!path.exists || !path.isDirectory) {
            resp.status = HttpServletResponse.SC_NOT_FOUND
            resp.writer.write("Templates directory not found.")
            return
        }

        // JSON array to hold file details
        val jsonResponse = new JSONArray
        
        // Iterate through each file in the templates directory
        for (file : path.listFiles) {
            if (file.isFile) {
                // Read file content as a string using Files.readAllBytes
                val fileContent = new String(Files.readAllBytes(Paths.get(file.getAbsolutePath)), "UTF-8")
                
                // Create a JSON object for each file
                val fileObject = new JSONObject
                fileObject.put("filename", file.getName)
                fileObject.put("content", fileContent)
                
                // Add the JSON object to the JSON array
                jsonResponse.put(fileObject)
            }
        }

        // Set response headers and content
        resp.contentType = "application/json"
        resp.status = HttpServletResponse.SC_OK
        resp.writer.write(jsonResponse.toString)
    }
}