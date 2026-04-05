export default async function handler(req, res) {
    // Solo permitimos peticiones POST
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    // Recibimos la pregunta y la personalidad de Lavoisier que envía tu web
    const { prompt, systemMsg } = req.body;
    
    // Aquí es donde Vercel inyectará tu clave secreta
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ text: "¡El servidor no tiene la clave API configurada!" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemMsg }] }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        const textoIA = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento ciudadano, mi pluma se ha quedado sin tinta.";
        
        // Devolvemos la respuesta a tu página web
        res.status(200).json({ text: textoIA });
    } catch (error) {
        res.status(500).json({ text: "Hubo un error de conexión con la academia de ciencias." });
    }
}