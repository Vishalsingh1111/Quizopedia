export default function extractAndParseJSON(text) {
    try {
        let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        const jsonStart = cleanText.indexOf('[');
        const jsonEnd = cleanText.lastIndexOf(']');

        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error('No valid JSON array found');
        }

        const jsonString = cleanText.slice(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);

        if (!Array.isArray(parsed)) throw new Error('Response is not an array');

        parsed.forEach((item, index) => {
            if (!item.question || !item.options || !item.answer) {
                throw new Error(`Invalid structure at index ${index}`);
            }
            if (!Array.isArray(item.options) || item.options.length < 2) {
                throw new Error(`Invalid options array at index ${index}`);
            }
            if (!item.options.includes(item.answer)) {
                throw new Error(`Answer not found at index ${index}`);
            }
        });

        return parsed;
    } catch (error) {
        console.error("JSON parsing error:", error);
        throw new Error('Failed to parse AI response: ' + error.message);
    }
}
