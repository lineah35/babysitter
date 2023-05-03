import { Schema, model, Document} from 'mongoose';

export interface IOneTimePayment extends Document {
    UserID?: string,
    stripeCustomerID?: string,
    paymentMethodID?: string,
    paymentIntentID?: string,
    amount?: string,
    date?: Date
}

const OneTimePaymentSchema: Schema = new Schema ({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    stripeCustomerID: {
        type: String,
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
    }
}, 
{
    timestamps: true
})

export default model <IOneTimePayment> ("OneTimePayment", OneTimePaymentSchema);