<?php
// SafeBite - AI Spoilage Analysis Endpoint (Gemini)
// POST JSON: { foodType: string, temp: number, humidity: number, gas: number }

require_once __DIR__ . '/../../config/auth.php';

Auth::setCORSHeaders();

// Load Gemini API key (env or config file fallback)
$geminiApiKey = getenv('GEMINI_API_KEY');
if (!$geminiApiKey) {
    $configPath = __DIR__ . '/../../config/gemini.php';
    if (file_exists($configPath)) {
        require_once $configPath;
        if (isset($GEMINI_API_KEY) && !empty($GEMINI_API_KEY)) {
            $geminiApiKey = $GEMINI_API_KEY;
        }
    }
}

if (!$geminiApiKey) {
    Auth::sendResponse([
        'error' => 'Gemini API key is not configured. Set GEMINI_API_KEY or backend/config/gemini.php.'
    ], 500);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    Auth::sendResponse(['error' => 'Invalid JSON body'], 400);
}

$foodType = isset($data['foodType']) ? trim((string)$data['foodType']) : '';
$temp = isset($data['temp']) ? floatval($data['temp']) : null;
$humidity = isset($data['humidity']) ? floatval($data['humidity']) : null;
$gas = isset($data['gas']) ? floatval($data['gas']) : null;

if ($foodType === '' || $temp === null || $humidity === null || $gas === null) {
    Auth::sendResponse(['error' => 'Missing required fields: foodType, temp, humidity, gas'], 400);
}

$systemInstruction = 'You are an AI food spoilage risk analyst for a sensor-driven monitoring system. '
  . 'Given food type and current sensor readings (temperature in °C, humidity in %, and gas level from a VOC sensor), '
  . 'assess spoilage risk and return a concise JSON object only. '
  . 'Use food-safety knowledge and typical thresholds for different food categories. '
  . 'If uncertain, make a best-effort estimate based on comparable foods. Keep reasoning concise.';

// Request structured JSON output
$schema = [
  'riskLevel' => 'Low|Medium|High',
  'riskScore' => '0-100 integer where 100 = highest risk',
  'summary' => '1-2 sentence overview of risk',
  'keyFactors' => ['list of the most important contributing factors'],
  'recommendations' => ['list of short actionable steps'],
  'estimatedShelfLifeHours' => 'approx remaining safe hours, integer',
  'notes' => 'any caveats or assumptions'
];

$model = 'gemini-1.5-flash';
$url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent?key=' . urlencode($geminiApiKey);

$userPrompt = [
  'Food Type: ' . $foodType,
  'Temperature (°C): ' . $temp,
  'Humidity (%): ' . $humidity,
  'Gas Level: ' . $gas,
  '',
  'Return ONLY valid JSON matching this structure (no markdown, no extra text):',
  json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
];

$payload = [
  'contents' => [[
    'role' => 'user',
    'parts' => [[ 'text' => $systemInstruction . "\n\n" . implode("\n", $userPrompt) ]]
  ]],
  'generationConfig' => [
    'temperature' => 0.4,
    'topP' => 0.9,
    'maxOutputTokens' => 512,
    'response_mime_type' => 'application/json'
  ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [ 'Content-Type: application/json' ]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
$resp = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$cerr = curl_error($ch);
curl_close($ch);

if ($resp === false) {
  Auth::sendResponse(['error' => 'Curl error: ' . $cerr], 500);
}

$json = json_decode($resp, true);
if ($http >= 400) {
  Auth::sendResponse(['error' => 'Gemini API error', 'status' => $http, 'details' => $json], $http);
}

// Extract text
$text = '';
if (isset($json['candidates'][0]['content']['parts'][0]['text'])) {
  $text = $json['candidates'][0]['content']['parts'][0]['text'];
} elseif (isset($json['candidates'][0]['content']['parts'])) {
  foreach ($json['candidates'][0]['content']['parts'] as $p) {
    if (isset($p['text'])) { $text .= $p['text']; }
  }
}

// Try to decode as JSON
$analysis = json_decode($text, true);
if ($analysis === null) {
  // Fallback: try to find a JSON block
  if (preg_match('/\{[\s\S]*\}/', $text, $m)) {
    $analysis = json_decode($m[0], true);
  }
}

if (!is_array($analysis)) {
  Auth::sendResponse(['error' => 'Model did not return valid JSON', 'raw' => $text], 500);
}

Auth::sendResponse(['analysis' => $analysis]);

?>


