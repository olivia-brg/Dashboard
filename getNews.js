export function getNews() {
    fetch("https://newsapi.org/v2/top-headlines/sources?apiKey=7c4358e0a2664204bd5ef1a98562017f")
        .then(news => news.json())
        .then(response => {
            let newsDiv = document.getElementById("newsDiv");
            response.sources.forEach(source => {
                let articleDiv = document.createElement("div");
                articleDiv.className = "newsArticle_div";
                articleDiv.style.padding = "2.5%";
                articleDiv.style.borderTop = "1px solid #000";
                articleDiv.setAttribute("data-lang", source.language);

                let articleContent = `
                    <h3><a href="${source.url}" target="_blank">${source.name}</a></h3>
                    <p style="height: 60px; overflow: auto;">${source.description}</p>
                    <a href="${source.url}" target="_blank">${source.url}</a>
                `;
                articleDiv.innerHTML = articleContent;
                newsDiv.appendChild(articleDiv);
            });

            sortNewsAscending();
            filterByLanguage();
        })
        .catch(error => console.error('Error fetching news:', error));

    document.getElementById("newsSort").addEventListener("change", function() {
        let selectedOption = this.value;
        if (selectedOption === "ascending") {
            sortNewsAscending();
        } else if (selectedOption === "descending") {
            sortNewsDescending();
        }
    });

    document.getElementById("newsLang").addEventListener("change", filterByLanguage);
}

function sortNewsDescending() {
    let newsDiv = document.getElementById("newsDiv");
    let divs = Array.from(newsDiv.getElementsByClassName("newsArticle_div"));
    divs.sort((div1, div2) => {
        let val1 = div1.getElementsByTagName("h3")[0].innerText;
        let val2 = div2.getElementsByTagName("h3")[0].innerText;
        return val2.localeCompare(val1);
    });
    divs.forEach(div => newsDiv.appendChild(div));
}

function sortNewsAscending() {
    let newsDiv = document.getElementById("newsDiv");
    let divs = Array.from(newsDiv.getElementsByClassName("newsArticle_div"));
    divs.sort((div1, div2) => {
        let val1 = div1.getElementsByTagName("h3")[0].innerText;
        let val2 = div2.getElementsByTagName("h3")[0].innerText;
        return val1.localeCompare(val2);
    });
    divs.forEach(div => newsDiv.appendChild(div));
}

function filterByLanguage() {
    let selectedLang = document.getElementById("newsLang").value;
    let newsDiv = document.getElementById("newsDiv");
    let divs = Array.from(newsDiv.getElementsByClassName("newsArticle_div"));
    divs.forEach(div => {
        let lang = div.getAttribute("data-lang");
        if (selectedLang === "" || lang === selectedLang) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    });
}