const UserModel = require('../model/User');

exports.signUpHasValidFields = (req, res, next) => {

  let errors = {};

  if (req.body) {

    if (!req.body.fullName) {
      errors['fullName'] = 'Full name is required';
    }

    if (!req.body.username) {
      errors['username'] = 'Username is required';
    }

    if (!req.body.email) {
      errors['email'] = 'Email is required';
    }

    if (!req.body.password) {
      errors['password'] = 'Password is required';
    }

    if (Object.keys(errors).length) {
      return res.status(400).send({ errors: errors });
    } else {
      return next();
    }
  }
}

exports.checkIfUsernameExist = async (req, res, next) => {

  const username = req.body.username;

  try {

    const response = await UserModel.findByUsername(username);

    if (response) {
      const result = response.username;

      if (username === result) {
        let error = 'This username has already been taken';
        return res.status(409).send({ error: error });
      }
    } else {
      next();
    }

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

exports.checkIfEmailExist = async (req, res, next) => {

  const userEmail = req.body.email;

  try {

    const response = await UserModel.findByEmail(userEmail);

    if (response) {
      const email = response.email;

      if (userEmail === email) {
        let error = 'This email has already been used';
        return res.status(409).send({ error: error });
      }
    } else {
      next();
    }

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}