function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 39.8283, lng: -98.5795 } // Center of the US
    });

    const locations = [
        { lat: 25.9580, lng: -80.1420, title: 'Miami Store' },
        { lat: 40.7580, lng: -73.9855, title: 'New York Times Square Store' },
        { lat: 34.0522, lng: -118.2437, title: 'Los Angeles Store' },
        { lat: 41.8903, lng: -87.6241, title: 'Chicago Store' },
        { lat: 47.6101, lng: -122.2015, title: 'Seattle Store' }
    ];

    locations.forEach(location => {
        new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title
        });
    });
}
