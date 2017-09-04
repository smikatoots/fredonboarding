var connect = process.env.MONGODB_URI;
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UsersSchema = schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    primaryFirstName: {
        type: String
    },
    primaryMiddleName: {
        type: String
    },
    primaryLastName: {
        type: String
    },
    primaryTin: {
        type: String
    },
    primarySSS: {
        type: String
    },
    primaryGender: {
        type: String
    },
    primaryDateOfBirth: {
        type: String
    },
    primaryCivilStatus: {
        type: String
    },
    primaryNumberAndStreet: {
        type: String
    },
    primarySubdivision: {
        type: String
    },
    primaryCityAndProvince: {
        type: String
    },
    primaryZipcode: {
        type: String
    },
    primaryTownAndDistrict: {
        type: String
    },
    primaryContact: {
        type: String
    },
    primaryBirthCountry: {
        type: String
    },
    primaryResidenceCountry: {
        type: String
    },
    primaryCitizenshipCountry: {
        type: String
    },
})

var User = mongoose.model('User', UsersSchema);

module.exports = {
    User
}
