import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const diretorioAtual = path.dirname(
  fileURLToPath(import.meta.url),
);

const caminhoBundle = path.join(
  diretorioAtual,
  "dist",
  "dice-box.es.js",
);

const bundle = fs.readFileSync(
  caminhoBundle,
  "utf8",
);

const correspondencia = bundle.match(
  /const ml = "([A-Za-z0-9+/=]+)"/,
);

if (!correspondencia) {
  throw new Error(
    "Worker de física não encontrado no bundle do Dice Box.",
  );
}

let worker = Buffer.from(
  correspondencia[1],
  "base64",
).toString("utf8");

if (!worker.includes('case"dropDie"')) {
  const marcadorAcao =
    'case"rollDie":ge(t.data.id);break;';

  if (!worker.includes(marcadorAcao)) {
    throw new Error(
      "Ponto de inclusão da ação dropDie não encontrado.",
    );
  }

  worker = worker.replace(
    marcadorAcao,
    'case"dropDie":rpgDropDie(t.data.options);break;' +
      marcadorAcao,
  );

  const marcadorFuncao =
    '},Be=_=>{zt=zt.filter(t=>{';

  if (!worker.includes(marcadorFuncao)) {
    throw new Error(
      "Ponto de inclusão da função dropDie não encontrado.",
    );
  }

  const funcaoDropDie =
    '},rpgDropDie=_=>{' +
    'const{id:t,position:f,linearVelocity:g=[0,0,0],angularVelocity:j=[.8,-.6,.7]}=_,' +
    'V=zt.findIndex(X=>X.id===t);' +
    'if(V<0)return!1;' +
    'const X=zt.splice(V,1)[0],U=new d.btTransform;' +
    'U.setIdentity(),U.setOrigin(P(f[0],f[1],f[2])),' +
    'U.setRotation(new d.btQuaternion(Math.random(),Math.random(),Math.random(),-1)),' +
    'X.setWorldTransform(U),X.getMotionState()&&X.getMotionState().setWorldTransform(U);' +
    'const G=P(0,0,0),v=X.getCollisionShape();' +
    'return v.calculateLocalInertia(X.mass,G),X.setMassProps(X.mass,G),' +
    'X.updateInertiaTensor(),X.setLinearVelocity(P(g[0],g[1],g[2])),' +
    'X.setAngularVelocity(P(j[0],j[1],j[2])),X.timeout=p.settleTimeout,' +
    'X.asleep=!1,X.forceActivationState(4),X.activate(),wt.push(X),ee=!1,!0' +
    '},Be=_=>{zt=zt.filter(t=>{';

  worker = worker.replace(
    marcadorFuncao,
    funcaoDropDie,
  );
}

const workerCodificado = Buffer.from(
  worker,
  "utf8",
).toString("base64");

const bundleAtualizado = bundle.replace(
  correspondencia[0],
  `const ml = "${workerCodificado}"`,
);

fs.writeFileSync(
  caminhoBundle,
  bundleAtualizado,
  "utf8",
);

console.log(
  "Worker do Dice Box adaptado para o RPG Solo.",
);
