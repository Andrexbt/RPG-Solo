const botãoEnviar = document.getElementById("botãoEnviar");
const ação = document.getElementById("ação");
const resposta = document.getElementById("resposta");
const botãoD20 = document.getElementById("botãoD20");
const resultadoD20 = document.getElementById("resultadoD20");
const somD20 = new Audio("D20.mp3");

botãoEnviar.addEventListener("click", function() {
    const acao = ação.value;

    resposta.textContent = "Você: " + acao + " | Mestre: Você tenta realizar essa ação. Role um d20 para descobrir o resultado.";

    ação.value = "";
});

botãoD20.addEventListener("click", function() {
    botãoD20.classList.add("rolando");
    resultadoD20.textContent = "Rolando...";

    somD20.currentTime = 0;
    somD20.play();

    setTimeout(function() {
        const D20 = Math.floor(Math.random() * 20) + 1;
        botãoD20.classList.remove("rolando");
        botãoD20.textContent = D20;
        resultadoD20.textContent = "Você rolou " + D20;
    },1000);
});
