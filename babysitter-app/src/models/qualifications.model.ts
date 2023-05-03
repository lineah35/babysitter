import mongoose, { Schema, model, Document } from 'mongoose';

export interface IBSQualifications extends Document{
    UserID?: string,
    babySittingTraining?: boolean,
    firstAidTraining?: boolean,
    howGetToBabySitting?: string,
    hasDrivingLicense?: boolean,
    unweightedGpa?: string,
    travelTobabysit?: string,
    chargeForOneKid?: string,
    chargeForAdditionalKid?: string,
    parentFirstName?: string,
    parentLastName?: string,
    parentEmail?: string,
    parentPhoneNo?: number,
}

const BSQualificationsSchema: Schema = new Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    babySittingTraining: {
        type: Boolean
    },
    firstAidTraining: {
        type: Boolean
    },
    howGetToBabySitting: {
        type: String
    },
    hasDrivingLicense: {
        type: Boolean
    },
    unweightedGpa: {
        type: String
    },
    travelTobabysit: {
        type: String
    },
    chargeForOneKid: {
        type: String
    },
    chargeForAdditionalKid: {
        type: String
    },
    parentFirstName: {
        type: String
    },
    parentLastName: {
        type: String
    },
    parentEmail: {
        type: String
    },
    parentPhoneNo: {
        type: Number
    },

},
{
    timestamps: true
})

export default model <IBSQualifications>("Qualifications", BSQualificationsSchema);