/**
 * Configurações globais e estado da aplicação
 */
window.GaussApp = window.GaussApp || {};

GaussApp.Config = {
    // Raio da esfera que limita o nosso espaço observável
    R_bound: 14.0,
    axesSize: 14.0
};

GaussApp.state = {
    currentShape: 'sphere',
    showGaussian: true,
    showField: true,
    showAreaVectors: true,
    showAxes: true,
    showPlaneX: false,
    showPlaneY: false,
    showPlaneZ: false,
    symmetryMode: 'none',
    mobilePanelCollapsed: false
};
