const app = document.getElementById("app");

/* ======================
   ESTADO
====================== */
let index = 0;
let enVideo = false;

/* ======================
   ESCENAS
====================== */
const escenas = [
  {
    texto: "Estás en clase...",
    fondo: "img/scenes/dark.jpg",
    posicion: "position1"
  },
  {
    texto: "Sigues en la secundaria...",
    fondo: "img/scenes/dark.jpg",
    posicion: "position1"
  },
  {
    texto: "Todo está normal...",
    fondo: "img/scenes/classroom.gif",
    posicion: "position2"
  },
  {
    texto: "Te llega un papelito 👀",
    fondo: "img/scenes/classroom.gif",
    posicion: "position2"
  },
  {
    tipo: "video"
  }
];

/* ======================
   RENDER ESCENA
====================== */
function mostrarEscena() {
  const escena = escenas[index];

  // 👉 ESCENA DE VIDEO
  if (escena.tipo === "video") {
    app.innerHTML = "";
    iniciarVideo();
    return;
  }

  // 👉 FONDO
  setBackground(escena.fondo);

  // 👉 POSICIÓN
  app.classList.remove("position1", "position2", "position3");

  if (escena.posicion) {
    app.classList.add(escena.posicion);
  }

  // 👉 TEXTO CON EFECTO
  renderTexto(escena.texto);
}

/* ======================
   TYPEWRITER
====================== */
let typingInterval = null;

function renderTexto(texto) {
  // limpiar interval previo
  if (typingInterval) clearInterval(typingInterval);

  app.innerHTML = `<p id="texto"></p>`;
  const el = document.getElementById("texto");

  let i = 0;

  typingInterval = setInterval(() => {
    el.innerHTML += texto[i];
    i++;

    if (i >= texto.length) {
      clearInterval(typingInterval);
    }
  }, 40);
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
    { time: 0.3, texto: "¿Qué es eso? 🤔<br>¿Quieres leerlo?" },
    { time: 7, texto: "Awwww... ¿Seguir leyendo?" },
    { time: 16, texto: "OMG!!! 👀<br>¿Seguir leyendo?" }
  ];

  let current = 0;

  video.muted = true;
  video.play();

  video.addEventListener("timeupdate", () => {
    if (current >= checkpoints.length) return;

    const checkpoint = checkpoints[current];

    if (video.currentTime >= checkpoint.time && !checkpoint.usado) {
      checkpoint.usado = true;

      video.pause();

      overlay.innerHTML = `
        <button class="btn-continuar" onclick="continuarVideo()">
          ${checkpoint.texto}
        </button>
      `;

      current++;
    }
  });

  window.continuarVideo = function () {
    overlay.innerHTML = "";
    video.play();
  };
}

/* ======================
   FONDO
====================== */
function setBackground(image) {
  document.body.style.backgroundImage = `url('${image}')`;
}

/* ======================
   INPUT USUARIO
====================== */
document.body.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") return;
  if (enVideo) return;

  if (index < escenas.length - 1) {
    index++;
    mostrarEscena();
  }
});

/* ======================
   INIT
====================== */
mostrarEscena();