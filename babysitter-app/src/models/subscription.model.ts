import { Schema, model, Document } from "mongoose";

export interface iSubscriptionDetails extends Document {
    planType?: string,
    UserID?: string,
    stripeCustomerID?: string,
    subscriptionID?: string,
    cardNumber?: String,
    expiryMonth?: number,
    expiryYear?: number,
    cvc?: number,
    date?: Date,
    currency?: string,
}

const SubscriptionDetailsSchema: Schema = new Schema ({
    planType: {
        type: String
    },
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    stripeCustomerID: {
        type: String,
    },
    subscriptionID: {
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
   date: {
    type: Date
   }, 
   currency: {
    type: String
   }
},
{
    timestamps: true
}
)

export default model <iSubscriptionDetails> ("SubscriptionDetails", SubscriptionDetailsSchema);