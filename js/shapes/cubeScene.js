/**
 * Construtor da cena da distribuição cúbica de carga, linhas de campo e vetores dA.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Shapes = GaussApp.Shapes || {};

(function() {
    function buildCubeScene() {
        const { mainGroup, createArrow } = GaussApp.Scene;
        const { chargeMaterial } = GaussApp.Materials;
        const { showGaussian, showField, showAreaVectors } = GaussApp.state;
        const { createSegmentedCube, createCubeAreaVectors } = GaussApp.Gaussian;

        mainGroup.add(new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), chargeMaterial));
        
        if (showGaussian) {
            mainGroup.add(createSegmentedCube(4.0, 4, 0.05));
        }

        if (showAreaVectors) {
            mainGroup.add(createCubeAreaVectors(4.0, 4, 0.85));
        }
        
        if (showField) {
            const pts = [
                new THREE.Vector3(2, 0, 0), new THREE.Vector3(-2, 0, 0), new THREE.Vector3(0, 2, 0), new THREE.Vector3(0, -2, 0), new THREE.Vector3(0, 0, 2), new THREE.Vector3(0, 0, -2),
                new THREE.Vector3(2, 2, 0), new THREE.Vector3(2, -2, 0), new THREE.Vector3(-2, 2, 0), new THREE.Vector3(-2, -2, 0),
                new THREE.Vector3(2, 2, 2), new THREE.Vector3(2, 2, -2), new THREE.Vector3(2, -2, 2), new THREE.Vector3(-2, -2, 2)
            ];
            pts.forEach(p => mainGroup.add(createArrow(p.clone().normalize(), p.clone().normalize().multiplyScalar(1.5), (showGaussian ? p.length() - 1.5 : 1), 0xfbbf24)));
        }
    }

    GaussApp.Shapes.buildCubeScene = buildCubeScene;
})();
