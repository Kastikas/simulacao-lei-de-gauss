/**
 * Construtor da superfície gaussiana cúbica segmentada em uma malha de painéis planos por face
 * e gerador dos vetores de área dA perpendiculares a cada face do cubo.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Gaussian = GaussApp.Gaussian || {};

(function() {
    function createSegmentedGaussianCube(size = 4.0, gridN = 4, gapRatio = 0.05, customMat = null, customBorderColor = null) {
        const group = new THREE.Group();
        const gaussianMaterial = GaussApp.Materials.gaussianMaterial;
        
        const positions = [];
        const normals = [];
        const linePositions = [];
        
        const half = size / 2;
        
        // 6 faces ortogonais com bases orientadas para que u x v = normal
        const faces = [
            { normal: new THREE.Vector3(1, 0, 0), u: new THREE.Vector3(0, 1, 0), v: new THREE.Vector3(0, 0, 1) },
            { normal: new THREE.Vector3(-1, 0, 0), u: new THREE.Vector3(0, -1, 0), v: new THREE.Vector3(0, 0, 1) },
            { normal: new THREE.Vector3(0, 1, 0), u: new THREE.Vector3(-1, 0, 0), v: new THREE.Vector3(0, 0, 1) },
            { normal: new THREE.Vector3(0, -1, 0), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 0, 1) },
            { normal: new THREE.Vector3(0, 0, 1), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 1, 0) },
            { normal: new THREE.Vector3(0, 0, -1), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, -1, 0) }
        ];
        
        const dStep = size / gridN;
        
        for (const face of faces) {
            const faceCenter = face.normal.clone().multiplyScalar(half);
            
            for (let i = 0; i < gridN; i++) {
                const uStart = -half + i * dStep;
                const uEnd = uStart + dStep;
                const du = dStep;
                const u0 = uStart + du * gapRatio;
                const u1 = uEnd - du * gapRatio;
                
                for (let j = 0; j < gridN; j++) {
                    const vStart = -half + j * dStep;
                    const vEnd = vStart + dStep;
                    const dv = dStep;
                    const v0 = vStart + dv * gapRatio;
                    const v1 = vEnd - dv * gapRatio;
                    
                    // 4 vértices do painel plano
                    const pA = faceCenter.clone().addScaledVector(face.u, u0).addScaledVector(face.v, v0);
                    const pB = faceCenter.clone().addScaledVector(face.u, u1).addScaledVector(face.v, v0);
                    const pC = faceCenter.clone().addScaledVector(face.u, u1).addScaledVector(face.v, v1);
                    const pD = faceCenter.clone().addScaledVector(face.u, u0).addScaledVector(face.v, v1);
                    
                    // Triângulo 1: A, B, C
                    positions.push(pA.x, pA.y, pA.z);
                    positions.push(pB.x, pB.y, pB.z);
                    positions.push(pC.x, pC.y, pC.z);
                    normals.push(face.normal.x, face.normal.y, face.normal.z);
                    normals.push(face.normal.x, face.normal.y, face.normal.z);
                    normals.push(face.normal.x, face.normal.y, face.normal.z);
                    
                    // Triângulo 2: A, C, D
                    positions.push(pA.x, pA.y, pA.z);
                    positions.push(pC.x, pC.y, pC.z);
                    positions.push(pD.x, pD.y, pD.z);
                    normals.push(face.normal.x, face.normal.y, face.normal.z);
                    normals.push(face.normal.x, face.normal.y, face.normal.z);
                    normals.push(face.normal.x, face.normal.y, face.normal.z);
                    
                    // 4 arestas de borda iluminada do painel
                    linePositions.push(pA.x, pA.y, pA.z, pB.x, pB.y, pB.z);
                    linePositions.push(pB.x, pB.y, pB.z, pC.x, pC.y, pC.z);
                    linePositions.push(pC.x, pC.y, pC.z, pD.x, pD.y, pD.z);
                    linePositions.push(pD.x, pD.y, pD.z, pA.x, pA.y, pA.z);
                }
            }
        }
        
        const panelGeo = new THREE.BufferGeometry();
        panelGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        panelGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        group.add(new THREE.Mesh(panelGeo, customMat || gaussianMaterial));
        
        const borderGeo = new THREE.BufferGeometry();
        borderGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const borderMat = new THREE.LineBasicMaterial({
            color: customBorderColor !== null ? customBorderColor : 0x7dd3fc,
            transparent: true,
            opacity: customBorderColor !== null ? 0.25 : 0.38,
            depthWrite: false
        });
        group.add(new THREE.LineSegments(borderGeo, borderMat));
        
        return group;
    }

    /**
     * Gera os vetores normais de área dA que emergem do centro de cada painel cúbico.
     */
    function createCubeAreaVectors(size = 4.0, gridN = 4, length = 0.85, color = 0x10b981) {
        const group = new THREE.Group();
        const createArrow = GaussApp.Scene.createArrow;

        const half = size / 2;
        const faces = [
            { normal: new THREE.Vector3(1, 0, 0), u: new THREE.Vector3(0, 1, 0), v: new THREE.Vector3(0, 0, 1) },
            { normal: new THREE.Vector3(-1, 0, 0), u: new THREE.Vector3(0, -1, 0), v: new THREE.Vector3(0, 0, 1) },
            { normal: new THREE.Vector3(0, 1, 0), u: new THREE.Vector3(-1, 0, 0), v: new THREE.Vector3(0, 0, 1) },
            { normal: new THREE.Vector3(0, -1, 0), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 0, 1) },
            { normal: new THREE.Vector3(0, 0, 1), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 1, 0) },
            { normal: new THREE.Vector3(0, 0, -1), u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, -1, 0) }
        ];

        const dStep = size / gridN;

        for (const face of faces) {
            const faceCenter = face.normal.clone().multiplyScalar(half);

            for (let i = 0; i < gridN; i++) {
                const uMid = -half + (i + 0.5) * dStep;

                for (let j = 0; j < gridN; j++) {
                    const vMid = -half + (j + 0.5) * dStep;

                    const origin = faceCenter.clone().addScaledVector(face.u, uMid).addScaledVector(face.v, vMid);
                    const norm = face.normal.clone();

                    group.add(createArrow(norm, origin, length, color, 0.24, 0.12));
                }
            }
        }

        return group;
    }

    GaussApp.Gaussian.createSegmentedCube = createSegmentedGaussianCube;
    GaussApp.Gaussian.createCubeAreaVectors = createCubeAreaVectors;
})();
