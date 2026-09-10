/**
 * js/atividades/data/questionsPlano.js - Módulo 4: Placa Plana Infinita & Pillbox
 */
window.GaussApp = window.GaussApp || {};
GaussApp.QuizData = GaussApp.QuizData || {};

GaussApp.QuizData.plano = [
    {
        id: "pla-q1",
        category: "sim3d",
        categoryLabel: "Desafio 3D: Simetria Bilateral",
        enunciado: "Considere uma placa plana infinita em $z = 0$ portando densidade uniforme de carga positiva $\\sigma$. Se avaliarmos o campo elétrico no ponto $\\vec{r}_1 = (0.0, 0.0, 2.0)$, onde o campo aponta em $+E\\,\\hat{k}$, <b>qual é a localização do ponto simétrico $\\vec{r}_2$ sob reflexão no plano da placa ($z = 0$), e qual é o vetor campo elétrico $\\vec{E}(\\vec{r}_2)$?</b>",
        prompt3D: "Abra a placa no laboratório 3D com reflexão em z = 0 e visualize os dois pontos em cotas simétricas +z e -z.",
        link3D: "../index.html?shape=plane&sym=refl_z&vx=0&vy=0&vz=2.0",
        alternativas: [
            "$\\vec{r}_2 = (0.0, 0.0, -2.0)$ com campo elétrico $\\vec{E}(\\vec{r}_2) = -E\\,\\hat{k}$, apontando para longe da placa.",
            "$\\vec{r}_2 = (2.0, 0.0, 0.0)$ com campo elétrico $\\vec{E}(\\vec{r}_2) = +E\\,\\hat{i}$.",
            "$\\vec{r}_2 = (0.0, 0.0, -2.0)$ com campo elétrico $\\vec{E}(\\vec{r}_2) = +E\\,\\hat{k}$, apontando para a placa.",
            "$\\vec{r}_2 = (0.0, 2.0, 0.0)$ com campo nulo por ortogonalidade."
        ],
        correta: 0,
        dica: "A reflexão no plano $z=0$ inverte apenas a cota normal $z \\to -z$. Como a placa tem carga positiva, as linhas de campo elétrico devem irradiar divergindo para fora em ambos os semi-espaços.",
        resolucao: `
            <p>1. Sob reflexão no plano $z = 0$, a cota normal inverte seu sinal:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\vec{r}_2 = (x, y, -z) = (0.0, 0.0, -2.0)$$</p>
            <p>2. Por simetria de reflexão, o campo deve apontar para fora da placa em ambos os semi-espaços:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$\\vec{E}(z) = \\begin{cases} +E\\,\\hat{k}, & z > 0 \\\\ -E\\,\\hat{k}, & z < 0 \\end{cases}$$</p>
            <p>Portanto, em $z = -2.0$, o vetor é $\\vec{E} = -E\\,\\hat{k}$, com magnitude rigorosamente idêntica à de $z = +2.0$.</p>
        `
    },
    {
        id: "pla-q2",
        category: "math",
        categoryLabel: "A Caixa de Pílula (Pillbox)",
        enunciado: "Ao aplicar a Lei de Gauss utilizando um pequeno cilindro (*pillbox*) com tampas paralelas de área $A$ situadas em $+z$ e $-z$, por que o fluxo elétrico total é $\\Phi = 2EA$ e não apenas $EA$?",
        alternativas: [
            "Porque o campo elétrico atravessa paralelamente ambas as tampas (superior em $+z$ e inferior em $-z$), contribuindo com $+EA$ em cada uma delas, enquanto o fluxo na parede lateral é estritamente zero.",
            "Porque a placa infinita possui carga em ambas as faces, duplicando a constante dielétrica $\\varepsilon_0$.",
            "Porque o fator 2 decorre da integração angular de $0$ a $2\\pi$.",
            "Porque as linhas de campo dão uma volta completa fechada ao redor da placa condutora."
        ],
        correta: 0,
        dica: "Na tampa superior: $\\vec{E} = +E\\hat{k}$ e $d\\vec{A} = +dA\\hat{k} \\implies \\vec{E}\\cdot d\\vec{A} = +E\\,dA$. Na tampa inferior: $\\vec{E} = -E\\hat{k}$ e $d\\vec{A} = -dA\\hat{k} \\implies \\vec{E}\\cdot d\\vec{A} = (-E)(-dA) = +E\\,dA$.",
        resolucao: `
            <p>A integral de fluxo fecha-se somando as 3 fronteiras da pillbox:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$\\oint_S \\vec{E} \\cdot d\\vec{A} = \\int_{\\text{lateral}} \\vec{E}\\cdot d\\vec{A} + \\int_{\\text{topo}} \\vec{E}\\cdot d\\vec{A} + \\int_{\\text{base}} \\vec{E}\\cdot d\\vec{A}$$</p>
            <p>1. Na lateral: $\\vec{E} \\perp d\\vec{A} \\implies \\Phi_{\\text{lateral}} = 0$.</p>
            <p>2. No topo ($z > 0$): $\\int (+E\\hat{k})\\cdot(+dA\\hat{k}) = EA$.</p>
            <p>3. Na base ($z < 0$): $\\int (-E\\hat{k})\\cdot(-dA\\hat{k}) = EA$.</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\Phi_{\\text{total}} = 0 + EA + EA = 2EA = \\frac{Q_{\\text{int}}}{\\varepsilon_0} = \\frac{\\sigma A}{\\varepsilon_0} \\implies E = \\frac{\\sigma}{2\\varepsilon_0}$$</p>
        `
    },
    {
        id: "pla-q3",
        category: "concept",
        categoryLabel: "Independência da Distância",
        enunciado: "O resultado $E = \\frac{\\sigma}{2\\varepsilon_0}$ mostra que o campo elétrico de uma placa plana infinita <b>não depende da distância $z$ até a placa</b>. Qual é a interpretação física intuitiva desse fenômeno surpreendente?",
        alternativas: [
            "Conforme nos afastamos da placa infinita, cada elemento de carga $dq$ exerce uma força mais fraca ($\\propto 1/r^2$), porém a quantidade de carga efetiva dentro do cone de visão do observador cresce exatamente na mesma proporção ($\\propto r^2$), compensando perfeitamente a distância.",
            "Porque no vácuo a velocidade da luz é infinita para geometrias planas.",
            "Porque uma placa infinita atua como um monopolo magnético ideal.",
            "Porque a gravidade cancela as componentes verticais de atração eletrostática."
        ],
        correta: 0,
        dica: "Pense na perspectiva de quem olha para um piso infinito. Se você sobe, o chão parece menor em cada pedaço, mas você enxerga uma área de piso muito maior dentro do mesmo campo de visão.",
        resolucao: `
            <p>Seja um ponto a uma distância $z$ da placa. Ao duplicar a distância ($z \\to 2z$):</p>
            <p>1. A força exercida por cada metro quadrado de carga reduz-se por um fator de $1/4$ (pela lei do inverso do quadrado de Coulomb).</p>
            <p>2. Porém, o anel circular da placa que subtende o mesmo ângulo sólido tem raio proporcional a $z$, logo sua área cresce com $z^2$, ou seja, aumenta por um fator de $4$.</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\Delta E \\propto \\frac{\\text{Área}}{r^2} \\propto \\frac{z^2}{z^2} = \\text{constante}$$</p>
            <p>A compensação é exata: o campo em $z = 1000\\,\\text{m}$ é rigorosamente igual ao campo em $z = 1\\,\\text{mm}$!</p>
        `
    },
    {
        id: "pla-q4",
        category: "critique",
        categoryLabel: "Descontinuidade de Contorno",
        enunciado: "Ao atravessar a placa plana carregada passando de $z = -\\epsilon$ para $z = +\\epsilon$, qual é o salto de descontinuidade sofrido pelo vetor campo elétrico perpendicular $\\Delta E_z = E_z(+\\epsilon) - E_z(-\\epsilon)$?",
        alternativas: [
            "$\\Delta E_z = \\frac{\\sigma}{\\varepsilon_0}$",
            "$\\Delta E_z = 0$ (o campo é contínuo)",
            "$\\Delta E_z = \\frac{\\sigma}{2\\varepsilon_0}$",
            "$\\Delta E_z = \\infty$"
        ],
        correta: 0,
        dica: "Lembre-se dos valores: $E_z(+\\epsilon) = +\\frac{\\sigma}{2\\varepsilon_0}$ e $E_z(-\\epsilon) = -\\frac{\\sigma}{2\\varepsilon_0}$. Calcule a diferença entre eles.",
        resolucao: `
            <p>Subtraindo os valores dos campos imediatamente acima e abaixo da superfície carregada:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\Delta E_z = E_z(+\\epsilon) - E_z(-\\epsilon) = \\left(+\\frac{\\sigma}{2\\varepsilon_0}\\right) - \\left(-\\frac{\\sigma}{2\\varepsilon_0}\\right) = \\frac{\\sigma}{\\varepsilon_0}$$</p>
            <p>Esta é a clássica <b>condição de contorno eletrostática geral</b> de Maxwell: a componente normal do campo elétrico sofre uma descontinuidade finita exatamente igual a $\\sigma / \\varepsilon_0$ ao atravessar qualquer camada com densidade superficial de carga.</p>
        `
    }
];
