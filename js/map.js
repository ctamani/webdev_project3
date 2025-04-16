// Initialize and add the map
function initMap() {
  // 1. Set Location: IIT Location
  const location = {lat: 41.8349, lng: -87.6270 };

  // 2. Create the map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: location,
    mapTypeId: 'roadmap',
    mapTypeControl: true,
    zoomControl: true,
    streetViewControl: false,
  });

  // 3. Add a marker
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    title: "We are here!",
    icon: {
      url: 'images/smollcat.png',
      scaledSize: new google.maps.Size(50, 50), // Width x Height in pixels
    },
  });

  // ___Feature: InfoWindow___
  // 4. Add an InfoWindow
  const infoWindow = new google.maps.InfoWindow({
    content: "<h2>IIT Main Campus</h2><p>Come visit us in Chicago!</p>"
  });
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

 new google.maps.Circle({
  strokeColor: '#ff8df7',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#ff8df7',
  fillOpacity: 0.15,
  map,
  center: location,
  radius: 2000
});

// ___Feature: Search ___
const input = document.getElementById("search-box");
const autocomplete = new google.maps.places.Autocomplete(input);
autocomplete.bindTo("bounds", map);

const searchMarker = new google.maps.Marker({
  map: map,
  icon: {
    url: 'images/smollcat.png',
    scaledSize: new google.maps.Size(40, 40),
  },
});

autocomplete.addListener("place_changed", () => {
  const place = autocomplete.getPlace();
  if (!place.geometry) return;

  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(15);
  }

  searchMarker.setPosition(place.geometry.location);
});

}