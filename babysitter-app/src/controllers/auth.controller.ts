import { RequestHandler } from "express";
import Users from "../models/user.model";
import bcrypt from "bcrypt";
import sendgrid from "@sendgrid/mail";
import dotenv from 'dotenv';

dotenv.config();

sendgrid.setApiKey("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");

export const logIn: RequestHandler = async (req, res) => {
    console.log("Log!");
    const email = req.body.email;
    const pw = req.body.password;
    console.log("email:", email);
    try {
        const findUser: any = await Users.findOne(
            { email: email });
          console.log("findUser:", findUser);
          if(findUser) {
            bcrypt.compare(pw, findUser.password, (err, result) => {
                console.log("err, result:", err, result); //err undefined, pw false so pw is not matching.
                if(result === false) {
                    res.status(400).send("Invalid credentials");
                } else {
                    res.send(findUser);
                }
            })
          } else {
            res.status(400).send("Check email address again.");
          }
    } catch (error) {
        console.log(error);
    }
}

export const forgotPW: RequestHandler = async(req, res) => {
    try {
        const msg = {
            to: 'rushshah2034@gmail.com',
            from: 'linea.h.35@gmail.com', // Use the email address or domain you verified above
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>', //any type of html like img tag, italic etc. front end will take care of the rest, URL etc
          };
          
          //ES8
          (async () => {
            try {
              await sendgrid.send(msg);
              res.send("Email sent");
            } catch (error: any) {
              console.error(error);
                
              if (error.response) {
                console.error(error.response.body)
              }
            }
          })();
          
    } catch (error) {
        console.log(error);
    }
}

export const resetPW: RequestHandler = async (req, res) => {
    const userID = req.body._id;
    console.log("userID:", userID);
    let newPW = req.body.password;
    const confirmPW = req.body.confirmPW;
    try {
        if(newPW === confirmPW) {
            newPW = bcrypt.hashSync(req.body.password, 10);
            const updatePassword = await Users.findOneAndUpdate({ _id: userID }, {password: newPW});
            console.log("updatePassword:", updatePassword);
            res.send(updatePassword);
        }
    } catch (error) {
        console.log(error);
    }

}