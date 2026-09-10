/**
 * Gerenciador da cena Three.js: Câmera, Luzes, Renderizador, Controles e Grupos.
 */
window.GaussApp = window.GaussApp || {};

(function() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.up.set(0, 0, 1);
    camera.position.set(13, -16, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (container) {
        container.appendChild(renderer.domElement);
    }

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 60;
    controls.minDistance = 2;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); 
    dirLight.position.set(10, 10, 20); 
    scene.add(dirLight);
    
    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.4); 
    dirLight2.position.set(-10, -10, -10); 
    scene.add(dirLight2);

    // Grupos globais
    const mainGroup = new THREE.Group(); 
    scene.add(mainGroup);
    
    const referenceGroup = new THREE.Group(); 
    scene.add(referenceGroup);
    
    const boundaryGroup = new THREE.Group(); 
    scene.add(boundaryGroup);
    
    const symmetryTestGroup = new THREE.Group(); 
    scene.add(symmetryTestGroup);

    function clearGroup(group) {
        while(group.children.length > 0) { 
            const child = group.children[0];
            if (child.children && child.children.length > 0) {
                clearGroup(child);
            }
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                const isShared = GaussApp.Materials ? GaussApp.Materials.isShared : () => false;
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => { if (!isShared(m)) m.dispose(); });
                } else if (!isShared(child.material)) {
                    child.material.dispose();
                }
            }
            group.remove(child); 
        }
    }

    function createArrow(dir, origin, length, color, headLength = null, headWidth = null) {
        const hLen = headLength !== null ? headLength : Math.min(0.38, Math.max(0.18, length * 0.22));
        const hWid = headWidth !== null ? headWidth : Math.min(0.18, Math.max(0.09, length * 0.11));
        return new THREE.ArrowHelper(dir, origin, length, color, hLen, hWid);
    }

    function onResize() {
        if (!container) return;
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function smoothResize(duration = 380) {
        const start = performance.now();
        function step(now) {
            onResize();
            if (now - start < duration) {
                requestAnimationFrame(step);
            } else {
                onResize();
            }
        }
        requestAnimationFrame(step);
    }

    window.addEventListener('resize', onResize);

    GaussApp.Scene = {
        container,
        scene,
        camera,
        renderer,
        controls,
        mainGroup,
        referenceGroup,
        boundaryGroup,
        symmetryTestGroup,
        clearGroup,
        createArrow,
        onResize,
        smoothResize
    };
})();
