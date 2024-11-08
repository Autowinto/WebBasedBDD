async function checkSpelling(word) {
    const response = await fetch(`https://api.datamuse.com/words?sp=${word}`);
    const data = await response.json();

    if (data.length === 0 || data[0].word.toLowerCase() !== word.toLowerCase()) {
        const suggestion = data.length > 0 ? data[0].word : "No suggestion";
        return { misspelled: word, suggestion: suggestion };
    }
    return null;
}

async function checkAllWords(words) {
    const results = await Promise.all(words.map(checkSpelling));
    return results.filter(result => result !== null);
}

function spellcheck(entities, scenarios) {
    let entitiesTextLines = entities.querySelectorAll(".ace_line");
    let words = [];

    entitiesTextLines.forEach(line => {
        let lineText = line.innerText.trim();
        if (lineText) {
            let lineWords = lineText.split(/\s+/).filter(word => /^[a-zA-Z]+$/.test(word));
            words.push(...lineWords);
        }
    });


    checkAllWords(words).then(misspelledWords => {
        if (misspelledWords.length > 0) {
            const toastErrorList = document.getElementById('toastErrorList');
            toastErrorList.innerHTML = misspelledWords
                .map(({ misspelled, suggestion }) => `<li>${misspelled}: did you mean <strong>${suggestion}</strong>?</li>`)
                .join('');

            // Show the toast
            const toast = document.getElementById('spellcheckToast');
            toast.style.display = 'block';
        } else {
            const toast = document.getElementById('spellcheckToast');
            toast.style.display = 'none';
        }
    });
}
