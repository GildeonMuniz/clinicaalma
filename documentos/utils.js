function extractJSONFromText(text) {
  const jsonRegex = /```(?:json)?([\s\S]*?)```|(\{[\s\S]*\})/;
  const match = text.match(jsonRegex);
  if (!match) return null;
  const jsonString = match[1] || match[2];
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Erro ao parsear JSON:", e);
    return null;
  }
}

module.exports = { extractJSONFromText };