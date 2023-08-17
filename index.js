let currentDefinitionIndex = 0;
let definitions = [];

document.getElementById("searchButton").addEventListener("click", function () {
    const searchQuery = document.getElementById("searchInput").value;
    if (searchQuery.trim() === "") {
        alert("Please enter a valid search query.");
        return;
    }

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchQuery)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Store definitions and initialize index
            if (data && data.length > 0) {
                definitions = data[0].meanings[0]?.definitions || [];
                currentDefinitionIndex = 0;
                showDefinition(currentDefinitionIndex);
            } else {
                showNoResults();
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});

function showDefinition(index) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (definitions.length > 0) {
        const definitionElement = document.createElement("div");
        const word = document.getElementById("searchInput").value; // Get the word searched for
        definitionElement.innerHTML = `
            <h3>Word: ${word}</h3>
            <div>Definition ${index + 1}: ${definitions[index].definition}</div>
        `;
        resultsContainer.appendChild(definitionElement);

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next Definition";
        nextButton.addEventListener("click", () => {
            currentDefinitionIndex = (currentDefinitionIndex + 1) % definitions.length;
            showDefinition(currentDefinitionIndex);
        });
        resultsContainer.appendChild(nextButton);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Definition";
        saveButton.addEventListener("click", () => {
            const response = {
                word: word, // Save the word searched for
                definition: definitions[index].definition
            };
            const savedDefinitions = JSON.parse(localStorage.getItem("savedDefinitions")) || [];
            savedDefinitions.push(response);
            localStorage.setItem("savedDefinitions", JSON.stringify(savedDefinitions));
            alert("Definition saved to history.");
        });
        resultsContainer.appendChild(saveButton);
    } else {
        showNoResults();
    }
}

function showNoResults() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "No results found.";
}
