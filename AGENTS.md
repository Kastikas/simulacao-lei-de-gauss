# Diretrizes Arquiteturais & Padrões do Simulador Lei de Gauss

Este documento estabelece as regras e contratos técnicos obrigatórios para o desenvolvimento e manutenção do simulador 3D e do guia educativo da Lei de Gauss.

## 1. Compatibilidade Obrigatória com Acesso Local (`file:///`)
- **Sem Bundlers ou Toolchains Pesadas:** O projeto deve funcionar perfeitamente ao ser aberto diretamente com duplo clique no navegador (`file:///.../index.html` ou `guia.html`), bem como em servidores estáticos (GitHub Pages).
- **Sem Módulos ES Puros (`import`/`export`):** Navegadores modernos bloqueiam requisições de módulos em `file:///` devido a políticas de CORS. Toda a modularização deve utilizar o namespace global híbrido:
  `window.GaussApp = window.GaussApp || {};`
- Encapsule componentes em IIFEs (`(function() { ... })();`) anexando módulos em `GaussApp` (ex: `GaussApp.Scene`, `GaussApp.Shapes`, `GaussApp.UI`).

## 2. Contrato de Deep Linking entre Teoria e Simulação
- A navegação entre o guia teórico (`guia.html`) e o laboratório interativo (`index.html`) deve suportar o parâmetro de query string `?shape=...` com valores válidos:
  `sphere`, `cylinder`, `plane`, `cube`.
- Ao inicializar `index.html` com o parâmetro `?shape=`:
  1. Atualizar o `<select id="shape-select">` e o estado `GaussApp.state.currentShape`.
  2. Forçar a ativação visual dos elementos fundamentais de Gauss (`showGaussian = true`, `showAreaVectors = true`, `showField = true`).
  3. Posicionar a câmera no ângulo pré-configurado ideal para a geometria selecionada (`camPositions[shape]`).

## 3. Renderização Matemática (MathJax 3) & Three.js
- Fórmulas LaTeX em linha usam `$ ... $` e em destaque usam `$$ ... $$`.
- Não chame `MathJax.typeset()` síncrono. Utilize sempre `MathJax.typesetPromise(elementos)` de forma não bloqueante para preservar os 60 FPS do loop de renderização do Three.js (`requestAnimationFrame`).

## 4. Validação e Testes
- Para validação de regressão visual, utilize comandos automatizados com o Google Chrome em modo headless (`--headless=new --screenshot=...`) para inspecionar tanto a página de teoria quanto as cenas 3D.
