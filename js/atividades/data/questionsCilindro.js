/**
 * js/atividades/data/questionsCilindro.js - Módulo 3: Fio Infinito & Gaussiana Cilíndrica
 */
window.GaussApp = window.GaussApp || {};
GaussApp.QuizData = GaussApp.QuizData || {};

GaussApp.QuizData.cilindro = [
    {
        id: "cil-q1",
        category: "sim3d",
        categoryLabel: "Desafio 3D: Análise das Tampas",
        enunciado: "Ao construir a superfície gaussiana cilíndrica fechada de raio $r$ e altura $L$ coaxial ao fio infinito no eixo $Z$, ela é composta por uma parede lateral curva e duas tampas circulares planas. <b>Inspecionando os vetores de área $d\\vec{A}$ nas tampas planas e o campo elétrico $\\vec{E}$, por que o fluxo através das tampas é identicamente zero?</b>",
        prompt3D: "Abra o cilindro no laboratório 3D e observe como as flechas verdes dA nas tampas planas apontam em Z, enquanto o campo elétrico amarelo aponta radialmente em XY.",
        link3D: "../index.html?shape=cylinder",
        alternativas: [
            "Porque nas tampas $d\\vec{A} = \\pm dA\\,\\hat{k}$ e o campo é puramente radial no plano $XY$ ($\\vec{E} \\perp \\hat{k}$), resultando em produto escalar nulo: $\\vec{E} \\cdot d\\vec{A} = 0$.",
            "Porque as tampas estão fora do vácuo e não possuem permissividade elétrica.",
            "Porque a área das tampas circulares é infinitesimal e desprezível frente à lateral.",
            "Porque o campo elétrico anula-se nas extremidades da superfície gaussiana imaginária."
        ],
        correta: 0,
        dica: "Observe o ângulo entre o vetor normal da tampa (que aponta para cima/baixo na direção $\\pm \\hat{k}$) e as flechas do campo elétrico (que irradiam perpendicularmente ao fio). Dois vetores ortogonais possuem produto escalar zero ($\\,\\cos 90^\\circ = 0$).",
        resolucao: `
            <p>Pela simetria cilíndrica, o campo elétrico é puramente radial no plano $XY$:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$\\vec{E}(\\vec{r}) = E(r)\\,\\hat{r}_{\\text{cil}} = E(r)(\\cos\\phi\\,\\hat{i} + \\sin\\phi\\,\\hat{j})$$</p>
            <p>Nas tampas circulares planas, a normal unitária aponta na direção longitudinal $\\pm\\hat{k}$:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\vec{E} \\cdot d\\vec{A}_{\\text{tampa}} = E(r)\\,\\hat{r}_{\\text{cil}} \\cdot (\\pm dA\\,\\hat{k}) = 0$$</p>
            <p>Assim, nenhuma linha de campo elétrico atravessa as tampas; elas correm paralelamente às tampas. O fluxo através de ambas é rigorosamente zero!</p>
        `
    },
    {
        id: "cil-q2",
        category: "sim3d",
        categoryLabel: "Desafio 3D: Translação Longitudinal",
        enunciado: "Considere um fio infinito com densidade linear uniforme $\\lambda$ orientado ao longo do eixo $Z$. Se escolhermos um vetor de teste na superfície do condutor $\\vec{r}_1 = (1.0, 0.0, 1.0)$ e aplicarmos uma <b>translação longitudinal de $\\Delta z = +2.0$ ao longo do eixo $Z$</b>, qual será a localização do vetor transladado $\\vec{r}_2$, e por que o sistema permanece perfeitamente invariante?",
        prompt3D: "No simulador, ative a translação em Z no cilindro com deslocamento +2.0 e confira que o vetor transladado coincide com a geometria do fio.",
        link3D: "../index.html?shape=cylinder&sym=trans_z&trans=2.0&vx=1.0&vy=0&vz=1.0",
        alternativas: [
            "$\\vec{r}_2 = (1.0, 0.0, 3.0)$; o sistema é invariante porque o fio é geometricamente infinito em $Z$, não havendo bordas ou extremidades que quebrem a homogeneidade.",
            "$\\vec{r}_2 = (3.0, 0.0, 1.0)$; a simetria quebra-se porque a distância radial da origem aumentou.",
            "$\\vec{r}_2 = (1.0, 2.0, 1.0)$; o sistema só seria invariante se o deslocamento fosse nulo.",
            "$\\vec{r}_2 = (-1.0, 0.0, -1.0)$; a translação inverte o sentido das linhas de campo."
        ],
        correta: 0,
        dica: "A translação por $\\Delta s\\,\\hat{k}$ soma o deslocamento unicamente na coordenada $z$: $(x, y, z) \\to (x, y, z + \\Delta s)$. Como a linha de carga é infinita, todo deslocamento em $Z$ sobrepõe a linha sobre si mesma.",
        resolucao: `
            <p>1. O operador de translação adiciona o vetor deslocamento $\\vec{s} = (0, 0, 2.0)$:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\vec{r}_2 = \\vec{r}_1 + \\Delta z\\,\\hat{k} = (1.0, 0.0, 1.0) + (0, 0, 2.0) = (1.0, 0.0, 3.0)$$</p>
            <p>2. Como o fio estende-se de $-\\infty$ a $+\\infty$, não existe nenhum ponto de referência longitudinal privilegiado. Consequentemente, $\\frac{\\partial \\vec{E}}{\\partial z} = \\vec{0}$.</p>
        `
    },
    {
        id: "cil-q3",
        category: "math",
        categoryLabel: "Cancelamento da Altura L",
        enunciado: "Na dedução do campo de um fio infinito pela Lei de Gauss, introduz-se uma altura finita arbitrária $L$ para o cilindro gaussiano imaginário: $\\Phi = E(r)(2\\pi r L) = \\frac{\\lambda L}{\\varepsilon_0}$. <b>Qual é o significado físico do cancelamento do parâmetro $L$ em ambos os lados da equação?</b>",
        alternativas: [
            "Demonstra que o campo elétrico real independe da dimensão arbitrária da superfície gaussiana imaginária que nós escolhemos para o cálculo.",
            "Indica que o fio na verdade tem comprimento nulo.",
            "Revela que a Lei de Gauss só é válida no limite assintótico $L \\to 0$.",
            "Mostra que a densidade linear de carga $\\lambda$ varia inversamente com $L$."
        ],
        correta: 0,
        dica: "A superfície gaussiana é uma construção puramente matemática imaginária criada pelo observador. Grandezas físicas reais observáveis (como a força ou o campo elétrico) nunca podem depender de escolhas arbitrárias do matemático.",
        resolucao: `
            <p>A carga interna envolvida pelo cilindro de altura $L$ é $Q_{\\text{int}} = \\lambda L$. A área lateral por onde o fluxo passa é $A = 2\\pi r L$.</p>
            <p>Ao igualar o fluxo à carga interna dividida por $\\varepsilon_0$:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$E(r) \\cdot (2\\pi r L) = \\frac{\\lambda L}{\\varepsilon_0} \\implies E(r) = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}$$</p>
            <p>O cancelamento exato de $L$ é uma exigência fundamental da consistência dimensional e da física: o campo resultante só depende das propriedades intrínsecas da fonte ($\\lambda$) e da distância radial ($r$).</p>
        `
    },
    {
        id: "cil-q4",
        category: "critique",
        categoryLabel: "Comparação de Decaimento",
        enunciado: "Comparando o campo de uma <b>carga pontual</b> ($E \\propto 1/r^2$) com o de um <b>fio infinito</b> ($E \\propto 1/r$), qual é a razão geométrica pela qual o campo do fio decai mais lentamente com a distância?",
        alternativas: [
            "Na carga pontual, as linhas de campo espalham-se em uma área esférica bidimensional que cresce com $r^2$; no fio infinito, as linhas espalham-se apenas radialmente na área lateral de um cilindro que cresce linearmente com $r$.",
            "Porque o fio é condutor e a carga pontual é isolante.",
            "Porque a constante eletrostática é multiplicada por $\\pi$ na geometria cilíndrica.",
            "Porque o fio infinito não obedece ao princípio da conservação da energia."
        ],
        correta: 0,
        dica: "Pense na área por onde a mesma quantidade de linhas de força deve se diluir. Para a esfera, $A = 4\\pi r^2$. Para o cilindro de altura fixa, $A = 2\\pi r L$ (proporcional apenas a $r$).",
        resolucao: `
            <p>Pelo Teorema da Divergência no vácuo, o número total de linhas de campo (fluxo) conserva-se.</p>
            <p>Na simetria esférica tridimensional, as linhas se diluem na área de uma casca esférica: $A_{\\text{esfera}} = 4\\pi r^2 \\implies E \\propto 1/r^2$.</p>
            <p>Na simetria cilíndrica, a invariância em $Z$ impede a dispersão longitudinal; as linhas só se diluem no perímetro do círculo transversal: $A_{\\text{lateral}} = 2\\pi r L \\implies E \\propto 1/r$.</p>
        `
    }
];
