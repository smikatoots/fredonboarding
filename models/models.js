var connect = process.env.MONGODB_URI;
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UsersSchema = schema({
    username: {
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
    primaryCity: {
        type: String
    },
    primaryProvince: {
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
    primaryOccupation: {
        type: String
    },
    primaryEmploymentStatus: {
        type: String
    },
    primaryEmployer: {
        type: String
    },
    primaryNatureOfBusiness: {
        type: String
    },
    primaryBusinessContact: {
        type: String
    },
    primaryBusinessNumberAndStreet: {
        type: String
    },
    primaryBusinessSubdivision: {
        type: String
    },
    primaryBusinessCity: {
        type: String
    },
    primaryBusinessProvince: {
        type: String
    },
    primaryBusinessZipcode: {
        type: String
    },
    primaryBusinessTownAndDistrict: {
        type: String
    },
    primaryBusinessCountry: {
        type: String
    },
    primaryPreferredAddress: {
        type: String
    },
})

var User = mongoose.model('User', UsersSchema);

module.exports = {
    User
}
