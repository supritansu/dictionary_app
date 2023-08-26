let currentDefinitionIndex = 0;
let definitions = [];

document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector(".search-button");
    searchButton.addEventListener("click", function () {
        const searchInput = document.getElementById("search-input");
        const searchQuery = searchInput.value;
        
        if (searchQuery.trim() === "") {
            alert("Please enter a valid search query.");
            return;
        }
        
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchQuery)}`;
        
        // Show loading icon
        const loadingIcon = document.createElement("div");
        loadingIcon.className = "loading-icon";
        searchButton.appendChild(loadingIcon);
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                definitions = data[0]?.meanings[0]?.definitions || [];
                currentDefinitionIndex = 0;
                showDefinition(currentDefinitionIndex, searchQuery);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                // Remove loading icon
                searchButton.removeChild(loadingIcon);
            });
    });
});

function showDefinition(index, word) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (definitions.length > 0) {
        const definitionElement = document.createElement("div");
        definitionElement.innerHTML = `
            <h3>Word: ${word}</h3>
            <div>Definition ${index + 1}: ${definitions[index].definition}</div>
        `;
        resultsContainer.appendChild(definitionElement);

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next Definition";
        nextButton.className = "custom-button";
        nextButton.addEventListener("click", () => {
            currentDefinitionIndex = (currentDefinitionIndex + 1) % definitions.length;
            showDefinition(currentDefinitionIndex, word);
        });
        resultsContainer.appendChild(nextButton);

        const savedDefinitions = JSON.parse(localStorage.getItem("savedDefinitions")) || [];
        const isAlreadySaved = savedDefinitions.some(def => def.word === word);
        
        if (!isAlreadySaved) {
            const saveButton = document.createElement("button");
            saveButton.textContent = "Save Definition";
            saveButton.className = "custom-button";
            saveButton.addEventListener("click", () => {
                const response = {
                    word: word,
                    definition: definitions[index].definition
                };
                savedDefinitions.push(response);
                localStorage.setItem("savedDefinitions", JSON.stringify(savedDefinitions));
                saveButton.disabled = true; // Disable save button after saving
                const saveNotification = document.createElement("div");
                saveNotification.textContent = "Definition saved!";
                saveNotification.className = "save-notification";
                resultsContainer.appendChild(saveNotification);
            });
            resultsContainer.appendChild(saveButton);
        }

    } else {
        showNoResults(resultsContainer);
    }
}

function showNoResults(container) {
    container.innerHTML = "No results found.";
}
