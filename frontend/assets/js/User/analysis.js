// analysis.js

window.initAnalysisPage = function() {
  // Only run if analysis page is present
  const main = document.querySelector('.analysis-main');
  if (!main) return;

  // Ensure Analyze tab is visible on load
  const analysisTab = document.getElementById('analysisTabContent');
  const aiChatTab = document.getElementById('aiChatTabContent');
  if (analysisTab) analysisTab.style.display = '';
  if (aiChatTab) aiChatTab.style.display = 'none';

  // Tab switching (UI only)
  document.querySelectorAll('.analysis-nav-btn').forEach(btn => {
    btn.onclick = function() {
      document.querySelectorAll('.analysis-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Tab switching logic
      const tab = btn.dataset.tab;
      const analysisTab = document.getElementById('analysisTabContent');
      const aiChatTab = document.getElementById('aiChatTabContent');
      if (tab === 'analyze') {
        if (analysisTab) analysisTab.style.display = '';
        if (aiChatTab) aiChatTab.style.display = 'none';
      } else if (tab === 'ai-chat') {
        if (analysisTab) analysisTab.style.display = 'none';
        if (aiChatTab) aiChatTab.style.display = '';
      }
    };
  });

  // Analyze button logic
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resultsEmpty = document.getElementById('analysisResultsEmpty');
  const resultsOutput = document.getElementById('analysisResultsOutput');
  const aiChatForm = document.querySelector('.ai-chat-input-row');
  const aiChatInput = document.querySelector('.ai-chat-input');
  const aiChatArea = document.querySelector('.ai-chat-area');
  const aiChatSendBtn = document.querySelector('.ai-chat-send-btn');
  // Create ChatGPT-style messages container if missing
  let chatMessages = aiChatArea ? aiChatArea.querySelector('.chat-messages') : null;
  if (aiChatArea && !chatMessages) {
    chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    aiChatArea.appendChild(chatMessages);
  }

  // --- Add temporary sample data on load ---
  if (resultsEmpty && resultsOutput) {
    resultsEmpty.style.display = 'none';
    resultsOutput.style.display = '';
    resultsOutput.innerHTML = `
      <div style="font-size:1.3rem;font-weight:700;">Spoilage Risk: <span style="color:#ffc107">Medium</span></div>
      <div>Food Type: <b>Meat</b></div>
      <div>Temp: <b>27.2°C</b> | Humidity: <b>72%</b> | Gas: <b>110</b></div>
      <div style="font-size:0.95rem;color:#6b7a99;">(Sample data - replace with your own analysis)</div>
    `;
  }

  if (analyzeBtn) {
    analyzeBtn.onclick = function() {
      // Get input values
      const foodType = document.getElementById('analysisProductType').value;
      const temp = parseFloat(document.getElementById('analysisTemp').value);
      const humidity = parseFloat(document.getElementById('analysisHumidity').value);
      const gas = parseFloat(document.getElementById('analysisGas').value);

      // Validate
      if (isNaN(temp) || isNaN(humidity) || isNaN(gas)) {
        resultsEmpty.style.display = '';
        resultsOutput.style.display = 'none';
        resultsEmpty.innerHTML = '<div style="color:#dc3545;font-weight:600;">Please enter all sensor values.</div>';
        return;
      }

      // Call backend AI analysis with skeleton loader
      resultsEmpty.style.display = 'none';
      resultsOutput.style.display = '';
      resultsOutput.innerHTML = `
        <div class="results-skeleton">
          <div class="skeleton-line" style="width: 40%"></div>
          <div class="skeleton-line" style="width: 75%"></div>
          <div class="skeleton-line" style="width: 65%"></div>
          <div class="skeleton-line" style="width: 55%"></div>
        </div>
      `;

      analyzeBtn.disabled = true;
      analyzeBtn.classList.add('is-loading');
      fetch('../../backend/api/User-api/ai-analyze.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodType, temp, humidity, gas })
      })
      .then(r => r.json())
      .then(data => {
        if (!data || !data.analysis) throw new Error(data && data.error ? data.error : 'Invalid response');
        const a = data.analysis;
        const risk = a.riskLevel || 'Unknown';
        const color = risk === 'High' ? '#dc3545' : (risk === 'Medium' ? '#ffc107' : '#28a745');
        const score = typeof a.riskScore !== 'undefined' ? ` (Score: ${a.riskScore})` : '';
        const shelf = a.estimatedShelfLifeHours ? `${a.estimatedShelfLifeHours}h` : '—';
        const factors = Array.isArray(a.keyFactors) ? a.keyFactors.map(f=>`<li>${escapeHtml(String(f))}</li>`).join('') : '';
        const recs = Array.isArray(a.recommendations) ? a.recommendations.map(f=>`<li>${escapeHtml(String(f))}</li>`).join('') : '';
        resultsOutput.innerHTML = `
          <div style="font-size:1.3rem;font-weight:700;">Spoilage Risk: <span style="color:${color}">${escapeHtml(risk)}</span>${score}</div>
          <div>Food Type: <b>${escapeHtml(foodType)}</b></div>
          <div>Temp: <b>${temp}°C</b> | Humidity: <b>${humidity}%</b> | Gas: <b>${gas}</b></div>
          ${a.summary ? `<div style=\"margin-top:8px;color:#dbe7ff;\">${escapeHtml(String(a.summary))}</div>` : ''}
          <div style="display:flex; gap:24px; margin-top:12px; width:100%;">
            <div style="flex:1;">
              <div style="font-weight:700;margin-bottom:6px;">Key Factors</div>
              <ul style="padding-left:18px; margin:0;">${factors}</ul>
            </div>
            <div style="flex:1;">
              <div style="font-weight:700;margin-bottom:6px;">Recommendations</div>
              <ul style="padding-left:18px; margin:0;">${recs}</ul>
            </div>
          </div>
          <div style="margin-top:10px;color:#9fb8ff;">Estimated Shelf Life: <b>${shelf}</b></div>
        `;
        resultsOutput.classList.add('ai-result-fade');
      })
      .catch(err => {
        resultsOutput.innerHTML = `<div style="color:#dc3545;font-weight:600;">AI analysis failed: ${escapeHtml(String(err.message || err))}</div>`;
      })
      .finally(() => {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('is-loading');
      });
    };
  }

  // AI Chat submit logic
  if (aiChatForm && aiChatInput && aiChatArea) {
    // Ensure form has no navigation side-effects
    aiChatForm.setAttribute('action', '');
    aiChatForm.setAttribute('novalidate', 'true');

    // Stop clicks inside the form from bubbling to SPA router (capture phase)
    aiChatForm.addEventListener('click', function(e){ e.stopPropagation(); }, true);

    // Prevent Enter key from causing navigation
    aiChatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        if (aiChatForm.requestSubmit) {
          aiChatForm.requestSubmit();
        } else {
          aiChatForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }
    });

    // Also intercept button click directly
    if (aiChatSendBtn) {
      aiChatSendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        if (aiChatForm.requestSubmit) {
          aiChatForm.requestSubmit();
        } else {
          aiChatForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      });
    }

    aiChatForm.onsubmit = async function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      const message = aiChatInput.value.trim();
      if (!message) return;

      // Capture current sensor inputs as context
      const foodTypeEl = document.getElementById('analysisProductType');
      const tempEl = document.getElementById('analysisTemp');
      const humidityEl = document.getElementById('analysisHumidity');
      const gasEl = document.getElementById('analysisGas');
      const context = {
        foodType: foodTypeEl ? foodTypeEl.value : '',
        temp: tempEl && tempEl.value !== '' ? parseFloat(tempEl.value) : '',
        humidity: humidityEl && humidityEl.value !== '' ? parseFloat(humidityEl.value) : '',
        gas: gasEl && gasEl.value !== '' ? parseFloat(gasEl.value) : ''
      };

      // Hide empty placeholder once chatting starts
      const empty = aiChatArea.querySelector('.ai-chat-empty');
      if (empty) empty.remove();

      // Append user message row (ChatGPT-style)
      const userRow = document.createElement('div');
      userRow.className = 'chat-message user';
      userRow.innerHTML = `
        <div class="chat-avatar"><img src="../../frontend/assets/images/user-icon.png" alt="You" /></div>
        <div class="message-bubble"><div class="message-content"></div></div>
      `;
      userRow.querySelector('.message-content').textContent = message;
      chatMessages.appendChild(userRow);
      aiChatArea.scrollTop = aiChatArea.scrollHeight;

      // Show loading row with typing dots and space for suggestion chips
      const loadingRow = document.createElement('div');
      loadingRow.className = 'chat-message bot';
      loadingRow.innerHTML = `
        <div class="chat-avatar"><img src="../../frontend/assets/images/bot-icon.png" alt="AI" /></div>
        <div class="message-bubble"><div class="message-content"><span class="typing-dots"><span></span><span></span><span></span></span><div class="quick-replies" style="display:none"></div></div></div>
      `;
      loadingRow.classList.add('typing');
      chatMessages.appendChild(loadingRow);
      aiChatArea.scrollTop = aiChatArea.scrollHeight;

      aiChatInput.value = '';
      aiChatInput.disabled = true;
      if (aiChatSendBtn) aiChatSendBtn.classList.add('is-loading');

      try {
        const res = await fetch('../../backend/api/User-api/ai-chat.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, context })
        });
        const data = await res.json();
        loadingRow.remove();
        const text = data && data.reply ? data.reply : (data && data.error ? `Error: ${data.error}` : 'No response');
        const botRow = document.createElement('div');
        botRow.className = 'chat-message bot';
        botRow.innerHTML = `
          <div class="chat-avatar"><img src="../../frontend/assets/images/bot-icon.png" alt="AI" /></div>
          <div class="message-bubble"><div class="message-content"></div></div>
        `;
        const content = botRow.querySelector('.message-content');
        await typeText(content, String(text));
        // Add suggestion chips based on response
        const suggestions = getSuggestions(String(text));
        if (suggestions.length) {
          const chips = document.createElement('div');
          chips.className = 'quick-replies';
          suggestions.forEach(s => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'quick-reply';
            chip.textContent = s;
            chip.addEventListener('click', () => {
              aiChatInput.value = s;
              if (aiChatForm.requestSubmit) aiChatForm.requestSubmit();
              else aiChatForm.dispatchEvent(new Event('submit', { cancelable: true }));
            });
            chips.appendChild(chip);
          });
          content.parentElement.appendChild(chips);
        }
        chatMessages.appendChild(botRow);
        aiChatArea.scrollTop = aiChatArea.scrollHeight;
      } catch (err) {
        loadingRow.remove();
        const errRow = document.createElement('div');
        errRow.className = 'chat-message bot';
        errRow.innerHTML = `
          <div class="chat-avatar"><img src="../../frontend/assets/images/bot-icon.png" alt="AI" /></div>
          <div class="message-bubble"><div class="message-content">Request failed</div></div>
        `;
        chatMessages.appendChild(errRow);
        aiChatArea.scrollTop = aiChatArea.scrollHeight;
      }
      aiChatInput.disabled = false;
      if (aiChatSendBtn) aiChatSendBtn.classList.remove('is-loading');
    };
  }
};

// Auto-initialize if loaded on a full page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initAnalysisPage);
} else {
  window.initAnalysisPage();
} 

// Typewriter effect to simulate streaming
async function typeText(targetEl, fullText) {
  const text = String(fullText);
  const chars = Array.from(text);
  targetEl.textContent = '';
  const step = 3;
  for (let i = 0; i < chars.length; i += step) {
    targetEl.textContent += chars.slice(i, i + step).join('');
    // small delay for smoothness
    await new Promise(r => setTimeout(r, 12));
  }
}

// Basic suggestion generator using simple heuristics
function getSuggestions(replyText) {
  const suggestions = [];
  const lowers = replyText.toLowerCase();
  if (lowers.includes('temperature')) suggestions.push('What temperature is safe?');
  if (lowers.includes('humidity')) suggestions.push('What humidity should I keep?');
  if (lowers.includes('gas') || lowers.includes('ethylene')) suggestions.push('What does high gas level mean?');
  if (!suggestions.length) suggestions.push('Give me actionable steps');
  return suggestions.slice(0, 4);
}

// Escape HTML helper for safe injection
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}