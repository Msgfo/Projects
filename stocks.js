const apiKey = 'ytNMRQ6XQqIBpF3KP49alUDz1B2FTKJE'; // Your Polygon.io API key
const redditAPI = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

async function fetchStockData(ticker, range) {
    try {
        ticker = ticker.toUpperCase();

        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - range);

        const from = pastDate.toISOString().split('T')[0];
        const to = today.toISOString().split('T')[0];

        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?apiKey=${apiKey}`;
        console.log('API URL:', url);

        const response = await fetch(url);
        const data = await response.json();

        console.log('Stock Data:', data);

        if (!data.results || data.results.length === 0) {
            alert('No data found for this ticker. Please try another one.');
            return [];
        }

        return data.results.map(item => ({
            date: new Date(item.t).toLocaleDateString(),
            close: item.c
        }));
    } catch (error) {
        console.error('Error fetching stock data:', error);
        alert('Failed to fetch stock data. Please try again later.');
        return [];
    }
}

async function loadStockData(tickerInput = null) {
    const ticker = tickerInput || document.getElementById('stock-ticker').value.toUpperCase();
    const daysRange = parseInt(document.getElementById('days-range').value, 10);

    if (!ticker) {
        alert('Please enter or say a stock ticker.');
        return;
    }

    const stockData = await fetchStockData(ticker, daysRange);

    if (stockData.length > 0) {
        const ctx = document.getElementById('stock-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: stockData.map(data => data.date),
                datasets: [{
                    label: `${ticker} Stock Price`,
                    data: stockData.map(data => data.close),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }
}

async function fetchRedditStocks() {
    try {
        const response = await fetch(redditAPI);
        const data = await response.json();
        const topStocks = data.slice(0, 5);
        console.log('Top 5 Reddit Stocks:', topStocks);
        return topStocks;
    } catch (error) {
        console.error('Error fetching Reddit stocks:', error);
        alert('Failed to fetch Reddit stock data.');
        return [];
    }
}

async function displayRedditStocks() {
    const topStocks = await fetchRedditStocks();

    if (!topStocks || topStocks.length === 0) {
        console.error('No stocks to display.');
        return;
    }

    const tableBody = document.getElementById('reddit-top-stocks').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    topStocks.forEach(stock => {
        const row = tableBody.insertRow();
        const tickerCell = row.insertCell(0);
        const commentCell = row.insertCell(1);
        const sentimentCell = row.insertCell(2);

        tickerCell.innerHTML = `<a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a>`;
        commentCell.innerText = stock.no_of_comments;

        if (stock.sentiment === 'Bullish') {
            sentimentCell.innerHTML = `<img src="bull-icon.png" alt="Bullish" style="width: 24px; height: 24px;">`;
        } else if (stock.sentiment === 'Bearish') {
            sentimentCell.innerHTML = `<img src="bear-icon.png" alt="Bearish" style="width: 24px; height: 24px;">`;
        } else {
            sentimentCell.innerText = 'Neutral';
        }
    });

    console.log('Reddit table populated.');
}

function setupVoiceCommands() {
    if (annyang) {
        const commands = {
            'hello': () => alert('Hello World!'),
            'change the color to *color': (color) => {
                document.body.style.backgroundColor = color;
            },
            'navigate to *page': (page) => {
                const targetPage = page.toLowerCase();
                if (targetPage === 'home') window.location.href = 'index.html';
                else if (targetPage === 'stocks') window.location.href = 'stocks.html';
                else if (targetPage === 'dogs') window.location.href = 'dogs.html';
                else alert("Page not recognized. Try 'home', 'stocks', or 'dogs'.");
            },
            'lookup *ticker': (ticker) => {
                console.log(`Voice Command: Lookup ${ticker}`);
                const formattedTicker = ticker.trim().toUpperCase();
                if (formattedTicker) {
                    loadStockData(formattedTicker);
                } else {
                    alert("Invalid ticker symbol. Please try again.");
                }
            }
        };

        annyang.addCommands(commands);
        console.log('Voice commands enabled.');
    } else {
        console.error("Annyang is not supported in this browser.");
    }
}

function startAudio() {
    annyang.start();
    alert("Voice commands are now enabled!");
}

function stopAudio() {
    annyang.abort();
    alert("Voice commands have been disabled.");
}

document.addEventListener('DOMContentLoaded', () => {
    displayRedditStocks();
    setupVoiceCommands();
});