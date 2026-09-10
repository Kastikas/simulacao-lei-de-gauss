/**
 * js/atividades/quizEngine.js - Motor interativo declarativo para os subsites de atividades.
 */
window.GaussApp = window.GaussApp || {};
GaussApp.Quiz = GaussApp.Quiz || {};

(function() {
    let currentModuleId = '';
    let questionsData = [];
    const moduleState = {
        answeredCount: 0,
        correctCount: 0,
        answers: {} // { [qId]: { selectedIndex, isCorrect } }
    };

    const letters = ['A', 'B', 'C', 'D', 'E'];

    function safeGetStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function safeSetStorage(key, val) {
        try {
            localStorage.setItem(key, val);
        } catch (e) {
            // Ignora se bloqueado em file:///
        }
    }

    function loadSavedState() {
        const saved = safeGetStorage(`gauss_quiz_${currentModuleId}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(moduleState, parsed);
            } catch (e) {
                console.error("Erro ao carregar estado do quiz:", e);
            }
        }
    }

    function saveCurrentState() {
        safeSetStorage(`gauss_quiz_${currentModuleId}`, JSON.stringify(moduleState));
    }

    function updateProgressUI() {
        const total = questionsData.length;
        const answered = moduleState.answeredCount;
        const correct = moduleState.correctCount;
        const pct = total > 0 ? (answered / total) * 100 : 0;

        const pBar = document.getElementById('module-progress-bar');
        if (pBar) pBar.style.width = `${pct}%`;

        const statCount = document.getElementById('stat-answered-count');
        if (statCount) statCount.textContent = `${answered} de ${total} questões`;

        const statScore = document.getElementById('stat-score-pct');
        if (statScore) {
            const scorePct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
            statScore.textContent = `${scorePct}% de acerto (${correct} acertos)`;
        }
    }

    function renderQuestions() {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        let html = '';

        questionsData.forEach((q, idx) => {
            const isAnswered = moduleState.answers[q.id] !== undefined;
            const ansInfo = moduleState.answers[q.id];

            let cardClass = 'question-card';
            if (isAnswered) {
                cardClass += ansInfo.isCorrect ? ' answered-correct' : ' answered-wrong';
            }

            let badgeClass = 'badge-concept';
            if (q.category === 'sim3d') badgeClass = 'badge-sim-3d';
            else if (q.category === 'math') badgeClass = 'badge-math';
            else if (q.category === 'critique') badgeClass = 'badge-critique';

            html += `
                <article class="${cardClass}" id="card-${q.id}" data-qid="${q.id}">
                    <div class="flex items-center justify-between gap-3 mb-3">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Questão ${idx + 1} de ${questionsData.length}
                        </span>
                        <span class="badge-category ${badgeClass}">
                            ${q.categoryLabel || 'Conceitual'}
                        </span>
                    </div>

                    <div class="text-base text-slate-100 font-medium leading-relaxed mb-4" id="enunciado-${q.id}">
                        ${q.enunciado}
                    </div>

                    ${q.link3D ? `
                        <div class="question-3d-banner">
                            <div class="text-xs text-purple-200">
                                <b class="text-purple-300 block mb-0.5">🔬 Desafio de Simetria 3D:</b>
                                <span>${q.prompt3D || 'Investigue as grandezas e vetores diretamente no laboratório 3D.'}</span>
                            </div>
                            <a href="${q.link3D}" class="btn-test-3d">
                                <span>🌐</span> Abrir no Simulador 3D
                            </a>
                        </div>
                    ` : ''}

                    <div class="options-list mb-3" id="options-${q.id}">
            `;

            q.alternativas.forEach((alt, optIdx) => {
                let optClass = 'option-btn';
                if (isAnswered) {
                    if (optIdx === q.correta) {
                        optClass += ' correct';
                    } else if (optIdx === ansInfo.selectedIndex) {
                        optClass += ' wrong';
                    }
                }

                html += `
                    <button type="button" class="${optClass}" data-qid="${q.id}" data-opt="${optIdx}" ${isAnswered ? 'disabled' : ''}>
                        <span class="option-letter">${letters[optIdx] || optIdx + 1}</span>
                        <span class="flex-1">${alt}</span>
                    </button>
                `;
            });

            html += `
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <button type="button" class="btn-toggle-hint text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer py-1" data-qid="${q.id}">
                            <span>💡</span> <span>${isAnswered ? 'Ver Dica' : 'Precisa de Dica?'}</span>
                        </button>
                        ${isAnswered ? `
                            <span class="font-bold ${ansInfo.isCorrect ? 'text-emerald-400' : 'text-red-400'}">
                                ${ansInfo.isCorrect ? '✓ Resposta Correta' : '✗ Resposta Incorreta'}
                            </span>
                        ` : `
                            <span class="text-slate-500">Selecione uma alternativa</span>
                        `}
                    </div>

                    <div class="hint-container hidden" id="hint-${q.id}">
                        <b class="text-amber-300 block mb-1">Dica Pedagógica:</b>
                        <div>${q.dica || 'Considere as condições geométricas impostas pelo Princípio de Curie e pela Lei de Gauss.'}</div>
                    </div>

                    <div class="solution-container ${isAnswered ? (ansInfo.isCorrect ? 'is-correct' : 'is-wrong') : 'hidden'}" id="sol-${q.id}">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-base">${ansInfo && ansInfo.isCorrect ? '🎉' : '📖'}</span>
                            <h4 class="text-sm font-bold text-white">Dedução & Fundamentação Física:</h4>
                        </div>
                        <div class="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                            ${q.resolucao}
                        </div>
                    </div>
                </article>
            `;
        });

        container.innerHTML = html;

        // Anexa listeners de clique nas opções
        container.querySelectorAll('.option-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const qId = btn.getAttribute('data-qid');
                const optIdx = parseInt(btn.getAttribute('data-opt'), 10);
                handleSelectOption(qId, optIdx);
            });
        });

        // Anexa listeners de alternância de dica
        container.querySelectorAll('.btn-toggle-hint').forEach(btn => {
            btn.addEventListener('click', () => {
                const qId = btn.getAttribute('data-qid');
                const hintEl = document.getElementById(`hint-${qId}`);
                if (hintEl) {
                    hintEl.classList.toggle('hidden');
                    if (!hintEl.classList.contains('hidden') && window.MathJax && typeof MathJax.typesetPromise === 'function') {
                        MathJax.typesetPromise([hintEl]).catch(() => {});
                    }
                }
            });
        });

        // Renderiza MathJax em todas as fórmulas
        if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise([container]).catch(err => console.log('MathJax quiz error:', err));
        }

        updateProgressUI();
    }

    function handleSelectOption(qId, selectedIdx) {
        const q = questionsData.find(item => item.id === qId);
        if (!q) return;

        const isCorrect = (selectedIdx === q.correta);
        moduleState.answers[qId] = { selectedIndex: selectedIdx, isCorrect };
        moduleState.answeredCount++;
        if (isCorrect) moduleState.correctCount++;

        saveCurrentState();

        // Atualiza a visualização do card
        const card = document.getElementById(`card-${qId}`);
        if (card) {
            card.classList.add(isCorrect ? 'answered-correct' : 'answered-wrong');
            
            // Desabilita e colore os botões
            const optBtns = card.querySelectorAll('.option-btn');
            optBtns.forEach((btn, idx) => {
                btn.disabled = true;
                if (idx === q.correta) {
                    btn.classList.add('correct');
                } else if (idx === selectedIdx) {
                    btn.classList.add('wrong');
                }
            });

            // Abre a solução detalhada
            const solEl = document.getElementById(`sol-${qId}`);
            if (solEl) {
                solEl.classList.remove('hidden');
                solEl.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
                if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                    MathJax.typesetPromise([solEl]).catch(() => {});
                }
            }

            // Atualiza status text
            const statusText = card.querySelector('.btn-toggle-hint').parentElement.querySelector('span:last-child');
            if (statusText) {
                statusText.className = `font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`;
                statusText.textContent = isCorrect ? '✓ Resposta Correta' : '✗ Resposta Incorreta';
            }
        }

        updateProgressUI();
    }

    function resetModule() {
        if (!confirm('Deseja reiniciar todas as respostas deste módulo?')) return;
        moduleState.answeredCount = 0;
        moduleState.correctCount = 0;
        moduleState.answers = {};
        saveCurrentState();
        renderQuestions();
    }

    function initModule(moduleId, data) {
        currentModuleId = moduleId;
        questionsData = data;
        loadSavedState();
        renderQuestions();

        const resetBtn = document.getElementById('btn-reset-module');
        if (resetBtn) resetBtn.addEventListener('click', resetModule);
    }

    GaussApp.Quiz.initModule = initModule;
    GaussApp.Quiz.resetModule = resetModule;
})();
