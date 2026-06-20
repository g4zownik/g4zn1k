/* ========================================================= */
/* ================= CARD REACTIVE ========================= */
/* ========================================================= */

const card = document.querySelector(".card");

if (card) {

  card.addEventListener("mousemove", (e) => {

    const rect = card.getBoundingClientRect();

    const x =
      e.clientX -
      rect.left -
      rect.width / 2;

    const y =
      e.clientY -
      rect.top -
      rect.height / 2;

    const mx =
      x / (rect.width / 2);

    const my =
      y / (rect.height / 2);

    card.style.setProperty(
      "--mx",
      mx.toFixed(2)
    );

    card.style.setProperty(
      "--my",
      my.toFixed(2)
    );

    const angle =
      Math.atan2(y, x) *
      (180 / Math.PI) +
      90;

    card.style.setProperty(
      "--light-angle",
      `${angle.toFixed(1)}deg`
    );

    card.classList.add("tilt");

  });

  card.addEventListener("mouseleave", () => {

    card.style.setProperty("--mx", 0);

    card.style.setProperty("--my", 0);

    card.classList.remove("tilt");

  });

}

/* ========================================================= */
/* ================= SPOTIFY =============================== */
/* ========================================================= */

function formatTime(ms){
  
  const minutes =
    Math.floor(ms / 60000);

  const seconds =
    Math.floor((ms % 60000) / 1000);

  return `${minutes}:${
    seconds < 10
      ? "0" + seconds
      : seconds
  }`;

}
let spotifyProgress = 0;
let spotifyDuration = 0;
let spotifyPlaying = false;
async function loadSpotify(){
  try{

    const response =
      await fetch("/api/spotify");

        const spotifyWidget =
  document.querySelector(
    ".spotify-widget"
  );

    const data =
      await response.json();

    const image =
  document.getElementById(
    "spotify-image"
  );

image.onload = () => {

  image.style.opacity = "1";

};

    const title =
      document.getElementById(
        "spotify-title"
      );

    const artist =
      document.getElementById(
        "spotify-artist"
      );

    const link =
      document.getElementById(
        "spotify-link"
      );

    const status =
      document.getElementById(
        "spotify-status"
      );

    const progressBar =
      document.getElementById(
        "spotify-progress-bar"
      );

    const currentTime =
      document.getElementById(
        "spotify-current"
      );

    const durationTime =
      document.getElementById(
        "spotify-duration"
      );

    if(
      !image ||
      !title ||
      !artist ||
      !link ||
      !status ||
      !progressBar ||
      !currentTime ||
      !durationTime
    ) return;

/* ========================= */
/* PLAYING */
/* ========================= */

if(data.playing){

  spotifyPlaying = true;
  spotifyProgress = data.progress;
  spotifyDuration = data.duration;

  spotifyWidget?.classList.add(
    "spotify-playing"
  );

  if(image.src !== data.image){

    image.style.opacity = "0";

    setTimeout(() => {

      image.src = data.image;

    }, 150);

  }

  if(data.title.length > 18){

    title.classList.add(
      "spotify-marquee"
    );

    if(
      title.getAttribute("data-title")
      !== data.title
    ){

      title.setAttribute(
        "data-title",
        data.title
      );

      title.innerHTML =
      `
      <div class="spotify-track">
        <span>${data.title}</span>
        <span>${data.title}</span>
      </div>
      `;

    }

  }else{

    title.classList.remove(
      "spotify-marquee"
    );

    title.innerHTML =
      `<span>${data.title}</span>`;

  }

  artist.innerText =
    data.artist;

  link.href =
    data.url;

  status.innerText =
    "Listening now";

  const progress =
    (data.progress /
    data.duration) * 100;

  progressBar.style.width =
    `${progress}%`;

  currentTime.innerText =
    formatTime(data.progress);

  durationTime.innerText =
    formatTime(data.duration);

}
/* ========================= */
/* PAUSED */
/* ========================= */

else if(data.paused){

  spotifyPlaying = false;

  spotifyWidget?.classList.remove(
    "spotify-playing"
  );

  if(image.src !== data.image){

    image.style.opacity = "0";

    setTimeout(() => {

      image.src = data.image;

    }, 150);

  }

  if(data.title.length > 18){

    title.classList.add(
      "spotify-marquee"
    );

    if(
      title.getAttribute("data-title")
      !== data.title
    ){

      title.setAttribute(
        "data-title",
        data.title
      );

      title.innerHTML =
      `
      <div class="spotify-track">
        <span>${data.title}</span>
        <span>${data.title}</span>
      </div>
      `;

    }

  }else{

    title.classList.remove(
      "spotify-marquee"
    );

    title.innerHTML =
      `<span>${data.title}</span>`;

  }

  artist.innerText =
    data.artist;

  link.href =
    data.url;

  status.innerText =
    "Paused";

  const progress =
    (data.progress /
    data.duration) * 100;

  progressBar.style.width =
    `${progress}%`;

  currentTime.innerText =
    formatTime(data.progress);

  durationTime.innerText =
    formatTime(data.duration);

  spotifyProgress = data.progress;
  spotifyDuration = data.duration;

}
/* ========================= */
/* OFFLINE */
/* ========================= */

else if(data.offline){

  spotifyPlaying = false;
  spotifyProgress = 0;
  spotifyDuration = 0;

  spotifyWidget?.classList.remove(
    "spotify-playing"
  );

  if(image.src !== data.image){

    image.style.opacity = "0";

    setTimeout(() => {

      image.src = data.image;

    }, 150);

  }

  if(data.title.length > 18){

    title.classList.add(
      "spotify-marquee"
    );

    if(
      title.getAttribute("data-title")
      !== data.title
    ){

      title.setAttribute(
        "data-title",
        data.title
      );

      title.innerHTML =
      `
      <div class="spotify-track">
        <span>${data.title}</span>
        <span>${data.title}</span>
      </div>
      `;

    }

  }else{

    title.classList.remove(
      "spotify-marquee"
    );

    title.innerHTML =
      `<span>${data.title}</span>`;

  }

  artist.innerText =
    data.artist;

  link.href =
    data.url;

  const playedDate =
    new Date(data.playedAt);

  const now =
    new Date();

  const diffMs =
    now - playedDate;

  const diffMinutes =
    Math.floor(
      diffMs / 1000 / 60
    );

  if(diffMinutes < 1){

    status.innerText =
      "Played just now";

  }else if(diffMinutes < 60){

    status.innerText =
      `Played ${diffMinutes}m ago`;

  }else{

    const diffHours =
      Math.floor(
        diffMinutes / 60
      );

    status.innerText =
      `Played ${diffHours}h ago`;

  }

  progressBar.style.width =
    "100%";

  currentTime.innerText =
    formatTime(
      data.duration
    );

  durationTime.innerText =
    formatTime(
      data.duration
    );

}
/* ========================= */
/* NOTHING */
/* ========================= */

else{

  spotifyPlaying = false;
  spotifyProgress = 0;
  spotifyDuration = 0;

  spotifyWidget?.classList.remove(
    "spotify-playing"
  );

  image.src = "";

  title.innerText =
    "Nothing playing";

  artist.innerText =
    "";

  status.innerText =
    "Offline";

  progressBar.style.width =
    "0%";

  currentTime.innerText =
    "0:00";

  durationTime.innerText =
    "0:00";

}

  }catch(err){

  console.log(err);

}

}
loadSpotify();

