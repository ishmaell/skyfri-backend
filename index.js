const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 9005;

// routers
const AgreementRouter = require('./routes/agreement/route.config');
const UserRouter = require('./routes/user/route.config');

// middleware for cookies
app.use(cookieParser());

// handle options credentials check - before CORS and fetch cookies credentials requirement
app.use(credentials);

// middleware for Cross Origin Resource sharing
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// built-in middleware for json
app.use(express.json());

// route config
AgreementRouter.routesConfig(app);
UserRouter.routesConfig(app);

// 404
app.use((_, res) => {
  res.status(404).send({ error: 'Invalid resource was requested' })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));