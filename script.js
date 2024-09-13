import { getData as getHolidayData } from "./getHolidayData.js";
import { getImage } from "./getDailyImage.js";
import { getAvailableBikes } from "./bikeFunction.js";
import { getNews } from "./getNews.js";


setInterval(function () {
	//fonction qui affiche la date avec un rafraichissement toute les secondes
	document.getElementById("time").innerHTML = formatedDate();
}, 1000);

function formatedDate() {
	//fonction qui formate la date
	let rawDate = new Date();

	let rawDateFr = rawDate.toLocaleString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});
	let rawDateString = rawDateFr.toString();
	const dateArray = rawDateString.split(" ");
	const newDate = `${dateArray[0]} ${dateArray[1]} ${dateArray[2]} ${dateArray[3]} <br> ${dateArray[5]}`;
	return newDate;
}

// fonction sticky navbar news
window.onload = function () {
	let navbar = document.getElementById("navbarNews");
	let newsDiv = document.getElementById("newsDiv");
	let sticky = navbar.offsetTop - newsDiv.offsetTop;

	function myFunction() {
		if (window.pageYOffset >= sticky + newsDiv.offsetTop) {
			navbar.classList.add("sticky");
		} else {
			navbar.classList.remove("sticky");
		}
	}

	window.onscroll = function () {
		myFunction();
	};
};
// fin de la fonction sticky navbar news

getHolidayData();

getImage();

getAvailableBikes();

getNews();
