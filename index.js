// src/index.js
const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const connectDB = require('./config/db');
const notionController = require('./controllers/addcsv.js'); // Controlador actualizado
const getUniquePhoneNumbersController = require('./controllers/gettotal.js');
const get = require('./controllers/get.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Habilita CORS para todas las solicitudes

// Conexión a MongoDB
connectDB();

// Configurar rutas
notionController(app);
getUniquePhoneNumbersController(app); // Rutas para obtener números de teléfono únicos
get(app);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
