/**
 * Renderização e controle visual do teste de simetria (vetores de prova, arcos, translações e guias).
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Symmetry = GaussApp.Symmetry || {};

(function() {
    /**
     * Cria um arco de varredura angular 3D em torno de axisVec no centro especificado,
     * com raio R, linhas radiais de abertura do setor (θ = 0 e θ atual) e ponta de seta tangente.
     */
    function createRotationSweepArc(axisVec, radius, angleRad, color = 0x22d3ee, center = new THREE.Vector3(0, 0, 0)) {
        const group = new THREE.Group();
        if (Math.abs(angleRad) < 0.001) return group;

        const normAxis = axisVec.clone().normalize();
        let ref = new THREE.Vector3(1, 0, 0);
        if (Math.abs(normAxis.dot(ref)) > 0.85) {
            ref = new THREE.Vector3(0, 1, 0);
        }
        const v = new THREE.Vector3().crossVectors(normAxis, ref).normalize();
        const u = new THREE.Vector3().crossVectors(v, normAxis).normalize();

        // Arco curvo
        const pts = [];
        const steps = 40;
        for (let s = 0; s <= steps; s++) {
            const a = (s / steps) * angleRad;
            pts.push(center.clone()
                .addScaledVector(u, radius * Math.cos(a))
                .addScaledVector(v, radius * Math.sin(a))
            );
        }
        const arcLine = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color, linewidth: 2, transparent: true, opacity: 0.95 })
        );
        group.add(arcLine);

        // Ponta de seta tangente indicando a direção de giro
        if (Math.abs(angleRad) > 0.05) {
            const tip = center.clone()
                .addScaledVector(u, radius * Math.cos(angleRad))
                .addScaledVector(v, radius * Math.sin(angleRad));
            const tangent = new THREE.Vector3()
                .addScaledVector(u, -Math.sin(angleRad))
                .addScaledVector(v, Math.cos(angleRad))
                .normalize();
            const arrowLen = Math.min(0.38, radius * 0.22);
            group.add(GaussApp.Scene.createArrow(tangent, tip, arrowLen, color, arrowLen * 0.7, arrowLen * 0.35));
        }

        // Linha radial estática de referência (θ = 0)
        const startPt = center.clone().addScaledVector(u, radius);
        const lineStart = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([center, startPt]),
            new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.6 })
        );
        lineStart.computeLineDistances();
        group.add(lineStart);

        // Linha radial móvel no ângulo atual (θ)
        const endPt = center.clone()
            .addScaledVector(u, radius * Math.cos(angleRad))
            .addScaledVector(v, radius * Math.sin(angleRad));
        const lineEnd = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([center, endPt]),
            new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75 })
        );
        group.add(lineEnd);

        return group;
    }

    /**
     * Cria setas tangenciais de movimento ao redor do eixo axisVec,
     * ilustrando a velocidade azimutal / fluxo de rotação ao longo da superfície.
     */
    function createTangentialMotionArrows(axisVec, radius, angleRad, color = 0x22d3ee, zOffsets = [0], numArrows = 4) {
        const group = new THREE.Group();
        if (Math.abs(angleRad) < 0.05) return group;

        const normAxis = axisVec.clone().normalize();
        let ref = new THREE.Vector3(1, 0, 0);
        if (Math.abs(normAxis.dot(ref)) > 0.85) {
            ref = new THREE.Vector3(0, 1, 0);
        }
        const v = new THREE.Vector3().crossVectors(normAxis, ref).normalize();
        const u = new THREE.Vector3().crossVectors(v, normAxis).normalize();

        zOffsets.forEach(offsetZ => {
            const center = normAxis.clone().multiplyScalar(offsetZ);
            for (let i = 0; i < numArrows; i++) {
                const a = angleRad + (i / numArrows) * Math.PI * 2;
                const pos = center.clone()
                    .addScaledVector(u, radius * Math.cos(a))
                    .addScaledVector(v, radius * Math.sin(a));
                const tangent = new THREE.Vector3()
                    .addScaledVector(u, -Math.sin(a))
                    .addScaledVector(v, Math.cos(a))
                    .normalize();
                const arrowLen = Math.min(0.48, radius * 0.32);
                group.add(GaussApp.Scene.createArrow(tangent, pos, arrowLen, color, arrowLen * 0.65, arrowLen * 0.32));
            }
        });

        return group;
    }

    function buildSymmetryTest() {
        const { symmetryTestGroup, clearGroup, createArrow } = GaussApp.Scene;
        const { currentShape, symmetryMode, showGaussian } = GaussApp.state;
        const { symmetryDict } = GaussApp;
        const { checkSymmetryValid, isInsideDistribution } = GaussApp.Symmetry;
        const { buildRotatedVolumeCopy, buildTranslatedVolumeCopy } = GaussApp.Shapes;

        clearGroup(symmetryTestGroup);
        const controlsDiv = document.getElementById('sym-controls');
        const angleContainer = document.getElementById('angle-container');
        const transContainer = document.getElementById('trans-container');
        const invalidMsg = document.getElementById('sym-invalid-msg');
        const outOfBoundsMsg = document.getElementById('sym-outofbounds-msg');
        
        if (symmetryMode === 'none') {
            if (controlsDiv) controlsDiv.classList.add('hidden');
            return;
        }
        if (controlsDiv) controlsDiv.classList.remove('hidden');

        const vecXEl = document.getElementById('vec-x');
        const vecYEl = document.getElementById('vec-y');
        const vecZEl = document.getElementById('vec-z');
        const vx = vecXEl ? (parseFloat(vecXEl.value) || 0) : 0;
        const vy = vecYEl ? (parseFloat(vecYEl.value) || 0) : 0;
        const vz = vecZEl ? (parseFloat(vecZEl.value) || 0) : 0;
        const p1 = new THREE.Vector3(vx, vy, vz);
        
        const p2 = new THREE.Vector3();
        const symInfo = symmetryDict[symmetryMode];
        const origin = new THREE.Vector3(0, 0, 0);
        
        let angleDeg = 0;
        let angleRad = 0;
        let transDist = 0;
        const axisVec = new THREE.Vector3();
        const transVec = new THREE.Vector3();

        if (symInfo && symInfo.type === 'rot') {
            if (angleContainer) angleContainer.classList.remove('hidden');
            if (transContainer) transContainer.classList.add('hidden');

            const rotAngleEl = document.getElementById('rot-angle');
            angleDeg = rotAngleEl ? (parseFloat(rotAngleEl.value) || 0) : 0;
            angleRad = angleDeg * Math.PI / 180;
            
            const angleValEl = document.getElementById('rot-angle-val');
            if (angleValEl) angleValEl.textContent = `${Math.round(angleDeg)}°`;

            if (symInfo.axis === 'x') axisVec.set(1, 0, 0);
            if (symInfo.axis === 'y') axisVec.set(0, 1, 0);
            if (symInfo.axis === 'z') axisVec.set(0, 0, 1);

            const hintEl = document.getElementById('rot-axis-hint');
            if (hintEl) {
                if (currentShape === 'sphere') {
                    hintEl.innerHTML = '<span class="text-emerald-400 font-semibold">Simetria Esférica Total:</span> Invariante para rotação contínua em torno de qualquer eixo (X, Y ou Z).';
                } else if (currentShape === 'cylinder') {
                    if (symInfo.axis === 'z') {
                        hintEl.innerHTML = '<span class="text-emerald-400 font-semibold">Eixo Longitudinal (Z):</span> Invariante para qualquer ângulo θ (simetria cilíndrica axial contínua).';
                    } else {
                        hintEl.innerHTML = `<span class="text-amber-400 font-semibold">Eixo Transversal (${symInfo.axis.toUpperCase()}):</span> Simetria somente nos ângulos de <b>180° e 360°</b>. Para outros ângulos, o cilindro inclina-se no espaço.`;
                    }
                } else if (currentShape === 'plane') {
                    if (symInfo.axis === 'z') {
                        hintEl.innerHTML = '<span class="text-emerald-400 font-semibold">Eixo Normal (Z):</span> Invariante para qualquer ângulo θ (simetria no plano XY contínua).';
                    } else {
                        hintEl.innerHTML = `<span class="text-amber-400 font-semibold">Eixo Coplanar (${symInfo.axis.toUpperCase()}):</span> Simetria somente nos ângulos de <b>180° e 360°</b>. Para outros ângulos, a placa inclina-se para fora de z = 0.`;
                    }
                } else if (currentShape === 'cube') {
                    hintEl.innerHTML = '<span class="text-sky-400 font-semibold">Simetria Discreta:</span> Invariante apenas em múltiplos de 90° (0°, 90°, 180°, 270°, 360°).';
                }
            }

            // Constrói e rotaciona a cópia do volume de carga e sua superfície gaussiana
            const rotatedCopy = buildRotatedVolumeCopy(currentShape, showGaussian);
            rotatedCopy.setRotationFromAxisAngle(axisVec, angleRad);
            symmetryTestGroup.add(rotatedCopy);

            // APOIO VISUAL DE ROTAÇÃO: Linhas estáticas de referência (posição original em θ = 0), arcos de varredura e setas de movimento tangencial
            if (angleDeg > 0.1) {
                const { R_bound } = GaussApp.Config;
                if (currentShape === 'cylinder') {
                    if (symInfo.axis === 'z') {
                        // Geratrizes estáticas de referência (θ = 0)
                        const radCharge = 1.0;
                        const zCap = Math.sqrt(R_bound * R_bound - radCharge * radCharge);
                        const refPts = [];
                        const numStripes = 8;
                        for (let i = 0; i < numStripes; i++) {
                            const a = (i / numStripes) * Math.PI * 2;
                            const x = (radCharge + 0.01) * Math.cos(a);
                            const y = (radCharge + 0.01) * Math.sin(a);
                            refPts.push(x, y, -zCap, x, y, zCap);
                        }
                        const geoRef = new THREE.BufferGeometry();
                        geoRef.setAttribute('position', new THREE.Float32BufferAttribute(refPts, 3));
                        const lineRef = new THREE.LineSegments(geoRef, new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.25, gapSize: 0.15, transparent: true, opacity: 0.6 }));
                        lineRef.computeLineDistances();
                        symmetryTestGroup.add(lineRef);

                        // Arcos de varredura angular em z = 0 e z = 2.5
                        symmetryTestGroup.add(createRotationSweepArc(axisVec, 1.35, angleRad, 0x22d3ee, new THREE.Vector3(0, 0, 0)));
                        symmetryTestGroup.add(createRotationSweepArc(axisVec, 1.35, angleRad, 0x22d3ee, new THREE.Vector3(0, 0, 2.5)));

                        // Setas tangenciais de movimento na superfície do cilindro (indicando a velocidade azimutal)
                        symmetryTestGroup.add(createTangentialMotionArrows(axisVec, 1.06, angleRad, 0x22d3ee, [-2.5, 0.0, 2.5], 4));
                    } else {
                        // Rotação transversal em X ou Y
                        symmetryTestGroup.add(createRotationSweepArc(axisVec, 2.4, angleRad, 0x22d3ee, new THREE.Vector3(0, 0, 0)));
                    }
                } else if (currentShape === 'plane') {
                    if (symInfo.axis === 'z') {
                        // Raios estáticos de referência (θ = 0) sobre a placa
                        const spokeRefPts = [];
                        const numSpokes = 12;
                        for (let i = 0; i < numSpokes; i++) {
                            const a = (i / numSpokes) * Math.PI * 2;
                            spokeRefPts.push(0, 0, 0.06, R_bound * Math.cos(a), R_bound * Math.sin(a), 0.06);
                        }
                        const geoSpokeRef = new THREE.BufferGeometry();
                        geoSpokeRef.setAttribute('position', new THREE.Float32BufferAttribute(spokeRefPts, 3));
                        const lineSpokeRef = new THREE.LineSegments(geoSpokeRef, new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.25, gapSize: 0.15, transparent: true, opacity: 0.55 }));
                        lineSpokeRef.computeLineDistances();
                        symmetryTestGroup.add(lineSpokeRef);

                        // Arco de varredura angular coplanar sobre a placa
                        symmetryTestGroup.add(createRotationSweepArc(axisVec, 3.8, angleRad, 0x22d3ee, new THREE.Vector3(0, 0, 0.08)));

                        // Setas tangenciais de movimento ao longo dos anéis circulares na placa
                        symmetryTestGroup.add(createTangentialMotionArrows(axisVec, 3.5, angleRad, 0x22d3ee, [0.08], 4));
                        symmetryTestGroup.add(createTangentialMotionArrows(axisVec, 6.5, angleRad, 0x22d3ee, [0.08], 4));
                    } else {
                        // Rotação transversal em X ou Y
                        symmetryTestGroup.add(createRotationSweepArc(axisVec, 4.0, angleRad, 0x22d3ee, new THREE.Vector3(0, 0, 0)));
                    }
                } else if (currentShape === 'sphere') {
                    // Meridianos estáticos de referência (θ = 0)
                    const numMeridians = 4;
                    for (let m = 0; m < numMeridians; m++) {
                        const rotA = (m / numMeridians) * Math.PI;
                        const pts = [];
                        for (let i = 0; i <= 64; i++) {
                            const a = (i / 64) * Math.PI * 2;
                            pts.push(new THREE.Vector3(1.51 * Math.cos(a), 0, 1.51 * Math.sin(a)).applyAxisAngle(new THREE.Vector3(0, 0, 1), rotA));
                        }
                        const lineRef = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.5 }));
                        lineRef.computeLineDistances();
                        symmetryTestGroup.add(lineRef);
                    }

                    // Arco de varredura angular em torno do eixo de rotação da esfera
                    symmetryTestGroup.add(createRotationSweepArc(axisVec, 1.85, angleRad, 0x22d3ee, new THREE.Vector3(0, 0, 0)));

                    // Setas tangenciais de movimento ao redor da esfera
                    symmetryTestGroup.add(createTangentialMotionArrows(axisVec, 1.55, angleRad, 0x22d3ee, [0], 4));
                } else if (currentShape === 'cube') {
                    // Caixa estática de referência (θ = 0)
                    const wireRef = new THREE.LineSegments(
                        new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 3, 3)),
                        new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.6 })
                    );
                    wireRef.computeLineDistances();
                    symmetryTestGroup.add(wireRef);

                    // Arco de varredura angular em torno do eixo de rotação do cubo
                    symmetryTestGroup.add(createRotationSweepArc(axisVec, 2.4, angleRad, 0x22d3ee, new THREE.Vector3(0, 0, 0)));
                }
            }
        } else if (symInfo && symInfo.type === 'trans') {
            if (angleContainer) angleContainer.classList.add('hidden');
            if (transContainer) transContainer.classList.remove('hidden');

            const transDistEl = document.getElementById('trans-dist');
            transDist = transDistEl ? (parseFloat(transDistEl.value) || 0) : 0;

            const transValEl = document.getElementById('trans-dist-val');
            if (transValEl) transValEl.textContent = `${transDist > 0 ? '+' : ''}${transDist.toFixed(1)}`;

            if (symInfo.axis === 'x') transVec.set(transDist, 0, 0);
            if (symInfo.axis === 'y') transVec.set(0, transDist, 0);
            if (symInfo.axis === 'z') transVec.set(0, 0, transDist);

            const hintEl = document.getElementById('trans-axis-hint');
            if (hintEl) {
                if (currentShape === 'cylinder') {
                    if (symInfo.axis === 'z') {
                        hintEl.innerHTML = '<span class="text-emerald-400 font-semibold">Eixo Longitudinal (Z):</span> Fio infinito invariante para translação ao longo de seu comprimento. Veja os anéis marcadores e setas de fluxo acompanhando o deslocamento.';
                    } else {
                        hintEl.innerHTML = `<span class="text-amber-400 font-semibold">Translação Transversal (${symInfo.axis.toUpperCase()}):</span> Desloca o fio para fora do eixo central, quebrando a simetria cilíndrica.`;
                    }
                } else if (currentShape === 'plane') {
                    if (symInfo.axis === 'x' || symInfo.axis === 'y') {
                        hintEl.innerHTML = `<span class="text-emerald-400 font-semibold">Plano Coplanar (${symInfo.axis.toUpperCase()}):</span> Placa infinita invariante no plano XY. Observe a malha deslizante e as setas coplanares indicando a translação.`;
                    } else {
                        hintEl.innerHTML = '<span class="text-amber-400 font-semibold">Translação Normal (Z):</span> Afasta a placa da origem z = 0, quebrando a simetria planar.';
                    }
                } else if (currentShape === 'sphere') {
                    hintEl.innerHTML = '<span class="text-amber-400 font-semibold">Distribuição Finita:</span> Esfera centrada na origem. Qualquer translação desloca a carga no espaço, quebrando a invariância.';
                } else if (currentShape === 'cube') {
                    hintEl.innerHTML = '<span class="text-amber-400 font-semibold">Distribuição Finita:</span> Cubo com centro fixo. Qualquer translação quebra a invariância.';
                }
            }

            // Constrói a cópia transladada com os indicadores visuais de movimento
            const translatedCopy = buildTranslatedVolumeCopy(currentShape, showGaussian, transVec, transDist, symInfo.axis);
            symmetryTestGroup.add(translatedCopy);
        } else {
            if (angleContainer) angleContainer.classList.add('hidden');
            if (transContainer) transContainer.classList.add('hidden');
        }

        if (p1.length() < 0.01) return; 

        const isInside = isInsideDistribution(currentShape, p1);

        if (!isInside) {
            if (outOfBoundsMsg) outOfBoundsMsg.classList.remove('hidden');
            if (invalidMsg) invalidMsg.classList.add('hidden');

            const matWarn = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
            const meshP1 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matWarn);
            meshP1.position.copy(p1);
            symmetryTestGroup.add(meshP1);
            symmetryTestGroup.add(createArrow(p1.clone().normalize(), origin, p1.length(), 0xf59e0b, 0.4, 0.2));
            return; 
        } else {
            if (outOfBoundsMsg) outOfBoundsMsg.classList.add('hidden');
        }

        if (symInfo) {
            if (symInfo.type === 'refl') {
                if (symmetryMode === 'refl_x') p2.set(-p1.x, p1.y, p1.z);
                else if (symmetryMode === 'refl_y') p2.set(p1.x, -p1.y, p1.z);
                else if (symmetryMode === 'refl_z') p2.set(p1.x, p1.y, -p1.z);
            } 
            else if (symInfo.type === 'inv') {
                p2.set(-p1.x, -p1.y, -p1.z);
            } 
            else if (symInfo.type === 'rot') {
                p2.copy(p1).applyAxisAngle(axisVec, angleRad);
            }
            else if (symInfo.type === 'trans') {
                p2.copy(p1).add(transVec);
            }
        }

        const isCoincident = p1.distanceTo(p2) < 0.001;
        const isSymValidForShape = checkSymmetryValid(currentShape, symmetryMode, symInfo, symInfo && symInfo.type === 'rot' ? angleDeg : transDist);

        if (isSymValidForShape) {
            if (invalidMsg) invalidMsg.classList.add('hidden');
        } else {
            if (invalidMsg) invalidMsg.classList.remove('hidden');
            const invalidText = document.getElementById('sym-invalid-text');
            if (invalidText && symInfo) {
                if (symInfo.type === 'rot') {
                    if (currentShape === 'cylinder' && (symInfo.axis === 'x' || symInfo.axis === 'y')) {
                        invalidText.textContent = `O cilindro possui simetria de rotação em torno do Eixo ${symInfo.axis.toUpperCase()} somente nos ângulos de 180° e 360°. Para ${Math.round(angleDeg)}°, o cilindro inclina-se no espaço e não coincide com a distribuição.`;
                    } else if (currentShape === 'plane' && (symInfo.axis === 'x' || symInfo.axis === 'y')) {
                        invalidText.textContent = `O plano possui simetria de rotação em torno do Eixo ${symInfo.axis.toUpperCase()} somente nos ângulos de 180° e 360°. Para ${Math.round(angleDeg)}°, a placa inclina-se para fora de z = 0 e não coincide com a distribuição.`;
                    } else if (currentShape === 'cube') {
                        invalidText.textContent = `O cubo possui apenas simetria rotacional discreta em múltiplos de 90° (0°, 90°, 180°, 270°, 360°). Para ${Math.round(angleDeg)}°, a distribuição não coincide.`;
                    } else {
                        invalidText.textContent = 'O objeto não possui simetria para este ângulo. Não há garantias de que o campo elétrico seja simétrico nesta posição.';
                    }
                } else if (symInfo.type === 'trans') {
                    if (currentShape === 'cylinder') {
                        invalidText.textContent = `O fio cilíndrico possui simetria de translação apenas ao longo do seu eixo longitudinal (Eixo Z). A translação no Eixo ${symInfo.axis.toUpperCase()} desloca o fio para fora do centro.`;
                    } else if (currentShape === 'plane') {
                        invalidText.textContent = `A placa infinita possui simetria de translação apenas no plano coplanar (Eixos X e Y). A translação no Eixo Z afasta a placa do plano z = 0.`;
                    } else {
                        invalidText.textContent = 'Esta distribuição é finita e localizada na origem. Qualquer translação espacial quebra a invariância.';
                    }
                }
            }
        }

        if (!isSymValidForShape) {
            const matRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
            const meshP1 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matRed); 
            meshP1.position.copy(p1);
            symmetryTestGroup.add(meshP1);
            symmetryTestGroup.add(createArrow(p1.clone().normalize(), origin, p1.length(), 0xef4444, 0.4, 0.2));

            if (!isCoincident) {
                const matGray = new THREE.MeshBasicMaterial({ color: 0x6b7280 });
                const meshP2 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matGray); 
                meshP2.position.copy(p2);
                symmetryTestGroup.add(meshP2);
                symmetryTestGroup.add(createArrow(p2.clone().normalize(), origin, p2.length(), 0x6b7280, 0.4, 0.2));
            }
        }
        else if (isCoincident) {
            const matPurple = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
            const meshP = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matPurple); 
            meshP.position.copy(p1);
            symmetryTestGroup.add(meshP);
            symmetryTestGroup.add(createArrow(p1.clone().normalize(), origin, p1.length(), 0xa855f7, 0.4, 0.2));
        } 
        else {
            const matP1 = new THREE.MeshBasicMaterial({ color: 0xd946ef });
            const matP2 = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

            const meshP1 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matP1); 
            const meshP2 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matP2); 
            meshP1.position.copy(p1); 
            meshP2.position.copy(p2);
            symmetryTestGroup.add(meshP1); 
            symmetryTestGroup.add(meshP2);

            symmetryTestGroup.add(createArrow(p1.clone().normalize(), origin, p1.length(), 0xd946ef, 0.4, 0.2));
            symmetryTestGroup.add(createArrow(p2.clone().normalize(), origin, p2.length(), 0x22d3ee, 0.4, 0.2));
        }

        const guideColor = !isSymValidForShape ? 0x666666 : 0xffffff;
        const subGuideColor = !isSymValidForShape ? 0x444444 : 0xaaaaaa;

        if (!isCoincident) {
            if (symInfo.type === 'refl' || symInfo.type === 'inv') {
                const line = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints([p1, p2]), 
                    new THREE.LineDashedMaterial({ color: guideColor, dashSize: 0.1, gapSize: 0.1 })
                );
                line.computeLineDistances();
                symmetryTestGroup.add(line);
                
                const midMarker = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: guideColor }));
                midMarker.position.copy(new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5));
                symmetryTestGroup.add(midMarker);
            } 
            else if (symInfo.type === 'rot') {
                const arcPts = [];
                for (let i = 0; i <= 50; i++) {
                    arcPts.push(p1.clone().applyAxisAngle(axisVec, angleRad * (i / 50)));
                }
                const arc = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(arcPts), 
                    new THREE.LineDashedMaterial({ color: guideColor, dashSize: 0.1, gapSize: 0.1 })
                );
                arc.computeLineDistances();
                symmetryTestGroup.add(arc);

                const centerPt = new THREE.Vector3();
                if (symInfo.axis === 'x') centerPt.set(p1.x, 0, 0);
                if (symInfo.axis === 'y') centerPt.set(0, p1.y, 0);
                if (symInfo.axis === 'z') centerPt.set(0, 0, p1.z);

                const cLine = new THREE.LineSegments(
                    new THREE.BufferGeometry().setFromPoints([
                        centerPt.clone().add(axisVec.clone().multiplyScalar(3)), 
                        centerPt.clone().add(axisVec.clone().multiplyScalar(-3))
                    ]), 
                    new THREE.LineDashedMaterial({ color: subGuideColor, dashSize: 0.1, gapSize: 0.1 })
                );
                cLine.computeLineDistances();
                symmetryTestGroup.add(cLine);
                
                const radLine = new THREE.LineSegments(
                    new THREE.BufferGeometry().setFromPoints([centerPt, p1, centerPt, p2]), 
                    new THREE.LineDashedMaterial({ color: subGuideColor, dashSize: 0.1, gapSize: 0.1 })
                );
                radLine.computeLineDistances();
                symmetryTestGroup.add(radLine);
            }
            else if (symInfo.type === 'trans') {
                const line = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints([p1, p2]), 
                    new THREE.LineDashedMaterial({ color: guideColor, dashSize: 0.1, gapSize: 0.1 })
                );
                line.computeLineDistances();
                symmetryTestGroup.add(line);

                // Seta guia do vetor de translação T = p2 - p1
                const transDistLen = p1.distanceTo(p2);
                if (transDistLen > 0.05) {
                    const transDir = new THREE.Vector3().subVectors(p2, p1).normalize();
                    const tArrow = createArrow(transDir, p1, transDistLen, guideColor, Math.min(0.35, transDistLen * 0.3), 0.12);
                    symmetryTestGroup.add(tArrow);
                }
            }
        }
    }

    GaussApp.Symmetry.buildSymmetryTest = buildSymmetryTest;
})();
