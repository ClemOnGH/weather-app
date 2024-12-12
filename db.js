// async function retrieveDB() {
//     const dbResponse = await fetch("http://localhost:3000/games/");
//     const dbData = await dbResponse.json();
//     console.log(dbData);
// }

// retrieveDB();

fetch("http://localhost:3000/games/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        adresse: "Fffsqdvqsdv",
        email: "dvsdvsv",
        id: 44,
        nom: "SABAH",
        numeroFamille: "SASAS",
        prenom: "QSD",
        telephone: "QSDQD",
    }),
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        return (window.location.href = "https://www.google.com");
    });
