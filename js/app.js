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
  { texto: "Estás en clase.", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: "De nuevo en la preparatoria...", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: "Todo es... normal.", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: "Cómo cualquier otro día.", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: "Una clase aburrida.", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: "Quieres que ya termine... <br> Solo contando los segundos para <br> que el profesor diga algo cómo...", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: "\"Muy bien jovenes! <br> Nos vemos la siguiente clase.\"", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: "Pero no llega el momento.", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: "Desearías haberte ido de pinta de nuevo.", fondo: "img/scenes/classroom.gif", posicion: "position2" },
  { texto: "Aunque sientes que hoy <br> alguien te ha estado observando... ", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: ". . .", fondo: "img/scenes/passing-note.gif", posicion: "position3" },
  { texto: "Alguien te pasa un papelito. 👀", fondo: "img/scenes/passing-note.gif", posicion: "position3" },
  { texto: "No es para ti.", fondo: "img/scenes/passing-note.gif", posicion: "position3" },
  { texto: ". . .", fondo: "img/scenes/passing-note.gif", posicion: "position3" },
  { texto: "O eso pensaste, pero...", fondo: "img/scenes/passing-note.gif", posicion: "position3" },
  { texto: "Espera un momento...", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: "Tiene tu nombre!?", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { texto: " ", fondo: "img/scenes/dark.jpg", posicion: "position1" },
  { tipo: "video" },
  { texto: "Así empiezan las historias bonitas", fondo: "img/scenes/dark.jpg", posicion: "position1" }
];

/* ======================
   RENDER ESCENA
====================== */
function mostrarEscena() {
  const escena = escenas[index];

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
    // detectar <br>
    if (texto.slice(i, i + 4) === "<br>") {
      el.innerHTML += "<br>";
      i += 4;
    } else {
      el.innerHTML += texto[i];
      i++;
    }

    if (i >= texto.length) clearInterval(typingInterval);
  }, 40);
}

/* ======================
   VIBRACIÓN
====================== */
let latidoTimeout = null;
let ritmoBase = 950;

function iniciarLatidos() {
  latido.currentTime = 0;
  latido.playbackRate = 0.8;
  latido.volume = 0.2;
  latido.play().catch(() => {});

  function latir() {
    if (navigator.vibrate) {
      navigator.vibrate([80, 60, 120]);
    }

    latidoTimeout = setTimeout(latir, ritmoBase);
  }

  latir();
}

function acelerarLatidos() {
  latido.playbackRate = Math.min(latido.playbackRate + 0.2, 2);
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

  iniciarLatidos();

  video.muted = true;
  video.play();

  video.addEventListener("timeupdate", () => {
    if (current >= checkpoints.length) return;

    const checkpoint = checkpoints[current];

    if (video.currentTime >= checkpoint.time && !checkpoint.usado) {
      checkpoint.usado = true;

      acelerarLatidos();

      video.style.transform = `scale(${1 + current * 0.05})`;
      video.style.transition = "transform 0.8s ease";

      video.pause();

      overlay.className = "overlay-base";
      overlay.classList.add(checkpoint.posicion);

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

    if (current >= checkpoints.length) {

      detenerLatidosSuave(() => {

        setTimeout(() => {
          musicaFinal.currentTime = 0;
          musicaFinal.play().catch(() => {});

          iniciarCorazonesLoop();

          setTimeout(() => {
            escenaFinal();
          }, 8000);

        }, 4400);

      });

    }

    video.play();
  };
}

/* ======================
   AUDIO
====================== */
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
   CORAZONES
====================== */
function lanzarCorazones() {
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement("div");
    heart.className = "corazon";
    heart.innerHTML = Math.random() > 0.5 ? "❤️" : "💕";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (20 + Math.random() * 20) + "px";
    heart.style.animationDuration = (2 + Math.random() * 2) + "s";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
  }
}

let corazonesInterval = null;

function iniciarCorazonesLoop() {
  if (corazonesInterval) return;

  corazonesInterval = setInterval(() => {
    lanzarCorazones();
  }, 800);
}

/* ======================
   FONDO
====================== */
function setBackground(image) {
  document.body.style.backgroundImage = `url('${image}')`;
}

/* ======================
   ESCENA FINAL (SOFT CINEMATICA)
====================== */
function escenaFinal() {
  const overlay = document.createElement("div");

  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";

  overlay.style.background = "rgba(0,0,0,0.55)";
  overlay.style.backdropFilter = "blur(6px)";
  overlay.style.webkitBackdropFilter = "blur(6px)";

  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  overlay.style.opacity = 0;
  overlay.style.transition = "opacity 2s ease";
  overlay.style.zIndex = 9999;

  overlay.innerHTML = `
    <div style="
      color: white;
      font-size: 22px;
      text-align: center;
      font-family: sans-serif;
      max-width: 80%;
      line-height: 1.6;
      text-shadow: 0 0 20px rgba(255,255,255,0.3), 0 2px 10px rgba(0,0,0,0.8);
    ">
      <p>Gracias por llegar hasta aquí Adri ❤️</p>
      <p>Espero que te haya gustado esta pequeña historia hecha con mucho cariño 😊</p>
      <p>Y que te haya hecho sentir aunque sea un poquito de lo que me haces sentir cuando puedo hablar contigo</p>
    </div>
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = 1;
  }, 100);
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