import { Schema, model, Document } from "mongoose";

export interface ISitterPreferences extends Document {
    UserID?: string,
    minAge?: number,
    licenseRequired: boolean,
    minGPA: number,
    genderPreferred: string,
    canTransportSitter: boolean,
    
}

const SitterQualificationsSchema: Schema = new Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    minAge: {
        type: Number
    },
    licenseRequired: {
        type: Boolean
    },
    minGPA: {
        type: Number
    },
    genderPreferred: {
        type: String
    },
    canTransportSitter: {
        type: Boolean
    },
    },
    {
        timestamps: true
    }
)

export default model <ISitterPreferences>("SitterPreferences", SitterQualificationsSchema);