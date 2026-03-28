export const WEB_UI_HTML = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vida-nutri | Nutrição Escolar Profissional</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
      :root {
        --bg: #f8faf9;
        --surface: #ffffff;
        --surface-soft: #f0f4f2;
        --ink: #1a2e21;
        --muted: #5c7064;
        --brand: #4a7c59; /* Verde Sálvia */
        --brand-hover: #3a6347;
        --accent: #c0841a; /* Ouro Institucional */
        --line: #e2e8e4;
        --ok: #2d6a4f;
        --warn: #a67c00;
        --danger: #9b2226;
        --radius-lg: 20px;
        --radius-md: 12px;
        --radius-sm: 8px;
        --shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        --shadow-hover: 0 15px 45px rgba(0, 0, 0, 0.08);
      }

      * {
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
      }

      body {
        margin: 0;
        color: var(--ink);
        font-family: 'Inter', sans-serif;
        background: var(--bg);
        line-height: 1.5;
        min-height: 100vh;
      }

      h1, h2, h3 {
        font-family: 'Playfair Display', serif;
        margin: 0;
      }

      .app-shell {
        display: grid;
        grid-template-rows: auto 1fr;
        min-height: 100vh;
      }

      header.top-bar {
        background: var(--surface);
        border-bottom: 1px solid var(--line);
        padding: 0 5%;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .logo-area {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo-icon {
        width: 32px;
        height: 32px;
        background: var(--brand);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .logo-text {
        font-family: 'Playfair Display', serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--brand);
      }

      nav.main-nav {
        display: flex;
        gap: 8px;
      }

      .nav-link {
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        text-decoration: none;
        color: var(--muted);
        font-weight: 500;
        font-size: 0.95rem;
        transition: all 0.2s;
        cursor: pointer;
        border: none;
        background: none;
      }

      .nav-link:hover {
        background: var(--surface-soft);
        color: var(--brand);
      }

      .nav-link.active {
        background: var(--surface-soft);
        color: var(--brand);
        font-weight: 600;
      }

      main.container {
        max-width: 1100px;
        margin: 32px auto;
        padding: 0 24px;
        width: 100%;
      }

      /* Sections Visibility */
      .page-section {
        display: none;
        animation: fadeIn 0.3s ease-out;
      }
      .page-section.active {
        display: block;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Step Wizard Styling */
      .wizard-card {
        background: var(--surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
        padding: 40px;
        border: 1px solid var(--line);
      }

      .step-header {
        margin-bottom: 32px;
        text-align: center;
      }

      .step-title {
        font-size: 1.8rem;
        color: var(--ink);
        margin-bottom: 8px;
      }

      .step-desc {
        color: var(--muted);
        font-size: 1rem;
      }

      .step-body {
        max-width: 600px;
        margin: 0 auto;
      }

      .input-group {
        margin-bottom: 24px;
      }

      .input-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--ink);
      }

      input, select, textarea {
        width: 100%;
        padding: 14px 16px;
        border-radius: var(--radius-md);
        border: 1.5px solid var(--line);
        background: #fdfdfd;
        font-family: inherit;
        font-size: 1rem;
        transition: all 0.2s;
      }

      input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: var(--brand);
        background: #fff;
        box-shadow: 0 0 0 4px rgba(74, 124, 89, 0.1);
      }

      .card-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 32px;
      }

      .option-card {
        border: 2px solid var(--line);
        border-radius: var(--radius-md);
        padding: 24px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
        background: var(--surface);
      }

      .option-card:hover {
        border-color: var(--brand);
        background: var(--surface-soft);
      }

      .option-card.selected {
        border-color: var(--brand);
        background: rgba(74, 124, 89, 0.05);
        box-shadow: 0 8px 20px rgba(74, 124, 89, 0.1);
      }

      .option-icon {
        font-size: 2rem;
        margin-bottom: 12px;
        display: block;
      }

      .option-title {
        font-weight: 700;
        display: block;
        margin-bottom: 4px;
      }

      .option-desc {
        font-size: 0.85rem;
        color: var(--muted);
      }

      /* Buttons */
      .btn {
        padding: 14px 28px;
        border-radius: var(--radius-md);
        border: none;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .btn-primary {
        background: var(--brand);
        color: white;
        box-shadow: 0 10px 20px rgba(74, 124, 89, 0.2);
      }

      .btn-primary:hover {
        background: var(--brand-hover);
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(74, 124, 89, 0.3);
      }

      .btn-secondary {
        background: white;
        color: var(--brand);
        border: 2px solid var(--brand);
      }

      .btn-secondary:hover {
        background: var(--surface-soft);
      }

      .btn-ghost {
        background: transparent;
        color: var(--muted);
      }

      .btn-ghost:hover {
        color: var(--brand);
      }

      .wizard-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        border-top: 1px solid var(--line);
        padding-top: 32px;
      }

      /* Multi-step logic */
      .step-pane {
        display: none;
      }
      .step-pane.active {
        display: block;
      }

      /* Result Area - The "A4" Document */
      .result-view {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 32px;
        align-items: start;
      }

      .document-paper {
        background: #fff;
        padding: 40px;
        border-radius: 4px; /* Simula papel */
        box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        min-height: 800px;
        border: 1px solid var(--line);
      }

      .doc-actions-card {
        position: sticky;
        top: 104px;
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: 24px;
        box-shadow: var(--shadow);
        border: 1px solid var(--line);
      }

      .doc-actions-card h3 {
        font-size: 1.1rem;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--line);
        padding-bottom: 12px;
      }

      /* History List */
      .history-grid {
        display: grid;
        gap: 16px;
      }

      .history-card {
        background: var(--surface);
        padding: 20px;
        border-radius: var(--radius-md);
        border: 1px solid var(--line);
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s;
      }

      .history-card:hover {
        transform: translateX(5px);
        box-shadow: var(--shadow-hover);
        border-color: var(--brand);
      }

      .history-info h4 {
        margin: 0 0 4px;
        font-size: 1.1rem;
      }

      .history-info p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--muted);
      }

      /* Utils */
      .status-pill {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      .pill-ok { background: #e8f5e9; color: #2d6a4f; }
      .hidden { display: none !important; }

      /* Responsive */
      @media (max-width: 900px) {
        .result-view { grid-template-columns: 1fr; }
        .doc-actions-card { position: static; }
        .input-row { grid-template-columns: 1fr; }
      }

      /* Logo Preview in Settings */
      .settings-logo-box {
        background: var(--surface-soft);
        border-radius: var(--radius-md);
        padding: 24px;
        text-align: center;
        border: 2px dashed var(--line);
      }
      .logo-preview-img {
        max-width: 200px;
        max-height: 80px;
        margin-bottom: 16px;
      }

      /* Feedback Messages */
      .toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        border-radius: var(--radius-md);
        color: white;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        display: none;
        animation: slideIn 0.3s forwards;
      }
      @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      .toast-success { background: var(--ok); }
      .toast-error { background: var(--danger); }

      /* Loading Overlay */
      .loading-overlay {
        position: fixed;
        inset: 0;
        background: rgba(255,255,255,0.8);
        backdrop-filter: blur(4px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        display: none;
      }
      .spinner {
        width: 48px;
        height: 48px;
        border: 5px solid var(--surface-soft);
        border-top-color: var(--brand);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* Tables in Result */
      .res-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;
        font-size: 0.9rem;
      }
      .res-table th, .res-table td {
        padding: 12px;
        border-bottom: 1px solid var(--line);
        text-align: left;
      }
      .res-table th { background: var(--surface-soft); font-weight: 700; color: var(--muted); }

    </style>
  </head>
  <body>

    <div class="app-shell">
      <header class="top-bar">
        <div class="logo-area">
          <div class="logo-icon">VN</div>
          <div class="logo-text">vida-nutri</div>
        </div>
        <nav class="main-nav">
          <button class="nav-link active" onclick="showPage('gerar')">Novo Documento</button>
          <button class="nav-link" onclick="showPage('historico')">Histórico</button>
          <button class="nav-link" onclick="showPage('config')">Configurações</button>
        </nav>
      </header>

      <main class="container">
        
        <!-- PAGE: GERAR -->
        <section id="page-gerar" class="page-section active">
          
          <div id="wizard" class="wizard-card">

            <!-- STEP 2: Dados Técnicos -->
            <div id="step-2" class="step-pane active">
              <div class="step-header">
                <h2 class="step-title">Público e Metas</h2>
                <p class="step-desc">Informe a quantidade de alunos e os objetivos nutricionais.</p>
              </div>
              <div class="step-body">
                <div class="input-row">
                  <div class="input-group">
                    <label for="generation-mode">Tipo de geração</label>
                    <select id="generation-mode">
                      <option value="completo" selected>Completo</option>
                      <option value="cardapio">Cardápio</option>
                      <option value="cautela">Cautela</option>
                      <option value="cotacao">Solicitação de cotação</option>
                    </select>
                  </div>
                  <div class="input-group">
                    <label for="period-mode">Período</label>
                    <select id="period-mode">
                      <option value="semanal">Semanal</option>
                      <option value="quinzenal">Quinzenal</option>
                      <option value="mensal" selected>Mensal</option>
                    </select>
                  </div>
                </div>

                <div class="input-row">
                  <div class="input-group">
                    <label for="students">Total de Alunos</label>
                    <input id="students" type="number" value="100" min="1" step="1" required />
                  </div>
                  <div class="input-group">
                    <label for="days">Dias Letivos</label>
                    <input id="days" type="number" value="22" min="1" step="1" required />
                  </div>
                </div>

                <div class="input-row">
                  <div class="input-group">
                    <label for="calories">Meta Calorias (kcal/dia)</label>
                    <input id="calories" type="number" value="600" required />
                  </div>
                  <div class="input-group">
                    <label for="protein">Meta Proteína (g/dia)</label>
                    <input id="protein" type="number" value="22" required />
                  </div>
                </div>

                <div class="input-group">
                  <label for="region">Região do Brasil</label>
                  <select id="region">
                    <option value="Norte">Norte</option>
                    <option value="Nordeste">Nordeste</option>
                    <option value="Centro-Oeste" selected>Centro-Oeste</option>
                    <option value="Sudeste">Sudeste</option>
                    <option value="Sul">Sul</option>
                  </select>
                </div>

                <div class="wizard-actions">
                  <span style="flex:1"></span>
                  <button class="btn btn-primary" onclick="generateSolicitation()">Gerar solicitação</button>
                </div>
              </div>
            </div>

          </div>

          <!-- RESULT VIEW -->
          <div id="result-container" class="result-view hidden">
            <div class="document-paper" id="paper-preview">
              <!-- Content injected by JS -->
              <div style="text-align:center; padding: 100px 0; color: var(--muted)">
                Gerando visualização prévia...
              </div>
            </div>
            
            <div class="doc-actions-card">
              <h3>Ações do Documento</h3>
              <div style="display:grid; gap: 12px;">
                <button class="btn btn-primary" id="print-btn" style="width:100%">Imprimir agora</button>
                <button class="btn btn-secondary" id="download-pdf-btn" style="width:100%">Salvar PDF</button>
                <button class="btn btn-ghost" id="new-version-btn" style="width:100%">Criar nova versão</button>
                <button class="btn btn-ghost" id="new-doc-btn" style="width:100%; margin-top: 12px; border-top: 1px solid var(--line); border-radius: 0; padding-top: 20px;">Novo documento</button>
              </div>
            </div>
          </div>

        </section>

        <!-- PAGE: HISTÓRICO -->
        <section id="page-historico" class="page-section">
          <div class="step-header" style="text-align:left">
            <h2 class="step-title">Seu Acervo de Documentos</h2>
            <p class="step-desc">Todas as solicitações geradas neste navegador.</p>
          </div>
          
          <div style="margin-bottom: 24px; display:flex; justify-content: flex-end;">
            <button class="btn btn-ghost" id="clear-history-btn" style="color: var(--danger)">Limpar tudo</button>
          </div>

          <div id="history-list" class="history-grid">
            <!-- Injected by JS -->
          </div>
        </section>

        <!-- PAGE: CONFIG -->
        <section id="page-config" class="page-section">
          <div class="step-header" style="text-align:left">
            <h2 class="step-title">Dados Institucionais</h2>
            <p class="step-desc">Configure uma vez para que todos os documentos saiam com seu timbre e assinatura.</p>
          </div>

          <div class="wizard-card" style="max-width: 800px;">
            <div class="input-row">
              <div class="input-group">
                <label for="institution-name">Nome da Instituição (Ex: Prefeitura de...)</label>
                <input id="institution-name" type="text" placeholder="Ex: Secretaria de Educação de..." />
              </div>
              <div class="input-group">
                <label for="school-unit">Unidade Escolar</label>
                <input id="school-unit" type="text" placeholder="Ex: Escola Municipal..." />
              </div>
            </div>

            <div class="input-row">
              <div class="input-group">
                <label for="city-uf">Cidade/UF</label>
                <input id="city-uf" type="text" placeholder="Ex: Manaus/AM" />
              </div>
              <div class="input-group">
                <label for="period-label">Mês/Ano do Cardápio</label>
                <input id="period-label" type="text" placeholder="Ex: Abril/2026" />
              </div>
            </div>

            <div class="input-row">
              <div class="input-group">
                <label for="technical-responsible">Nutricionista (RT)</label>
                <input id="technical-responsible" type="text" placeholder="Nome Completo" />
              </div>
              <div class="input-group">
                <label for="technical-crn">Registro CRN</label>
                <input id="technical-crn" type="text" placeholder="Ex: CRN-7 1234/P" />
              </div>
            </div>

            <div class="input-group hidden">
               <input id="document-number" type="hidden" />
               <input id="logo-url" type="hidden" />
            </div>

            <div class="settings-logo-box">
              <label>Logotipo Institucional</label>
              <div id="logo-preview-area">
                <img id="logo-preview-img" class="logo-preview-img hidden" src="" alt="Sua logo" />
                <div id="logo-empty" class="step-desc" style="padding: 20px 0;">Nenhuma logo selecionada.</div>
              </div>
              <div style="display:flex; justify-content:center; gap: 12px; margin-top: 12px;">
                <button class="btn btn-secondary" id="choose-logo-btn">Selecionar Imagem</button>
                <button class="btn btn-ghost hidden" id="remove-logo-btn" style="color:var(--danger)">Remover</button>
              </div>
              <input id="logo-file-input" type="file" class="hidden" accept="image/*" />
              <p class="step-desc" style="font-size:0.8rem; margin-top:10px;">Recomendado: PNG ou JPG fundo branco. Máx 3MB.</p>
            </div>
          </div>
        </section>

      </main>
    </div>

    <!-- UI Overlays -->
    <div id="loader" class="loading-overlay">
      <div class="spinner"></div>
      <p style="margin-top: 20px; font-weight: 600; color: var(--brand)" id="loader-text">Processando Inteligência Nutricional...</p>
    </div>

    <div id="toast" class="toast"></div>

    <script>
      // DOM Elements
      var studentsInput = document.getElementById("students");
      var daysInput = document.getElementById("days");
      var caloriesInput = document.getElementById("calories");
      var proteinInput = document.getElementById("protein");
      var regionInput = document.getElementById("region");
      var periodModeInput = document.getElementById("period-mode");
      var generationModeInput = document.getElementById("generation-mode");

      var institutionNameInput = document.getElementById("institution-name");
      var schoolUnitInput = document.getElementById("school-unit");
      var cityUfInput = document.getElementById("city-uf");
      var technicalResponsibleInput = document.getElementById("technical-responsible");
      var technicalCrnInput = document.getElementById("technical-crn");
      var periodLabelInput = document.getElementById("period-label");
      var documentNumberInput = document.getElementById("document-number");
      var logoUrlInput = document.getElementById("logo-url");

      var historyList = document.getElementById("history-list");
      var resultContainer = document.getElementById("result-container");
      var wizard = document.getElementById("wizard");
      var paperPreview = document.getElementById("paper-preview");

      var logoFileInput = document.getElementById("logo-file-input");
      var logoPreviewImg = document.getElementById("logo-preview-img");
      var logoEmpty = document.getElementById("logo-empty");
      var removeLogoBtn = document.getElementById("remove-logo-btn");
      var chooseLogoBtn = document.getElementById("choose-logo-btn");

      // State
      var currentResult = null;
      var currentContext = null;
      var selectedLogoDataUrl = "";
      var STORAGE = { institutional: "vida_nutri_inst_v2", history: "vida_nutri_hist_v2" };

      // --- UI NAVIGATION ---
      function showPage(pageId) {
        document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
        
        document.getElementById('page-' + pageId).classList.add('active');
        event.target.classList.add('active');

        if (pageId === 'gerar') {
           // Reset wizard if no result
           if (!currentResult) {
              resultContainer.classList.add('hidden');
              wizard.classList.remove('hidden');
              nextStep(2);
           }
        }
      }

      function nextStep(n) {
        document.querySelectorAll('.step-pane').forEach(s => s.classList.remove('active'));
        document.getElementById('step-' + n).classList.add('active');
      }

      function prevStep(n) {
        nextStep(n);
      }

      // --- STORAGE & HISTORY ---
      function getHistory() {
        try { return JSON.parse(localStorage.getItem(STORAGE.history)) || []; } catch(e) { return []; }
      }
      function saveHistory(h) { localStorage.setItem(STORAGE.history, JSON.stringify(h)); }

      function showToast(msg, type = 'success') {
        var t = document.getElementById('toast');
        t.textContent = msg;
        t.className = 'toast toast-' + type;
        t.style.display = 'block';
        setTimeout(() => { t.style.display = 'none'; }, 3000);
      }

      function setLoading(isLoading, text) {
        var l = document.getElementById('loader');
        if (text) document.getElementById('loader-text').textContent = text;
        l.style.display = isLoading ? 'flex' : 'none';
      }

      // --- LOGIC ---
      function formatNumber(v, d) {
        return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
      }

      function formatDateBr(date) { return new Intl.DateTimeFormat("pt-BR").format(date); }

      function generateUniqueDocumentNumber() {
        var now = new Date();
        var prefix = generationModeInput.value === "cautela" ? "CAU" : "PNAE";
        return prefix + now.getFullYear() + String(now.getMonth()+1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + "-" + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
      }

      function getInstitutionData() {
        return {
          institutionName: institutionNameInput.value.trim() || "Secretaria de Educação",
          schoolUnit: schoolUnitInput.value.trim() || "Unidade Escolar",
          cityUf: cityUfInput.value.trim() || "-",
          technicalResponsible: technicalResponsibleInput.value.trim() || "Nutricionista Responsável",
          technicalCrn: technicalCrnInput.value.trim() || "CRN-0000",
          periodLabel: periodLabelInput.value.trim() || "Mês Corrente",
          documentNumber: documentNumberInput.value || generateUniqueDocumentNumber(),
          generatedAt: formatDateBr(new Date()),
          logoSrc: selectedLogoDataUrl || logoUrlInput.value.trim()
        };
      }

      async function generateSolicitation(options) {
        setLoading(true, "A IA está planejando os melhores gêneros alimentícios...");
        
        var requestData = {
          students: Number(studentsInput.value),
          days: Number(daysInput.value),
          calories: Number(caloriesInput.value),
          protein: Number(proteinInput.value),
          region: regionInput.value,
          periodMode: periodModeInput.value,
          generationMode: generationModeInput.value
        };

        try {
          var response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
          });
          var body = await response.json();
          if(!body.ok) throw body.error;

          var data = body.data;
          var inst = getInstitutionData();
          var rootNumber = options?.rootDocumentNumber || inst.documentNumber;
          var version = options?.version || 1;

          var record = {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            rootDocumentNumber: rootNumber,
            version: version,
            createdAtLabel: new Date().toLocaleString('pt-BR'),
            requestData: requestData,
            institutionData: inst,
            resultData: data
          };

          currentResult = data;
          currentContext = record;
          
          var h = getHistory();
          h.push(record);
          saveHistory(h);

          renderDocumentPreview(record);
          wizard.classList.add('hidden');
          resultContainer.classList.remove('hidden');
          showToast("Documento pronto com sucesso!");
        } catch (e) {
          showToast(e.message || "Erro na geração", "error");
        } finally {
          setLoading(false);
        }
      }

      function escapeHtml(v) { return String(v).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

      function renderDocumentPreview(record) {
        var data = record.resultData;
        var inst = record.institutionData;

        var menuHtml = "";
        if (data.institutional?.weeks) {
           data.institutional.weeks.forEach(w => {
              w.days.forEach(d => {
                 menuHtml += \`<tr><td>Semana \${w.weekNumber}</td><td>\${d.weekdayLabel}</td><td>\${d.preparation}</td><td>\${formatNumber(d.totals.totalCalories, 0)} kcal</td></tr>\`;
              });
           });
        }

        var listHtml = "";
        var items = data.institutional?.cautela?.rows || data.purchaseList.items;
        items.forEach(i => {
           var qty = i.quantidadeConsolidada || i.totalKg;
           listHtml += \`<tr><td>\${i.genero || i.name}</td><td>\${formatNumber(qty, 2)} kg</td><td>R$ \${formatNumber(i.estimativaTotal || i.totalCost, 2)}</td></tr>\`;
        });

        paperPreview.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:start; border-bottom: 2px solid var(--brand); padding-bottom: 20px; margin-bottom: 20px;">
            <div>
               <h1 style="font-size:1.5rem; color:var(--brand)">\${inst.institutionName}</h1>
               <p style="margin:0; font-size:0.9rem; color:var(--muted)">\${inst.schoolUnit} • \${inst.cityUf}</p>
            </div>
            \${inst.logoSrc ? \`<img src="\${inst.logoSrc}" style="max-height:60px">\` : '<div class="logo-icon">🌿</div>'}
          </div>
          <div style="margin-bottom: 30px;">
             <h2 style="font-size:1.2rem; margin-bottom: 10px; text-transform:uppercase">Solicitação de Cotação PNAE</h2>
             <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem; background: var(--surface-soft); padding: 15px; border-radius: 8px;">
                <div><b>Documento:</b> \${record.rootDocumentNumber} (v\${record.version})</div>
                <div><b>Data:</b> \${inst.generatedAt}</div>
                <div><b>Responsável:</b> \${inst.technicalResponsible}</div>
                <div><b>CRN:</b> \${inst.technicalCrn}</div>
                <div><b>Período:</b> \${inst.periodLabel}</div>
                <div><b>Alunos:</b> \${data.request.students}</div>
             </div>
          </div>
          
          <h3 style="font-size:1rem; margin-top:20px;">Planejamento Alimentar</h3>
          <table class="res-table">
            <thead><tr><th>Período</th><th>Dia</th><th>Preparação</th><th>Meta</th></tr></thead>
            <tbody>\${menuHtml}</tbody>
          </table>

          <h3 style="font-size:1rem; margin-top:30px;">Estimativa de Gêneros Alimentícios</h3>
          <table class="res-table">
            <thead><tr><th>Item</th><th>Quantidade</th><th>Subtotal Est.</th></tr></thead>
            <tbody>\${listHtml}</tbody>
          </table>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--line); text-align:right">
             <p style="font-size:1.1rem; font-weight:700">Total Estimado: R$ \${formatNumber(data.purchaseList.grandTotalCost, 2)}</p>
          </div>
        \`;
      }

      function renderHistory() {
        var h = getHistory().sort((a,b) => b.id - a.id);
        historyList.innerHTML = h.length ? "" : "<p class='step-desc'>Nenhum documento encontrado.</p>";
        h.forEach(item => {
           var card = document.createElement('div');
           card.className = 'history-card';
           card.innerHTML = \`
            <div class="history-info">
              <h4>\${item.rootDocumentNumber} <span class="status-pill pill-ok">v\${item.version}</span></h4>
              <p>\${item.institutionData.schoolUnit} • \${item.institutionData.periodLabel}</p>
              <p style="font-size:0.75rem">\${item.createdAtLabel}</p>
            </div>
            <div style="display:flex; gap: 8px;">
               <button class="btn btn-secondary" style="padding: 8px 12px; font-size: 0.8rem" onclick="viewHistoryItem('\${item.id}')">Visualizar</button>
            </div>
           \`;
           historyList.appendChild(card);
        });
      }

      function viewHistoryItem(id) {
         var item = getHistory().find(i => i.id === id);
         if(item) {
            currentResult = item.resultData;
            currentContext = item;
            renderDocumentPreview(item);
            showPage('gerar');
            wizard.classList.add('hidden');
            resultContainer.classList.remove('hidden');
         }
      }

      // --- SETUP & EVENTS ---
      document.getElementById('new-doc-btn').onclick = () => {
         currentResult = null;
         resultContainer.classList.add('hidden');
         wizard.classList.remove('hidden');
         nextStep(2);
      };

      document.getElementById('print-btn').onclick = () => window.print();
      document.getElementById('download-pdf-btn').onclick = () => window.print(); // Hint handled in generic style

      document.getElementById('new-version-btn').onclick = () => {
         if(!currentContext) return;
         var nextVers = getHistory().filter(i => i.rootDocumentNumber === currentContext.rootDocumentNumber).length + 1;
         generateSolicitation({ rootDocumentNumber: currentContext.rootDocumentNumber, version: nextVers });
      };

      document.getElementById('clear-history-btn').onclick = () => {
         if(confirm("Deseja apagar todos os documentos?")) {
            saveHistory([]);
            renderHistory();
            showToast("Histórico limpo.");
         }
      };

      // --- LOGO HANDLING ---
      chooseLogoBtn.onclick = () => logoFileInput.click();
      logoFileInput.onchange = (e) => {
         var file = e.target.files[0];
         if(!file) return;
         var reader = new FileReader();
         reader.onload = (re) => {
            selectedLogoDataUrl = re.target.result;
            logoPreviewImg.src = selectedLogoDataUrl;
            logoPreviewImg.classList.remove('hidden');
            logoEmpty.classList.add('hidden');
            removeLogoBtn.classList.remove('hidden');
            localStorage.setItem(STORAGE.institutional, JSON.stringify(getInstitutionData()));
         };
         reader.readAsDataURL(file);
      };

      removeLogoBtn.onclick = () => {
         selectedLogoDataUrl = "";
         logoPreviewImg.classList.add('hidden');
         logoEmpty.classList.remove('hidden');
         removeLogoBtn.classList.add('hidden');
         localStorage.setItem(STORAGE.institutional, JSON.stringify(getInstitutionData()));
      };

      // Auto-save institutional data
      ['institution-name', 'school-unit', 'city-uf', 'technical-responsible', 'technical-crn', 'period-label'].forEach(id => {
         document.getElementById(id).addEventListener('input', () => {
            localStorage.setItem(STORAGE.institutional, JSON.stringify(getInstitutionData()));
         });
      });

      function init() {
         var saved = localStorage.getItem(STORAGE.institutional);
         if(saved) {
            var d = JSON.parse(saved);
            institutionNameInput.value = d.institutionName || "";
            schoolUnitInput.value = d.schoolUnit || "";
            cityUfInput.value = d.cityUf || "";
            technicalResponsibleInput.value = d.technicalResponsible || "";
            technicalCrnInput.value = d.technicalCrn || "";
            periodLabelInput.value = d.periodLabel || "";
            if(d.logoSrc) {
               selectedLogoDataUrl = d.logoSrc;
               logoPreviewImg.src = d.logoSrc;
               logoPreviewImg.classList.remove('hidden');
               logoEmpty.classList.add('hidden');
               removeLogoBtn.classList.remove('hidden');
            }
         }
         renderHistory();
      }

      init();
    </script>
  </body>
</html>
`;
