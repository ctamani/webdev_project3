// ==================== LYRICS PLAYER CODE ====================
document.addEventListener('DOMContentLoaded', () => {
  // --- Controls ---
  const audio = document.getElementById('song-audio');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeDisplay = document.getElementById('current-time');
  const totalTimeDisplay = document.getElementById('total-time');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const rewindBtn = document.getElementById('rewind-btn');
  const forwardBtn = document.getElementById('forward-btn');
  const reloadBtn = document.getElementById('reload-btn');
  const loopBtn = document.getElementById('loop-btn');

  const lyricsLines = document.querySelectorAll('.lyrics-line');
  const largeLyricsDisplay = document.getElementById('large-lyrics-display');

  const lyrics = [
    { time: 0, text: '' },
    { time: 1, text: "i'll keep you safe" },
    { time: 2, text: "in these arms of mine" },
    { time: 4, text: "hold on to me" },
    { time: 6, text: "pretty baby and you'll see" },
    { time: 9, text: "i can be all you need" },
    { time: 13, text: "i'll keep you safe in these arms of mine" },
    { time: 17, text: "hold on to me" },
    { time: 19, text: "pretty baby and you'll see" },
    { time: 21, text: "i'll keep you" },
    { time: 22, text: "safe in these arms of mine" },
    { time: 25, text: "hold on to me" },
    { time: 27, text: "pretty baby and you'll see" },
    { time: 30, text: "i'll keep you safe in these arms of mine" },
    { time: 33, text: "hold on to me" },
    { time: 36, text: "pretty baby and you'll see" },
    { time: 38, text: "i'll keep you safe" },
    { time: 39, text: "in these arm of mine" },
    { time: 42, text: "hold on to me" },
    { time: 46, text: "i'll keep you safe in these arms of mine" },
    { time: 49, text: "hold on to me" },
    { time: 52, text: "pretty baby and you'll see" },
    { time: 55, text: "i'll keep you safe in these arms of mine" },
    { time: 58, text: "hold on to me pretty baby" },
    { time: 62, text: "(and you'll see)" },
    { time: 63, text: "i'll keep you safe in these arms of mine" },
    { time: 67, text: "hold on to me pretty baby" },
    { time: 70, text: "and you'll see" },
    { time: 80, text: "i'll keep you safe in these arms of mine" },
    { time: 83, text: "hold on to me" },
    { time: 85, text: "pretty baby" },
    { time: 92, text: "I'll keep you safe in these arms of mine" },
    { time: 97, text: "hold on to me" },
    { time: 98, text: "pretty baby" },
    { time: 100, text: "I'll keep you safe in these arms of mine" },
    { time: 105, text: "hold on to me" },
    { time: 106, text: "Pretty baby" },
    { time: 109, text: "I'll keep you safe in these arms of mine" },
    { time: 112, text: "hold on to me" },
    { time: 114, text: "pretty baby" },
    { time: 116, text: "I'll keep you safe in these arms of mine" },
    { time: 121, text: "hold on to me" },
    { time: 123, text: "pretty baby" },
    { time: 125, text: "I'll keep you safe in these arms of mine" },
    { time: 129, text: "hold on to me" },
    { time: 131, text: "pretty baby" },
    { time: 134, text: "*I'll keep you safe in these arms of mine*" },
    { time: 138, text: "*hold on into me*" },
    { time: 140, text: "*pretty baby*" },
    { time: 142, text: "(I'll keep you safe in these arms of mine)" },
    { time: 146, text: "(hold into me)" },
    { time: 148, text: "(pretty baby)" },
    { time: 150, text: "I'll keep you safe in these arms of mine" },
    { time: 155, text: "hold on to me" },
    { time: 157, text: "pretty baby" },
    { time: 159, text: "I'll keep you safe in these arms of mine" },
    { time: 163, text: "hold on to me" },
    { time: 165, text: "pretty baby" },
    { time: 167, text: "" }
  ];

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function updateLyricsDisplay(index) {
    largeLyricsDisplay.innerHTML = '';
    if (index >= 0 && index < lyrics.length) {
      const p = document.createElement('p');
      p.textContent = lyrics[index].text;
      p.className = 'highlight';
      largeLyricsDisplay.appendChild(p);
      largeLyricsDisplay.classList.add('active');

      const currentLyricText = lyrics[index].text.toLowerCase().trim();
      lyricsLines.forEach(line => line.classList.remove('highlight'));

      let foundExactMatch = false;
      lyricsLines.forEach(line => {
        if (line.textContent.toLowerCase().trim() === currentLyricText) {
          line.classList.add('highlight');
          foundExactMatch = true;
        }
      });

      if (!foundExactMatch) {
        lyricsLines.forEach(line => {
          const lineText = line.textContent.toLowerCase().trim();
          if (currentLyricText.includes(lineText) && lineText.length > 3) {
            line.classList.add('highlight');
          }
        });

        let combinedText = '';
        let startHighlighting = false;
        let highlightedLines = [];
        for (let i = 0; i < lyricsLines.length; i++) {
          const lineText = lyricsLines[i].textContent.toLowerCase().trim();
          if (!startHighlighting && currentLyricText.startsWith(lineText) && lineText.length > 3) {
            startHighlighting = true;
            combinedText = lineText;
            highlightedLines.push(i);
            lyricsLines[i].classList.add('highlight');
            continue;
          }
          if (startHighlighting) {
            const potentialCombined = combinedText + ' ' + lineText;
            if (currentLyricText.includes(potentialCombined)) {
              combinedText = potentialCombined;
              highlightedLines.push(i);
              lyricsLines[i].classList.add('highlight');
              if (potentialCombined === currentLyricText) {
                break;
              }
            } else {
              startHighlighting = false;
            }
          }
        }
      }
    } else {
      largeLyricsDisplay.classList.remove('active');
      lyricsLines.forEach(line => line.classList.remove('highlight'));
    }
  }

  let isPlaying = false;
  let isLooping = false;
  let currentLyricIndex = -1;

  if (audio) {
    audio.addEventListener('loadedmetadata', () => {
      progressBar.max = Math.floor(audio.duration);
      totalTimeDisplay.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      progressBar.value = audio.currentTime;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
      let idx = -1;
      for (let i = 0; i < lyrics.length; i++) {
        if (audio.currentTime >= lyrics[i].time) {
          idx = i;
        } else {
          break;
        }
      }
      if (idx !== currentLyricIndex) {
        updateLyricsDisplay(idx);
        currentLyricIndex = idx;
      }
    });

    audio.addEventListener('ended', () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        updateLyricsDisplay("");
      }
    });

    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        playPauseBtn.textContent = '▶';
      } else {
        audio.play();
        playPauseBtn.textContent = '❚❚';
      }
      isPlaying = !isPlaying;
    });

    rewindBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
    });

    forwardBtn.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
    });

    reloadBtn.addEventListener('click', () => {
      audio.currentTime = 0;
      audio.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶';
      updateLyricsDisplay("");
    });

    loopBtn.addEventListener('click', () => {
      isLooping = !isLooping;
      loopBtn.classList.toggle('active', isLooping);
      audio.loop = isLooping;
    });

    progressBar.addEventListener('input', () => {
      audio.currentTime = progressBar.value;
    });

    updateLyricsDisplay("");
  }
});

