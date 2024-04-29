const express = require('express');
const morgan = require('morgan');

const app = express();

// Middelware - morgan
app.use(morgan('combined'));
app.use(express.json());

// Server config - express
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Server init - express
const server = app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});


// routes
app.use('/blockchain', require('./src/routes/blockchain/routes'));
app.use('/dag', require('./src/routes/dag/routes'));