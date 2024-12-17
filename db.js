// async function retrieveDB() {
//     const dbResponse = await fetch("http://localhost:3000/games/");
//     const dbData = await dbResponse.json();
//     console.log(dbData);
// }

// retrieveDB();

(async () => {
    try {
        const raw = await fetch("http://localhost:3000/games");
        const rawResponse = await raw.json();
        for (game of rawResponse) {
            console.log(game.title);
        }
    } catch (e) {
        console.error(e);
    }
})();
