let currentCategory = "";
let currentPage = 1;
const limit = 10;
let isLoading = false; // Evita doppie richieste

document.getElementById("search-box").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {  // Controlla se è stato premuto il tasto "Enter"
        document.getElementById("search-btn").click();  // Simula il click sul tasto Cerca
    }
});

document.getElementById("search-btn").addEventListener("click", function() {
    const category = document.getElementById("search-box").value.trim();
    if (!category) {
        alert("Inserisci una categoria!");
        return;
    }

    currentCategory = category;
    currentPage = 1;
    fetchBooks();
});

document.getElementById("prev-page-btn").addEventListener("click", function() {
    if (currentPage > 1 && !isLoading) {
        currentPage--;
        fetchBooks();
    }
});

document.getElementById("next-page-btn").addEventListener("click", function() {
    if (!isLoading) {
        currentPage++;
        fetchBooks();
    }
});

async function fetchBooks() {
    isLoading = true;
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("results").innerHTML = "";
    
    const offset = (currentPage - 1) * limit;
    const url = `https://openlibrary.org/subjects/${currentCategory}.json?limit=${limit}&offset=${offset}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("loading").classList.add("hidden");
        isLoading = false;

        if (!data.works || data.works.length === 0) {
            document.getElementById("results").innerHTML = "<p>Nessun libro trovato.</p>";
            return;
        }

        const resultsDiv = document.getElementById("results");
        data.works.forEach(book => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book");
            bookElement.innerHTML = `<strong>${book.title}</strong><br>Autori: ${book.authors ? book.authors.map(a => a.name).join(", ") : "Sconosciuto"}`;
            bookElement.addEventListener("click", () => fetchBookDetails(book.key, bookElement));
            resultsDiv.appendChild(bookElement);
        });

        updatePagination(data.works.length);
    } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
        document.getElementById("loading").classList.add("hidden");
        isLoading = false;
    }
}

function updatePagination(resultsCount) {
    document.getElementById("page-number").textContent = `Pagina ${currentPage}`;
    document.getElementById("prev-page-btn").classList.toggle("hidden", currentPage === 1);
    document.getElementById("next-page-btn").classList.toggle("hidden", resultsCount < limit);
}

async function fetchBookDetails(bookKey, bookElement) {
    // Controlla se il libro cliccato ha già una descrizione aperta
    const existingDescription = bookElement.nextElementSibling;

    if (existingDescription && existingDescription.classList.contains("book-description")) {
        // Se esiste, rimuovila
        existingDescription.remove();
    } else {
        // Rimuove altre descrizioni esistenti
        document.querySelectorAll(".book-description").forEach(desc => desc.remove());

        // Recupera i dettagli del libro
        const url = `https://openlibrary.org${bookKey}.json`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Crea il div della descrizione
            const descriptionDiv = document.createElement("div");
            descriptionDiv.classList.add("book-description");
            descriptionDiv.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.description ? (typeof data.description === "string" ? data.description : data.description.value) : "Descrizione non disponibile"}</p>
            `;

            // Inserisci la descrizione subito dopo il libro cliccato
            bookElement.after(descriptionDiv);

            // Scorri verso la descrizione con un effetto smooth
            descriptionDiv.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (error) {
            console.error("Errore nel recupero dei dettagli del libro:", error);
        }
    }
}
