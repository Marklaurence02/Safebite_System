<?php
// SafeBite - AI Chat Endpoint (Gemini)
// POST JSON: { message: string, context?: { foodType?: string, temp?: number, humidity?: number, gas?: number } }

require_once __DIR__ . '/../../config/auth.php';

// CORS and JSON headers
Auth::setCORSHeaders();

// Load Gemini API key
$geminiApiKey = getenv('GEMINI_API_KEY');
if (!$geminiApiKey) {
    // Fallback to config file
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
        'error' => 'Gemini API key is not configured. Set the GEMINI_API_KEY environment variable or add it to backend/config/gemini.php as $GEMINI_API_KEY.'
    ], 500);
}

// Read JSON body
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !isset($data['message']) || trim($data['message']) === '') {
    Auth::sendResponse(['error' => 'Missing message'], 400);
}

$userMessage = trim($data['message']);
$context = isset($data['context']) && is_array($data['context']) ? $data['context'] : [];

// Build context string
$contextParts = [];
if (isset($context['foodType']) && $context['foodType'] !== '') {
    $contextParts[] = 'Food Type: ' . $context['foodType'];
}
if (isset($context['temp']) && $context['temp'] !== '') {
    $contextParts[] = 'Temperature (°C): ' . $context['temp'];
}
if (isset($context['humidity']) && $context['humidity'] !== '') {
    $contextParts[] = 'Humidity (%): ' . $context['humidity'];
}
if (isset($context['gas']) && $context['gas'] !== '') {
    $contextParts[] = 'Gas Level: ' . $context['gas'];
}
$contextString = count($contextParts) ? ("Current sensor data -> " . implode(' | ', $contextParts)) : '';

// System instruction to steer the model
$systemInstruction = 'You are an AI assistant for a spoilage monitoring system. '
    . 'Your allowed scope: food safety, spoilage risks, storage, handling, shelf-life, hygiene, sensor data interpretation (temperature, humidity, gas/VOC). '
    . 'If a request is out of scope (math, general knowledge, unrelated advice), respond with: "Sorry, I can only help with food spoilage and sensor analysis. Try asking about temperature, humidity, gas levels, storage, or shelf-life." Do not provide an out-of-scope answer. '
    . 'Use the provided sensor data context when relevant. Be concise (<=6 sentences), practical, and actionable. '
    . 'Answer in the same language as the user message. If the user uses inappropriate language, reply: "Sorry, I cannot answer that."';

// Gemini endpoint and payload (v1beta generateContent)
$model = 'gemini-1.5-flash';
$url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent?key=' . urlencode($geminiApiKey);

$promptParts = [];
if ($contextString !== '') {
    $promptParts[] = $contextString;
}
$promptParts[] = 'User: ' . $userMessage;
$fullPrompt = implode("\n\n", $promptParts);

$payload = [
    'contents' => [[
        'role' => 'user',
        'parts' => [[ 'text' => $systemInstruction . "\n\n" . $fullPrompt ]]
    ]],
    'generationConfig' => [
        'temperature' => 0.7,
        'topK' => 40,
        'topP' => 0.95,
        'maxOutputTokens' => 512
    ]
];

// Make the HTTP request
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($response === false) {
    Auth::sendResponse(['error' => 'Request failed: ' . $curlErr], 500);
}

$json = json_decode($response, true);
if ($httpCode >= 400) {
    Auth::sendResponse([
        'error' => 'Gemini API error',
        'status' => $httpCode,
        'details' => $json
    ], $httpCode);
}

// Parse reply text from candidates
$replyText = '';
if (isset($json['candidates'][0]['content']['parts'])) {
    $parts = $json['candidates'][0]['content']['parts'];
    foreach ($parts as $part) {
        if (isset($part['text'])) {
            $replyText .= $part['text'];
        }
    }
}

if (trim($replyText) === '') {
    $replyText = 'Sorry, I could not generate a response.';
}

Auth::sendResponse([
    'reply' => $replyText,
    'raw' => $json
]);

?>


