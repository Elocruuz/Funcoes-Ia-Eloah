// Mapeamento dos elementos DOM
const caixaPerguntas = document.getElementById("caixaPerguntas");
const caixaAlternativas = document.getElementById("caixaAlternativas");
const caixaResultado = document.getElementById("caixaResultado");
const textoResultado = document.getElementById("textoResultado");
const tituloResposta = document.getElementById("tituloResposta");
const linkNoticia = document.getElementById("linkNoticia");
const btnVoz = document.getElementById("btnVoz");
const statusVoz = document.getElementById("statusVoz");
const btnReiniciar = document.getElementById("btnReiniciar");
const secaoInterativa = document.querySelector(".secao-interativa");

// Base de dados com perguntas, respostas prontas e links de referência
const perguntas = [
    {
        enunciado: "Qual pergunta você deseja fazer à nutricionista sobre Introdução Alimentar?",
        alternativas: [
            {
                texto: "Por que iniciar a introdução alimentar com acompanhamento nutricional?",
                titulo: "A Importância da Orientação Profissional",
                respostaPronta: "O acompanhamento com uma nutricionista garante que o bebê receba todos os nutrientes essenciais para o seu desenvolvimento cognitivo e físico. Além disso, previne deficiências nutricionais como a anemia ferropriva, orienta sobre a consistência correta dos alimentos para evitar engasgos e auxilia na prevenção de alergias alimentares de forma segura e individualizada.",
                noticiaUrl: "https://www.gov.br/saude/pt-br/assuntos/noticias/2021/agosto/saiba-como-fazer-a-introducao-alimentar-de-forma-saudavel"
            },
            {
                texto: "Quando é o momento certo de iniciar e como a nutri ajuda no processo?",
                titulo: "Prontidão do Bebê e Idade Adequada",
                respostaPronta: "Segundo a Organização Mundial da Saúde (OMS) e o Ministério da Saúde, a introdução alimentar deve começar aos 6 meses. A nutricionista avalia os 'sinais de prontidão' do bebê (como sentar sem apoio e ter o reflexo de protrusão diminuído) e cria um plano estruturado para introduzir os alimentos sem substituir abruptamente o leite materno ou a fórmula.",
                noticiaUrl: "https://www.prontoped.com.br/artigos/sinais-de-prontidao-para-a-introducao-alimentar/"
            },
            {
                texto: "Qual o risco de fazer a introdução alimentar sem orientação?",
                titulo: "Riscos da Introdução Alimentar Precoce ou Sem Guiamento",
                respostaPronta: "Iniciar sem orientação pode expor a criança à oferta de alimentos altamente alergênicos sem o devido protocolo, ao uso indevido de sal e açúcares antes dos 2 anos, além do risco de sobrecarga renal e intestinal por oferta incorreta de proteínas. O nutricionista ajuda a criar uma relação saudável com a comida desde a primeira colherada.",
                noticiaUrl: "https://www.paho.org/pt/topicos/nutricao-e-seguranca-alimentar"
            }
        ]
    }
];

let respostaAtualTexto = "";

// Inicializa a exibição da pergunta
function carregarPerguntas() {
    caixaPerguntas.innerText = perguntas[0].enunciado;
    caixaAlternativas.innerHTML = "";

    perguntas[0].alternativas.forEach((opcao) => {
        const botao = document.createElement("button");
        botao.classList.add("btn-opcao");
        botao.innerHTML = `<span>${opcao.texto}</span> ➔`;
        botao.addEventListener("click", () => exibirResposta(opcao));
        caixaAlternativas.appendChild(botao);
    });
}

// Exibe a resposta selecionada
function exibirResposta(opcao) {
    secaoInterativa.classList.add("escondido");
    caixaResultado.classList.remove("escondido");

    tituloResposta.innerText = opcao.titulo;
    textoResultado.innerText = opcao.respostaPronta;
    linkNoticia.href = opcao.noticiaUrl;

    respostaAtualTexto = opcao.respostaPronta;
}

// Recurso de Voz por I.A. (Web Speech API)
btnVoz.addEventListener("click", () => {
    if (!('speechSynthesis' in window)) {
        statusVoz.innerText = "Navegador não suporta leitura de áudio.";
        return;
    }

    // Se estiver lendo, interrompe
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        statusVoz.innerText = "Áudio pausado.";
        btnVoz.innerHTML = "🔊 Ouvir Resposta por I.A.";
        return;
    }

    const mensagem = new SpeechSynthesisUtterance(respostaAtualTexto);
    mensagem.lang = 'pt-BR';
    mensagem.rate = 1.0;

    mensagem.onstart = () => {
        statusVoz.innerText = "Reproduzindo resposta...";
        btnVoz.innerHTML = "⏹ Parar Áudio";
    };

    mensagem.onend = () => {
        statusVoz.innerText = "";
        btnVoz.innerHTML = "🔊 Ouvir Resposta por I.A.";
    };

    window.speechSynthesis.speak(mensagem);
});

// Reiniciar pergunta
btnReiniciar.addEventListener("click", () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    statusVoz.innerText = "";
    btnVoz.innerHTML = "🔊 Ouvir Resposta por I.A.";
    caixaResultado.classList.add("escondido");
    secaoInterativa.classList.remove("escondido");
});

// Executa na inicialização
carregarPerguntas();