setInterval(
  loadSpotify,
  10000
);

setInterval(() => {

  if (
    spotifyPlaying &&
    spotifyProgress > 0 &&
    spotifyDuration > 0
  ) {

    spotifyProgress += 1000;

    const progressBar =
      document.getElementById(
        "spotify-progress-bar"
      );

    const currentTime =
      document.getElementById(
        "spotify-current"
      );

    const percent =
      (spotifyProgress /
      spotifyDuration) * 100;

    if (progressBar) {

      progressBar.style.width =
        `${Math.min(percent, 100)}%`;

    }

    if (currentTime) {

      currentTime.innerText =
        formatTime(
          spotifyProgress
        );

    }

  }

}, 1000);
/* ========================================================= */
/* ================= FACEIT =============================== */
/* ========================================================= */

async function loadFaceit() {

  try {

    const response =
      await fetch("/api/faceit");

    const data =
      await response.json();

    const level =
      data.level ?? 1;

    const elo =
      data.elo ?? 0;

    // AVATAR

    document.getElementById(
      "faceit-avatar"
    ).src =
      data.avatar;

    // LEVEL

    document.getElementById(
      "faceit-level-icon"
    ).src =
      `assets/faceit/${level}.svg`;

    // ELO

    document.getElementById(
      "faceit-elo"
    ).innerText =
      elo;

    // FLAGA

    const country =
      document.getElementById(
        "faceit-country"
      );

    if (country && data.country) {

      country.src =
        `https://flagcdn.com/w40/${data.country.toLowerCase()}.png`;

    }

    // KD

    document.getElementById(
      "faceit-kd"
    ).innerText =
      data.kd ?? "-";

    // WIN RATE

    document.getElementById(
      "faceit-winrate"
    ).innerText =
      `${data.winRate ?? "-"}%`;

    // MECZE

    document.getElementById(
      "faceit-matches"
    ).innerText =
      data.matches ?? "-";

    // PROGRESS

    const currentLevelMin =
      1201;

    const nextLevelMin =
      1350;

    const progress =
      ((elo - currentLevelMin) /
      (nextLevelMin - currentLevelMin))
      * 100;

    document.getElementById(
      "faceit-progress-bar"
    ).style.width =
      `${Math.max(
        0,
        Math.min(progress, 100)
      )}%`;

    document.getElementById(
      "faceit-needed"
    ).innerText =
      `+${nextLevelMin - elo} do poziomu 7`;

  } catch (err) {

    console.log(
      "Faceit error:",
      err
    );

  }

}

loadFaceit();

setInterval(
  loadFaceit,
  60000
);