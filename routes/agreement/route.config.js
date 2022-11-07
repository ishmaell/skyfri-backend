const AgreementController = require('./controllers/agreement.controller');

exports.routesConfig = function (app) {
  app.post('/save-agreement', [AgreementController.saveAgreement]);
} 