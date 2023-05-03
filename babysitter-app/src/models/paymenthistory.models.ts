import { Schema, model, Document } from 'mongoose';

export interface IPaymentHistory extends Document {
    UserID?: string,
    stripeCustomerID?: string,
    paymentMethodID?: string,
    paymentIntentID?: string,
    amount?: string,
    date?: Date,
    name?: string,
    phone?: number,
    email?: string,
    cardNumber?: String,
    expiryMonth?: number,
    expiryYear?: number,
    cvc?: number,
    currency?: string,
    subscriptionID: string
}

const PaymentHistorySchema: Schema = new Schema ({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    stripeCustomerID: {
        type: String
    },
    paymentMethodID: {
        type: String
    },
    paymentIntentID: {
        type: String
    },
    amount: {
        type: String
    },
    date: {
        type: Date
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
    currency: {
        type: String
    },
    subscriptionID: {
        type: String
    }
},
{
    timestamps: true
}
)

export default model <IPaymentHistory> ("PaymentHistory", PaymentHistorySchema);