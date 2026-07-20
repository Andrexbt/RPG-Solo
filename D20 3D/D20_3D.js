const cena = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha:true});
renderizador.setSize(400, 400);
renderizador.setClearColor(0x000000, 0);

document.getElementById("cena3d").appendChild(renderizador.domElement);

const geometria = new THREE.IcosahedronGeometry(1, 0);

const material = new THREE.MeshStandardMaterial({
  color: 0x055081,
  flatShading: true
});

const dado = new THREE.Mesh(geometria, material);
cena.add(dado);

const luzAmbiente = new THREE.AmbientLight(0xffffff, 1.5);
cena.add(luzAmbiente);

const luzDirecional = new THREE.DirectionalLight(0xffffff, 1);
luzDirecional.position.set(3, 3, 5);
cena.add(luzDirecional);

camera.position.z = 3;

let velocidadeX = 0;
let velocidadeY = 0;
let estaRolando = false;

function animar() {
  requestAnimationFrame(animar);

  dado.rotation.x += velocidadeX;
  dado.rotation.y += velocidadeY;

  if (estaRolando === true) {
    velocidadeX = velocidadeX * 0.98;
    velocidadeY = velocidadeY * 0.98;

    if (velocidadeX < 0.01 && velocidadeY < 0.01) {
      estaRolando = false;
        velocidadeX = 0;
        velocidadeY = 0;
    }
  }

  renderizador.render(cena, camera);
}

renderizador.domElement.addEventListener("dblclick", function() {
  estaRolando = true;

  velocidadeX = 0.2 + Math.random() * 0.2;
  velocidadeY = 0.2 + Math.random() * 0.2;
});

let estaArrastando = false;

function moverDadoComMouse(evento) {
    const retangulo = renderizador.domElement.getBoundingClientRect();
    const mouseX = (evento.clientX - retangulo.left) / retangulo.width;
    const mouseY = (evento.clientY - retangulo.top) / retangulo.height;

    dado.position.x = (mouseX - 0.5) * 4;
    dado.position.y = -(mouseY - 0.5) * 4;
}

renderizador.domElement.addEventListener("pointerdown", function(evento) {
  estaArrastando = true;
  moverDadoComMouse(evento);
});

window.addEventListener("pointermove", function(evento) {
  if (estaArrastando === true) {
    moverDadoComMouse(evento);
  }
});

window.addEventListener("pointerup", function() {
  estaArrastando = false;
});

animar()
