let DateHolidayArray;
let DescriptionHolidayArray;
let UpdateDateHolidayArray = [];
let UpdatedDescriptionHolidayArray = [];

export async function getData() {
	const url = `https://calendrier.api.gouv.fr/jours-feries/metropole/2024.json`;

	try {
		// regroupe des instructions à exécuter et définit une réponse si elle provoque une exception
		const response = await fetch(url); // permet d'attendre une réponse de l'URL
		if (!response.ok) {
			// si la réponse est pas ok, on définit un message d'erreur qui sera exécuté dans le bloc catch
			throw new Error(`Statut de la réponse: ${response.status}`);
		}

		const json = await response.json(); //on utilise la méthode .json() pour récupérer les données de l'objet response
		DateHolidayArray = Object.keys(json);
		DescriptionHolidayArray = Object.values(json);
		//console.log(DescriptionHolidayArray);

		CompareHolidayDate();
		DisplayHoliday();
	} catch (error) {
		console.error(error.message);
	}
}

function DisplayHoliday() {

	document.getElementById("holiday").innerHTML = `<h3>Prochains jours férié :</h3>`

	for (let i = 0; i < UpdateDateHolidayArray.length; i++) {
		let FormatedDateToLocal = UpdateDateHolidayArray[i].toLocaleDateString();

		document.getElementById("holiday").innerHTML += `${FormatedDateToLocal} ${UpdatedDescriptionHolidayArray[i]}<br>`

	}
}

function CompareHolidayDate() {
	let today = new Date();
	let todayStr = today.toLocaleDateString();
	//console.log(todayStr);

	//boucle for ici pour faire pour toutes les dates de jours férié
	for (let i = 0; i < DateHolidayArray.length; i++) {
		const formatDate = DateHolidayArray[i].split("-");
		//console.log(formatDate[0] + formatDate[1] + formatDate[2]);
		const ComparingDate = new Date();
		ComparingDate.setDate(formatDate[2]);
		ComparingDate.setMonth(formatDate[1] - 1); // -1 car le mois en js commence par 0 pour Janvier
		ComparingDate.setFullYear(formatDate[0]);
		//console.log(ComparingDate);

		//mettre les dates en millisecondes
		const todayMilli = today.getTime();
		const ComparedDateMilli = ComparingDate.getTime();

		if (todayMilli < ComparedDateMilli) {
			UpdateDateHolidayArray.push(ComparingDate);
		}
	} //fin de la boucle for
	//console.log(UpdateDateHolidayArray);
	//console.log(UpdateDateHolidayArray.length);

	//mis à jour du tableau contenant les descriptions des jours fériés
	UpdatedDescriptionHolidayArray = DescriptionHolidayArray.slice(
		DescriptionHolidayArray.length - UpdateDateHolidayArray.length
	); // slice supprime les éléments depuis l'index 0 jusqu'au nombre spécifié
}
