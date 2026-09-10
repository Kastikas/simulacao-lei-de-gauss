/**
 * js/atividades/data/questionsSimetria.js - Módulo 1: Fundamentos & Princípio de Curie
 */
window.GaussApp = window.GaussApp || {};
GaussApp.QuizData = GaussApp.QuizData || {};

GaussApp.QuizData.simetrias = [
    {
        id: "sim-q1",
        category: "concept",
        categoryLabel: "Conceito & Curie",
        enunciado: "O <b>Princípio de Curie (1894)</b> postula que <i>\"a assimetria dos efeitos deve encontrar-se nas causas\"</i>. Em termos eletrostáticos, sendo a distribuição estática de carga $\\rho(\\vec{r})$ a causa e o campo elétrico resultante $\\vec{E}(\\vec{r})$ o efeito, qual é a consequência matemática obrigatória para qualquer operação de simetria geométrica espacial $T$ que mantenha a carga invariante ($\\rho(T\\vec{r}) = \\rho(\\vec{r})$)?",
        alternativas: [
            "O campo elétrico deve satisfazer a relação de covariância geométrica: $T\\vec{E}(\\vec{r}) = \\vec{E}(T\\vec{r})$.",
            "O campo elétrico deve anular-se em todos os pontos do espaço tridimensional: $\\vec{E}(\\vec{r}) = \\vec{0}$.",
            "A intensidade do campo elétrico torna-se necessariamente independente da distância da fonte.",
            "O potencial eletrostático deve se transformar como um pseudovetor sob rotações espaciais."
        ],
        correta: 0,
        dica: "Lembre-se de que se o sistema físico gerador não muda sob uma transformação geométrica $T$, o efeito físico gerado após a transformação também deve coincidir com o efeito antes da transformação.",
        resolucao: `
            <p>Pelo Princípio de Curie, o campo elétrico $\\vec{E}(\\vec{r})$ deve possuir, no mínimo, todas as simetrias geométricas de sua distribuição geradora de cargas $\\rho(\\vec{r})$.</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$T\\vec{E}(\\vec{r}) = \\vec{E}(T\\vec{r})$$</p>
            <p>Isso estabelece que transformar o vetor campo no ponto $\\vec{r}$ fornece exatamente o mesmo resultado que calcular o campo diretamente no ponto transformado $T\\vec{r}$.</p>
        `
    },
    {
        id: "sim-q2",
        category: "sim3d",
        categoryLabel: "Desafio 3D: Predição Vetorial",
        enunciado: "Considere uma distribuição com simetria de reflexão em relação ao plano $x = 0$ (plano $YZ$), como um fio condutor infinito alinhado ao longo do eixo $Z$. Se escolhermos um vetor de prova $\\vec{r}_1 = (1.0, 0.5, 2.0)$, <b>qual deve ser a localização exata do segundo vetor $\\vec{r}_2$ que deve obrigatoriamente existir para preservar a simetria da distribuição?</b>",
        prompt3D: "Abra a distribuição cilíndrica com reflexão em x = 0 e inspecione a posição do vetor simétrico gerado na cena.",
        link3D: "../index.html?shape=cylinder&sym=refl_x&vx=1.0&vy=0.5&vz=2.0",
        alternativas: [
            "$\\vec{r}_2 = (-1.0, 0.5, 2.0)$",
            "$\\vec{r}_2 = (1.0, -0.5, 2.0)$",
            "$\\vec{r}_2 = (1.0, 0.5, -2.0)$",
            "$\\vec{r}_2 = (-1.0, -0.5, -2.0)$"
        ],
        correta: 0,
        dica: "A reflexão no plano $x = 0$ (plano cartesiano YZ) inverte apenas o sinal da coordenada perpendicular ao plano espelho ($x \\to -x$), mantendo as coordenadas coplanares $y$ e $z$ inalteradas.",
        resolucao: `
            <p>A matriz de reflexão especular através do plano $x = 0$ atua sobre um vetor genérico $\\vec{r} = (x, y, z)$ invertendo unicamente a componente normal ao plano:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\vec{r}' = R_x \\vec{r} = (-x, y, z)$$</p>
            <p>Substituindo as coordenadas dadas $(1.0, 0.5, 2.0)$, obtemos imediatamente:</p>
            <p class="font-mono text-xs my-1 text-sky-300">$$\\vec{r}_2 = (-1.0, 0.5, 2.0)$$</p>
            <p>No laboratório 3D, você pode constatar que $\\vec{r}_1$ (em magenta) e $\\vec{r}_2$ (em ciano) formam um par estritamente simétrico e contido no interior do cilindro condutor.</p>
        `
    },
    {
        id: "sim-q3",
        category: "sim3d",
        categoryLabel: "Desafio 3D: Rotação Contínua",
        enunciado: "Para uma distribuição com simetria esférica contínua $O(3)$ centrada na origem, se escolhermos um ponto $\\vec{r}_1 = (1.5, 0.0, 0.0)$ e aplicarmos uma rotação arbitrária não-notável de $\\theta = 73^\\circ$ em torno do eixo $Y$, o que acontece com a densidade de carga $\\rho(\\vec{r}_2)$ e a intensidade do campo elétrico $|\\vec{E}(\\vec{r}_2)|$ no ponto transformado $\\vec{r}_2$?",
        prompt3D: "Visualize a rotação arbitrária na esfera e note que a distribuição e a magnitude radial coincidem perfeitamente.",
        link3D: "../index.html?shape=sphere&sym=rot_y&angle=73&vx=1.5&vy=0&vz=0",
        alternativas: [
            "Permanecem rigorosamente idênticas: $\\rho(\\vec{r}_2) = \\rho(\\vec{r}_1)$ e $|\\vec{E}(\\vec{r}_2)| = |\\vec{E}(\\vec{r}_1)|$, pois a distância radial $r = |\\vec{r}|$ é conservada.",
            "A densidade de carga permanece idêntica, porém o campo elétrico reduz-se pelo fator $\\cos(73^\\circ)$.",
            "A simetria é rompida, pois esferas só admitem rotações discretas em múltiplos de $90^\\circ$.",
            "O campo no ponto $\\vec{r}_2$ passa a ter uma componente azimutal não-nula proporcional ao ângulo de rotação."
        ],
        correta: 0,
        dica: "Rotações no espaço euclidiano são isometrias lineares que conservam o produto escalar e o módulo do vetor ($|\\vec{r}_2| = |\\vec{r}_1| = r$). Como a esfera depende somente de $r$, o sistema é isotrópico.",
        resolucao: `
            <p>O grupo ortogonal especial $SO(3)$ descreve todas as rotações contínuas no $\\mathbb{R}^3$. Como qualquer rotação preserva distâncias radiais:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$|R_Y(73^\\circ)\\vec{r}_1| = |\\vec{r}_1| = 1.5$$</p>
            <p>Sendo a carga e o campo puramente radiais em uma distribuição esférica ($\\rho = \\rho(r)$ e $\\vec{E} = E(r)\\hat{r}$), a magnitude não sofre alteração alguma em nenhum ângulo de giro contínuo.</p>
        `
    },
    {
        id: "sim-q4",
        category: "concept",
        categoryLabel: "Paridade & Inversão",
        enunciado: "Considere uma distribuição de cargas com simetria de <b>inversão espacial</b> em relação à origem ($\\rho(-\\vec{r}) = \\rho(\\vec{r})$), como uma esfera uniforme ou um cubo carregado centrado em $(0,0,0)$. Sabendo que o campo elétrico $\\vec{E}$ é um <b>vetor polar verdadeiro</b> (que inverte de sentido sob reflexão pela origem: $\\vec{E}(-\\vec{r}) = -\\vec{E}(\\vec{r})$), qual deve ser o valor de $\\vec{E}$ na origem $\\vec{r} = \\vec{0}$?",
        alternativas: [
            "$\\vec{E}(\\vec{0}) = \\vec{0}$, porque o único vetor igual ao seu oposto aditivo no espaço vetorial é o vetor nulo.",
            "$\\vec{E}(\\vec{0}) \\to \\infty$, devido ao acúmulo central de linhas de força.",
            "$\\vec{E}(\\vec{0}) = \\frac{Q}{4\\pi\\varepsilon_0}\\hat{k}$, apontando na direção preferencial do eixo Z.",
            "Indeterminado, dependendo da constante dielétrica do vácuo $\\varepsilon_0$."
        ],
        correta: 0,
        dica: "Aplique a transformação de paridade na origem: $\\vec{E}(\\vec{0}) = -\\vec{E}(\\vec{0})$. Some $\\vec{E}(\\vec{0})$ em ambos os lados da equação.",
        resolucao: `
            <p>Pela invariância do sistema sob inversão $\\vec{r} \\to -\\vec{r}$ e pelo fato de $\\vec{E}$ ser um vetor polar ímpar sob paridade:</p>
            <p class="font-mono text-xs my-1 text-emerald-300">$$\\vec{E}(\\vec{0}) = -\\vec{E}(\\vec{0}) \\implies 2\\vec{E}(\\vec{0}) = \\vec{0} \\implies \\vec{E}(\\vec{0}) = \\vec{0}$$</p>
            <p>Portanto, no centro geométrico de qualquer distribuição que possua simetria de paridade central, o campo elétrico resultante anula-se rigorosamente por cancelamento de pares de forças opostas.</p>
        `
    },
    {
        id: "sim-q5",
        category: "math",
        categoryLabel: "Redução de Variáveis",
        enunciado: "Um sistema eletrostático genérico possui inicialmente um campo elétrico descrito por 3 funções escalares de 3 variáveis: $\\vec{E}(x,y,z) = E_x \\hat{i} + E_y \\hat{j} + E_z \\hat{k}$. Se o sistema apresentar <b>simetria de translação contínua ao longo do eixo Z</b> e <b>simetria de reflexão no plano $z = 0$</b>, quais simplificações ocorrem imediatamente no vetor $\\vec{E}$?",
        alternativas: [
            "Elimina-se a dependência da coordenada $z$ ($\\partial\\vec{E}/\\partial z = \\vec{0}$) e anula-se a componente longitudinal ($E_z = 0$).",
            "Anulam-se as componentes transversais $E_x = E_y = 0$, restando apenas $E_z(z)$.",
            "O campo passa a depender exclusivamente do ângulo azimutal $\\phi$.",
            "O campo torna-se conservativo com divergente não-nulo em todo o espaço."
        ],
        correta: 0,
        dica: "A translação contínua em $z$ significa que deslocar-se em $z$ não muda nada. A reflexão $z \\to -z$ faz com que a componente perpendicular ao plano $z=0$ (ou seja, $E_z$) mude de sinal, forçando-a a zero se o sistema for simétrico.",
        resolucao: `
            <p>1. Pela <b>translação contínua em Z</b>: $\\frac{\\partial \\vec{E}}{\\partial z} = \\vec{0} \\implies \\vec{E} = \\vec{E}(x, y)$. A variável $z$ é eliminada.</p>
            <p>2. Pela <b>reflexão no plano $z = 0$</b>: para cada ponto com cota $+z$, o ponto em $-z$ possui $E_z(-z) = -E_z(+z)$. Pela invariância de translação, $E_z(-z) = E_z(+z)$, logo $E_z = -E_z \\implies E_z = 0$.</p>
            <p>Conclusão: o campo fica restrito ao plano transversal: $\\vec{E} = E_x(x,y)\\hat{i} + E_y(x,y)\\hat{j}$.</p>
        `
    }
];
