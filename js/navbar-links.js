function reloadQuestions(){
    const exit = confirm("Tem certeza que deseja reiniciar o quiz? Todo o progresso será perdido")
    if(exit){
        location.hash = "00";
        location.reload();
    }
}

function returnHomeScreen(){
    const exit = confirm("Tem certeza que deseja sair do quiz? Todo o progresso será perdido")
    if(exit){
        location.href = "./index.htm"
    }
}

function aboutUs(){
    alert(`Desenvolvido por Douglas Martins e Juliana Cerqueira
    
"O "FanQuiz" é uma pequena aplicação destinada a você testar seus conhecimentos sobre a cultura pop enquanto se diverte. Tudo que precisa é ter em mãos algum dispositivo conectado a internet. ;)"`)
}

document.querySelector("#return-home").onclick = returnHomeScreen;
document.querySelector("#exit-quiz").onclick = returnHomeScreen;
document.querySelector("#reload-quiz").onclick = reloadQuestions;
document.querySelector("#about-us-info").onclick = aboutUs;
document.querySelector("#return-question").onclick = () => changeQuestion(false);