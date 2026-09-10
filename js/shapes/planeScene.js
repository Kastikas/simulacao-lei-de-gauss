/**
 * Construtor da cena da placa infinita, linhas de campo e vetores dA.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Shapes = GaussApp.Shapes || {};

(function() {
    function buildPlaneScene() {
        const { mainGroup, createArrow } = GaussApp.Scene;
        const { planeMaterial } = GaussApp.Materials;
        const { showGaussian, showField, showAreaVectors } = GaussApp.state;
        const { R_bound } = GaussApp.Config;
        const { createSegmentedCylinder, createCylinderAreaVectors } = GaussApp.Gaussian;

        const gaussRad = 2.0;
        const gaussHeight = 4.0;
        
        // Placa infinita em z = 0, estendendo-se até o horizonte da esfera
        const planeGeo = new THREE.CylinderGeometry(R_bound, R_bound, 0.08, 64);
        const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
        planeMesh.rotation.x = Math.PI / 2;
        mainGroup.add(planeMesh);
        
        // Linha no horizonte da esfera que delimita o plano
        const horizonPts = [];
        for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            horizonPts.push(new THREE.Vector3(R_bound * Math.cos(a), R_bound * Math.sin(a), 0));
        }
        const horizonGeo = new THREE.BufferGeometry().setFromPoints(horizonPts);
        const horizonLine = new THREE.Line(horizonGeo, new THREE.LineBasicMaterial({
            color: 0xfb7185,
            linewidth: 2,
            transparent: true,
            opacity: 0.95
        }));
        mainGroup.add(horizonLine);

        // Anel de brilho suave no horizonte
        const horizonRingGeo = new THREE.RingGeometry(R_bound - 0.3, R_bound + 0.05, 64);
        const horizonRingMat = new THREE.MeshBasicMaterial({
            color: 0xf43f5e,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const horizonRing = new THREE.Mesh(horizonRingGeo, horizonRingMat);
        mainGroup.add(horizonRing);
        
        if (showGaussian) {
            mainGroup.add(createSegmentedCylinder(gaussRad, gaussHeight, 3, 12, 2, 0.05));
        }

        if (showAreaVectors) {
            mainGroup.add(createCylinderAreaVectors(gaussRad, gaussHeight, 3, 12, 2, 0.75));
        }
        
        if (showField) {
            const arrowLength = (showGaussian ? gaussHeight / 2 : 1.5) - 0.05;
            // Flechas centrais
            mainGroup.add(createArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0.04), arrowLength, 0xfbbf24));
            mainGroup.add(createArrow(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, -0.04), arrowLength, 0xfbbf24));
            
            // Distribuição circular de flechas cobrindo a placa
            const rings = [1.5, 3.0, 4.8, 6.8];
            const counts = [6, 12, 16, 20];
            for (let rIdx = 0; rIdx < rings.length; rIdx++) {
                const r = rings[rIdx];
                const count = counts[rIdx];
                for (let i = 0; i < count; i++) {
                    const a = (i / count) * Math.PI * 2;
                    const x = r * Math.cos(a);
                    const y = r * Math.sin(a);
                    mainGroup.add(createArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(x, y, 0.04), arrowLength, 0xfbbf24));
                    mainGroup.add(createArrow(new THREE.Vector3(0, 0, -1), new THREE.Vector3(x, y, -0.04), arrowLength, 0xfbbf24));
                }
            }
        }
    }

    GaussApp.Shapes.buildPlaneScene = buildPlaneScene;
})();
