const mongoose=require("mongoose")

const userOnboardingSchema=mongoose.Schema({
    name: {
        type: String,
      },
      mobile: {
        type: Number,
      },
      mobileMake: String,
      mobileModel: String,
      imeiNumber: String,
      reference: String,
      issue: String,
      priceQuoted: Number,
      advancePay: Number,
      registeredDate:Date,
      expectedDeliveryDate: Date,
      comments: String
})

const UserOnboarding = mongoose.model('UserOnboarding', userOnboardingSchema);

module.exports = UserOnboarding;