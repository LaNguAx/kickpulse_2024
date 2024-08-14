import Main from '../main.js';
import Header from '../header.js';

class Stores {
  constructor() {
    this.initMap();
  }

  async initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { PlacesService } = await google.maps.importLibrary("places");

    // Center point for the map
    const centerLatlng = { lat: 25.7617, lng: -80.1918 }; // Centered around Miami, FL

    // Create the map, centered on the specified point
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: centerLatlng,
      mapId: "DEMO_MAP_ID",
    });

    // Initialize the Places service
    const service = new google.maps.places.PlacesService(map);

    // Fetch branch data from the API
    const branches = await this.fetchBranches();

    // Extract location data from the branches
    const placeNames = branches.map(branch => branch.location);

    // Function to handle the Places API response
    function handleSearchResult(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(result => {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: result.geometry.location,
            map,
            title: result.name,
          });

          // Add click listener to each marker
          marker.addListener("click", () => {
            map.setZoom(8);
            map.setCenter(marker.position);
          });
        });
      } else {
        console.error(`Places search was not successful: ${status}`);
      }
    }

    // Loop through place names and perform a Text Search request for each
    placeNames.forEach(placeName => {
      const request = {
        query: placeName,
        fields: ["name", "geometry"],
      };

      service.textSearch(request, handleSearchResult);
    });
  }

  async fetchBranches() {
    try {
      const response = await fetch('/api/branches');
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        console.error('Failed to fetch branches:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  }
}
function initStores() {
  window.addEventListener('load', function () {
    new Stores();
  });
}
initStores();

Main.initComponents([Header]);

Main.hidePreLoader();
