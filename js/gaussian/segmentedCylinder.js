/**
 * Construtor da superfície gaussiana cilíndrica segmentada em painéis curvados e setores nas tampas
 * e gerador dos vetores de área dA perpendiculares à parede e tampas.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Gaussian = GaussApp.Gaussian || {};

(function() {
    function createSegmentedGaussianCylinder(radius = 3.0, height = 6.0, nZ = 5, nTheta = 14, nRings = 2, gapRatio = 0.05, customMat = null, customBorderColor = null) {
        const group = new THREE.Group();
        const gaussianMaterial = GaussApp.Materials.gaussianMaterial;
        
        const positions = [];
        const normals = [];
        const linePositions = [];
        
        // --- 1. Parede lateral cilíndrica segmentada em planos curvados ---
        const subZ = 1;
        const subTheta = 2;
        
        for (let i = 0; i < nZ; i++) {
            const zStart = -height / 2 + (i / nZ) * height;
            const zEnd = -height / 2 + ((i + 1) / nZ) * height;
            const dz = zEnd - zStart;
            const z0 = zStart + dz * gapRatio;
            const z1 = zEnd - dz * gapRatio;
            
            for (let j = 0; j < nTheta; j++) {
                const thetaStart = (j / nTheta) * Math.PI * 2;
                const thetaEnd = ((j + 1) / nTheta) * Math.PI * 2;
                const dTheta = thetaEnd - thetaStart;
                const t0 = thetaStart + dTheta * gapRatio;
                const t1 = thetaEnd - dTheta * gapRatio;
                
                const panelGrid = [];
                for (let u = 0; u <= subZ; u++) {
                    panelGrid[u] = [];
                    const curZ = z0 + (z1 - z0) * (u / subZ);
                    for (let v = 0; v <= subTheta; v++) {
                        const curT = t0 + (t1 - t0) * (v / subTheta);
                        const cosT = Math.cos(curT);
                        const sinT = Math.sin(curT);
                        
                        panelGrid[u][v] = {
                            pos: new THREE.Vector3(radius * cosT, radius * sinT, curZ),
                            norm: new THREE.Vector3(cosT, sinT, 0)
                        };
                    }
                }
                
                // Triângulos do painel lateral curvado
                for (let u = 0; u < subZ; u++) {
                    for (let v = 0; v < subTheta; v++) {
                        const pA = panelGrid[u][v];
                        const pB = panelGrid[u + 1][v];
                        const pC = panelGrid[u + 1][v + 1];
                        const pD = panelGrid[u][v + 1];
                        
                        // Triângulo 1: A, D, C (CCW visto de fora)
                        positions.push(pA.pos.x, pA.pos.y, pA.pos.z);
                        positions.push(pD.pos.x, pD.pos.y, pD.pos.z);
                        positions.push(pC.pos.x, pC.pos.y, pC.pos.z);
                        normals.push(pA.norm.x, pA.norm.y, pA.norm.z);
                        normals.push(pD.norm.x, pD.norm.y, pD.norm.z);
                        normals.push(pC.norm.x, pC.norm.y, pC.norm.z);
                        
                        // Triângulo 2: A, C, B
                        positions.push(pA.pos.x, pA.pos.y, pA.pos.z);
                        positions.push(pC.pos.x, pC.pos.y, pC.pos.z);
                        positions.push(pB.pos.x, pB.pos.y, pB.pos.z);
                        normals.push(pA.norm.x, pA.norm.y, pA.norm.z);
                        normals.push(pC.norm.x, pC.norm.y, pC.norm.z);
                        normals.push(pB.norm.x, pB.norm.y, pB.norm.z);
                    }
                }
                
                // Bordas perimetrais que delimitam o painel lateral
                for (let v = 0; v < subTheta; v++) {
                    const pStart = panelGrid[0][v].pos;
                    const pNext = panelGrid[0][v + 1].pos;
                    linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                }
                for (let u = 0; u < subZ; u++) {
                    const pStart = panelGrid[u][subTheta].pos;
                    const pNext = panelGrid[u + 1][subTheta].pos;
                    linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                }
                for (let v = subTheta; v > 0; v--) {
                    const pStart = panelGrid[subZ][v].pos;
                    const pNext = panelGrid[subZ][v - 1].pos;
                    linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                }
                for (let u = subZ; u > 0; u--) {
                    const pStart = panelGrid[u][0].pos;
                    const pNext = panelGrid[u - 1][0].pos;
                    linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                }
            }
        }
        
        // --- 2. Tampas circulares (superior e inferior) segmentadas ---
        const caps = [
            { z: height / 2, normalZ: 1 },
            { z: -height / 2, normalZ: -1 }
        ];
        
        const subR = 1;
        for (const cap of caps) {
            for (let rIdx = 0; rIdx < nRings; rIdx++) {
                const rStart = (rIdx / nRings) * radius;
                const rEnd = ((rIdx + 1) / nRings) * radius;
                const dr = rEnd - rStart;
                const r0 = rIdx === 0 ? Math.max(0.04 * radius, dr * gapRatio) : rStart + dr * gapRatio;
                const r1 = rEnd - dr * gapRatio;
                
                for (let j = 0; j < nTheta; j++) {
                    const thetaStart = (j / nTheta) * Math.PI * 2;
                    const thetaEnd = ((j + 1) / nTheta) * Math.PI * 2;
                    const dTheta = thetaEnd - thetaStart;
                    const t0 = thetaStart + dTheta * gapRatio;
                    const t1 = thetaEnd - dTheta * gapRatio;
                    
                    const panelGrid = [];
                    for (let u = 0; u <= subR; u++) {
                        panelGrid[u] = [];
                        const curR = r0 + (r1 - r0) * (u / subR);
                        for (let v = 0; v <= subTheta; v++) {
                            const curT = t0 + (t1 - t0) * (v / subTheta);
                            panelGrid[u][v] = {
                                pos: new THREE.Vector3(curR * Math.cos(curT), curR * Math.sin(curT), cap.z),
                                norm: new THREE.Vector3(0, 0, cap.normalZ)
                            };
                        }
                    }
                    
                    // Triângulos do painel da tampa
                    for (let u = 0; u < subR; u++) {
                        for (let v = 0; v < subTheta; v++) {
                            const pA = panelGrid[u][v];
                            const pB = panelGrid[u + 1][v];
                            const pC = panelGrid[u + 1][v + 1];
                            const pD = panelGrid[u][v + 1];
                            
                            if (cap.normalZ > 0) {
                                // Tampa superior (+Z)
                                positions.push(pA.pos.x, pA.pos.y, pA.pos.z);
                                positions.push(pB.pos.x, pB.pos.y, pB.pos.z);
                                positions.push(pC.pos.x, pC.pos.y, pC.pos.z);
                                normals.push(pA.norm.x, pA.norm.y, pA.norm.z);
                                normals.push(pB.norm.x, pB.norm.y, pB.norm.z);
                                normals.push(pC.norm.x, pC.norm.y, pC.norm.z);
                                
                                positions.push(pA.pos.x, pA.pos.y, pA.pos.z);
                                positions.push(pC.pos.x, pC.pos.y, pC.pos.z);
                                positions.push(pD.pos.x, pD.pos.y, pD.pos.z);
                                normals.push(pA.norm.x, pA.norm.y, pA.norm.z);
                                normals.push(pC.norm.x, pC.norm.y, pC.norm.z);
                                normals.push(pD.norm.x, pD.norm.y, pD.norm.z);
                            } else {
                                // Tampa inferior (-Z)
                                positions.push(pA.pos.x, pA.pos.y, pA.pos.z);
                                positions.push(pB.pos.x, pB.pos.y, pB.pos.z);
                                positions.push(pC.pos.x, pC.pos.y, pC.pos.z);
                                normals.push(pA.norm.x, pA.norm.y, pA.norm.z);
                                normals.push(pB.norm.x, pB.norm.y, pB.norm.z);
                                normals.push(pC.norm.x, pC.norm.y, pC.norm.z);
                                
                                positions.push(pA.pos.x, pA.pos.y, pA.pos.z);
                                positions.push(pC.pos.x, pC.pos.y, pC.pos.z);
                                positions.push(pD.pos.x, pD.pos.y, pD.pos.z);
                                normals.push(pA.norm.x, pA.norm.y, pA.norm.z);
                                normals.push(pC.norm.x, pC.norm.y, pC.norm.z);
                                normals.push(pD.norm.x, pD.norm.y, pD.norm.z);
                            }
                        }
                    }
                    
                    // Bordas perimetrais do painel da tampa
                    for (let v = 0; v < subTheta; v++) {
                        const pStart = panelGrid[0][v].pos;
                        const pNext = panelGrid[0][v + 1].pos;
                        linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                    }
                    for (let u = 0; u < subR; u++) {
                        const pStart = panelGrid[u][subTheta].pos;
                        const pNext = panelGrid[u + 1][subTheta].pos;
                        linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                    }
                    for (let v = subTheta; v > 0; v--) {
                        const pStart = panelGrid[subR][v].pos;
                        const pNext = panelGrid[subR][v - 1].pos;
                        linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                    }
                    for (let u = subR; u > 0; u--) {
                        const pStart = panelGrid[u][0].pos;
                        const pNext = panelGrid[u - 1][0].pos;
                        linePositions.push(pStart.x, pStart.y, pStart.z, pNext.x, pNext.y, pNext.z);
                    }
                }
            }
        }
        
        const panelGeo = new THREE.BufferGeometry();
        panelGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        panelGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        const panelMesh = new THREE.Mesh(panelGeo, customMat || gaussianMaterial);
        group.add(panelMesh);
        
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
     * Gera os vetores normais de área dA para a superfície gaussiana cilíndrica.
     * Na parede lateral: radiais (perpendiculares a z).
     * Nas tampas superior/inferior: axiais (+Z e -Z).
     */
    function createCylinderAreaVectors(radius = 3.0, height = 6.0, nZ = 5, nTheta = 14, nRings = 2, length = 0.85, color = 0x10b981) {
        const group = new THREE.Group();
        const createArrow = GaussApp.Scene.createArrow;

        // 1. Vetores na parede lateral
        for (let i = 0; i < nZ; i++) {
            const zStart = -height / 2 + (i / nZ) * height;
            const zEnd = -height / 2 + ((i + 1) / nZ) * height;
            const midZ = (zStart + zEnd) / 2;

            for (let j = 0; j < nTheta; j++) {
                const thetaStart = (j / nTheta) * Math.PI * 2;
                const thetaEnd = ((j + 1) / nTheta) * Math.PI * 2;
                const midTheta = (thetaStart + thetaEnd) / 2;

                const cosT = Math.cos(midTheta);
                const sinT = Math.sin(midTheta);
                const norm = new THREE.Vector3(cosT, sinT, 0);
                const origin = new THREE.Vector3(radius * cosT, radius * sinT, midZ);

                group.add(createArrow(norm, origin, length, color, 0.24, 0.12));
            }
        }

        // 2. Vetores nas tampas (superior +Z e inferior -Z)
        const caps = [
            { z: height / 2, normalZ: 1 },
            { z: -height / 2, normalZ: -1 }
        ];

        for (const cap of caps) {
            for (let rIdx = 0; rIdx < nRings; rIdx++) {
                const rStart = (rIdx / nRings) * radius;
                const rEnd = ((rIdx + 1) / nRings) * radius;
                const midR = (rStart + rEnd) / 2;

                for (let j = 0; j < nTheta; j++) {
                    const thetaStart = (j / nTheta) * Math.PI * 2;
                    const thetaEnd = ((j + 1) / nTheta) * Math.PI * 2;
                    const midTheta = (thetaStart + thetaEnd) / 2;

                    const norm = new THREE.Vector3(0, 0, cap.normalZ);
                    const origin = new THREE.Vector3(midR * Math.cos(midTheta), midR * Math.sin(midTheta), cap.z);

                    group.add(createArrow(norm, origin, length, color, 0.24, 0.12));
                }
            }
        }

        return group;
    }

    GaussApp.Gaussian.createSegmentedCylinder = createSegmentedGaussianCylinder;
    GaussApp.Gaussian.createCylinderAreaVectors = createCylinderAreaVectors;
})();
