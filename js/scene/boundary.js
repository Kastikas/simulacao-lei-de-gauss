/**
 * Construção da esfera celeste delimitadora do espaço observável.
 */
window.GaussApp = window.GaussApp || {};

(function() {
    function buildBoundarySphere() {
        const { boundaryGroup, clearGroup } = GaussApp.Scene;
        const R_bound = GaussApp.Config.R_bound;
        
        clearGroup(boundaryGroup);
        
        // Domo esférico translúcido que delimita o espaço observável
        const boundGeo = new THREE.SphereGeometry(R_bound, 48, 24);
        const boundMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.04,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const boundMesh = new THREE.Mesh(boundGeo, boundMat);
        boundaryGroup.add(boundMesh);

        // Malha de coordenadas esféricas (latitude e longitude celestes)
        const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(R_bound, 24, 12));
        const wireMat = new THREE.LineBasicMaterial({
            color: 0x64748b,
            transparent: true,
            opacity: 0.15,
            depthWrite: false
        });
        const boundWire = new THREE.LineSegments(wireGeo, wireMat);
        boundaryGroup.add(boundWire);

        // Linhas dos grandes círculos celestes da esfera (equador z=0, meridianos x=0 e y=0)
        function addCelestialCircle(basis) {
            const pts = [];
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                pts.push(new THREE.Vector3(R_bound * Math.cos(a), R_bound * Math.sin(a), 0));
            }
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            if (basis) geo.applyMatrix4(basis);
            const line = new THREE.Line(
                geo,
                new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.4, gapSize: 0.3, transparent: true, opacity: 0.30 })
            );
            line.computeLineDistances();
            boundaryGroup.add(line);
        }

        // Equador celeste (z = 0)
        addCelestialCircle(null);
        // Meridiano celeste (x = 0)
        addCelestialCircle(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0)));
        // Meridiano celeste (y = 0)
        addCelestialCircle(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0)));
    }

    GaussApp.Boundary = {
        buildBoundarySphere
    };
})();
