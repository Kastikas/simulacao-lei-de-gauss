/**
 * js/atividades/data/questionsCubo.js - Módulo 5: Cubo Carregado & Limites de Solubilidade
 */
window.GaussApp = window.GaussApp || {};
GaussApp.QuizData = GaussApp.QuizData || {};

GaussApp.QuizData.cubo = [
    {
        id: "cub-q1",
        category: "sim3d",
        categoryLabel: "Desafio 3D: Variação Angular nos Cantos",
        enunciado: "Ao visualizar o cubo no laboratório 3D com os vetores de área $d\\vec{A}$ (em verde) e as linhas de campo elétrico $\\vec{E}$ (em amarelo), <b>o que se observa sobre a orientação e a magnitude do campo elétrico ao longo de uma mesma face plana do cubo?</b>",
        prompt3D: "Abra o cubo no simulador 3D. Compare o alinhamento das setas no centro da face com as setas localizadas nas arestas e cantos do cubo.",
        link3D: "../index.html?shape=cube",
        alternativas: [
            "A magnitude $|\\vec{E}|$ varia continuamente (mais forte no centro da face, mais fraca nos cantos mais distantes) e as setas inclinam-se obliquamente nas arestas ($\\vec{E} \\not\\parallel d\\vec{A}$).",
            "O campo elétrico é rigorosamente paralelo a $d\\vec{A}$ em todos os pontos de todas as faces.",
            "O campo elétrico anula-se nas arestas do cubo por causa das quinas pontiagudas.",
            "A intensidade do campo elétrico é constante em todas as 6 faces por simetria esférica."
        ],
        correta: 0,
        dica: "Observe as setas verdes que saem perpendicularmente a cada face quadrada. No centro da face, o campo amarelo aponta para fora junto com a verde; mas nos cantos, as flechas amarelas espalham-se diagonalmente, formando um ângulo agudo com a normal.",
        resolucao: `
            <p>1. <b>Variação de Distância:</b> Para uma face a $z = L/2$, o centro está a uma distância $r_{\\text{min}} = L/2$, enquanto os vértices estão a $r_{\\text{max}} = \\sqrt{(L/2)^2 + (L/2)^2 + (L/2)^2} = \\frac{\\sqrt{3}}{2}L \\approx 0.866 L$. Logo, $|\\vec{E}|$ não é constante.</p>
            <p>2. <b>Desvio Angular:</b> O vetor $\\vec{E}$ aponta para longe do centro de carga. Nos cantos, $\\vec{E}$ possui componentes paralelas à face, de modo que $\\theta(\\vec{r}) \\neq 0$.</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\oint_{\\text{face}} \\vec{E} \\cdot d\\vec{A} = \\int_{\\text{face}} |\\vec{E}(\\vec{r})| \\cos\\theta(\\vec{r}) \\, dA \\neq |\\vec{E}| \\int dA$$</p>
            <p>Portanto, não é possível colocar $|\vec{E}|$ para fora da integral!</p>
        `
    },
    {
        id: "cub-q2",
        category: "sim3d",
        categoryLabel: "Desafio 3D: Simetria Rotacional Discreta",
        enunciado: "No laboratório 3D, aplique uma rotação em torno do eixo $Z$ na distribuição cúbica. <b>Quais são os únicos ângulos no intervalo $[0^\\circ, 360^\\circ]$ para os quais a distribuição cúbica coincide perfeitamente com sua posição original no espaço?</b>",
        prompt3D: "No simulador, selecione o Cubo e altere o slider de ângulo de rotação em torno de Z para constatar quando o holograma coincide com o objeto.",
        link3D: "../index.html?shape=cube&sym=rot_z&angle=90",
        alternativas: [
            "Apenas nos ângulos discretos múltiplos de $90^\\circ$: $0^\\circ$, $90^\\circ$, $180^\\circ$, $270^\\circ$ e $360^\\circ$.",
            "Para qualquer ângulo contínuo real $\\theta \\in [0^\\circ, 360^\\circ]$, como em um cilindro.",
            "Apenas nos ângulos de $0^\\circ$ e $180^\\circ$.",
            "Apenas no ângulo nulo $0^\\circ$, pois o cubo não possui nenhuma rotação de simetria."
        ],
        correta: 0,
        dica: "Um quadrado possui simetria rotacional de 4ª ordem ($C_4$). A cada quarto de volta ($360^\\circ / 4 = 90^\\circ$), suas arestas voltam a coincidir com a orientação inicial.",
        resolucao: `
            <p>O grupo pontual de simetria do cubo ($O_h$) é um grupo <b>discreto e finito</b>.</p>
            <p>Ao redor de qualquer um dos 3 eixos de simetria coordenados normais às faces (eixos $X, Y, Z$), o cubo é invariante apenas sob giros de múltiplos de um quarto de volta:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$\\theta = n \\cdot 90^\\circ \\quad (n \\in \\mathbb{Z})$$</p>
            <p>Para qualquer outro ângulo (ex: $45^\\circ$ ou $30^\\circ$), o holograma inclina-se no espaço e o simulador exibe o alerta de quebra de simetria.</p>
        `
    },
    {
        id: "cub-q3",
        category: "math",
        categoryLabel: "Fluxo por Face Simétrica",
        enunciado: "Uma carga pontual positiva $+Q$ encontra-se exatamente no <b>centro geométrico</b> de uma caixa imaginária cúbica fechada de aresta $L$. Utilizando a Lei de Gauss e a equivalência geométrica das 6 faces, <b>qual é o fluxo elétrico que atravessa uma única face do cubo?</b>",
        alternativas: [
            "$\\Phi_{\\text{face}} = \\frac{Q}{6\\varepsilon_0}$",
            "$\\Phi_{\\text{face}} = \\frac{Q}{\\varepsilon_0}$",
            "$\\Phi_{\\text{face}} = \\frac{Q}{4\\pi\\varepsilon_0 L^2}$",
            "Zero, pois a Lei de Gauss não se aplica a superfícies que possuem cantos."
        ],
        correta: 0,
        dica: "A carga está equidistante de todas as 6 faces quadradas idênticas. Pela Lei de Gauss, o fluxo total sobre a superfície fechada é $\\Phi_{\\text{total}} = Q / \\varepsilon_0$. Divida o total igualmente entre as 6 faces simétricas.",
        resolucao: `
            <p>1. Pela Lei de Gauss, o fluxo elétrico total somado através das 6 faces é:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\Phi_{\\text{total}} = \\oint_{\\text{cubo}} \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{int}}}{\\varepsilon_0} = \\frac{Q}{\\varepsilon_0}$$</p>
            <p>2. Por simetria discreta estrita em relação ao centro, cada uma das 6 faces quadradas subtende exatamente o mesmo ângulo sólido $\\Omega = \\frac{4\\pi}{6} = \\frac{2\\pi}{3}\\,\\text{sr}$.</p>
            <p>Portanto, o fluxo que atravessa qualquer uma das faces é exatamente um sexto do fluxo total:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$\\Phi_{\\text{face}} = \\frac{\\Phi_{\\text{total}}}{6} = \\frac{Q}{6\\varepsilon_0}$$</p>
        `
    },
    {
        id: "cub-q4",
        category: "critique",
        categoryLabel: "A Lição de Física 3",
        enunciado: "Qual é a principal lição teórica e pedagógica que o cubo carregado ensina sobre a <b>Lei de Gauss</b>?",
        alternativas: [
            "A Lei de Gauss é uma lei fundamental da física universalmente válida para qualquer superfície fechada imaginária; no entanto, ela só permite calcular analiticamente o campo elétrico quando a simetria for contínua o bastante para colocar $|\\vec{E}|$ em evidência para fora da integral.",
            "Que a Lei de Gauss falha em corpos que possuem quinas e arestas.",
            "Que a Lei de Coulomb é incompatível com distribuições com simetrias discretas.",
            "Que o fluxo elétrico total através de superfícies cúbicas depende da constante de Planck."
        ],
        correta: 0,
        dica: "Diferencie 'uma lei de conservação ser matematicamente verdadeira na natureza' de 'uma equação servir como método de cálculo de uma função desconhecida'.",
        resolucao: `
            <p>A Lei de Gauss física $\\oint \\vec{E}\\cdot d\\vec{A} = Q/\\varepsilon_0$ é <b>100% exata e válida para qualquer geometria imaginária no universo</b>.</p>
            <p>Porém, uma única equação escalar não é capaz de determinar uma infinidade de incógnitas pontuais quando o campo varia de ponto a ponto sobre a superfície.</p>
            <p>Para distribuições como o cubo, deve-se recorrer a métodos de integração direta pela Lei de Coulomb ou a métodos computacionais de elementos finitos.</p>
        `
    }
];
