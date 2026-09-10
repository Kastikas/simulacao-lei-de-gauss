/**
 * Mapeamento de operações de simetria (reflexões, inversão e rotações) para cada geometria.
 */
window.GaussApp = window.GaussApp || {};

GaussApp.symmetryDict = {
    'refl_x': { text: 'Reflexão pelo plano x = 0 (YZ)', type: 'refl' },
    'refl_y': { text: 'Reflexão pelo plano y = 0 (XZ)', type: 'refl' },
    'refl_z': { text: 'Reflexão pelo plano z = 0 (XY)', type: 'refl' },
    'inv': { text: 'Inversão Espacial (Pela Origem)', type: 'inv' },
    'rot_x': { text: 'Rotação em torno do Eixo X', type: 'rot', axis: 'x' },
    'rot_y': { text: 'Rotação em torno do Eixo Y', type: 'rot', axis: 'y' },
    'rot_z': { text: 'Rotação em torno do Eixo Z', type: 'rot', axis: 'z' },
    'trans_x': { text: 'Translação ao longo do Eixo X', type: 'trans', axis: 'x' },
    'trans_y': { text: 'Translação ao longo do Eixo Y', type: 'trans', axis: 'y' },
    'trans_z': { text: 'Translação ao longo do Eixo Z', type: 'trans', axis: 'z' }
};

GaussApp.shapeSymmetries = {
    sphere: ['refl_x', 'refl_y', 'refl_z', 'inv', 'rot_x', 'rot_y', 'rot_z', 'trans_x', 'trans_y', 'trans_z'],
    cylinder: ['refl_x', 'refl_y', 'refl_z', 'inv', 'rot_x', 'rot_y', 'rot_z', 'trans_z', 'trans_x', 'trans_y'],
    plane: ['refl_x', 'refl_y', 'refl_z', 'inv', 'rot_x', 'rot_y', 'rot_z', 'trans_x', 'trans_y', 'trans_z'],
    cube: ['refl_x', 'refl_y', 'refl_z', 'inv', 'rot_x', 'rot_y', 'rot_z', 'trans_x', 'trans_y', 'trans_z']
};

