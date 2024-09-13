let indexDiapo = 0;
let maxIndex = 100;

document.getElementById("previousButton").onclick = function() {
    if (indexDiapo < maxIndex) {indexDiapo++;}
    getImage();
};

document.getElementById("nextButton").onclick = function() {
    if (indexDiapo > 0) {indexDiapo--;}
    getImage();
};

const apiKey = 'cXdXxe4xIBTCanhmLAhoZYNJOePzTbqaIqNCE7yV';
const numDays = maxIndex;
const dateList = decrementDate(numDays);
const urlList = dateList.map(date => `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);

let urlsArray = [];
for (const url of urlList) {
    urlsArray.push(url);
}

export async function getImage() {
        try {
            const data = await fetchData(urlsArray[indexDiapo]);
            setBackgroundImage(data.hdurl);
            initializeDescriptionButton(data);
        } catch (error) {
            console.error(error.message);
        }
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Statut de la réponse: ${response.status}`);
    }
    return await response.json();
}

function setBackgroundImage(imageUrl) {
    const sheet = document.createElement('style');
    sheet.innerHTML = `
        body {
            background-image: url("${imageUrl}");
            background-size: 100%;
            background-position: 50% 0%;
            background-repeat: no-repeat;
        }
    `;
    document.head.appendChild(sheet);
}

function initializeDescriptionButton(data) {
    document.getElementById("ImgDscDiv").innerHTML = `
        <input type="button" class="descriptionButton" value="En savoir plus sur l'image du jour"/>
    `;
    const button = document.getElementsByClassName("descriptionButton")[0];
    button.addEventListener("click", () => showDescription(data));
}

function showDescription(data) {
    document.getElementById("ImgDscDiv").innerHTML = `
        <h4 style="margin: 2.5%;">${data.title}</h4>
        <p style="margin: 2.5%;">${data.explanation}</p>
        <a href="${data.hdurl}" style="margin: 2.5%;">Afficher en grand</a><br>
        <input type="button" class="descriptionButton" value="Fermer la description"/>
    `;
    const button = document.getElementsByClassName("descriptionButton")[0];
    button.addEventListener("click", hideDescription);
}

function hideDescription() {
    document.getElementById("ImgDscDiv").innerHTML = `
        <input type="button" class="descriptionButton" value="En savoir plus sur l'image du jour"/>
    `;
    const button = document.getElementsByClassName("descriptionButton")[0];
    button.addEventListener("click", async () => {
        const apiKey = 'cXdXxe4xIBTCanhmLAhoZYNJOePzTbqaIqNCE7yV';
        const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
        const data = await fetchData(url);
        showDescription(data);
    });
}

function decrementDate(numDays) {
    let dateArray = new Date().toLocaleDateString().split("/");
    const startDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;

    const rawDate = new Date(startDate);
    const dateList = [];

    for (let i = 0; i < numDays; i++) {
        
        const year = rawDate.getFullYear();
        const month = String(rawDate.getMonth() + 1).padStart(2, '0');
        const day = String(rawDate.getDate()).padStart(2, '0');
        
        const date = `${year}-${month}-${day}`;
        dateList.push(date);
        rawDate.setDate(rawDate.getDate() - 1);
    }

    return dateList;
}