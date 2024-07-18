const userInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const displayData = document.getElementById("display-data");
const displayDailyPuzzle = document.getElementById("display-daily-puzzle");

const chessCall = async () => {
    if (userInput.value === "") {
        return;
    }

    try {
        const res = await fetch(`https://api.chess.com/pub/player/${userInput.value}`);
        const data = await res.json();
        console.log(data);

        const resStats = await fetch(`https://api.chess.com/pub/player/${userInput.value}/stats`);
        const dataStats = await resStats.json();
        console.log(dataStats);

        const resCountry = await fetch(`${data.country}`);
        const dataCountry = await resCountry.json();
        console.log(dataCountry);

        let blitzHtml = '';
        let bulletHtml = '';
        let titleHtml = '';

        if (dataStats.chess_blitz) {
            blitzHtml = `
                <div class="blitz">
                    <p>Blitz</p>
                    <p>Rating: ${dataStats.chess_blitz.last.rating}</p>
                    <p>Win/Loss/Draw Record: ${dataStats.chess_blitz.record.win}/${dataStats.chess_blitz.record.loss}/${dataStats.chess_blitz.record.draw}</p>
                </div>
                <br>
            `;
        }

        if (dataStats.chess_bullet) {
            bulletHtml = `
                <div class="bullet">
                    <p>Bullet</p>
                    <p>Rating: ${dataStats.chess_bullet.last.rating}</p>
                    <p>Win/Loss/Draw Record: ${dataStats.chess_bullet.record.win}/${dataStats.chess_bullet.record.loss}/${dataStats.chess_bullet.record.draw}</p>
                </div>
                <br>
            `;
        }

        if (data.title) {
            titleHtml = `<span class="title">${data.title}</span>`;
        }

        if (data.followers >= 1000 && data.followers <= 999999) {
            data.followers = `${(data.followers / 1000).toFixed(2)}k`;
        } else if (data.followers >= 1000000) {
            data.followers = `${(data.followers / 1000000).toFixed(2)}m`;
        }
        

        displayData.innerHTML = `
            <img src="${data.avatar}" alt="${userInput.value}'s Avatar">
            <h2>Name: ${titleHtml} ${data.name == undefined ? "" : data.name}</h2>
            <h3>Username: ${data.username}</h3>
            <p><b>Followers:</b> ${data.followers}</p>
            <p><b>Country:</b> ${dataCountry.name}</p>
            <p><b>League:</b> ${data.league}</p>
            <p><b>Chess.com URL:</b> <a target="_blank" href="${data.url}">${data.url}</a></p>
            <br>
            <div class="rapid">
                <p>Rapid</p>
                <p>Rating: ${dataStats.chess_rapid.last.rating}</p>
                <p>Win/Loss/Draw Record: ${dataStats.chess_rapid.record.win}/${dataStats.chess_rapid.record.loss}/${dataStats.chess_rapid.record.draw}</p>
            </div>
            <br>
            ${blitzHtml}
            ${bulletHtml}
        `;
    }
    catch (err) {
        console.log(err.message);
        displayData.innerHTML = `<h3>This player is unavailable</h3>`;
    }

}

const displayPuzzle = async () => {
    const resDailyPuzzle = await fetch("https://api.chess.com/pub/puzzle");
    const dataDailyPuzzle = await resDailyPuzzle.json();
    console.log(dataDailyPuzzle);

    displayDailyPuzzle.innerHTML = `
        <h2>${dataDailyPuzzle.title}</h2>
        <a target="_blank" href="${dataDailyPuzzle.url}"><img src="${dataDailyPuzzle.image}" alt="Daily Puzzle Image"></a>
        <p><i>Click on image to do the Daily Puzzle</i></p>
    `;
}

window.onload = displayPuzzle();
searchBtn.addEventListener('click', chessCall);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        chessCall();
    }
})