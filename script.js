// Initialize Leaflet map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to calculate distance using Haversine formula
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const toRad = (angle) => angle * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Function to calculate azimuth
function calculateAzimuth(lat1, lon1, lat2, lon2) {
    const toRad = (angle) => angle * (Math.PI / 180);
    const toDeg = (angle) => angle * (180 / Math.PI);

    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
              Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
    const azimuth = (toDeg(Math.atan2(y, x)) + 360) % 360;
    return azimuth;
}

// Event listener for the calculate button
document.getElementById('calculate').addEventListener('click', () => {
    const lat1 = parseFloat(document.getElementById('lat1').value);
    const lon1 = parseFloat(document.getElementById('lon1').value);
    const lat2 = parseFloat(document.getElementById('lat2').value);
    const lon2 = parseFloat(document.getElementById('lon2').value);

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        alert("Please enter valid latitude and longitude values.");
        return;
    }

    // Calculate distance and azimuth
    const distanceKm = haversine(lat1, lon1, lat2, lon2);
    const distanceMiles = distanceKm * 0.621371;
    const azimuth = calculateAzimuth(lat1, lon1, lat2, lon2);

    // Update the output
    document.getElementById('distance').innerText = `${distanceKm.toFixed(2)} km (${distanceMiles.toFixed(2)} miles)`;
    document.getElementById('azimuth').innerText = `${azimuth.toFixed(2)}°`;

    // Update map
    map.setView([(lat1 + lat2) / 2, (lon1 + lon2) / 2], 9); // Center map between the points

    // Add markers and line
    L.marker([lat1, lon1]).addTo(map).bindPopup("Point 1").openPopup();
    L.marker([lat2, lon2]).addTo(map).bindPopup("Point 2").openPopup();
    L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'blue' }).addTo(map);
});
