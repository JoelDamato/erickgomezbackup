const Message = require('../models/message'); // Importa el modelo

const notionController = (app) => {
  // Endpoint para buscar información en MongoDB basado en el número de teléfono
  app.get('/fetch', async (req, res) => {
    console.log('Solicitud recibida para obtener datos desde MongoDB');

    const phoneNumber = req.query.phoneNumber;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'El número de teléfono es requerido' });
    }

    try {
      // Construye la expresión regular de manera segura
      const regexPhoneNumber = new RegExp(phoneNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

      // Buscar en MongoDB donde "chatSession" coincide con el número de teléfono proporcionado
      const results = await Message.find({ chatSession: regexPhoneNumber });

      console.log('Total de datos encontrados:', results.length);

      // Retornar los resultados o enviar un error si no hay coincidencias
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron datos para el número de teléfono proporcionado' });
      }
    } catch (error) {
      console.error('Error al buscar en MongoDB:', error.message);
      res.status(500).json({ error: 'Error al procesar la solicitud: ' + error.message });
    }
  });
};

module.exports = notionController;
