const cityMap = initializeMap();
loadTiles(cityMap);
let groupMarkers = L.markerClusterGroup();
cityMap.addLayer(groupMarkers);

export async function getAvailableBikes() {
    groupMarkers.clearLayers();
    console.log('test');
    try {
        const allData = await fetchAllData();
        createMarkers(allData, groupMarkers, cityMap);
    } catch (error) {
        console.error(error.message);
    }
}

function initializeMap() {
	return L.map("myMap").setView([47.218371, -1.553621], 13);
}

function loadTiles(map) {
	L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
		attribution:
		'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
		minZoom: 1,
		maxZoom: 20,
	}).addTo(map);
}

async function fetchData(offset, limit) {
	// on place les variables limit et offset entre backticks
	const url = `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_stations-velos-libre-service-nantes-metropole-disponibilites/records?order_by=number%20ASC&limit=${limit}&offset=${offset}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return await response.json();
}

async function fetchAllData() {
	const json1 = await fetchData(0, 100); // on appel fetchData pour les 100 premiers résultats
	const json2 = await fetchData(100, 25); // on appel fetchData pour les 25 résultats suivants
	const json = [...json1.results, ...json2.results]; // on place les résultats dans un nouveau tableau unique
	return json;
}

function listenerButton(data, markers, myMap) {
	document
	.getElementById("button1")
	.addEventListener("click", () => updateMarkers('available_bikes', data, markers, myMap));
	document.getElementById("button2").addEventListener("click", () => updateMarkers('available_bike_stands', data, markers, myMap));
}

function createMarkers(data, markers, myMap) {
	for (let i = 0; i < data.length; i++) {
		let availableBikes = new Set();
		availableBikes.add(data[i]);
		//On parcourt les différentes stations et on leur attribue un marqueur
		for (let bikeStns of availableBikes) {	
			let marker = L.marker([bikeStns.position.lat, bikeStns.position.lon], {
				icon: updatePinpoint(bikeStns, "available_bikes"),
			}); 
			marker.bindPopup(
				`<p>${bikeStns.name}<br>${bikeStns.address}<br> Vélos disponibles : ${bikeStns.available_bikes}<br>Places disponibles: ${bikeStns.available_bike_stands}`
			);
			markers.addLayer(marker);
		}
		myMap.addLayer(markers);
	}
	listenerButton(data, markers, myMap);
}

function updateMarkers(source, data, markers, myMap) {
	markers.clearLayers();
	
	for (let i = 0; i < data.length; i++) {
		let availableBikes = new Set();
		availableBikes.add(data[i]);
		//On parcourt les différentes stations et on leur attribue un marqueur
		for (let bikeStns of availableBikes) {
			let marker = L.marker([bikeStns.position.lat, bikeStns.position.lon], {
				icon: updatePinpoint(bikeStns, source),
			}); 
			marker.bindPopup(
				`<p>${bikeStns.name}<br>${bikeStns.address}<br> Vélos disponibles : ${bikeStns.available_bikes}<br>Places disponibles: ${bikeStns.available_bike_stands}`
			);
			markers.addLayer(marker);
		}
		myMap.addLayer(markers);
	}
}

function updatePinpoint(stations, source) {
	let newIcon = L.Icon.extend({
		options: {
			iconSize: [40, 45], // size of the icon
			iconAnchor: [22, 45], // point of the icon which will correspond to marker's location
			popupAnchor: [-3, -50], // point from which the popup should open relative to the iconAnchor
		},
	});
	
	let greenIcon = new newIcon({iconUrl: "./ico/pin-point-GREEN.png",}),
		orangeIcon = new newIcon({iconUrl: "./ico/pin-point-ORANGE.png",}),
		redIcon = new newIcon({ iconUrl: "./ico/pin-point-RED.png" });
	
	let dynIcon;
	
	if (stations[source] > 3) {
		return dynIcon = greenIcon;
	} else if (stations[source] >= 1) {
		return dynIcon = orangeIcon;
	} else {
		return dynIcon = redIcon;
	}
}

setInterval(getAvailableBikes, 60000);