
export function open_template(fileName) {
    
    console.log("Opened template: " + fileName)
    loadTemplateButtons();
}

async function loadTemplateButtons(){
    console.log("Fetching createtemplate")
    try {
        const response = await fetch('/list-templates', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          alert('RESPONSE WAS NOT OK!');
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        alert('An error occurred while loading templates.');
      }
}


window.open_template = open_template

