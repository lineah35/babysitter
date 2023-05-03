import { RequestHandler } from "express";
const stripe = require("stripe")(
  "sk_test_51Mk8jgJzU7tia8TKcgfdnWuJ0qlGOnbFMqXoGGxs3hfcyXaumPG84OoIQ9JQImV2m9hBDONB5FD2t1cedFy4UfkL00iJ5LSOuM"
);
import StripeCustomer from "../models/stripecustomer.model";
import OneTimePayment from "../models/onetimepayment.model";
import PaymentHistory from "../models/paymenthistory.models";
import SubscriptionDetails from "../models/subscription.model";
import { Stripe } from "stripe";

//handler for creating the transaction and storing the transaction (oneTimePayment) data
export const oneTimePayment: RequestHandler = async (req, res) => {
  try {
    //check if customer making payment already exists in database. If so, retrieve ID.
    const checkCustomer = await StripeCustomer.find({
      UserID: req.body.UserID,
    });
    console.log("checkCustomer:", checkCustomer);

    const customerDetails = req.body;

    //declare stripeID globally to be able to access it outside conditions.
    let getStripeCustomerID;

    if (checkCustomer.length > 0) {
      console.log(
        "checkCustomer inside if block:",
        checkCustomer.length,
        checkCustomer
      );
      //get existing stripe customer ID to store only onetimepayment and payment history info.
      getStripeCustomerID = checkCustomer[0]._id;
      console.log("getStripeCustomerID:", getStripeCustomerID);
    } else {
      //generate new customer.
      const customer = await stripe.customers.create({
        name: customerDetails.name,
        phone: customerDetails.phone,
        email: customerDetails.email,
        description:
          "My First Test Customer (created for API docs at https://www.stripe.com/docs/api)",
      });

      if (!customer) {
        res.send("Error creating customer.");
        return;
      }

      getStripeCustomerID = customer.id;
      console.log("CUSTOMER JUST CREATED:", customer);
    }

    //retrieve other req body info and create payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: customerDetails.cardNumber,
        exp_month: customerDetails.expiryMonth,
        exp_year: customerDetails.expiryYear,
        cvc: customerDetails.cvc,
      },
    });
    console.log("paymentMethod:", paymentMethod);

    if (!paymentMethod) {
      res.send("Error creating payment method.");
      return;
    }

    //create customer object according to model to store in collection
    const stripeCustomerObject = {
      UserID: customerDetails.UserID,
      stripeCustomerID: getStripeCustomerID,
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: customerDetails.email,
      cardNumber: customerDetails.cardNumber,
      expiryMonth: customerDetails.expiryMonth,
      expiryYear: customerDetails.expiryYear,
      cvc: customerDetails.cvc,
      amount: customerDetails.amount,
      currency: customerDetails.currency,
    };

    //now store customer details into collection
    const storeStripeCustomerDetails = await new StripeCustomer(
      stripeCustomerObject
    );
    await storeStripeCustomerDetails.save();
    console.log(storeStripeCustomerDetails);

    //payment intent is most important
    const paymentIntent = await stripe.paymentIntents.create({
      customer: getStripeCustomerID,
      payment_method: paymentMethod.id,
      amount: customerDetails.amount,
      currency: customerDetails.currency,
      automatic_payment_methods: { enabled: true },
    });
    console.log("paymentIntent:", paymentIntent);

    if (!paymentIntent) {
      res.send("Error creating payment intent.");
      return;
    }

    //store onetime payment details into collection the same way as above.
    const oneTimePayment = {
      UserID: customerDetails.UserID,
      stripeCustomerID: getStripeCustomerID,
      paymentMethodID: paymentMethod.id,
      paymentIntentID: paymentIntent.id,
      amount: customerDetails.amount,
      date: customerDetails.date,
    };
    const storeOneTimePaymentInfo = await new OneTimePayment(oneTimePayment);
    await storeOneTimePaymentInfo.save();

    //create payment history object to store current transaction into payment histories
    const paymentHistoryObject = {
      UserID: customerDetails.UserID,
      stripeCustomerID: getStripeCustomerID,
      paymentMethodID: paymentMethod.id,
      paymentIntentID: paymentIntent.id,
      amount: customerDetails.amount,
      date: customerDetails.date,
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: customerDetails.email,
      cardNumber: customerDetails.cardNumber,
      expiryMonth: customerDetails.expiryMonth,
      expiryYear: customerDetails.expiryYear,
      cvc: customerDetails.cvc,
      currency: customerDetails.currency,
    };

    const storePaymentHistory = await new PaymentHistory(paymentHistoryObject);
    await storePaymentHistory.save();
    console.log(storePaymentHistory);

    res.send(storeOneTimePaymentInfo);
  } catch (e) {
    console.log(e);
  }
};

