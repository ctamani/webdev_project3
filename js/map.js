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

  // Feature 1: InfoWindow
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

// Feature 2: Search 
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

// Feature 3: Click-to-drop-pin 
let pinCount = 0;
const allMarkers = [];

map.addListener("click", (e) => {
  const lat = e.latLng.lat().toFixed(5);
  const lng = e.latLng.lng().toFixed(5);

  // Prompt user for a note
  const note = prompt("Add a note for this pin:", `Pin ${pinCount + 1}`);

  // Exit early if Cancel was clicked or input is empty
  if (note === null || note.trim() === "") {
    return;
  }

  pinCount++;

  const marker = new google.maps.Marker({
    position: e.latLng,
    map: map,
    title: note
  });

  allMarkers.push(marker);

  const infoWindow = new google.maps.InfoWindow({
    content: `<strong>${note}</strong><br>(${lat}, ${lng})`
  });

  marker.addListener("click", () => infoWindow.open(map, marker));

  const listItem = document.createElement("li");
  listItem.innerHTML = `📍 <strong>${note}</strong> — (${lat}, ${lng})
    <button class="edit-btn" style="margin-left: 10px;">Edit</button>`;

  // Edit button functionality (same logic as before)
  listItem.querySelector(".edit-btn").addEventListener("click", () => {
    const newNote = prompt("Edit your pin note:", note);
    if (newNote !== null && newNote.trim() !== "") {
      listItem.innerHTML = `📍 <strong>${newNote}</strong> — (${lat}, ${lng})
        <button class="edit-btn" style="margin-left: 10px;">Edit</button>`;
      marker.setTitle(newNote);
      infoWindow.setContent(`<strong>${newNote}</strong><br>(${lat}, ${lng})`);

      // Rebind edit after HTML replacement
      listItem.querySelector(".edit-btn").addEventListener("click", () => {
        const newNoteAgain = prompt("Edit your pin note again:", newNote);
        if (newNoteAgain !== null && newNoteAgain.trim() !== "") {
          listItem.innerHTML = `📍 <strong>${newNoteAgain}</strong> — (${lat}, ${lng})
            <button class="edit-btn" style="margin-left: 10px;">Edit</button>`;
          marker.setTitle(newNoteAgain);
          infoWindow.setContent(`<strong>${newNoteAgain}</strong><br>(${lat}, ${lng})`);
        }
      });
    }
  });

  document.getElementById("location-list").appendChild(listItem);
});

// Clear all pins + list
document.getElementById("clear-pins").addEventListener("click", () => {
  allMarkers.forEach(marker => marker.setMap(null));
  allMarkers.length = 0;
  document.getElementById("location-list").innerHTML = '';
  pinCount = 0;
});

}