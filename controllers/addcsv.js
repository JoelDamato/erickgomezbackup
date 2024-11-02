const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const multer = require('multer');
const Message = require('../models/message');

// Configuración de multer para manejar archivos temporales
const upload = multer({ dest: 'uploads/' });

const notionController = (app) => {
  app.post('/upload-csv', upload.single('csvFile'), async (req, res) => {
    console.log('Solicitud recibida para cargar datos del CSV a MongoDB');

    try {
      const csvFilePath = req.file.path;
      const parser = fs.createReadStream(csvFilePath).pipe(parse({ columns: true }));
      const rows = [];
      const BATCH_SIZE = 1000; // Ajusta el tamaño del lote según el rendimiento

      parser.on('data', (row) => {
        rows.push({
          chatSession: row['Chat Session'] || '',
          messageDate: row['Message Date'] || '',
          sentDate: row['Sent Date'] || '',
          type: row['Type'] || '',
          senderId: row['Sender ID'] || '',
          senderName: row['Sender Name'] || '',
          status: row['Status'] || '',
          replyingTo: row['Replying to'] || '',
          text: row['Text'] || ''
        });
      });

      parser.on('end', async () => {
        console.log('Archivo CSV leído, procesando e insertando en MongoDB...');
        let count = 0;

        // Procesar en lotes de BATCH_SIZE para optimizar la inserción
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
          const batch = rows.slice(i, i + BATCH_SIZE);
          try {
            await Message.insertMany(batch); // Inserción masiva del lote actual
            count += batch.length;
            console.log(`Lote insertado. Total insertado: ${count}/${rows.length}`);
          } catch (error) {
            console.error('Error al insertar el lote:', error.message);
          }
        }

        fs.unlinkSync(csvFilePath); // Elimina el archivo temporal
        console.log('Carga de datos completada con éxito');
        res.status(200).json({ message: 'Datos cargados a MongoDB con éxito', filasGuardadas: count });
      });

      parser.on('error', (error) => {
        console.error('Error al leer el archivo CSV:', error.message);
        res.status(500).json({ error: 'Error al leer el archivo CSV: ' + error.message });
      });
    } catch (error) {
      console.error('Error general:', error.message);
      res.status(500).json({ error: 'Error al procesar la solicitud: ' + error.message });
    }
  });
};

module.exports = notionController;
