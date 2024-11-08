function load_templates() {
  loadTemplateButtons();
}

async function open_template(fileName) {
  const editor = getCurrentAceEditor()
  editor.setValue("")
  var session = editor.session

  
  
  let templates = await fetchTemplates()

  templates.forEach(template => {
    if(template.filename === fileName) {
      session.insert({
        row: session.getLength(),
        column: 0
      }, "\n" + template.content)
    }
  });
}

async function loadTemplateButtons(){
  const container = document.getElementById("templates_container");
  
  let data = await fetchTemplates()
  console.log(data)

  for(let i = 0; i < data.length; i++){
    if(container.childElementCount > data.length+1) {
      continue
    }
    const template = data[i];
    const button = document.createElement("button");
    button.textContent = template.filename;
    button.onclick = () => open_template(template.filename);
    container.appendChild(button);
  }
}

async function fetchTemplates() {
  try {
    const response = await fetch('/list-templates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data

    } else {
      alert('RESPONSE WAS NOT OK!');
    }
  } catch (error) {
    console.error('Error loading templates:', error);
    alert('An error occurred while loading template buttons.');
  }
}


window.open_template = open_template
window.load_templates = load_templates

