
import os

def readFile():
    scenarioCounter = 0
    # Get the directory of the current script
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Construct the path to the sample.bdd file
    bdd_file_path = os.path.abspath(os.path.join(current_dir , os.pardir, os.pardir))
    bdd_file_path = bdd_file_path + "/sample.bdd"
    
    # Construct the path to the tests.feature file
    feature_file_path = os.path.abspath(os.path.join(current_dir , os.pardir))
    feature_file_path = feature_file_path + "/tests.feature"
    # Check if the file exists
    if not os.path.exists(bdd_file_path):
        print(f"File not found: {bdd_file_path}")
        return
    
    print("here")

    with open(bdd_file_path) as f:
        with open(feature_file_path, "w") as fileWriter:
            content = f.readlines()
            disallowedStrings = ['actions', 'states', 'properties', '}', '/*', '*/', "which means", '//', 'declarative', 'imperative', 'model']
            for line in content:
                if any(x in line for x in disallowedStrings):
                    continue
                if line.startswith('Scenario:'):
                    scenarioCounter += 1
                    scenario = line.replace('"', "").replace("Scenario: ", "")
                    s = "Feature: " + scenario
                    fileWriter.write(s + '\n')
                elif line.startswith(('Given', 'When', 'Then')):
                    s = '\tScenario: ' + line
                    fileWriter.write(s)
                else:
                    fileWriter.write(line)

# Call the function
#readFile()