// ==================== RESUME CAROUSEL & SKILLS CODE ====================
document.addEventListener("DOMContentLoaded", function () {
  // Project Carousel
  const projects = document.querySelectorAll('.project-item');
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');
  let currentIndex = 0;

  function showProject(index) {
    projects.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  if (leftBtn && rightBtn && projects.length) {
    leftBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + projects.length) % projects.length;
      showProject(currentIndex);
    });

    rightBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % projects.length;
      showProject(currentIndex);
    });

    showProject(currentIndex);
  }

  // Skills Section
  const skills = document.querySelectorAll('.skills-list li');
  skills.forEach(skill => {
    skill.addEventListener('mouseenter', function() {
      skill.classList.add('hovered');
    });
    skill.addEventListener('mouseleave', function() {
      skill.classList.remove('hovered');
    });
  });
});

// ==================== GOOGLE MAPS & FEATURES CODE ====================
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
      scaledSize: new google.maps.Size(50, 50),
    },
  });

  // Feature 1: InfoWindow
  const infoWindow = new google.maps.InfoWindow({
    content: "<h2>IIT Main Campus</h2><p>Come visit us in Chicago!</p>"
  });
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  // Feature 2: Circle
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

  // Feature 3: Search
  const input = document.getElementById("search-box");
  if (input) {
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

  // Feature 4: Click-to-drop-pin
  let pinCount = 0;
  const allMarkers = [];
  map.addListener("click", (e) => {
    const lat = e.latLng.lat().toFixed(5);
    const lng = e.latLng.lng().toFixed(5);

    const note = prompt("Add a note for this pin:", `Pin ${pinCount + 1}`);
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

    // Edit button functionality
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

    const locationList = document.getElementById("location-list");
    if (locationList) {
      locationList.appendChild(listItem);
    }
  });

  // Clear all pins + list
  const clearBtn = document.getElementById("clear-pins");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      allMarkers.forEach(marker => marker.setMap(null));
      allMarkers.length = 0;
      const locationList = document.getElementById("location-list");
      if (locationList) locationList.innerHTML = '';
      pinCount = 0;
    });
  }
}