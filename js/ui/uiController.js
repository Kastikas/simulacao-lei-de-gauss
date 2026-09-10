/**
 * Controlador de Interface de Usuário, sincronização com MathJax e eventos do DOM.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.UI = GaussApp.UI || {};

(function() {
    const toggleThemes = {
        blue: {
            activeBorder: 'border-sky-500/50',
            activeBg: 'bg-sky-950/30',
            activeSwitch: 'bg-sky-500',
            activeText: 'text-sky-400'
        },
        amber: {
            activeBorder: 'border-amber-500/50',
            activeBg: 'bg-amber-950/30',
            activeSwitch: 'bg-amber-500',
            activeText: 'text-amber-400'
        },
        emerald: {
            activeBorder: 'border-emerald-500/50',
            activeBg: 'bg-emerald-950/30',
            activeSwitch: 'bg-emerald-500',
            activeText: 'text-emerald-400'
        },
        red: {
            activeBorder: 'border-red-500/50',
            activeBg: 'bg-red-950/30',
            activeSwitch: 'bg-red-600',
            activeText: 'text-red-400'
        },
        green: {
            activeBorder: 'border-green-500/50',
            activeBg: 'bg-green-950/30',
            activeSwitch: 'bg-green-600',
            activeText: 'text-green-400'
        },
        indigo: {
            activeBorder: 'border-indigo-500/50',
            activeBg: 'bg-indigo-950/30',
            activeSwitch: 'bg-indigo-600',
            activeText: 'text-indigo-400'
        }
    };

    function updateToggleUI(id, active, themeKey) {
        const btn = document.getElementById(id);
        if (!btn) return;
        const theme = toggleThemes[themeKey] || toggleThemes.blue;
        btn.setAttribute('aria-checked', active ? 'true' : 'false');
        
        const statusEl = btn.querySelector('.toggle-status');
        const switchEl = btn.querySelector('.toggle-switch');
        const pinEl = btn.querySelector('.toggle-pin');

        if (active) {
            btn.className = `toggle-btn w-full flex items-center justify-between p-2.5 rounded-lg border ${theme.activeBorder} ${theme.activeBg} hover:bg-slate-700/60 text-left`;
            if (statusEl) {
                statusEl.textContent = 'ATIVO';
                statusEl.className = `toggle-status text-[10px] font-bold uppercase tracking-wider ${theme.activeText}`;
            }
            if (switchEl) {
                switchEl.className = `toggle-switch w-8 h-4 rounded-full ${theme.activeSwitch} relative transition-colors`;
            }
            if (pinEl) {
                pinEl.className = 'toggle-pin w-3 h-3 rounded-full bg-white absolute top-0.5 right-0.5 transition-all shadow-sm';
            }
        } else {
            btn.className = 'toggle-btn w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-700/60 text-left';
            if (statusEl) {
                statusEl.textContent = 'OCULTO';
                statusEl.className = 'toggle-status text-[10px] font-bold uppercase tracking-wider text-slate-400';
            }
            if (switchEl) {
                switchEl.className = 'toggle-switch w-8 h-4 rounded-full bg-slate-600 relative transition-colors';
            }
            if (pinEl) {
                pinEl.className = 'toggle-pin w-3 h-3 rounded-full bg-white absolute top-0.5 left-0.5 transition-all shadow-sm';
            }
        }
    }

    function updateSymmetryDropdown(shape) {
        const select = document.getElementById('symmetry-mode');
        if (!select) return;
        
        select.innerHTML = '<option value="none">Nenhuma (Desativado)</option>';
        
        const shapeSyms = GaussApp.shapeSymmetries[shape] || [];
        shapeSyms.forEach(symKey => {
            const sym = GaussApp.symmetryDict[symKey];
            if (!sym) return;
            const opt = document.createElement('option');
            opt.value = symKey;
            opt.textContent = sym.text;
            select.appendChild(opt);
        });
        
        GaussApp.state.symmetryMode = 'none'; 
        select.value = 'none';

        const rotSlider = document.getElementById('rot-angle');
        if (rotSlider) rotSlider.value = '0';
        const transSlider = document.getElementById('trans-dist');
        if (transSlider) transSlider.value = '0.0';

        const vx = document.getElementById('vec-x');
        const vy = document.getElementById('vec-y');
        const vz = document.getElementById('vec-z');

        if (shape === 'sphere') {
            if (vx) vx.value = '1.5';
            if (vy) vy.value = '0.0';
            if (vz) vz.value = '0.0';
        } else if (shape === 'cylinder') {
            if (vx) vx.value = '1.0';
            if (vy) vy.value = '0.0';
            if (vz) vz.value = '2.0';
        } else if (shape === 'plane') {
            if (vx) vx.value = '2.0';
            if (vy) vy.value = '2.0'; 
            if (vz) vz.value = '0.0';
        } else if (shape === 'cube') {
            if (vx) vx.value = '1.5';
            if (vy) vy.value = '1.5';
            if (vz) vz.value = '1.5';
        }
    }

    function updateUI() {
        const shape = GaussApp.state.currentShape;
        const data = GaussApp.contentData[shape];
        if (!data) return;

        const titleEl = document.getElementById('info-title');
        const dimsEl = document.getElementById('shape-dimensions');
        const descEl = document.getElementById('info-desc');
        const mathEl = document.getElementById('info-math');

        if (titleEl) titleEl.innerHTML = data.title;
        if (dimsEl) dimsEl.innerHTML = data.dimensions;
        if (descEl) descEl.innerHTML = data.desc;
        if (mathEl) mathEl.innerHTML = data.math;
        
        // Atualiza badge de forma no botão mobile
        const shapeNames = {
            sphere: 'Esfera',
            cylinder: 'Cilindro',
            plane: 'Plano',
            cube: 'Cubo'
        };
        const badge = document.getElementById('mobile-current-shape-badge');
        if (badge) {
            badge.textContent = shapeNames[shape] || shape;
        }

        if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
            const targets = [mathEl, descEl, dimsEl].filter(Boolean);
            MathJax.typesetPromise(targets).catch((err) => console.log(err.message));
        }
    }

    function initEventListeners() {
        const state = GaussApp.state;

        const shapeSelect = document.getElementById('shape-select');
        if (shapeSelect) {
            shapeSelect.addEventListener('change', (e) => { 
                state.currentShape = e.target.value; 
                updateSymmetryDropdown(state.currentShape);
                GaussApp.updateScene(); 
                updateUI(); 
            });
        }

        // Toggles de referências e visualização
        const toggleAxes = document.getElementById('toggle-axes');
        if (toggleAxes) {
            toggleAxes.addEventListener('click', () => {
                state.showAxes = !state.showAxes;
                updateToggleUI('toggle-axes', state.showAxes, 'indigo');
                GaussApp.ReferencePlanes.updateReferencesVisibility();
            });
        }

        const togglePlaneX = document.getElementById('toggle-plane-x');
        if (togglePlaneX) {
            togglePlaneX.addEventListener('click', () => {
                state.showPlaneX = !state.showPlaneX;
                updateToggleUI('toggle-plane-x', state.showPlaneX, 'red');
                GaussApp.ReferencePlanes.updateReferencesVisibility();
            });
        }

        const togglePlaneY = document.getElementById('toggle-plane-y');
        if (togglePlaneY) {
            togglePlaneY.addEventListener('click', () => {
                state.showPlaneY = !state.showPlaneY;
                updateToggleUI('toggle-plane-y', state.showPlaneY, 'green');
                GaussApp.ReferencePlanes.updateReferencesVisibility();
            });
        }

        const togglePlaneZ = document.getElementById('toggle-plane-z');
        if (togglePlaneZ) {
            togglePlaneZ.addEventListener('click', () => {
                state.showPlaneZ = !state.showPlaneZ;
                updateToggleUI('toggle-plane-z', state.showPlaneZ, 'blue');
                GaussApp.ReferencePlanes.updateReferencesVisibility();
            });
        }

        const toggleGaussian = document.getElementById('toggle-gaussian');
        if (toggleGaussian) {
            toggleGaussian.addEventListener('click', () => {
                state.showGaussian = !state.showGaussian;
                updateToggleUI('toggle-gaussian', state.showGaussian, 'blue');
                GaussApp.updateScene();
            });
        }

        const toggleAreaVectors = document.getElementById('toggle-area-vectors');
        if (toggleAreaVectors) {
            toggleAreaVectors.addEventListener('click', () => {
                state.showAreaVectors = !state.showAreaVectors;
                updateToggleUI('toggle-area-vectors', state.showAreaVectors, 'emerald');
                GaussApp.updateScene();
            });
        }

        const toggleField = document.getElementById('toggle-field');
        if (toggleField) {
            toggleField.addEventListener('click', () => {
                state.showField = !state.showField;
                updateToggleUI('toggle-field', state.showField, 'amber');
                GaussApp.updateScene();
            });
        }

        const symSelect = document.getElementById('symmetry-mode');
        if (symSelect) {
            symSelect.addEventListener('change', (e) => { 
                state.symmetryMode = e.target.value; 
                GaussApp.updateScene(); 
            });
        }

        ['vec-x', 'vec-y', 'vec-z', 'rot-angle', 'trans-dist'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => GaussApp.updateScene());
            }
        });

        document.querySelectorAll('.preset-angle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const angle = e.currentTarget.getAttribute('data-angle');
                const slider = document.getElementById('rot-angle');
                if (slider) {
                    slider.value = angle;
                    slider.dispatchEvent(new Event('input'));
                }
            });
        });

        document.querySelectorAll('.preset-dist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dist = e.currentTarget.getAttribute('data-dist');
                const slider = document.getElementById('trans-dist');
                if (slider) {
                    slider.value = dist;
                    slider.dispatchEvent(new Event('input'));
                }
            });
        });

        // Controles de recolher / expandir painel mobile
        const btnCollapse = document.getElementById('btn-collapse-panel');
        if (btnCollapse) {
            btnCollapse.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMobilePanel(true);
            });
        }

        const mobileHeader = document.getElementById('mobile-panel-header');
        if (mobileHeader) {
            mobileHeader.addEventListener('click', () => {
                toggleMobilePanel(true);
            });

            // Gesto de deslizar (swipe down) no mobile
            let startY = 0;
            mobileHeader.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches[0]) {
                    startY = e.touches[0].clientY;
                }
            }, { passive: true });

            mobileHeader.addEventListener('touchend', (e) => {
                if (e.changedTouches && e.changedTouches[0]) {
                    const diffY = e.changedTouches[0].clientY - startY;
                    if (diffY > 35) {
                        toggleMobilePanel(true);
                    }
                }
            }, { passive: true });
        }

        const btnExpand = document.getElementById('mobile-expand-btn');
        if (btnExpand) {
            btnExpand.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMobilePanel(false);
            });
        }
    }

    function toggleMobilePanel(collapse) {
        const state = GaussApp.state;
        const shouldCollapse = collapse !== undefined 
            ? collapse 
            : !document.body.classList.contains('mobile-panel-collapsed');
        
        if (shouldCollapse) {
            document.body.classList.add('mobile-panel-collapsed');
            state.mobilePanelCollapsed = true;
        } else {
            document.body.classList.remove('mobile-panel-collapsed');
            state.mobilePanelCollapsed = false;
        }

        // Recalcula projeção do Three.js durante e ao final da transição CSS
        if (GaussApp.Scene && typeof GaussApp.Scene.smoothResize === 'function') {
            GaussApp.Scene.smoothResize(380);
        } else if (GaussApp.Scene && typeof GaussApp.Scene.onResize === 'function') {
            GaussApp.Scene.onResize();
            setTimeout(() => GaussApp.Scene.onResize(), 360);
        }
    }

    GaussApp.UI = {
        toggleThemes,
        updateToggleUI,
        updateSymmetryDropdown,
        updateUI,
        initEventListeners,
        toggleMobilePanel
    };

    // Alias global para MathJax startup
    window.updateUI = updateUI;
    GaussApp.updateUI = updateUI;
})();
