const AgreementModel = require('../model/Agreement');

const saveAgreement = async (req, res) => {

  try {
    const result = await AgreementModel.save(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  saveAgreement
}