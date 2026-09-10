/**
 * Construtor da superfície gaussiana esférica segmentada em planos curvados (elementos dA)
 * e gerador dos vetores de área dA perpendiculares a cada painel.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Gaussian = GaussApp.Gaussian || {};

(function() {
    function createSegmentedGaussianSphere(radius = 3.5, nPhi = 9, nTheta = 16, gapRatio = 0.05, customMat = null, customBorderColor = null) {
        const group = new THREE.Group();
        const gaussianMaterial = GaussApp.Materials.gaussianMaterial;
        
        const positions = [];
        const normals = [];
        const linePositions = [];
        
        // Subdivisões internas de cada painel para manter sua curvatura precisa
        const subPhi = 2;
        const subTheta = 2;
        
        for (let i = 0; i < nPhi; i++) {
            const phiStart = (i / nPhi) * Math.PI;
            const phiEnd = ((i + 1) / nPhi) * Math.PI;
            const dPhi = phiEnd - phiStart;
            
            // Gap angular entre os painéis em latitude
            const p0 = phiStart + dPhi * gapRatio;
            const p1 = phiEnd - dPhi * gapRatio;
            
            for (let j = 0; j < nTheta; j++) {
                const thetaStart = (j / nTheta) * Math.PI * 2;
                const thetaEnd = ((j + 1) / nTheta) * Math.PI * 2;
                const dTheta = thetaEnd - thetaStart;
                
                // Gap angular entre os painéis em longitude
                const t0 = thetaStart + dTheta * gapRatio;
                const t1 = thetaEnd - dTheta * gapRatio;
                
                const panelGrid = [];
                for (let u = 0; u <= subPhi; u++) {
                    panelGrid[u] = [];
                    const curPhi = p0 + (p1 - p0) * (u / subPhi);
                    for (let v = 0; v <= subTheta; v++) {
                        const curTheta = t0 + (t1 - t0) * (v / subTheta);
                        const sinP = Math.sin(curPhi);
                        const cosP = Math.cos(curPhi);
                        const sinT = Math.sin(curTheta);
                        const cosT = Math.cos(curTheta);
                        
                        const nx = sinP * cosT;
                        const ny = sinP * sinT;
                        const nz = cosP;
                        
                        panelGrid[u][v] = {
                            pos: new THREE.Vector3(radius * nx, radius * ny, radius * nz),
                            norm: new THREE.Vector3(nx, ny, nz)
                        };
                    }
                }
                
                // Triângulos do plano curvado
                for (let u = 0; u < subPhi; u++) {
                    for (let v = 0; v < subTheta; v++) {
                        const pA = panelGrid[u][v];
                        const pB = panelGrid[u + 1][v];
                        const pC = panelGrid[u + 1][v + 1];
                        const pD = panelGrid[u][v + 1];
                        
                        // Triângulo 1: A, B, C
                        positions.push(pA.pos.x, pA.pos.y, pA.pos.z);
                        positions.push(pB.pos.x, pB.pos.y, pB.pos.z);
                        positions.push(pC.pos.x, pC.pos.y, pC.pos.z);
                        normals.push(pA.norm.x, pA.norm.y, pA.norm.z);
                        normals.push(pB.norm.x, pB.norm.y, pB.norm.z);
                        normals.push(pC.norm.x, pC.norm.y, pC.norm.z);
                        
                        // Triângulo 2: A, C, D
                        positions.push(pA.pos.x, pA.pos.y, pA.pos.z);
                        positions.push(pC.pos.x, pC.pos.y, pC.pos.z);
                        positions.push(pD.pos.x, pD.pos.y, pD.pos.z);
                        normals.push(pA.norm.x, pA.norm.y, pA.norm.z);
                        normals.push(pC.norm.x, pC.norm.y, pC.norm.z);
                        normals.push(pD.norm.x, pD.norm.y, pD.norm.z);
                    }
                }
                
                // Bordas perimetrais que delimitam o plano curvado
                for (let v = 0; v < subTheta; v++) {
                    const pStart = panelGrid[0][v].pos;
                    const pNext = panelGrid[0][v + 1].pos;
                    linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                }
                for (let u = 0; u < subPhi; u++) {
                    const pStart = panelGrid[u][subTheta].pos;
                    const pNext = panelGrid[u + 1][subTheta].pos;
                    linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                }
                for (let v = subTheta; v > 0; v--) {
                    const pStart = panelGrid[subPhi][v].pos;
                    const pNext = panelGrid[subPhi][v - 1].pos;
                    linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                }
                for (let u = subPhi; u > 0; u--) {
                    const pStart = panelGrid[u][0].pos;
                    const pNext = panelGrid[u - 1][0].pos;
                    linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                }
            }
        }
        
        const panelGeo = new THREE.BufferGeometry();
        panelGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        panelGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        
        const panelMesh = new THREE.Mesh(panelGeo, customMat || gaussianMaterial);
        group.add(panelMesh);
        
        // Linhas demarcatórias iluminadas dos planos curvados
        const borderGeo = new THREE.BufferGeometry();
        borderGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const borderMat = new THREE.LineBasicMaterial({
            color: customBorderColor !== null ? customBorderColor : 0x7dd3fc,
            transparent: true,
            opacity: customBorderColor !== null ? 0.25 : 0.38,
            depthWrite: false
        });
        const borderLines = new THREE.LineSegments(borderGeo, borderMat);
        group.add(borderLines);
        
        return group;
    }

    /**
     * Gera os vetores normais de área dA que emergem do centro geométrico de cada painel esférico.
     */
    function createSphereAreaVectors(radius = 3.5, nPhi = 9, nTheta = 16, length = 0.85, color = 0x10b981) {
        const group = new THREE.Group();
        const createArrow = GaussApp.Scene.createArrow;

        for (let i = 0; i < nPhi; i++) {
            const phiStart = (i / nPhi) * Math.PI;
            const phiEnd = ((i + 1) / nPhi) * Math.PI;
            const midPhi = (phiStart + phiEnd) / 2;

            for (let j = 0; j < nTheta; j++) {
                const thetaStart = (j / nTheta) * Math.PI * 2;
                const thetaEnd = ((j + 1) / nTheta) * Math.PI * 2;
                const midTheta = (thetaStart + thetaEnd) / 2;

                const sinP = Math.sin(midPhi);
                const cosP = Math.cos(midPhi);
                const sinT = Math.sin(midTheta);
                const cosT = Math.cos(midTheta);

                const nx = sinP * cosT;
                const ny = sinP * sinT;
                const nz = cosP;

                const norm = new THREE.Vector3(nx, ny, nz);
                const origin = norm.clone().multiplyScalar(radius);

                const arrow = createArrow(norm, origin, length, color, 0.24, 0.12);
                group.add(arrow);
            }
        }

        return group;
    }

    GaussApp.Gaussian.createSegmentedSphere = createSegmentedGaussianSphere;
    GaussApp.Gaussian.createSphereAreaVectors = createSphereAreaVectors;
})();
