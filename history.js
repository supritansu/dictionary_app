const historyList = document.getElementById("historyList");

// Load history from local storage and populate the list
const savedDefinitions = JSON.parse(localStorage.getItem("savedDefinitions")) || [];

// Reverse the array to show latest definitions first
const reversedDefinitions = savedDefinitions.slice().reverse();

reversedDefinitions.forEach((definition, index) => {
    const definitionContainer = document.createElement("div");
    definitionContainer.className = "history-entry";

    const definitionHtml = `
    <div class="definition">
        <h3>Word: ${definition.word}</h3>
        <div>${definition.definition}</div>
        <button class="delete-button" onclick="deleteDefinition(${index})">
            <i class="fas fa-trash-alt"></i> Delete
        </button>
    </div>
`;
    definitionContainer.innerHTML = definitionHtml;
    historyList.appendChild(definitionContainer);
});

function deleteDefinition(index) {
    reversedDefinitions.splice(index, 1);
    localStorage.setItem("savedDefinitions", JSON.stringify(reversedDefinitions.slice().reverse()));
    location.reload(); // Refresh the page to update the list
}