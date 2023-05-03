import { Schema, model, Document } from "mongoose";

export interface IStripeCustomerInfo extends Document {
    UserID?: string,
    stripeCustomerID?: string
    name?: string,
    phone?: number,
    email?: string,
    cardNumber?: string,
    expiryMonth?: number,
    expiryYear?: number,
    cvc?: number,
    amount?: string,
    currency?: string
}

const StripeCustomerSchema: Schema = new Schema ({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    stripeCustomerID: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: Number
    },
    email: {
        type: String
    },
    cardNumber: {
        type: String
    },
    expiryMonth: {
        type: Number
    },
    expiryYear: {
        type: Number
    },
    cvc: {
        type: Number
    },
    amount: {
        type: String
    },
    currency: {
        type: String
    }
},
    {
        timestamps: true
})

export default model <IStripeCustomerInfo>("StripeCustomer", StripeCustomerSchema);