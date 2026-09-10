/**
 * Construtor da cena da distribuição de carga esférica, linhas de campo e vetores dA.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Shapes = GaussApp.Shapes || {};

(function() {
    function buildSphereScene() {
        const { mainGroup, createArrow } = GaussApp.Scene;
        const { chargeMaterial } = GaussApp.Materials;
        const { showGaussian, showField, showAreaVectors } = GaussApp.state;
        const { createSegmentedSphere, createSphereAreaVectors } = GaussApp.Gaussian;

        const radCharge = 1.5;
        const radGauss = 3.5;
        
        mainGroup.add(new THREE.Mesh(new THREE.SphereGeometry(radCharge, 32, 32), chargeMaterial));
        
        if (showGaussian) {
            mainGroup.add(createSegmentedSphere(radGauss, 9, 16, 0.05));
        }

        if (showAreaVectors) {
            mainGroup.add(createSphereAreaVectors(radGauss, 9, 16, 0.85));
        }
        
        if (showField) {
            const goldenRatio = (1 + Math.sqrt(5)) / 2;
            const arrowLength = (showGaussian ? radGauss : radGauss - 1.0) - radCharge;
            for (let i = 0; i < 40; i++) {
                const phi = Math.acos(1 - 2 * (i + 0.5) / 40);
                const theta = 2 * Math.PI * i / goldenRatio;
                const dir = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi));
                mainGroup.add(createArrow(dir, dir.clone().multiplyScalar(radCharge), arrowLength, 0xfbbf24));
            }
        }
    }

    GaussApp.Shapes.buildSphereScene = buildSphereScene;
})();
