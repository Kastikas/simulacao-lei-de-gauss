/**
 * Construtor da cópia rotacionada (holograma translúcido) do volume de carga e da superfície gaussiana.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Shapes = GaussApp.Shapes || {};

(function() {
    function buildRotatedVolumeCopy(shape, showGauss) {
        const group = new THREE.Group();
        const { copyChargeMat, copyGaussMat, copyBorderColor } = GaussApp.Materials;
        const { R_bound } = GaussApp.Config;
        const { createSegmentedSphere, createSegmentedCylinder, createSegmentedCube } = GaussApp.Gaussian;

        if (shape === 'sphere') {
            const radCharge = 1.5;
            const radGauss = 3.5;
            
            // Cópia da carga esférica em cinza translúcido suave
            const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(radCharge, 32, 32), copyChargeMat);
            group.add(sphereMesh);
            
            // Linhas de contorno discretas em cinza
            const wire = new THREE.LineSegments(
                new THREE.WireframeGeometry(new THREE.SphereGeometry(radCharge, 16, 16)),
                new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.2, depthWrite: false })
            );
            group.add(wire);

            // APOIO VISUAL DE ROTAÇÃO: Meridianos giratórios em ciano na superfície da esfera
            const numMeridians = 4;
            for (let m = 0; m < numMeridians; m++) {
                const rotA = (m / numMeridians) * Math.PI;
                const pts = [];
                for (let i = 0; i <= 64; i++) {
                    const a = (i / 64) * Math.PI * 2;
                    pts.push(new THREE.Vector3((radCharge + 0.01) * Math.cos(a), 0, (radCharge + 0.01) * Math.sin(a)).applyAxisAngle(new THREE.Vector3(0, 0, 1), rotA));
                }
                group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.75 })));
            }

            // Equador giratório
            const eqPts = [];
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                eqPts.push(new THREE.Vector3((radCharge + 0.01) * Math.cos(a), (radCharge + 0.01) * Math.sin(a), 0));
            }
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(eqPts), new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.75 })));

            // Cópia da superfície gaussiana esférica
            if (showGauss) {
                group.add(createSegmentedSphere(radGauss, 9, 16, 0.05, copyGaussMat, copyBorderColor));
            }
        } else if (shape === 'cylinder') {
            const radCharge = 1.0;
            const radGauss = 3.0;
            const heightGauss = 6.0;
            const zCap = Math.sqrt(R_bound * R_bound - radCharge * radCharge);
            const cylHeight = 2 * zCap;

            // Cópia do fio/cilindro infinito
            const chargeGeo = new THREE.CylinderGeometry(radCharge, radCharge, cylHeight, 48, 1, true);
            const chargeMesh = new THREE.Mesh(chargeGeo, copyChargeMat);
            chargeMesh.rotation.x = Math.PI / 2;
            group.add(chargeMesh);

            // Circunferências em cinza suave nas extremidades celestes
            function addCopyCap(zPos) {
                const pts = [];
                for (let i = 0; i <= 64; i++) {
                    const a = (i / 64) * Math.PI * 2;
                    pts.push(new THREE.Vector3(radCharge * Math.cos(a), radCharge * Math.sin(a), zPos));
                }
                const line = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(pts),
                    new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 1.5, transparent: true, opacity: 0.45 })
                );
                group.add(line);
            }
            addCopyCap(zCap);
            addCopyCap(-zCap);

            // APOIO VISUAL DE ROTAÇÃO 1: Geratrizes longitudinais giratórias em ciano na superfície do cilindro
            const genPts = [];
            const numStripes = 8;
            for (let i = 0; i < numStripes; i++) {
                const a = (i / numStripes) * Math.PI * 2;
                const x = (radCharge + 0.015) * Math.cos(a);
                const y = (radCharge + 0.015) * Math.sin(a);
                genPts.push(x, y, -zCap, x, y, zCap);
            }
            const genGeo = new THREE.BufferGeometry();
            genGeo.setAttribute('position', new THREE.Float32BufferAttribute(genPts, 3));
            group.add(new THREE.LineSegments(genGeo, new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 1.5, transparent: true, opacity: 0.85 })));

            // APOIO VISUAL DE ROTAÇÃO 2: Arcos circulares de rotação ao redor do cilindro
            const zArcLevels = [-2.5, 0.0, 2.5];
            zArcLevels.forEach(zL => {
                const arcPts = [];
                for (let i = 0; i <= 64; i++) {
                    const a = (i / 64) * Math.PI * 2;
                    arcPts.push(new THREE.Vector3((radCharge + 0.02) * Math.cos(a), (radCharge + 0.02) * Math.sin(a), zL));
                }
                group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(arcPts), new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5 })));
            });

            // Cópia da superfície gaussiana cilíndrica
            if (showGauss) {
                group.add(createSegmentedCylinder(radGauss, heightGauss, 5, 14, 2, 0.05, copyGaussMat, copyBorderColor));
            }
        } else if (shape === 'plane') {
            const gaussRad = 2.0;
            const gaussHeight = 4.0;

            // Cópia da placa infinita
            const planeGeo = new THREE.CylinderGeometry(R_bound, R_bound, 0.08, 64);
            const planeMesh = new THREE.Mesh(planeGeo, copyChargeMat);
            planeMesh.rotation.x = Math.PI / 2;
            group.add(planeMesh);

            // Linha de horizonte cinza da cópia do plano
            const horizonPts = [];
            for (let i = 0; i <= 128; i++) {
                const a = (i / 128) * Math.PI * 2;
                horizonPts.push(new THREE.Vector3(R_bound * Math.cos(a), R_bound * Math.sin(a), 0));
            }
            const horizonLine = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(horizonPts),
                new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 1.5, transparent: true, opacity: 0.45 })
            );
            group.add(horizonLine);

            // APOIO VISUAL DE ROTAÇÃO 1: Raios angulares giratórios (Spokes) sobre a placa
            const spokePts = [];
            const numSpokes = 12;
            for (let i = 0; i < numSpokes; i++) {
                const a = (i / numSpokes) * Math.PI * 2;
                spokePts.push(0, 0, 0.07, R_bound * Math.cos(a), R_bound * Math.sin(a), 0.07);
            }
            const spokeGeo = new THREE.BufferGeometry();
            spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(spokePts, 3));
            group.add(new THREE.LineSegments(spokeGeo, new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 1.5, transparent: true, opacity: 0.75 })));

            // APOIO VISUAL DE ROTAÇÃO 2: Círculos concêntricos na placa que guiam o giro
            [3.5, 7.0].forEach(r => {
                const cPts = [];
                for (let i = 0; i <= 64; i++) {
                    const a = (i / 64) * Math.PI * 2;
                    cPts.push(new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), 0.07));
                }
                group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cPts), new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.55 })));
            });

            // Cópia da superfície gaussiana (caixa de pílula)
            if (showGauss) {
                group.add(createSegmentedCylinder(gaussRad, gaussHeight, 3, 12, 2, 0.05, copyGaussMat, copyBorderColor));
            }
        } else if (shape === 'cube') {
            // Cópia do cubo carregado
            const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), copyChargeMat);
            group.add(boxMesh);

            // Arestas de contorno nítidas em ciano evidenciando a rotação
            const wire = new THREE.LineSegments(
                new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 3, 3)),
                new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85 })
            );
            group.add(wire);

            // Cópia da superfície gaussiana cúbica
            if (showGauss) {
                group.add(createSegmentedCube(4.0, 4, 0.05, copyGaussMat, copyBorderColor));
            }
        }

        return group;
    }

    /**
     * Construtor da cópia transladada com indicadores visuais de movimento
     * para demonstrar a simetria de translação contínua no cilindro e no plano.
     */
    function buildTranslatedVolumeCopy(shape, showGauss, transVec, dist, axis) {
        const group = new THREE.Group();
        const { copyChargeMat, copyGaussMat, copyBorderColor } = GaussApp.Materials;
        const { R_bound } = GaussApp.Config;
        const { createSegmentedSphere, createSegmentedCylinder, createSegmentedCube } = GaussApp.Gaussian;
        const createArrow = GaussApp.Scene.createArrow;

        const isCylinderZ = (shape === 'cylinder' && axis === 'z');
        const isPlaneXY = (shape === 'plane' && (axis === 'x' || axis === 'y'));

        if (isCylinderZ) {
            const radCharge = 1.0;
            const radGauss = 3.0;
            const heightGauss = 6.0;
            const zCap = Math.sqrt(R_bound * R_bound - radCharge * radCharge);
            const cylHeight = 2 * zCap;

            // O cilindro em si permanece contínuo no eixo Z
            const chargeMesh = new THREE.Mesh(new THREE.CylinderGeometry(radCharge, radCharge, cylHeight, 48, 1, true), copyChargeMat);
            chargeMesh.rotation.x = Math.PI / 2;
            group.add(chargeMesh);

            // INDICADOR VISUAL DE MOVIMENTO 1: Anéis de marcação deslizantes
            const ringZSteps = [-6.0, -4.0, -2.0, 0.0, 2.0, 4.0, 6.0];
            ringZSteps.forEach(z0 => {
                // Anel de referência estático (posição original antes da translação)
                const ptsRef = [];
                for (let i = 0; i <= 48; i++) {
                    const a = (i / 48) * Math.PI * 2;
                    ptsRef.push(new THREE.Vector3((radCharge + 0.01) * Math.cos(a), (radCharge + 0.01) * Math.sin(a), z0));
                }
                const lineRef = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(ptsRef),
                    new THREE.LineDashedMaterial({ color: 0x64748b, dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.35 })
                );
                lineRef.computeLineDistances();
                group.add(lineRef);

                // Anel deslocado que desliza com a translação Δz
                const zMoved = z0 + dist;
                if (Math.abs(zMoved) <= zCap) {
                    const ptsMoved = [];
                    for (let i = 0; i <= 48; i++) {
                        const a = (i / 48) * Math.PI * 2;
                        ptsMoved.push(new THREE.Vector3((radCharge + 0.02) * Math.cos(a), (radCharge + 0.02) * Math.sin(a), zMoved));
                    }
                    const lineMoved = new THREE.Line(
                        new THREE.BufferGeometry().setFromPoints(ptsMoved),
                        new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2, transparent: true, opacity: 0.85 })
                    );
                    group.add(lineMoved);
                }
            });

            // INDICADOR VISUAL DE MOVIMENTO 2: Setas direcionais de fluxo na superfície do cilindro
            if (Math.abs(dist) > 0.05) {
                const dirZ = Math.sign(dist);
                const arrowLen = Math.min(1.2, Math.max(0.4, Math.abs(dist) * 0.35));
                const angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
                const zLevels = [-3.0, 0.0, 3.0];
                
                angles.forEach(ang => {
                    const cosA = Math.cos(ang);
                    const sinA = Math.sin(ang);
                    zLevels.forEach(zL => {
                        const origin = new THREE.Vector3((radCharge + 0.05) * cosA, (radCharge + 0.05) * sinA, zL);
                        const arrow = createArrow(new THREE.Vector3(0, 0, dirZ), origin, arrowLen, 0x22d3ee, 0.28, 0.14);
                        group.add(arrow);
                    });
                });
            }

            // Cópia da superfície gaussiana deslocada por Δz
            if (showGauss) {
                const gaussCopy = createSegmentedCylinder(radGauss, heightGauss, 5, 14, 2, 0.05, copyGaussMat, copyBorderColor);
                gaussCopy.position.z = dist;
                group.add(gaussCopy);
            }
        }
        else if (isPlaneXY) {
            // Placa infinita em z = 0
            const planeMesh = new THREE.Mesh(new THREE.CylinderGeometry(R_bound, R_bound, 0.08, 64), copyChargeMat);
            planeMesh.rotation.x = Math.PI / 2;
            group.add(planeMesh);

            // INDICADOR VISUAL DE MOVIMENTO 1: Grade de referência deslizante na superfície da placa
            const gridPtsRef = [];
            const step = 2.0;
            for (let k = -8.0; k <= 8.0; k += step) {
                const span = Math.sqrt(Math.max(0, 64 - k * k));
                gridPtsRef.push(k, -span, 0.06, k, span, 0.06);
                gridPtsRef.push(-span, k, 0.06, span, k, 0.06);
            }
            const geoGridRef = new THREE.BufferGeometry();
            geoGridRef.setAttribute('position', new THREE.Float32BufferAttribute(gridPtsRef, 3));
            const lineGridRef = new THREE.LineSegments(geoGridRef, new THREE.LineDashedMaterial({ color: 0x64748b, dashSize: 0.2, gapSize: 0.15, transparent: true, opacity: 0.3 }));
            lineGridRef.computeLineDistances();
            group.add(lineGridRef);

            // Grade deslocada (que desliza com Δx ou Δy)
            const gridPtsMoved = [];
            const dx = transVec.x;
            const dy = transVec.y;
            for (let k = -8.0; k <= 8.0; k += step) {
                const span = Math.sqrt(Math.max(0, 64 - k * k));
                gridPtsMoved.push(k + dx, -span + dy, 0.07, k + dx, span + dy, 0.07);
                gridPtsMoved.push(-span + dx, k + dy, 0.07, span + dx, k + dy, 0.07);
            }
            const geoGridMoved = new THREE.BufferGeometry();
            geoGridMoved.setAttribute('position', new THREE.Float32BufferAttribute(gridPtsMoved, 3));
            group.add(new THREE.LineSegments(geoGridMoved, new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.7 })));

            // Círculos concêntricos deslizantes marcando o deslocamento
            [2.5, 5.0].forEach(r => {
                const ptsC = [];
                for (let i = 0; i <= 64; i++) {
                    const a = (i / 64) * Math.PI * 2;
                    ptsC.push(new THREE.Vector3(dx + r * Math.cos(a), dy + r * Math.sin(a), 0.07));
                }
                group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ptsC), new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6 })));
            });

            // INDICADOR VISUAL DE MOVIMENTO 2: Setas de fluxo coplanares
            if (Math.abs(dist) > 0.05) {
                const dir = transVec.clone().normalize();
                const arrowLen = Math.min(1.2, Math.max(0.4, Math.abs(dist) * 0.35));
                const flowOrigins = [
                    new THREE.Vector3(-3, -3, 0.08), new THREE.Vector3(-3, 3, 0.08),
                    new THREE.Vector3(3, -3, 0.08), new THREE.Vector3(3, 3, 0.08),
                    new THREE.Vector3(0, -3, 0.08), new THREE.Vector3(0, 3, 0.08),
                    new THREE.Vector3(-3, 0, 0.08), new THREE.Vector3(3, 0, 0.08)
                ];
                flowOrigins.forEach(orig => {
                    group.add(createArrow(dir, orig, arrowLen, 0x22d3ee, 0.28, 0.14));
                });
            }

            // Cópia da superfície gaussiana deslocada coplanarmente
            if (showGauss) {
                const gaussCopy = createSegmentedCylinder(2.0, 4.0, 3, 12, 2, 0.05, copyGaussMat, copyBorderColor);
                gaussCopy.position.copy(transVec);
                group.add(gaussCopy);
            }
        }
        else {
            // CASO DE TRANSLAÇÃO INVÁLIDA (deslocamento fora da simetria)
            const copy = buildRotatedVolumeCopy(shape, showGauss);
            copy.position.copy(transVec);
            group.add(copy);
        }

        return group;
    }

    GaussApp.Shapes.buildRotatedVolumeCopy = buildRotatedVolumeCopy;
    GaussApp.Shapes.buildTranslatedVolumeCopy = buildTranslatedVolumeCopy;
})();
