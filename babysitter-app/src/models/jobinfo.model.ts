import { Schema, model, Document } from "mongoose";

export interface IJobInfo extends Document {
    UserID?: string,
    babysittingAddress?: string,
    city?: string,
    zipCode?: number,
    startDate?: Date,
    endDate?: Date,
    startTime?: string, //?
    endTime?: string,
    kids?: [{
        gender: string,
        age: number
    }]
}

const JobInfoSchema: Schema = new Schema ({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    babysittingAddress: {
        type: String
    },
    city: {
        type: String
    },
    zipCode: {
        type: Number
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    kids: {
        type: Array
    },
},
{
    timestamps: true
})

export default model <IJobInfo>("JobInformation", JobInfoSchema);
