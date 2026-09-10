/**
 * Textos teóricos, fórmulas matemáticas em LaTeX e dimensões de cada distribuição.
 */
window.GaussApp = window.GaussApp || {};

GaussApp.contentData = {
    sphere: {
        title: "Simetria Esférica",
        dimensions: "<span class=\"inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5 align-middle\"></span><b>Carga:</b> Raio = $1.5$ <br> <span class=\"inline-block w-2 h-2 rounded-full bg-sky-400 mr-1.5 align-middle\"></span><b>Gaussiana:</b> Raio = $3.5$ (painéis $\\Delta \\vec{A}$) <br> <span class=\"inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 align-middle\"></span><b>Vetores:</b> $d\\vec{A} \\parallel \\vec{E}$ radiais em toda a superfície",
        desc: "Uma esfera centrada na origem possui todas as simetrias possíveis. A superfície gaussiana é aproximada pela montagem de planos curvados (elementos de área $\\Delta \\vec{A}_i$). Em cada um, $\\vec{E}$ e $d\\vec{A}$ são estritamente paralelos e $\\vec{E}$ possui módulo constante, saindo da integral: $\\oint \\vec{E} \\cdot d\\vec{A} = E \\sum \\Delta A = E(4\\pi r^2)$.",
        math: "$$ \\oint \\vec{E} \\cdot d\\vec{A} = E(4\\pi r^2) = \\frac{q_{int}}{\\epsilon_0} $$"
    },
    cylinder: {
        title: "Simetria Cilíndrica",
        dimensions: "<span class=\"inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5 align-middle\"></span><b>Carga:</b> Fio infinito ($R=1.0$) no eixo Z <br> <span class=\"inline-block w-2 h-2 rounded-full bg-sky-400 mr-1.5 align-middle\"></span><b>Gaussiana:</b> Raio = $3.0$ | Altura = $6.0$ <br> <span class=\"inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 align-middle\"></span><b>Vetores:</b> $d\\vec{A} \\parallel \\vec{E}$ na parede; $d\\vec{A} \\perp \\vec{E}$ nas tampas",
        desc: "O fio/cilindro estende-se por todo o espaço esférico com circunferências nos limites. A superfície gaussiana cilíndrica é discretizada em painéis curvados na parede lateral e setores circulares nas tampas. Nas tampas, $\\vec{E} \\perp d\\vec{A}$ (fluxo nulo); na parede lateral, $\\vec{E} \\parallel d\\vec{A}$ e uniforme, somando: $\\sum E \\Delta A = E(2\\pi r L)$.",
        math: "$$ \\oint \\vec{E} \\cdot d\\vec{A} = E(2\\pi r L) = \\frac{\\lambda L}{\\epsilon_0} $$"
    },
    plane: {
        title: "Simetria Planar",
        dimensions: "<span class=\"inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5 align-middle\"></span><b>Placa:</b> Em $z=0$ até a linha do horizonte <br> <span class=\"inline-block w-2 h-2 rounded-full bg-sky-400 mr-1.5 align-middle\"></span><b>Gaussiana (Cilindro):</b> Raio = $2.0$ | Altura = $4.0$ <br> <span class=\"inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 align-middle\"></span><b>Vetores:</b> $d\\vec{A} \\parallel \\vec{E}$ nas tampas; $d\\vec{A} \\perp \\vec{E}$ na parede",
        desc: "Uma placa infinita no plano XY ($z=0$) corta o espaço até o horizonte celeste. A superfície gaussiana (caixa de pílula) é segmentada em painéis discretos. Na parede lateral, $\\vec{E} \\perp d\\vec{A}$ (fluxo nulo). Nas duas tampas planas ($z = \\pm 2.0$), $\\vec{E}$ é perpendicular à tampa e uniforme, com $\\vec{E} \\parallel d\\vec{A}$, somando $E(2A)$.",
        math: "$$ \\oint \\vec{E} \\cdot d\\vec{A} = E(2A) = \\frac{\\sigma A}{\\epsilon_0} $$"
    },
    cube: {
        title: "Assimetria (Distribuição Cúbica)",
        dimensions: "<span class=\"inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5 align-middle\"></span><b>Carga:</b> Cubo de Lado = $3.0$ <br> <span class=\"inline-block w-2 h-2 rounded-full bg-sky-400 mr-1.5 align-middle\"></span><b>Gaussiana:</b> Cubo de Lado = $4.0$ <br> <span class=\"inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 align-middle\"></span><b>Vetores:</b> $d\\vec{A}$ perpendicular à face; ângulo com $\\vec{E}$ varia",
        desc: "Um cubo possui rotações discretas (múltiplos de 90°), mas <b>não possui rotações contínuas</b>. Ao dividir as faces da gaussiana em painéis $\\Delta \\vec{A}_i$, vemos que o ângulo entre $\\vec{E}$ e $d\\vec{A}$ varia de ponto a ponto (centro vs. bordas e vértices). Por isso, $\\vec{E}$ não pode sair da integral!",
        math: "$$ \\oint \\vec{E} \\cdot d\\vec{A} = \\iint \\vec{E}(x,y,z) \\cdot \\hat{n} \\, dA $$"
    }
};
