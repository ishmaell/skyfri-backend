const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8800;

// middleware for cookies
app.use(cookieParser());

// middleware for Cross Origin Resource sharing
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// built-in middleware for json
app.use(express.json());

// 404
app.use((_, res) => {
  res.status(404).send({ error: 'Invalid resource was requested' })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));