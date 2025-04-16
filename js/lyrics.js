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
  const largeLyricsDisplay = document.getElementById('large-lyrics-display');

  const lyrics = [
    { time: 0, text: '' },
    { time: 1, text: "i'll keep you safe" },
    { time: 2, text: "in these arms of mine" },
    { time: 4, text: "hold on to me" },
    { time: 6, text: "pretty baby, can't you see" },
    { time: 9, text: "i can be all you need" },
    { time: 13, text: "i'll keep you safe in these arms of mine" },
    { time: 17, text: "hold on to me" },
    { time: 19, text: "pretty baby, can't you see" },
    { time: 21, text: "i'll keep you" },
    { time: 22, text: "safe in these arms of mine" },
    { time: 25, text: "hold on to me" },
    { time: 27, text: "pretty baby, can't you see" },
    { time: 30, text: "i'll keep you safe in these arms of mine" },
    { time: 33, text: "hold on to me" },
    { time: 36, text: "pretty baby can't you see" },
    { time: 38, text: "i'll keep you safe" },
    { time: 39, text: "in these arm of mine" },
    { time: 42, text: "hold on to me" },
    { time: 46, text: "i'll keep you safe in these arms of mine" },
    { time: 49, text: "hold on to me" },
    { time: 52, text: "pretty baby you will see" },
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

  // --- Prepare large lyrics display ---
  function showLargeLyric(text) {
    largeLyricsDisplay.innerHTML = '';
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      p.className = 'highlight';
      largeLyricsDisplay.appendChild(p);
      largeLyricsDisplay.classList.add('active');
    } else {
      largeLyricsDisplay.classList.remove('active');
    }
  }

  // --- Format time as mm:ss ---
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      showLargeLyric(idx >= 0 ? lyrics[idx].text : '');
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
      showLargeLyric('');
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
    showLargeLyric('');
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
  showLargeLyric('');
});