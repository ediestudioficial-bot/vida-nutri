export const WEB_UI_HTML = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vida-nutri | Planejamento de Nutrição Escolar</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      :root {
        --bg: #f8fafc;
        --surface: #ffffff;
        --ink: #0f172a;
        --muted: #64748b;
        --brand: #10b981;
        --brand-light: #ecfdf5;
        --brand-dark: #059669;
        --line: #f1f5f9;
        --line-dark: #e2e8f0;
        --accent: #f59e0b;
        --radius-sm: 6px;
        --radius: 12px;
        --radius-lg: 16px;
        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      }

      * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

      body {
        margin: 0;
        color: var(--ink);
        font-family: 'Inter', sans-serif;
        background: var(--bg);
        line-height: 1.6;
        font-size: 14px;
      }

      /* Layout */
      header {
        background: var(--surface);
        border-bottom: 1px solid var(--line-dark);
        height: 72px;
        display: flex;
        align-items: center;
        padding: 0 6%;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: var(--shadow-sm);
      }

      .logo {
        font-weight: 800;
        font-size: 1.6rem;
        color: var(--brand-dark);
        display: flex;
        align-items: center;
        gap: 10px;
        letter-spacing: -0.04em;
        position: relative;
      }
      .logo::before {
        content: "";
        width: 12px;
        height: 12px;
        background: var(--brand);
        border-radius: 3px;
        display: inline-block;
      }

      nav { display: flex; gap: 8px; }
      .nav-link {
        padding: 10px 20px;
        border-radius: var(--radius);
        text-decoration: none;
        color: var(--muted);
        font-weight: 600;
        font-size: 0.95rem;
        border: none;
        background: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .nav-link.active { color: var(--brand-dark); background: var(--brand-light); }
      .nav-link:hover:not(.active) { color: var(--ink); background: var(--line); }

      main {
        max-width: 1280px;
        margin: 48px auto;
        padding: 0 24px;
      }

      .page-section { display: none; }
      .page-section.active { display: block; }

      /* Columns */
      .grid-layout {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 40px;
        align-items: start;
        min-width: 0;
      }

      .col-left {
        display: flex;
        flex-direction: column;
        gap: 24px;
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: 40px;
        box-shadow: var(--shadow);
        border: 1px solid var(--line-dark);
      }
      .col-right {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      /* Visual Blocks */
      .card {
        background: var(--surface);
        border: 1px solid var(--line-dark);
        border-radius: var(--radius-lg);
        padding: 28px;
        box-shadow: var(--shadow);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .card:hover {
        box-shadow: var(--shadow-md);
      }

      .card-title {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--ink);
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--line);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .main-title {
        font-size: 2.8rem;
        font-weight: 800;
        color: var(--ink);
        margin: 0 0 12px;
        letter-spacing: -0.05em;
        line-height: 1.1;
      }

      .main-subtitle {
        font-size: 1.1rem;
        color: var(--muted);
        margin: 0 0 32px;
        font-weight: 400;
        max-width: 500px;
      }

      .form-section {
        margin-bottom: 32px;
        padding: 24px;
        background: #fcfdfe;
        border-radius: var(--radius);
        border: 1px solid var(--line);
      }
      
      .form-section-label {
        font-weight: 700;
        font-size: 0.85rem;
        color: var(--brand-dark);
        text-transform: uppercase;
        margin-bottom: 20px;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .form-section-label::before {
        content: "";
        width: 4px;
        height: 16px;
        background: var(--brand);
        border-radius: 2px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 0;
      }

      .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
      }
      .input-group:last-child { margin-bottom: 0; }

      label {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--ink);
      }

      input, select {
        padding: 12px 16px;
        border: 1.5px solid var(--line-dark);
        border-radius: var(--radius-sm);
        font-family: inherit;
        font-size: 0.95rem;
        width: 100%;
        background: white;
        transition: all 0.2s ease;
        color: var(--ink);
      }

      input:focus, select:focus {
        outline: none;
        border-color: var(--brand);
        box-shadow: 0 0 0 4px var(--brand-light);
      }      .btn-primary {
        background: var(--brand-dark);
        color: #fff;
        border: none;
        padding: 16px 36px;
        width: auto;
        min-width: 240px;
        align-self: flex-start;
        font-weight: 700;
        font-size: 1.05rem;
        border-radius: var(--radius);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        margin-top: 12px;
      }
      .btn-primary:hover {
        background: #047857;
        transform: translateY(-2px);
        box-shadow: 0 12px 20px -5px rgba(16, 185, 129, 0.3);
      }
      .btn-primary:active {
        transform: translateY(0);
      }

      /* Summary List */
      .summary-list { display: flex; flex-direction: column; gap: 8px; }
      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 18px;
        background: white;
        border: 1px solid var(--line);
        border-radius: var(--radius);
        transition: border-color 0.2s ease;
      }
      .summary-label {
        color: var(--muted);
        font-weight: 500;
        font-size: 0.9rem;
      }
      .summary-value {
        font-weight: 700;
        color: var(--brand-dark);
        font-size: 1rem;
      }

      /* History List */
      .history-mini { display: flex; flex-direction: column; gap: 10px; }
      .history-mini-item {
        padding: 18px;
        border: 1px solid var(--line);
        border-radius: var(--radius);
        cursor: pointer;
        background: white;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .history-mini-item:hover {
        border-color: var(--brand);
        background: white;
        box-shadow: var(--shadow);
        transform: translateY(-2px);
      }
      .history-mini-name {
        font-weight: 700;
        display: block;
        font-size: 0.95rem;
        color: var(--ink);
        margin-bottom: 6px;
      }
      .history-mini-date {
        font-size: 0.8rem;
        color: var(--muted);
      }

      /* Result Area */
      .result-view { display: none; margin-top: 20px; }
      .result-view.active { display: block; }

      .paper {
        background: white;
        border: 1px solid var(--line-dark);
        padding: 80px;
        box-shadow: var(--shadow-lg);
        max-width: 900px;
        margin: 0 auto 48px;
        border-radius: 4px;
        position: relative;
      }
      .paper::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 6px;
        background: var(--brand-dark);
        border-radius: 4px 4px 0 0;
      }

      .paper-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-bottom: 80px;
      }

      .btn-secondary {
        background: white;
        border: 1px solid var(--line-dark);
        padding: 12px 28px;
        font-weight: 600;
        border-radius: var(--radius);
        cursor: pointer;
        color: var(--muted);
        transition: all 0.2s ease;
      }
      .btn-secondary:hover { 
        background: var(--bg);
        color: var(--ink);
        border-color: var(--muted);
      }

      .btn-small {
        background: var(--brand-dark);
        color: #fff;
        border: none;
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        font-weight: 600;
        cursor: pointer;
      }

      /* Utils */
      .hidden { display: none !important; }

      .loader {
        position: fixed; inset: 0; background: rgba(255,255,255,0.9);
        display: none; align-items: center; justify-content: center;
        flex-direction: column; z-index: 1000;
        backdrop-filter: blur(8px);
      }
      .spinner { width: 48px; height: 48px; border: 4px solid var(--brand-light); border-top: 4px solid var(--brand); border-radius: 50%; animation: spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite; margin-bottom: 24px; }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    </style>
  </head>
  <body>

    <header>
      <div class="logo">vida-nutri</div>
      <nav>
        <button class="nav-link active" onclick="showPage('gerar')">Novo Documento</button>
        <button class="nav-link" onclick="showPage('historico')">Histórico</button>
        <button class="nav-link" onclick="showPage('config')">Configurações</button>
      </nav>
    </header>

    <main>
      
      <!-- PAGE: GERAR -->
      <div id="page-gerar" class="page-section active">
        
        <div id="form-container" class="grid-layout">
          
          <div class="col-left">
            <h1 class="main-title">Planejamento Nutricional</h1>
            <p class="main-subtitle">Configurações para geração de documentos técnicos de nutrição escolar.</p>

            <div class="form-section">
              <span class="form-section-label">Dados Escolares</span>
              <div class="form-row">
                <div class="input-group">
                  <label>Total de alunos</label>
                  <input id="students" type="number" value="100" min="1" oninput="updateSummary()" />
                </div>
                <div class="input-group">
                  <label>Dias letivos</label>
                  <input id="days" type="number" value="22" min="1" oninput="updateSummary()" />
                </div>
              </div>

              <span class="form-section-label">Metas Nutricionais</span>
              <div class="form-row">
                <div class="input-group">
                  <label>Calorias (kcal/aluno)</label>
                  <input id="calories" type="number" value="600" oninput="updateSummary()" />
                </div>
                <div class="input-group">
                  <label>Proteína (g/aluno)</label>
                  <input id="protein" type="number" value="22" oninput="updateSummary()" />
                </div>
              </div>

              <span class="form-section-label">Parâmetros de Geração</span>
              <div class="input-group" style="margin-bottom:24px;">
                <label>Tipo de geração</label>
                <select id="generation-mode" onchange="updateSummary()">
                  <option value="completo" selected>Completo (Dossiê)</option>
                  <option value="cardapio">Apenas Cardápio</option>
                  <option value="cautela">Apenas Cautela</option>
                  <option value="cotacao">Solicitação de Cotação</option>
                </select>
              </div>
              <div class="form-row">
                <div class="input-group">
                  <label>Período</label>
                  <select id="period-mode" onchange="updateSummary()">
                    <option value="semanal">Semanal</option>
                    <option value="quinzenal">Quinzenal</option>
                    <option value="mensal" selected>Mensal</option>
                  </select>
                </div>
                <div class="input-group">
                  <label>Região</label>
                  <select id="region">
                    <option value="Norte">Norte</option>
                    <option value="Nordeste">Nordeste</option>
                    <option value="Centro-Oeste" selected>Centro-Oeste</option>
                    <option value="Sudeste">Sudeste</option>
                    <option value="Sul">Sul</option>
                  </select>
                </div>
              </div>
            </div>

            <button class="btn-primary" onclick="generateSolicitation()">Gerar Documentação</button>
          </div>

          <div class="col-right">
            <div class="card">
              <div class="card-title">Resumo do Plano</div>
              <div class="summary-list">
                <div class="summary-item">
                  <span class="summary-label">Tipo:</span>
                  <span class="summary-value" id="sum-type">Completo</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Período:</span>
                  <span class="summary-value" id="sum-period">Mensal</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Alunos:</span>
                  <span class="summary-value" id="sum-students">100</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Dias:</span>
                  <span class="summary-value" id="sum-days">22</span>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-title">Últimos documentos</div>
              <div id="quick-history" class="history-mini">
                <!-- Injected via JS -->
              </div>
            </div>

            <div class="card">
              <div class="card-title">Conta</div>
              <div class="input-group">
                <label>Email</label>
                <input id="auth-email" type="email" placeholder="voce@email.com" />
              </div>
              <div class="input-group">
                <label>Senha</label>
                <input id="auth-password" type="password" placeholder="********" />
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="btn-small" onclick="signUp()">Criar conta</button>
                <button class="btn-small" onclick="signIn()">Entrar</button>
                <button class="btn-secondary" onclick="signOut()">Sair</button>
              </div>
              <p id="auth-status" style="margin:14px 0 0; color:var(--muted); font-size:0.85rem;">Sessão: não autenticado</p>
            </div>

            <div class="card">
              <div class="card-title">Planos</div>
              <p style="margin:0 0 14px; color:var(--muted); font-size:0.9rem;">Assinatura recorrente via Stripe.</p>
              <div style="display:flex; flex-direction:column; gap:10px;">
                <button class="btn-secondary" onclick="startCheckout('essencial')">Assinar Essencial</button>
                <button class="btn-secondary" onclick="startCheckout('profissional')">Assinar Profissional</button>
                <button class="btn-secondary" onclick="startCheckout('institucional')">Assinar Institucional</button>
              </div>
            </div>
          </div>

        </div>

        <div id="result-view" class="result-view">
          <div class="paper" id="paper-preview"></div>
          <div class="paper-actions">
            <button class="btn-secondary" onclick="window.print()">Imprimir PDF</button>
            <button class="btn-secondary" id="back-btn" onclick="goBack()">Voltar</button>
          </div>
        </div>

      </div>

      <!-- PAGE: HISTORICO -->
      <div id="page-historico" class="page-section">
        <h1 class="main-title">Acervo de Documentos</h1>
        <p class="main-subtitle">Acesso rápido aos últimos planejamentos gerados.</p>
        <div id="history-full" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px; margin-top:24px;"></div>
      </div>

      <!-- PAGE: CONFIG -->
      <div id="page-config" class="page-section">
        <h1 class="main-title">Configurações</h1>
        <p class="main-subtitle">Dados institucionais para o timbre dos documentos.</p>
        
        <div class="card" style="margin-top:32px; max-width:800px;">
          <div class="form-row">
            <div class="input-group">
              <label>Nome da Instituição</label>
              <input id="institution-name" type="text" />
            </div>
            <div class="input-group">
              <label>Unidade Escolar</label>
              <input id="school-unit" type="text" />
            </div>
          </div>
          <div class="form-row">
            <div class="input-group">
              <label>Cidade/UF</label>
              <input id="city-uf" type="text" />
            </div>
            <div class="input-group">
              <label>Responsável Técnico</label>
              <input id="technical-responsible" type="text" />
            </div>
          </div>
          <div class="input-group" style="max-width:320px;">
            <label>CRN</label>
            <input id="technical-crn" type="text" />
          </div>
        </div>
      </div>

    </main>

    <div id="loader" class="loader">
      <div class="spinner"></div>
      <p style="font-weight:700; color:var(--ink);">Gerando planejamento...</p>
      <p style="color:var(--muted); font-size:0.9rem;">Solicitação pronta</p>
    </div>

    <script>
      var STORAGE_KEY = "vida_nutri_data_v4";
      var historyData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      var AUTH_TOKEN_KEY = "vida_nutri_access_token";
      var accessToken = localStorage.getItem(AUTH_TOKEN_KEY) || "";
      var appConfig = null;

      function showPage(id) {
        document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.getElementById('page-' + id).classList.add('active');
        
        const tabs = ['gerar', 'historico', 'config'];
        const links = document.querySelectorAll('.nav-link');
        tabs.forEach((tab, index) => {
          if (id === tab) links[index].classList.add('active');
        });
        
        if (id === 'historico') renderFullHistory();
      }

      function updateSummary() {
        document.getElementById('sum-type').textContent = document.getElementById('generation-mode').selectedOptions[0].text;
        document.getElementById('sum-period').textContent = document.getElementById('period-mode').selectedOptions[0].text;
        document.getElementById('sum-students').textContent = document.getElementById('students').value;
        document.getElementById('sum-days').textContent = document.getElementById('days').value;
      }

      function goBack() {
        document.getElementById('form-container').classList.remove('hidden');
        document.getElementById('result-view').classList.remove('active');
      }

      async function generateSolicitation() {
        if (!accessToken) {
          alert("Entre com sua conta para gerar documentos.");
          return;
        }

        var loader = document.getElementById('loader');
        loader.style.display = 'flex';

        var payload = {
          students: Number(document.getElementById('students').value),
          days: Number(document.getElementById('days').value),
          calories: Number(document.getElementById('calories').value),
          protein: Number(document.getElementById('protein').value),
          region: document.getElementById('region').value,
          periodMode: document.getElementById('period-mode').value,
          generationMode: document.getElementById('generation-mode').value
        };

        try {
          var response = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(payload)
          });
          var res = await response.json();
          if (res.ok) {
            renderPaper(res.data);
            saveToHistory(res.data);
            document.getElementById('form-container').classList.add('hidden');
            document.getElementById('result-view').classList.add('active');
          } else {
            alert("Erro: " + res.error.message);
          }
        } catch(e) {
          alert("Erro de conexão.");
        } finally {
          loader.style.display = 'none';
        }
      }

      function saveToHistory(data) {
        var entry = {
          id: Date.now(),
          title: "Plano " + (document.getElementById('generation-mode').selectedOptions[0].text),
          students: data.request.students,
          date: new Date().toLocaleString('pt-BR'),
          data: data
        };
        historyData.unshift(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historyData.slice(0, 50)));
        renderQuickHistory();
      }

      function renderQuickHistory() {
        var container = document.getElementById('quick-history');
        container.innerHTML = historyData.slice(0, 3).map(item => \`
          <div class="history-mini-item" onclick="viewHistoryItem(\${item.id})">
            <span class="history-mini-name">\${item.title}</span>
            <span class="history-mini-date">\${item.date}</span>
          </div>
        \`).join("") || '<p style="color:var(--muted); font-size:0.8rem; padding: 10px;">Vazio</p>';
      }

      function renderFullHistory() {
        var container = document.getElementById('history-full');
        container.innerHTML = historyData.map(item => \`
          <div class="card" style="display:flex; flex-direction: column; cursor:pointer;" onclick="viewHistoryItem(\${item.id})">
            <div style="flex: 1;">
              <span style="font-weight:700; font-size:1.1rem; color: var(--ink);">\${item.title}</span>
              <p style="margin:8px 0 0; font-size:0.85rem; color:var(--muted);">\${item.date}</p>
            </div>
            <button class="btn-secondary" style="margin-top:20px; width:100%;">Visualizar</button>
          </div>
        \`).join("") || '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);">Nenhum documento gerado ainda.</p>';
      }

      function viewHistoryItem(id) {
        var item = historyData.find(h => h.id === id);
        if (item) {
          renderPaper(item.data);
          document.getElementById('form-container').classList.add('hidden');
          document.getElementById('result-view').classList.add('active');
          showPage('gerar');
        }
      }

      function renderPaper(data) {
        var inst = {
          name: document.getElementById('institution-name').value || "Instituição não configurada",
          unit: document.getElementById('school-unit').value || "Unidade não configurada",
          city: document.getElementById('city-uf').value || "-",
          rt: document.getElementById('technical-responsible').value || "Nutricionista responsável",
          crn: document.getElementById('technical-crn').value || "CRN -"
        };

        var html = \`
          <div style="border-bottom: 2px solid var(--brand-dark); padding-bottom: 24px; margin-bottom: 40px; display:flex; justify-content:space-between; align-items: flex-start;">
            <div>
              <strong style="font-size:1.3rem; color:var(--ink); display:block; margin-bottom: 4px;">\${inst.name}</strong>
              <span style="color:var(--muted);">\${inst.unit}</span>
            </div>
            <div style="text-align:right">
              <p style="margin:0; font-size:0.85rem; color:var(--muted);">Ficha gerada em:</p>
              <p style="margin:4px 0 0; font-size:0.9rem; font-weight: 600;">\${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <h2 style="text-align:center; font-size:1.5rem; margin-bottom:40px; color:var(--ink); letter-spacing: 0.5px;">RELATÓRIO DE PLANEJAMENTO NUTRICIONAL</h2>
          
          <table style="width:100%; border-collapse:collapse; margin-bottom:40px;">
            <thead>
              <tr style="background:#f8fafc; color: var(--ink);">
                <th style="padding:14px; border:1px solid #e2e8f0; text-align:left; font-size: 0.9rem;">ALIMENTO</th>
                <th style="padding:14px; border:1px solid #e2e8f0; text-align:right; font-size: 0.9rem;">TOTAL (KG)</th>
                <th style="padding:14px; border:1px solid #e2e8f0; text-align:right; font-size: 0.9rem;">CUSTO ESTIMADO</th>
              </tr>
            </thead>
            <tbody>
              \${data.purchaseList.items.map(i => \`
                <tr>
                  <td style="padding:12px 14px; border:1px solid #e2e8f0; color:var(--ink); font-weight: 500;">\${i.name}</td>
                  <td style="padding:12px 14px; border:1px solid #e2e8f0; text-align:right; font-family: monospace;">\${i.totalKg.toFixed(2).replace('.', ',')}</td>
                  <td style="padding:12px 14px; border:1px solid #e2e8f0; text-align:right; font-family: monospace;">R$ \${i.totalCost.toFixed(2).replace('.', ',')}</td>
                </tr>
              \`).join("")}
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; font-weight:800; color: var(--brand-dark);">
                <td colspan="2" style="padding:16px 14px; border:1px solid #e2e8f0; text-align: right; text-transform: uppercase; font-size: 0.85rem;">Total Geral Estimado</td>
                <td style="padding:16px 14px; border:1px solid #e2e8f0; text-align:right; font-size: 1.1rem;">R$ \${data.purchaseList.grandTotalCost.toFixed(2).replace('.', ',')}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top:80px; display:flex; justify-content:space-between; text-align:center;">
            <div style="flex: 1;">
              <div style="border-top:1px solid #cbd5e1; width:220px; margin:24px auto 8px;"></div>
              <p style="font-size:0.9rem; font-weight:700; color:var(--ink); margin:0;">\${inst.rt}</p>
              <p style="font-size:0.8rem; color:var(--muted); margin:4px 0 0;">\${inst.crn}</p>
            </div>
            <div style="flex: 1;">
               <div style="border-top:1px solid #cbd5e1; width:220px; margin:24px auto 8px;"></div>
               <p style="font-size:0.9rem; font-weight:700; color:var(--ink); margin:0;">Responsável Institucional</p>
               <p style="font-size:0.8rem; color:var(--muted); margin:4px 0 0;">\${inst.city}</p>
            </div>
          </div>
        \`;
        document.getElementById('paper-preview').innerHTML = html;
      }

      // Settings load/save
      var configFields = ['institution-name', 'school-unit', 'city-uf', 'technical-responsible', 'technical-crn'];
      configFields.forEach(id => {
        var el = document.getElementById(id);
        el.value = localStorage.getItem('cfg_' + id) || "";
        el.onchange = () => localStorage.setItem('cfg_' + id, el.value);
      });

      renderQuickHistory();
      updateSummary();

      async function loadConfig() {
        try {
          var response = await fetch("/api/config");
          var res = await response.json();
          if (res.ok) {
            appConfig = res.data;
          }
        } catch (e) {
          appConfig = null;
        }
      }

      function updateAuthStatus(text) {
        var el = document.getElementById('auth-status');
        if (el) {
          el.textContent = text;
        }
      }

      function getAuthPayload() {
        return {
          email: String(document.getElementById('auth-email').value || "").trim(),
          password: String(document.getElementById('auth-password').value || "")
        };
      }

      async function signUp() {
        var payload = getAuthPayload();
        if (!payload.email || !payload.password) {
          alert("Preencha email e senha.");
          return;
        }

        var response = await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload)
        });
        var res = await response.json();
        if (!res.ok) {
          alert("Erro: " + res.error.message);
          return;
        }

        if (res.data.session && res.data.session.accessToken) {
          accessToken = res.data.session.accessToken;
          localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
          updateAuthStatus("Sessão ativa: " + payload.email);
          return;
        }
        updateAuthStatus("Conta criada. Verifique seu email para confirmação.");
      }

      async function signIn() {
        var payload = getAuthPayload();
        if (!payload.email || !payload.password) {
          alert("Preencha email e senha.");
          return;
        }
        var response = await fetch("/api/auth/sign-in", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload)
        });
        var res = await response.json();
        if (!res.ok) {
          alert("Erro: " + res.error.message);
          return;
        }
        accessToken = res.data.session.accessToken;
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        updateAuthStatus("Sessão ativa: " + payload.email);
      }

      function signOut() {
        accessToken = "";
        localStorage.removeItem(AUTH_TOKEN_KEY);
        updateAuthStatus("Sessão: não autenticado");
      }

      async function startCheckout(plan) {
        if (!accessToken) {
          alert("Entre com sua conta antes de assinar.");
          return;
        }
        var response = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
          },
          body: JSON.stringify({ plan: plan })
        });
        var res = await response.json();
        if (!res.ok) {
          alert("Erro: " + res.error.message);
          return;
        }
        if (!res.data.checkoutUrl) {
          alert("Checkout não disponível.");
          return;
        }
        window.location.href = res.data.checkoutUrl;
      }

      if (accessToken) {
        updateAuthStatus("Sessão ativa.");
      }
      void loadConfig();
    </script>
  </body>
</html>
`;

