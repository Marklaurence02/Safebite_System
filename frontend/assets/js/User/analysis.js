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

      // Fake AI result logic
      let risk = 'Low';
      let color = '#28a745';
      if (temp > 30 || humidity > 80 || gas > 150) {
        risk = 'High';
        color = '#dc3545';
      } else if (temp > 25 || humidity > 70 || gas > 100) {
        risk = 'Medium';
        color = '#ffc107';
      }

      resultsEmpty.style.display = 'none';
      resultsOutput.style.display = '';
      resultsOutput.innerHTML = `
        <div style="font-size:1.3rem;font-weight:700;">Spoilage Risk: <span style="color:${color}">${risk}</span></div>
        <div>Food Type: <b>${foodType}</b></div>
        <div>Temp: <b>${temp}°C</b> | Humidity: <b>${humidity}%</b> | Gas: <b>${gas}</b></div>
        <div style="font-size:0.95rem;color:#6b7a99;">(AI-powered result - demo)</div>
      `;
    };
  }
};

// Auto-initialize if loaded on a full page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initAnalysisPage);
} else {
  window.initAnalysisPage();
} 