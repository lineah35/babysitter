import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    firstName?: string, //? indicates that it is an optional prop. If required, error. Otherwise no error.
    lastName?: string,
    role?: string
    dateOfBirth?: Date,
    gender?: string,
    homeAddress?: string,
    city?: string,
    zipCode?: number,
    email?: string,
    cellPhone?: number,
    password?: string
}

const userSchema: Schema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }, 
    role: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String
    },
    homeAddress: {
        type: String
    },
    city: {
        type: String
    },
    zipCode: {
        type: Number
    },
    email: {
        type: String
    },
    cellPhone: {
        type: Number
    }, 
    password: {         //retype pw is for validation on front end
        type: String
    }

},
{
    timestamps: true
})

export default model <IUser>("Users", userSchema); //Users in string is the model name



