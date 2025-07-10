const express = require('express');
const mapsRoutes = require('./routes/mapsRoutes');
require('./config/redis'); // Initialize Redis client

const app = express();
const port = process.env.PORT || 3000;

app.use('/', mapsRoutes);

app.listen(port, () => {
    console.log(`Maps Service listening at http://localhost:${port}`);
});