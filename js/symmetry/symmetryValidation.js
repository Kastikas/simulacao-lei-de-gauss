/**
 * Regras analíticas e validações geométricas de simetria e pertencimento à distribuição.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Symmetry = GaussApp.Symmetry || {};

(function() {
    function checkSymmetryValid(shape, symKey, symInfo, paramVal = 0) {
        if (!symInfo) return true;
        
        if (symInfo.type === 'rot') {
            const angleDeg = paramVal;
            const rem360 = Math.abs(angleDeg % 360);
            const isZero = (rem360 < 0.001 || Math.abs(rem360 - 360) < 0.001);
            if (isZero) return true; // 0° ou 360° é a identidade trivial (sem rotação efetiva)
            
            if (shape === 'sphere') {
                return true; // Simetria esférica contínua em qualquer eixo (X, Y ou Z)
            }
            
            if (shape === 'cylinder') {
                // Rotação em torno do eixo longitudinal (Z) é simétrica para qualquer ângulo
                if (symInfo.axis === 'z') return true;
                // Rotações em torno de X ou Y possuem simetria somente nos ângulos de 180° e 360°
                const rem180 = Math.abs(angleDeg % 180);
                return (rem180 < 0.001 || Math.abs(rem180 - 180) < 0.001);
            }
            
            if (shape === 'plane') {
                // Rotação em torno do eixo normal (Z) é simétrica para qualquer ângulo
                if (symInfo.axis === 'z') return true;
                // Rotações em torno de X ou Y possuem simetria somente nos ângulos de 180° e 360°
                const rem180 = Math.abs(angleDeg % 180);
                return (rem180 < 0.001 || Math.abs(rem180 - 180) < 0.001);
            }
            
            if (shape === 'cube') {
                const rem = Math.abs(angleDeg % 90);
                return (rem < 0.001 || Math.abs(rem - 90) < 0.001);
            }
            return true;
        }

        if (symInfo.type === 'trans') {
            const dist = paramVal;
            if (Math.abs(dist) < 0.001) return true; // Deslocamento nulo = identidade

            if (shape === 'cylinder') {
                // Fio infinito ao longo de Z: translação contínua em Z é simetria perfeita
                return symInfo.axis === 'z';
            }

            if (shape === 'plane') {
                // Placa infinita em z = 0: translações coplanares em X e Y são simetrias perfeitas
                return symInfo.axis === 'x' || symInfo.axis === 'y';
            }

            // Esfera e Cubo são distribuições finitas localizadas na origem: qualquer translação não nula quebra a invariância
            return false;
        }

        return true;
    }

    function isInsideDistribution(shape, p) {
        const tol = 0.2; 
        const R_bound = GaussApp.Config.R_bound;

        if (shape === 'sphere') {
            return p.length() <= 1.5 + tol;
        } else if (shape === 'cylinder') {
            const zCap = Math.sqrt(R_bound * R_bound - 1.0);
            return Math.sqrt(p.x * p.x + p.y * p.y) <= 1.0 + tol && Math.abs(p.z) <= zCap + tol;
        } else if (shape === 'plane') {
            return Math.sqrt(p.x * p.x + p.y * p.y) <= R_bound + tol && Math.abs(p.z) <= 0.05 + tol;
        } else if (shape === 'cube') {
            return Math.abs(p.x) <= 1.5 + tol && Math.abs(p.y) <= 1.5 + tol && Math.abs(p.z) <= 1.5 + tol;
        }
        return true;
    }

    GaussApp.Symmetry.checkSymmetryValid = checkSymmetryValid;
    GaussApp.Symmetry.isInsideDistribution = isInsideDistribution;
})();
