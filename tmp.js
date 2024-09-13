export async function getAvailableBikes() {
    const myMap = initializeMap();
    loadTiles(myMap);
    const markers = L.markerClusterGroup();
    
    try {
        const data = await fetchAllData();
        addBikeMarkers(data, markers, myMap);
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
    const url = `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_stations-velos-libre-service-nantes-metropole-disponibilites/records?order_by=number%20ASC&limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
}

async function fetchAllData() {
    const json1 = await fetchData(0, 100);
    const json2 = await fetchData(100, 25);
    return [...json1.results, ...json2.results];
}

function createIcon(url) {
    return new L.Icon({
        iconUrl: url,
        iconSize: [40, 45],
        iconAnchor: [22, 45],
        popupAnchor: [-3, -50]
    });
}

function determineIcon(bikeStns, source, icons) {
    if (bikeStns[source] > 3) {
        return icons.greenIcon;
    } else if (bikeStns[source] > 1) {
        return icons.orangeIcon;
    } else {
        return icons.redIcon;
    }
}

function addBikeMarkers(data, markers, map) {
    const greenIcon = createIcon('./ico/pin-point-GREEN.png');
    const orangeIcon = createIcon('./ico/pin-point-ORANGE.png');
    const redIcon = createIcon('./ico/pin-point-RED.png');

    const icons = { greenIcon, orangeIcon, redIcon };

    data.forEach(station => {
        const marker = L.marker([station.position.lat, station.position.lon], { 
            icon: determineIcon(station, 'available_bikes', icons)
        });
        
        marker.bindPopup(
            `<p>${station.name}<br>${station.address}<br> Vélos disponibles : ${station.available_bikes}<br>Places disponibles: ${station.available_bike_stands}</p>`
        );

        markers.addLayer(marker);
    });

    map.addLayer(markers);
    
    document.getElementById("button1").addEventListener("click", () => updateMarkers('available_bikes', data, markers, icons, map));
    document.getElementById("button2").addEventListener("click", () => updateMarkers('available_bike_stands', data, markers, icons, map));
}

function updateMarkers(source, data, markers, icons, map) {
    markers.clearLayers();

    data.forEach(station => {
        const marker = L.marker([station.position.lat, station.position.lon], {
            icon: determineIcon(station, source, icons)
        });

        marker.bindPopup(
            `<p>${station.name}<br>${station.address}<br> Vélos disponibles : ${station.available_bikes}<br>Places disponibles: ${station.available_bike_stands}</p>`
        );

        markers.addLayer(marker);
    });

    map.addLayer(markers);
}






export function listenerButton() {
	document.getElementById("button1").addEventListener("click", updatePinpoint('available_bikes'))
	document.getElementById("button2").addEventListener("click", updatePinpoint('available_bike_stands'))
}

function updatePinpoint(source) {
	if (bikeStns[source] > 3) {
		dynIcon = greenIcon
	} else if (bikeStns[source] >= 1) {
		dynIcon = orangeIcon
	} else {
		dynIcon = redIcon
	}
}