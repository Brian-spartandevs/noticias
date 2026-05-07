export default async function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { categoria } = req.query;

        if (!categoria) {
            return res.status(400).json({ error: 'Parámetro "categoria" requerido' });
        }

        const apiKey = process.env.NEWS_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API key no configurada' });
        }

        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(categoria)}&language=es&apiKey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || 'Error al obtener noticias'
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error en /api/noticias:', error);
        return res.status(500).json({ 
            error: 'Error al procesar la solicitud',
            message: error.message 
        });
    }
}
