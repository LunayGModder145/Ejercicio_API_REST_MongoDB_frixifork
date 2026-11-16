require('dotenv').config();
const express = require('express');
const cowsay = require('cowsay');
require('./config/db_mongo'); // Conexion con MongoDB

// Middlewares
const morgan = require('./middlewares/morgan.js');
const error404 = require('./middlewares/error404.js'); 

// Rutas
const providerRoutes = require('./routes/providers.routes.js');
const productsRoutes = require('./routes/products.routes.js')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Para leer el body en formato JSON
app.use(morgan(':method :host :url :status :param[id] - :response-time ms :body'));

// Ruta raíz de prueba
app.get('/', (req, res) => {
    res.status(200).json({ message: 'MongoDB y Mongoose funcionando correctamente' });
});

// Endpoints de la API
app.use('/api/providers', providerRoutes);
app.use('/api/products', productsRoutes);

// Middleware para rutas no encontradas (404)
app.use(error404);

app.listen(port, () => {
    console.log(
        cowsay.say({
            text: `Servidor funcionando en http://localhost:${port}`,
            e: "oO",
            T: "U "
        })
    );
});