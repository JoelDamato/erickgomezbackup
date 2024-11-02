const Message = require('../models/message'); // Importa el modelo

const getUniquePhoneNumbersController = (app) => {
  // Endpoint para obtener los números de teléfono únicos desde MongoDB
  app.get('/unique-phone-numbers', async (req, res) => {
    console.log('Solicitud recibida para obtener números de teléfono únicos desde MongoDB');

    try {
      // Inicia el contador de tiempo
      console.time('Tiempo de procesamiento desde MongoDB');

      // Obtener los números de teléfono únicos usando "distinct"
      const uniquePhoneNumbers = await Message.distinct('chatSession');

      // Fin del contador de tiempo
      console.timeEnd('Tiempo de procesamiento desde MongoDB');
      console.log('Total de números de teléfono únicos encontrados:', uniquePhoneNumbers.length);

      // Retornar los números de teléfono únicos
      res.status(200).json({ uniquePhoneNumbers });
    } catch (error) {
      console.error('Error al obtener números de teléfono únicos desde MongoDB:', error.message);
      res.status(500).json({ error: 'Error al procesar la solicitud: ' + error.message });
    }
  });
};

module.exports = getUniquePhoneNumbersController;
