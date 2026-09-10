/**
 * Construtor da cena do fio/cilindro infinito, linhas de campo e vetores dA.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Shapes = GaussApp.Shapes || {};

(function() {
    function buildCylinderScene() {
        const { mainGroup, createArrow } = GaussApp.Scene;
        const { chargeMaterial } = GaussApp.Materials;
        const { showGaussian, showField, showAreaVectors } = GaussApp.state;
        const { R_bound } = GaussApp.Config;
        const { createSegmentedCylinder, createCylinderAreaVectors } = GaussApp.Gaussian;

        const radCharge = 1.0;
        const radGauss = 3.0;
        const heightGauss = 6.0;
        
        // O cilindro estende-se até tocar a esfera limite nos polos
        const zCap = Math.sqrt(R_bound * R_bound - radCharge * radCharge);
        const cylHeight = 2 * zCap;
        
        // Corpo do cilindro infinito (aberto nas pontas de encontro com o espaço)
        const chargeGeo = new THREE.CylinderGeometry(radCharge, radCharge, cylHeight, 48, 1, true);
        const chargeMesh = new THREE.Mesh(chargeGeo, chargeMaterial);
        chargeMesh.rotation.x = Math.PI / 2;
        mainGroup.add(chargeMesh);
        
        // Circunferências luminosas no topo e no fundo do espaço
        function addCapCircumference(zPos) {
            const pts = [];
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                pts.push(new THREE.Vector3(radCharge * Math.cos(a), radCharge * Math.sin(a), zPos));
            }
            const line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(pts),
                new THREE.LineBasicMaterial({ color: 0xfb7185, linewidth: 2, transparent: true, opacity: 0.95 })
            );
            mainGroup.add(line);
            
            // Anel de brilho na circunferência
            const ringGeo = new THREE.RingGeometry(radCharge - 0.08, radCharge + 0.08, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide, transparent: true, opacity: 0.75, depthWrite: false });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.position.z = zPos;
            mainGroup.add(ringMesh);
        }
        addCapCircumference(zCap);
        addCapCircumference(-zCap);
        
        if (showGaussian) {
            mainGroup.add(createSegmentedCylinder(radGauss, heightGauss, 5, 14, 2, 0.05));
        }

        if (showAreaVectors) {
            mainGroup.add(createCylinderAreaVectors(radGauss, heightGauss, 5, 14, 2, 0.85));
        }
        
        if (showField) {
            const arrowLength = (showGaussian ? radGauss : radGauss - 1.0) - radCharge;
            for (let z = -5.0; z <= 5.0; z += 1.25) {
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
                    mainGroup.add(createArrow(dir, new THREE.Vector3(radCharge * Math.cos(angle), radCharge * Math.sin(angle), z), arrowLength, 0xfbbf24));
                }
            }
        }
    }

    GaussApp.Shapes.buildCylinderScene = buildCylinderScene;
})();
