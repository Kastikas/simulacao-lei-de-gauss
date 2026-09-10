/**
 * Eixos e planos cartesianos esféricos de referência (x=0, y=0, z=0).
 */
window.GaussApp = window.GaussApp || {};

(function() {
    const { referenceGroup } = GaussApp.Scene;
    const R_bound = GaussApp.Config.R_bound;
    const axesSize = GaussApp.Config.axesSize;

    const axesHelper = new THREE.AxesHelper(axesSize);
    referenceGroup.add(axesHelper);

    // Função geradora de planos cartesianos com divisão esférica idêntica ao plano infinito
    function createSphericalCartesianPlane(axis, baseColorHex, brightColorHex) {
        let u, v, n;
        if (axis === 'x') {
            u = new THREE.Vector3(0, 1, 0); // Y
            v = new THREE.Vector3(0, 0, 1); // Z (apontado para cima)
            n = new THREE.Vector3(1, 0, 0); // X (normal ao plano x = 0)
        } else if (axis === 'y') {
            u = new THREE.Vector3(0, 0, 1); // Z (apontado para cima)
            v = new THREE.Vector3(1, 0, 0); // X
            n = new THREE.Vector3(0, 1, 0); // Y (normal ao plano y = 0)
        } else {
            u = new THREE.Vector3(1, 0, 0); // X
            v = new THREE.Vector3(0, 1, 0); // Y
            n = new THREE.Vector3(0, 0, 1); // Z (normal ao plano z = 0)
        }

        const basis = new THREE.Matrix4().makeBasis(u, v, n);

        // 1. Disco circular que se estende por todo o espaço até o horizonte da esfera (R_bound)
        const discGeo = new THREE.CircleGeometry(R_bound, 64);
        discGeo.applyMatrix4(basis);
        const discMat = new THREE.MeshBasicMaterial({
            color: baseColorHex,
            transparent: true,
            opacity: 0.10,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const discMesh = new THREE.Mesh(discGeo, discMat);

        // 2. Linha brilhante no horizonte da esfera (circunferência externa delimitando o plano)
        const horizonPts = [];
        for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            horizonPts.push(new THREE.Vector3(R_bound * Math.cos(a), R_bound * Math.sin(a), 0));
        }
        const horizonGeo = new THREE.BufferGeometry().setFromPoints(horizonPts);
        horizonGeo.applyMatrix4(basis);
        const horizonLine = new THREE.Line(horizonGeo, new THREE.LineBasicMaterial({
            color: brightColorHex,
            linewidth: 2,
            transparent: true,
            opacity: 0.95
        }));

        // 3. Anel de brilho suave no horizonte
        const horizonRingGeo = new THREE.RingGeometry(R_bound - 0.35, R_bound + 0.05, 64);
        horizonRingGeo.applyMatrix4(basis);
        const horizonRingMat = new THREE.MeshBasicMaterial({
            color: brightColorHex,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const horizonRing = new THREE.Mesh(horizonRingGeo, horizonRingMat);

        // 4. Divisões e malha interna (círculos concêntricos e grade cartesiana delimitada pela esfera)
        const gridPts = [];
        
        // Círculos concêntricos de escala (r = 3.5, 7.0, 10.5)
        const ringRadii = [3.5, 7.0, 10.5];
        for (const r of ringRadii) {
            for (let i = 0; i < 64; i++) {
                const a1 = (i / 64) * Math.PI * 2;
                const a2 = ((i + 1) / 64) * Math.PI * 2;
                gridPts.push(
                    r * Math.cos(a1), r * Math.sin(a1), 0,
                    r * Math.cos(a2), r * Math.sin(a2), 0
                );
            }
        }

        // Grade cartesiana a cada 2.0 unidades, recortada perfeitamente na fronteira do disco
        const gridStep = 2.0;
        for (let k = -12.0; k <= 12.0; k += gridStep) {
            if (Math.abs(k) < 0.001) continue;
            const span = Math.sqrt(Math.max(0, R_bound * R_bound - k * k));
            gridPts.push(k, -span, 0, k, span, 0);
            gridPts.push(-span, k, 0, span, k, 0);
        }

        // Eixos centrais que cortam o plano de horizonte a horizonte
        gridPts.push(
            -R_bound, 0, 0, R_bound, 0, 0,
            0, -R_bound, 0, 0, R_bound, 0
        );

        const gridGeo = new THREE.BufferGeometry();
        gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3));
        gridGeo.applyMatrix4(basis);
        const gridMat = new THREE.LineBasicMaterial({
            color: brightColorHex,
            transparent: true,
            opacity: 0.22,
            depthWrite: false
        });
        const gridLines = new THREE.LineSegments(gridGeo, gridMat);

        const group = new THREE.Group();
        group.add(discMesh);
        group.add(horizonLine);
        group.add(horizonRing);
        group.add(gridLines);

        return group;
    }

    const groupPlaneX = createSphericalCartesianPlane('x', 0xef4444, 0xff6b6b);
    referenceGroup.add(groupPlaneX);

    const groupPlaneY = createSphericalCartesianPlane('y', 0x22c55e, 0x4ade80);
    referenceGroup.add(groupPlaneY);

    const groupPlaneZ = createSphericalCartesianPlane('z', 0x3b82f6, 0x60a5fa);
    referenceGroup.add(groupPlaneZ);

    function updateReferencesVisibility() {
        const state = GaussApp.state;
        axesHelper.visible = state.showAxes;
        groupPlaneX.visible = state.showPlaneX;
        groupPlaneY.visible = state.showPlaneY;
        groupPlaneZ.visible = state.showPlaneZ;
    }

    GaussApp.ReferencePlanes = {
        axesHelper,
        groupPlaneX,
        groupPlaneY,
        groupPlaneZ,
        updateReferencesVisibility,
        createSphericalCartesianPlane
    };
})();
