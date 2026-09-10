/**
 * Definição centralizada dos materiais Three.js PBR e linhas.
 */
window.GaussApp = window.GaussApp || {};

(function() {
    // Material da distribuição de carga com alta solidez e emissão luminosa vibrante
    const chargeMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xf43f5e, // Rubi/carmesim vibrante
        roughness: 0.22, 
        metalness: 0.08, 
        clearcoat: 0.8, 
        emissive: 0xe11d48, 
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.85,
        depthWrite: false 
    });

    // Material semitranslúcido dedicado para a placa infinita (permite ver ambos os hemisférios de vetores)
    const planeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf43f5e,
        roughness: 0.25,
        metalness: 0.08,
        clearcoat: 0.8,
        emissive: 0xe11d48,
        emissiveIntensity: 0.28,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // Superfície Gaussiana: envelope cristalino hipertranslúcido em vidro ciano
    const gaussianMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x38bdf8, // Ciano cristalino suave
        transparent: true, 
        opacity: 0.09, 
        roughness: 0.04, 
        metalness: 0.02, 
        clearcoat: 0.4,
        side: THREE.DoubleSide, 
        depthWrite: false 
    });

    // Materiais para o holograma rotacionado nas semelhanças de rotação (Cinza suave translúcido)
    const copyChargeMat = new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8, // Cinza ardósia suave
        transparent: true,
        opacity: 0.22,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const copyGaussMat = new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.08,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const copyBorderColor = 0x94a3b8;

    function isShared(material) {
        return (
            material === chargeMaterial ||
            material === planeMaterial ||
            material === gaussianMaterial ||
            material === copyChargeMat ||
            material === copyGaussMat
        );
    }

    GaussApp.Materials = {
        chargeMaterial,
        planeMaterial,
        gaussianMaterial,
        copyChargeMat,
        copyGaussMat,
        copyBorderColor,
        isShared
    };
})();
