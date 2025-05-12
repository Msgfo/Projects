// Fetch and display a random quote from ZenQuotes API
function fetchQuote() {
    fetch("https://zenquotes.io/api/random")
        .then(response => response.json())
        .then(data => {
            const quoteElement = document.getElementById("quote-text");
            if (data && data[0]) {
                quoteElement.textContent = `"${data[0].q}" - ${data[0].a}`;
            } else {
                quoteElement.textContent = "Could not fetch a quote at this time.";
            }
        })
        .catch(() => {
            document.getElementById("quote-text").textContent = "Error loading quote.";
        });
}

// Initialize Annyang voice commands
function startAudio() {
    if (annyang) {
        annyang.addCommands({
            'hello': function() {
                alert("Hello World!");
            },
            'change the color to *color': function(color) {
                document.body.style.backgroundColor = color;
            },
            'navigate to *page': function(page) {
                if (page === "home") {
                    window.location.href = "index.html";
                } else if (page === "stocks") {
                    window.location.href = "stocks.html";
                } else if (page === "dogs") {
                    window.location.href = "dogs.html";
                }
            }
        });

        annyang.start();
    }
}

// Stop Annyang voice commands
function stopAudio() {
    if (annyang) {
        annyang.abort();
    }
}

// Fetch quote when the page loads
window.onload = fetchQuote;