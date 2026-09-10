/**
 * js/atividades/data/questionsEsfera.js - Módulo 2: A Carga Esférica & Teorema das Cascas
 */
window.GaussApp = window.GaussApp || {};
GaussApp.QuizData = GaussApp.QuizData || {};

GaussApp.QuizData.esfera = [
    {
        id: "esf-q1",
        category: "concept",
        categoryLabel: "Simetria Angular",
        enunciado: "Em uma distribuição esfericamente simétrica de cargas $\\rho(r)$, por que razões físicas as componentes angulares polar ($E_\\theta$) e azimutal ($E_\\phi$) do campo elétrico devem ser <b>estritamente nulas</b> em qualquer ponto do espaço?",
        alternativas: [
            "Porque qualquer plano que contenha a origem e o ponto $\\vec{r}$ é um plano de simetria espelho; se houvesse componente transversal ou azimutal, ela inverteria de sentido na reflexão, violando a invariância.",
            "Porque a Lei de Gauss proíbe a existência de campos perpendiculares a eixos cartesianos.",
            "Porque o divergente de campos eletrostáticos no vácuo é obrigatoriamente infinito fora da origem.",
            "Porque o potencial eletrostático depende de $\\theta$ e $\\phi$ de maneira compensatória."
        ],
        correta: 0,
        dica: "Pense na reflexão em um plano meridiano que passe pelo ponto $\\vec{r}$. Um vetor contido na direção radial não inverte, mas qualquer componente perpendicular ao plano refletiria para o lado oposto.",
        resolucao: `
            <p>Considere o plano meridiano definido pelo eixo $Z$ e pelo ponto $\\vec{r}$. Este plano é um plano de simetria espelho da carga esférica.</p>
            <p>Sob reflexão especular nesse plano, a componente radial $\\hat{r}$ e a polar $\\hat{\\theta}$ permanecem no plano, mas a componente azimutal $\\hat{\\phi}$ aponta na direção normal, logo $E_\\phi \\to -E_\\phi$.</p>
            <p>Pela invariância do sistema, $E_\\phi = -E_\\phi \\implies E_\\phi = 0$. Repetindo para o plano ortogonal, obtém-se $E_\\theta = 0$. Logo:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\vec{E}(\\vec{r}) = E(r)\\,\\hat{r}$$</p>
        `
    },
    {
        id: "esf-q2",
        category: "sim3d",
        categoryLabel: "Desafio 3D: Ponto Simétrico por Inversão",
        enunciado: "Considere uma casca esférica de raio $R = 1.5$. Se selecionarmos um ponto de teste em sua superfície $\\vec{r}_1 = (1.5, 0.0, 0.0)$, <b>qual é o ponto simétrico $\\vec{r}_2$ gerado pela operação de Inversão Espacial pela Origem ($\\vec{r} \\to -\\vec{r}$), e qual é a relação entre os vetores campo elétrico $\\vec{E}(\\vec{r}_1)$ e $\\vec{E}(\\vec{r}_2)$?</b>",
        prompt3D: "Abra a esfera no simulador 3D com a operação de inversão pela origem ativada e inspecione os vetores de prova.",
        link3D: "../index.html?shape=sphere&sym=inv&vx=1.5&vy=0&vz=0",
        alternativas: [
            "$\\vec{r}_2 = (-1.5, 0.0, 0.0)$ com campo $\\vec{E}(\\vec{r}_2) = -\\vec{E}(\\vec{r}_1)$, possuindo a mesma magnitude escalar $E(r)$.",
            "$\\vec{r}_2 = (0.0, 1.5, 0.0)$ com campo $\\vec{E}(\\vec{r}_2) = \\vec{E}(\\vec{r}_1)$.",
            "$\\vec{r}_2 = (1.5, 0.0, 0.0)$ com campo nulo por cancelamento na casca.",
            "$\\vec{r}_2 = (-1.5, -1.5, 0.0)$ com campo perpendicular ao eixo X."
        ],
        correta: 0,
        dica: "A inversão espacial mapeia cada coordenada cartesiana em seu valor oposto: $(x,y,z) \\to (-x,-y,-z)$. Sendo o campo puramente radial para fora, ele aponta em $-\\hat{i}$ no ponto $(-1.5, 0, 0)$.",
        resolucao: `
            <p>1. Sob inversão pela origem:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\vec{r}_2 = -\\vec{r}_1 = -(1.5, 0, 0) = (-1.5, 0.0, 0.0)$$</p>
            <p>2. Como o campo aponta radialmente para fora de $(0,0,0)$:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$\\vec{E}(\\vec{r}_1) = E(1.5)\\,\\hat{i} \\quad \\text{e} \\quad \\vec{E}(\\vec{r}_2) = E(1.5)\\,(-\\hat{i}) = -\\vec{E}(\\vec{r}_1)$$</p>
            <p>As magnitudes são idênticas, comprovando a perfeita simetria radial na esfera!</p>
        `
    },
    {
        id: "esf-q3",
        category: "math",
        categoryLabel: "Cálculo Integral",
        enunciado: "Ao aplicar a Lei de Gauss a uma superfície esférica imaginária concêntrica de raio $r > R$ que envolve uma carga total $Q_{\\text{int}}$, por que podemos escrever $\\oint_S \\vec{E}\\cdot d\\vec{A} = E(r) \\oint_S dA$?",
        alternativas: [
            "Porque em toda a superfície o vetor normal de área é $d\\vec{A} = dA\\,\\hat{r}$ (paralelo a $\\vec{E}$) e o raio $r$ constante garante que a magnitude $E(r)$ seja estritamente uniforme em toda a casca.",
            "Porque a área de uma esfera $4\\pi r^2$ é constante para qualquer valor de $r$.",
            "Porque o rotacional do campo elétrico é zero, permitindo retirar qualquer função da integral.",
            "Porque a constante dielétrica do vácuo $\\varepsilon_0$ cancela as dependências angulares."
        ],
        correta: 0,
        dica: "Revise os dois critérios fundamentais de solubilidade: alinhamento vetorial estrito (paralelismo) e magnitude constante sobre a superfície de integração.",
        resolucao: `
            <p>O produto escalar simplifica-se porque $\\vec{E} = E(r)\\hat{r}$ e $d\\vec{A} = dA\\,\\hat{r}$:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\vec{E} \\cdot d\\vec{A} = (E(r)\\,\\hat{r}) \\cdot (dA\\,\\hat{r}) = E(r)\\,dA$$</p>
            <p>Como todos os pontos da superfície gaussiana estão à mesma distância radial $r$ da origem, $E(r)$ não varia com a posição na casca e pode ser colocado em evidência para fora do integrando:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$\\oint_S E(r)\\,dA = E(r) \\oint_S dA = E(r) \\cdot (4\\pi r^2) = \\frac{Q_{\\text{int}}}{\\varepsilon_0} \\implies E(r) = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Q_{\\text{int}}}{r^2}$$</p>
        `
    },
    {
        id: "esf-q4",
        category: "critique",
        categoryLabel: "Teorema das Cascas",
        enunciado: "Considere uma casca esférica condutora de raio $R$ com carga total $Q$ distribuída uniformemente sobre sua superfície exterior. Pela Lei de Gauss, qual é o campo elétrico no interior da casca ($r < R$) e no exterior ($r > R$)?",
        alternativas: [
            "$E(r) = 0$ para $r < R$, e $E(r) = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Q}{r^2}$ para $r > R$.",
            "$E(r) = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Q}{R^2}$ em todos os pontos do espaço.",
            "$E(r) = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Qr}{R^3}$ para $r < R$, e zero para $r > R$.",
            "$E(r) = \\infty$ na origem e zero no exterior."
        ],
        correta: 0,
        dica: "Construa uma superfície gaussiana esférica imaginária com raio $r < R$. Quanta carga está contida no interior dessa superfície imaginária?",
        resolucao: `
            <p>1. <b>Para $r < R$ (interior):</b> A superfície gaussiana esférica concêntrica de raio $r$ não envolve nenhuma carga líquida ($Q_{\\text{int}} = 0$). Como $E(r) \\cdot 4\\pi r^2 = 0$, temos necessariamente $E(r) = 0$.</p>
            <p>2. <b>Para $r > R$ (exterior):</b> A gaussiana envolve toda a carga $Q_{\\text{int}} = Q$, logo $E(r) \\cdot 4\\pi r^2 = Q / \\varepsilon_0 \\implies E(r) = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Q}{r^2}$.</p>
            <p>Este é o célebre Teorema das Cascas de Newton-Gauss: o interior de uma casca esférica oca é uma região de blindagem eletrostática perfeita.</p>
        `
    }
];
