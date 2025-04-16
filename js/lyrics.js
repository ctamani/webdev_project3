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

  // --- Format time as mm:ss ---
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Update both lyrics displays (large and small)
  function updateLyricsDisplay(index) {
    // Update large display
    largeLyricsDisplay.innerHTML = '';
    if (index >= 0 && index < lyrics.length) {
      const p = document.createElement('p');
      p.textContent = lyrics[index].text;
      p.className = 'highlight';
      largeLyricsDisplay.appendChild(p);
      largeLyricsDisplay.classList.add('active');
      
      // Update small display
      const currentLyricText = lyrics[index].text.toLowerCase().trim();
      
      // First, remove all highlights
      lyricsLines.forEach(line => {
        line.classList.remove('highlight');
      });
      
      // Check for full matches first
      let foundExactMatch = false;
      lyricsLines.forEach(line => {
        if (line.textContent.toLowerCase().trim() === currentLyricText) {
          line.classList.add('highlight');
          foundExactMatch = true;
        }
      });
      
      // If no exact match found, check for partial matches
      if (!foundExactMatch) {
        // Check if any line is contained within the current lyric
        lyricsLines.forEach(line => {
          const lineText = line.textContent.toLowerCase().trim();
          if (currentLyricText.includes(lineText) && lineText.length > 3) {
            line.classList.add('highlight');
          }
        });
        
        // Try to reconstruct the full lyric by combining adjacent lines
        let combinedText = '';
        let startHighlighting = false;
        let highlightedLines = [];
        
        for (let i = 0; i < lyricsLines.length; i++) {
          const lineText = lyricsLines[i].textContent.toLowerCase().trim();
          
          // Check if this line starts the current lyric
          if (!startHighlighting && currentLyricText.startsWith(lineText) && lineText.length > 3) {
            startHighlighting = true;
            combinedText = lineText;
            highlightedLines.push(i);
            lyricsLines[i].classList.add('highlight');
            continue;
          }
          
          // If we've started highlighting, keep adding lines until we match the full lyric
          if (startHighlighting) {
            const potentialCombined = combinedText + ' ' + lineText;
            if (currentLyricText.includes(potentialCombined)) {
              combinedText = potentialCombined;
              highlightedLines.push(i);
              lyricsLines[i].classList.add('highlight');
              
              // If we've matched the entire lyric, we can stop
              if (potentialCombined === currentLyricText) {
                break;
              }
            } else {
              // This line doesn't continue the match, so stop highlighting
              startHighlighting = false;
            }
          }
        }
      }
    } else {
      largeLyricsDisplay.classList.remove('active');
      lyricsLines.forEach(line => {
        line.classList.remove('highlight');
      });
    }
  }

  // --- Audio controls and progress ---
  let isPlaying = false;
  let isLooping = false;
  let currentLyricIndex = -1;

  audio.addEventListener('loadedmetadata', () => {
    progressBar.max = Math.floor(audio.duration);
    totalTimeDisplay.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    progressBar.value = audio.currentTime;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);

    // Find the current lyric
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (audio.currentTime >= lyrics[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    if (idx !== currentLyricIndex) {
      updateLyricsDisplay(idx >= 0 ? lyrics[idx].text : '');
      currentLyricIndex = idx;
      updateLyricsDisplay(idx)
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

  // --- Initialize display ---
  updateLyricsDisplay("");
});