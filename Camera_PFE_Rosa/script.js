const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const nomeAluno = document.getElementById("nomeAluno");
const btnLigar = document.getElementById("btnLigar");
const btnCapturar = document.getElementById("btnCapturar");
const btnDesligar = document.getElementById("btnDesligar");
const btnBaixar = document.getElementById("btnBaixar");
const btnTema = document.getElementById("btnTema");
const iconeTema = document.getElementById("iconeTema");
const textoTema = document.getElementById("textoTema");
const statusCamera = document.getElementById("statusCamera");
const mensagem = document.getElementById("mensagem");
const mensagemVideo = document.getElementById("mensagemVideo");
const mensagemCanvas = document.getElementById("mensagemCanvas");
const infoFoto = document.getElementById("infoFoto");

let streamAtual = null;
let fotoCapturada = false;

// Alterna entre o tema rosa claro e um tema escuro suave.
btnTema.addEventListener("click", () => {
  const escuroAtivo = document.documentElement.dataset.theme === "dark";
  if (escuroAtivo) {
    delete document.documentElement.dataset.theme;
    iconeTema.textContent = "☾";
    textoTema.textContent = "Modo escuro";
    btnTema.setAttribute("aria-label", "Ativar modo escuro");
  } else {
    document.documentElement.dataset.theme = "dark";
    iconeTema.textContent = "☀";
    textoTema.textContent = "Modo claro";
    btnTema.setAttribute("aria-label", "Ativar modo claro");
  }
});

async function ligarCamera() {
  mensagem.textContent = "";
  mensagem.classList.remove("erro");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    mostrarErro("Este navegador não permite acesso à câmera neste endereço. Use o Live Server ou HTTPS.");
    return;
  }

  try {
    streamAtual = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });
    video.srcObject = streamAtual;
    await video.play();

    statusCamera.innerHTML = "<i></i> Ligada";
    statusCamera.classList.add("ligada");
    mensagemVideo.hidden = true;
    btnLigar.disabled = true;
    btnCapturar.disabled = false;
    btnDesligar.disabled = false;
    mensagem.textContent = "Tudo pronto! Digite seu nome e clique em “Capturar foto”.";
  } catch (erro) {
    streamAtual = null;
    if (erro.name === "NotAllowedError" || erro.name === "PermissionDeniedError") {
      mostrarErro("A permissão da câmera foi negada. Permita o acesso nas configurações do navegador e tente novamente.");
    } else if (erro.name === "NotFoundError" || erro.name === "DevicesNotFoundError") {
      mostrarErro("Nenhuma câmera foi encontrada neste dispositivo.");
    } else {
      mostrarErro("Não foi possível ligar a câmera. Verifique se ela está conectada e se outro aplicativo não a está usando.");
    }
  }
}

function capturarFoto() {
  if (!streamAtual || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth) {
    mostrarErro("Ligue a câmera e espere a imagem aparecer antes de capturar.");
    return;
  }
  const nome = nomeAluno.value.trim();
  if (!nome) {
    nomeAluno.focus();
    mostrarErro("Digite seu nome antes de capturar a foto.");
    return;
  }

  const largura = video.videoWidth;
  const altura = video.videoHeight;
  canvas.width = largura;
  canvas.height = altura;

  // Espelha a foto para combinar com a prévia da câmera frontal.
  context.save();
  context.translate(largura, 0);
  context.scale(-1, 1);
  context.filter = "sepia(1)";
  context.drawImage(video, 0, 0, largura, altura);
  context.restore();
  context.filter = "none";

  const agora = new Date();
  const dataHora = agora.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });

  const faixaAltura = Math.max(78, altura * 0.18);
  context.fillStyle = "rgba(48, 25, 42, 0.76)";
  context.fillRect(0, altura - faixaAltura, largura, faixaAltura);
  context.fillStyle = "#ffffff";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.font = `bold ${Math.max(20, largura * 0.035)}px Arial`;
  context.fillText(nome, largura * 0.035, altura - faixaAltura * 0.48, largura * 0.92);
  context.font = `${Math.max(14, largura * 0.022)}px Arial`;
  context.fillText(`Capturada em: ${dataHora}`, largura * 0.035, altura - faixaAltura * 0.17, largura * 0.92);

  // Mantém a foto no Canvas visível ao lado da câmera, sem salvar automaticamente no PC.
  mensagemCanvas.hidden = true;
  fotoCapturada = true;
  btnBaixar.disabled = false;
  infoFoto.textContent = `Capturada em ${dataHora}`;
  mensagem.classList.remove("erro");
  mensagem.textContent = "Foto pronta! Ela aparece ao lado. Use “Baixar foto em PNG” para salvar no computador.";
}

function baixarFoto() {
  if (!fotoCapturada) return;
  const linkTemporario = document.createElement("a");
  linkTemporario.download = "captura-camera-pfe.png";
  linkTemporario.href = canvas.toDataURL("image/png");
  document.body.appendChild(linkTemporario);
  linkTemporario.click();
  linkTemporario.remove();
}

function desligarCamera() {
  if (streamAtual) {
    streamAtual.getTracks().forEach((track) => track.stop());
    streamAtual = null;
  }
  video.pause();
  video.srcObject = null;
  statusCamera.innerHTML = "<i></i> Desligada";
  statusCamera.classList.remove("ligada");
  mensagemVideo.hidden = false;
  btnLigar.disabled = false;
  btnCapturar.disabled = true;
  btnDesligar.disabled = true;
  mensagem.classList.remove("erro");
  mensagem.textContent = "Câmera desligada. Você pode ligá-la novamente quando quiser.";
}

function mostrarErro(texto) {
  mensagem.textContent = texto;
  mensagem.classList.add("erro");
}

btnLigar.addEventListener("click", ligarCamera);
btnCapturar.addEventListener("click", capturarFoto);
btnDesligar.addEventListener("click", desligarCamera);
btnBaixar.addEventListener("click", baixarFoto);

window.addEventListener("pagehide", () => {
  if (streamAtual) {
    streamAtual.getTracks().forEach((track) => track.stop());
    streamAtual = null;
  }
});
