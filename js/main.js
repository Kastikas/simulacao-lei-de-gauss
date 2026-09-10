/**
 * Ponto de entrada (bootstrap), orquestração da cena e loop de animação.
 */
window.GaussApp = window.GaussApp || {};

(function() {
    function updateScene() {
        const { mainGroup, clearGroup } = GaussApp.Scene;
        const { currentShape } = GaussApp.state;
        const { ReferencePlanes, Shapes, Symmetry } = GaussApp;

        clearGroup(mainGroup);
        ReferencePlanes.updateReferencesVisibility();
        
        switch (currentShape) {
            case 'sphere': 
                Shapes.buildSphereScene(); 
                break;
            case 'cylinder': 
                Shapes.buildCylinderScene(); 
                break;
            case 'plane': 
                Shapes.buildPlaneScene(); 
                break;
            case 'cube': 
                Shapes.buildCubeScene(); 
                break;
        }
        
        Symmetry.buildSymmetryTest();
    }

    function animate() {
        requestAnimationFrame(animate);
        GaussApp.Scene.controls.update();
        GaussApp.Scene.renderer.render(GaussApp.Scene.scene, GaussApp.Scene.camera);
    }

    function init() {
        const { Boundary, UI, ReferencePlanes, state, Scene } = GaussApp;

        // Leitura de parâmetros de URL (?shape=sphere|cylinder|plane|cube)
        const urlParams = new URLSearchParams(window.location.search);
        const requestedShape = urlParams.get('shape');
        const validShapes = ['sphere', 'cylinder', 'plane', 'cube'];

        if (requestedShape && validShapes.includes(requestedShape)) {
            state.currentShape = requestedShape;
            const shapeSelect = document.getElementById('shape-select');
            if (shapeSelect) {
                shapeSelect.value = requestedShape;
            }
            // Assegura que os elementos visuais principais da Lei de Gauss estão ativos
            state.showGaussian = true;
            state.showAreaVectors = true;
            state.showField = true;
            state.symmetryMode = 'none';

            // Posição de câmera ideal para visualização inicial da geometria
            const camPositions = {
                sphere: { x: 4.5, y: 3.5, z: 5.5 },
                cylinder: { x: 6.0, y: 4.0, z: 6.0 },
                plane: { x: 7.5, y: 7.0, z: 9.0 },
                cube: { x: 5.0, y: 4.5, z: 6.0 }
            };
            const pos = camPositions[requestedShape];
            if (pos && Scene.camera) {
                Scene.camera.position.set(pos.x, pos.y, pos.z);
                Scene.camera.lookAt(0, 0, 0);
                if (Scene.controls) {
                    Scene.controls.target.set(0, 0, 0);
                    Scene.controls.update();
                }
            }
        }

        // Constrói a esfera celeste limite
        Boundary.buildBoundarySphere();

        // Inicializa estado visual dos botões de alternância
        UI.updateToggleUI('toggle-gaussian', state.showGaussian, 'blue');
        UI.updateToggleUI('toggle-area-vectors', state.showAreaVectors, 'emerald');
        UI.updateToggleUI('toggle-field', state.showField, 'amber');
        UI.updateToggleUI('toggle-axes', state.showAxes, 'indigo');
        UI.updateToggleUI('toggle-plane-x', state.showPlaneX, 'red');
        UI.updateToggleUI('toggle-plane-y', state.showPlaneY, 'green');
        UI.updateToggleUI('toggle-plane-z', state.showPlaneZ, 'blue');

        // Configura visibilidade inicial de eixos e planos
        ReferencePlanes.updateReferencesVisibility();

        // Inicializa dropdown de simetria para a geometria atual
        UI.updateSymmetryDropdown(state.currentShape);

        // Aplica parâmetros avançados de teste de simetria da URL (para desafios de fixação)
        const symMode = urlParams.get('sym');
        const vx = urlParams.get('vx');
        const vy = urlParams.get('vy');
        const vz = urlParams.get('vz');
        const angle = urlParams.get('angle');
        const trans = urlParams.get('trans');

        if (symMode && GaussApp.symmetryDict && GaussApp.symmetryDict[symMode]) {
            state.symmetryMode = symMode;
            const symSelect = document.getElementById('symmetry-mode');
            if (symSelect) symSelect.value = symMode;
        }
        if (vx !== null && document.getElementById('vec-x')) document.getElementById('vec-x').value = vx;
        if (vy !== null && document.getElementById('vec-y')) document.getElementById('vec-y').value = vy;
        if (vz !== null && document.getElementById('vec-z')) document.getElementById('vec-z').value = vz;
        if (angle !== null && document.getElementById('rot-angle')) {
            document.getElementById('rot-angle').value = angle;
        }
        if (trans !== null && document.getElementById('trans-dist')) {
            document.getElementById('trans-dist').value = trans;
        }

        // Registra todos os event listeners da interface
        UI.initEventListeners();

        // Monta a primeira cena 3D e atualiza textos/fórmulas
        updateScene();
        UI.updateUI();

        // Garante dimensão correta de canvas no viewport atual
        Scene.onResize();

        // Se requisitado via URL, inicia em modo recolhido (Modo 3D Amplo)
        if (urlParams.get('collapsed') === 'true') {
            UI.toggleMobilePanel(true);
        }

        // Inicia loop de renderização
        animate();
    }

    GaussApp.updateScene = updateScene;
    GaussApp.init = init;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