//handler for creating subscription
//check if customer details are already in database. If so, then find the stripe customer ID for monthly subscription
export const createSubscription: RequestHandler = async (req, res) => {
  const userID = req.body.UserID;
  const planType = req.body.planType;

  const checkIfCustomerExists = await StripeCustomer.find({ UserID: userID });
  console.log("checkIfCustomerExists:", checkIfCustomerExists);
  const stripeCustomerID = checkIfCustomerExists[0].stripeCustomerID;
  console.log("stripeCustomerID:", stripeCustomerID);

  //create payment method for customer who does not exist and attach it. Attaching will enable storing the card info in stripe. And then create subscription. We get the stripe id and payment method for subscriptions.
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: checkIfCustomerExists[0].cardNumber,
      exp_month: checkIfCustomerExists[0].expiryMonth,
      exp_year: checkIfCustomerExists[0].expiryYear,
      cvc: checkIfCustomerExists[0].cvc,
    },
  });
  console.log("paymentMethod:", paymentMethod);

  //attaching a payment method card to a customer.
  const paymentMethodToAttach = await stripe.paymentMethods.attach(
    paymentMethod.id,
    { customer: stripeCustomerID }
  );
  console.log("paymentMethodToAttach:", paymentMethodToAttach);

  if (!paymentMethod) {
    res.send("Error creating payment method.");
    return;
  }

  //price is what you see under subscriptions on your stripe dashboard. No payment intent but the create Subscription method from Stripe
  let subscription;
  if (planType === "monthly") {
    subscription = await stripe.subscriptions.create({
      customer: stripeCustomerID,
      items: [{ price: "price_1Mme1bJzU7tia8TKybqSQIdK" }],
      default_payment_method: paymentMethod.id,
    });
    console.log("subscription:", subscription);
  } else if (planType === "Annual") {
    subscription = await stripe.subscriptions.create({
      customer: stripeCustomerID,
      items: [{ price: "price_1Mo6PHJzU7tia8TKB9Dt7lbs" }],
      default_payment_method: paymentMethod.id,
    });
    console.log("subscription:", subscription);
  }

  //store subscription details into collection
  const subscribedUserObject = {
    planType: req.body.planType,
    UserID: req.body.userID,
    stripeCustomerID: req.body.stripeCustomerID,
    subscriptionID: subscription.id,
    cardNumber: req.body.cardNumber,
    expiryMonth: req.body.expiryMonth,
    expiryYear: req.body.expiryYear,
    cvc: req.body.cvc,
  };
  const storeSubscriptionDetails = await new SubscriptionDetails(
    subscribedUserObject
  );
  await storeSubscriptionDetails.save();
  console.log("storeSubscriptionDetails:", storeSubscriptionDetails);
  res.send(storeSubscriptionDetails);

  //add this to paymentHistory
  const paymentHistoryObject = {
    UserID: req.body.UserID,
    stripeCustomerID: req.body.stripeCustomerID,
    paymentMethodID: paymentMethod.id,
    amount: subscription.plan.amount,
    date: req.body.date,
    name: checkIfCustomerExists[0].name,
    phone: checkIfCustomerExists[0].phone,
    email: checkIfCustomerExists[0].email,
    cardNumber: req.body.cardNumber,
    expiryMonth: req.body.expiryMonth,
    expiryYear: req.body.expiryYear,
    cvc: req.body.cvc,
    currency: req.body.currency,
    subscriptionID: subscription.id,
  };

  const storePaymentHistory = await new PaymentHistory(paymentHistoryObject);
  await storePaymentHistory.save();
  console.log(storePaymentHistory);
};

//handler for cancelling subscription
export const cancelSubscription: RequestHandler = async (req, res) => {
  const subscriptionID = req.params.id;
  const deleted = await stripe.subscriptions.del(subscriptionID);
  console.log("subscription cancelled!");
  res.send(deleted);
};
