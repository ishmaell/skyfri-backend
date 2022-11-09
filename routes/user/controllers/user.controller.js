const mongoose = require('../../../services/mongoose.service').mongoose;
const UserModel = require('../model/User');


const jwt = require('jsonwebtoken');


const insert = async (req, res) => {
  try {
    const { _id, fullName, username, email } = await UserModel.insert(req.body);

    // create JWT
    const accessToken = jwt.sign(
      { "email": email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
      { "email": email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '50m' }
    );
    await UserModel.updateRefreshToken({ _id, refreshToken });
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(201).json({ fullName, username, email, accessToken });

  } catch (error) {
    let errorMessage = error.message;
    if (error instanceof mongoose.Document.ValidationError) {
      errorMessage = (error.message.split(":")[2]).trim();
      res.status(403).send({ error: errorMessage });
    } else {
      res.status(500).send({ error: errorMessage });
    }
  }
}

const findByCredentials = async (req, res) => {
  try {
    const { _id, fullName, username, email } = await UserModel.findByCredentials(req.body.email, req.body.password);

    // create JWT
    const accessToken = jwt.sign(
      { "email": email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
      { "email": email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '50m' }
    );
    await UserModel.updateRefreshToken({ _id, refreshToken });
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ fullName, username, email, accessToken });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
}


const refresh = async (req, res) => {

  const cookies = req.cookies;
  if (!cookies.jwt) return res.sendStatus(401); // unathorized
  const refreshToken = cookies.jwt;


  const foundUser = await UserModel.findByRefreshToken({ refreshToken });

  if (!foundUser) return res.sendStatus(403); // forbidden

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { "email": decoded.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
      );
      res.status(200).json({ accessToken })
    }
  );
}

module.exports = {
  insert,
  findByCredentials,
  refresh
}