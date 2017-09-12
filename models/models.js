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
    primaryTelephone: {
        type: String
    },
    primaryMobile: {
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


    secondaryFirstName: {
        type: String
    },
    secondaryMiddleName: {
        type: String
    },
    secondaryLastName: {
        type: String
    },
    secondaryTin: {
        type: String
    },
    secondarySSS: {
        type: String
    },
    secondaryGender: {
        type: String
    },
    secondaryDateOfBirth: {
        type: String
    },
    secondaryCivilStatus: {
        type: String
    },
    secondaryNumberAndStreet: {
        type: String
    },
    secondarySubdivision: {
        type: String
    },
    secondaryCity: {
        type: String
    },
    secondaryProvince: {
        type: String
    },
    secondaryZipcode: {
        type: String
    },
    secondaryTownAndDistrict: {
        type: String
    },
    secondaryTelephone: {
        type: String
    },
    secondaryMobile: {
        type: String
    },
    secondaryBirthCountry: {
        type: String
    },
    secondaryResidenceCountry: {
        type: String
    },
    secondaryCitizenshipCountry: {
        type: String
    },
    secondaryOccupation: {
        type: String
    },
    secondaryEmploymentStatus: {
        type: String
    },
    secondaryEmployer: {
        type: String
    },
    secondaryNatureOfBusiness: {
        type: String
    },
    secondaryBusinessContact: {
        type: String
    },
    secondaryBusinessNumberAndStreet: {
        type: String
    },
    secondaryBusinessSubdivision: {
        type: String
    },
    secondaryBusinessCity: {
        type: String
    },
    secondaryBusinessProvince: {
        type: String
    },
    secondaryBusinessZipcode: {
        type: String
    },
    secondaryBusinessTownAndDistrict: {
        type: String
    },
    secondaryBusinessCountry: {
        type: String
    },
    secondaryEmail: {
        type: String
    },

})

var User = mongoose.model('User', UsersSchema);

module.exports = {
    User
}
