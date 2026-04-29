const app = document.getElementById("app");

const sonidoClick = new Audio("audio/click.mp3");

const musica = new Audio("audio/escuela.mp3");
musica.loop = true;
musica.volume = 0.4;

const latido = new Audio("audio/heartbeat.mp3");
latido.loop = true;
latido.volume = 0.6;

const musicaFinal = new Audio("audio/romantica.mp3");
musicaFinal.loop = true;
musicaFinal.volume = 0.5;

/* ======================
   ESTADO
====================== */
let index = 0;
let enVideo = false;

/* ======================
   ESCENAS
====================== */
const escenas = [
  { texto: ". . .", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: "Estás en clase...", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: "De nuevo en la preparatoria...", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: "Todo es... normal...", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: "Cómo cualquier otro día.", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: " . . . ", fondo: "img/scenes/passing-note.gif", posicion: "position3" },
  { texto: "Alguien te pasa un papelito 👀", fondo: "img/scenes/passing-note.gif", posicion: "position3" },
  { texto: "No es para ti.", fondo: "img/scenes/passing-note.gif", posicion: "position3" },
  { texto: ". . .", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: "O eso pensaste, pero . . . ", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { tipo: "video" }
];

/* ======================
   RENDER ESCENA
====================== */
function mostrarEscena() {
  const escena = escenas[index];

  // fade out música antes del video
  if (index === escenas.length - 2) {
    fadeOutMusica();
  }

  if (escena.tipo === "video") {
    app.innerHTML = "";
    iniciarVideo();
    return;
  }

  setBackground(escena.fondo);

  app.classList.remove("position1", "position2", "position3");
  if (escena.posicion) app.classList.add(escena.posicion);

  renderTexto(escena.texto);
}

/* ======================
   TYPEWRITER
====================== */
let typingInterval = null;

function renderTexto(texto) {
  if (typingInterval) clearInterval(typingInterval);

  app.innerHTML = `<p id="texto"></p>`;
  const el = document.getElementById("texto");

  let i = 0;

  typingInterval = setInterval(() => {
    el.innerHTML += texto[i];
    i++;
    if (i >= texto.length) clearInterval(typingInterval);
  }, 40);
}

/* ======================
   VIBRACIÓN
====================== */

let latidoTimeout = null;
let ritmoBase = 950; // ms (≈ duración de un ciclo)

function iniciarLatidos() {
  latido.currentTime = 0;
  latido.playbackRate = 0.8;
  latido.volume = 0.2;
  latido.play().catch(() => {});

  function latir() {
    if (navigator.vibrate) {
      navigator.vibrate([80, 60, 120]); // tum-tum
    }

    latidoTimeout = setTimeout(latir, ritmoBase);
  }

  latir();
}

function acelerarLatidos() {
  // acelera audio
  latido.playbackRate = Math.min(latido.playbackRate + 0.2, 2);

  // acelera ritmo
  ritmoBase = Math.max(400, ritmoBase - 150);
}

function detenerLatidosSuave(callback) {
  clearTimeout(latidoTimeout);

  const fade = setInterval(() => {
    if (latido.volume > 0.05) {
      latido.volume -= 0.05;
    } else {
      latido.pause();
      latido.currentTime = 0;
      latido.volume = 0.2;
      clearInterval(fade);

      if (callback) callback();
    }
  }, 100);
}

/* ======================
   VIDEO
====================== */
function iniciarVideo() {
  if (enVideo) return;
  enVideo = true;

  app.innerHTML = `
    <div class="video-container">
      <video id="video" playsinline>
        <source src="img/scenes/papelito.mp4" type="video/mp4">
      </video>
      <div id="overlay"></div>
    </div>
  `;

  setTimeout(setupVideo, 100);
}

function setupVideo() {
  const video = document.getElementById("video");
  const overlay = document.getElementById("overlay");

  const checkpoints = [
    { time: 0.3, texto: "¿Qué es eso? 🤔<br>¿Quieres leerlo?", posicion: "overlay-center" },
    { time: 7, texto: "Awwww... ¿Seguir leyendo?", posicion: "overlay-bottom" },
    { time: 16, texto: "OMG!!! 👀<br>¿Seguir leyendo?", posicion: "overlay-top" }
  ];

  let current = 0;

  // ❤️ iniciar latidos
  iniciarLatidos();

  video.muted = true;
  video.play();

  video.addEventListener("timeupdate", () => {
    if (current >= checkpoints.length) return;

    const checkpoint = checkpoints[current];

    if (video.currentTime >= checkpoint.time && !checkpoint.usado) {
      checkpoint.usado = true;

      // 🔥 tensión
      acelerarLatidos();

      // 🎥 zoom progresivo
      video.style.transform = `scale(${1 + current * 0.05})`;
      video.style.transition = "transform 0.8s ease";

      video.pause();

      // UI overlay
      overlay.className = "";
      overlay.classList.add("overlay-base");

      if (checkpoint.posicion) {
        overlay.classList.add(checkpoint.posicion);
      }

      overlay.innerHTML = `
        <button class="btn-continuar" onclick="continuarVideo()">
          ${checkpoint.texto}
        </button>
      `;

      current++;
    }
  });

  window.continuarVideo = function () {
    sonidoClick.play();
    video.muted = false;
    overlay.innerHTML = "";

    // 💥 MOMENTO FINAL
    if (current === checkpoints.length) {

      detenerLatidosSuave(() => {

        // 🤫 pausa dramática REAL
        setTimeout(() => {
          musicaFinal.currentTime = 0;
          musicaFinal.play().catch(() => {});
        }, 4500);

      });

      // 💕 efectos visuales
      video.classList.add("video-romantico");
      lanzarCorazones();
    }

    video.play();
  };
}

/* ======================
   AUDIO
====================== */
function iniciarLatidos() {
  latido.currentTime = 0;
  latido.playbackRate = 0.8;
  latido.play().catch(() => {});
}

function fadeOutMusica() {
  const fade = setInterval(() => {
    if (musica.volume > 0.05) {
      musica.volume -= 0.05;
    } else {
      musica.pause();
      musica.currentTime = 0;
      musica.volume = 0.4;
      clearInterval(fade);
    }
  }, 100);
}

function fadeInMusica() {
  musica.volume = 0;
  musica.play().catch(() => {});

  const fade = setInterval(() => {
    if (musica.volume < 0.4) {
      musica.volume += 0.05;
    } else {
      clearInterval(fade);
    }
  }, 100);
}

/* ======================
   EFECTOS
====================== */
function lanzarCorazones() {
  for (let i = 0; i < 10; i++) {
    const heart = document.createElement("div");
    heart.className = "corazon";
    heart.innerHTML = "💖";
    heart.style.left = Math.random() * 100 + "%";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }
}

/* ======================
   FONDO
====================== */
function setBackground(image) {
  document.body.style.backgroundImage = `url('${image}')`;
}

/* ======================
   INPUT
====================== */
document.body.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") return;
  if (enVideo) return;

  if (index < escenas.length - 1) {
    index++;

    if (index === 2 && musica.paused) {
      fadeInMusica();
    }

    mostrarEscena();
  }
});

/* ======================
   INIT
====================== */
mostrarEscena();