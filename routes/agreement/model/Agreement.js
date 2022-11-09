const mongoose = require('../../../services/mongoose.service').mongoose;
const Schema = mongoose.Schema;


const agreementSchema = new Schema({
  agreementTitle: {
    type: String,
    required: true,
  },
  subsidiary: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  billingFrequency: {
    type: String,
    required: true,
  },
  paymentTerms: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  }
}, { timestamps: true });


agreementSchema.methods.toJSON = function () {
  const agreement = this;
  const agreementObject = agreement.toObject();

  delete agreementObject._id;
  delete agreementObject.__v;

  return agreementObject;
}


const Agreement = mongoose.model('agreements', agreementSchema);

exports.save = data => {
  const agreement = new Agreement(data);
  return agreement.save();
}