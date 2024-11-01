package dk.sdu.bdd.xtext.web.servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.json.JSONObject;

class CreateTemplateServlet extends HttpServlet {
	
	private val templatesDirectory = "src/dk/sdu/bdd/xtext/web/servlets/templates"

    override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        val jsonResponse = new JSONObject;
        jsonResponse.put("templates", #[ "CREATE!", "TEMPLATE!" ]);
        resp.contentType = "application/json";
        resp.status = HttpServletResponse.SC_OK;
        resp.writer.write(jsonResponse.toString);
    }
}