import { RequestHandler } from "express";
import Users from "../models/user.model";
import BSQualifications from "../models/qualifications.model";
import SitterPreferences from '../models/babysitterpref.model';
import bcrypt from "bcrypt";

//storing user info
export const createBabysitterUser: RequestHandler = async (req, res) => {
  const babysitterData = req.body; //will contain id already

  try {
    babysitterData.password = bcrypt.hashSync(req.body.password, 10);
    const createBabysitter = new Users(babysitterData);
    await createBabysitter.save();
    res.send(createBabysitter);
  } catch (err) {
    console.log(err);
  }
};

export const createBabysitterQualifications: RequestHandler = async (
  req,
  res
) => {
  const babysitterData = req.body;
  try {
    const addQualifications = new BSQualifications(babysitterData);
    //ID! Conditional statement? If this user was the one who clicked the button on the previous page...? .populate and ref?
    await addQualifications.save();
    res.send(addQualifications);
  } catch (err) {
    console.log(err);
  }
};

//finding user through param

export const findBabysitterUser: RequestHandler = async (req, res) => {
  const babysitterId = req.query._id; //this is a query param, coming after question mark. If param is specified in route  e.g. retrieve/:id, then use req.params
  console.log("babysitterId:", babysitterId);
  try {
    res.send(await Users.findById(babysitterId));
  } catch (err) {
    console.log(err);
  }
};

export const findBabysitterQualifications: RequestHandler = async (
  req,
  res
) => {
  const babysitterId = req.params.id;
  try {
    res.send(await BSQualifications.findById(babysitterId).populate("UserID")); //this is how to fetch data of the other related doc. Use the right key name.
  } catch (err) {
    console.log(err);
  }
};

//update qualification doc by inserting more info (from 3rd page)

export const addBSParentInfo: RequestHandler = async (req, res) => {
  const findUser = await BSQualifications.findOneAndUpdate(
    { UserID: req.body.UserID },
    req.body
  );
  console.log("findUser:", findUser);
  try {
    res.send(findUser);
  } catch (err) {
    console.log(err);
  }
};

//update registration first page of babysitters

export const updateBabysitterUser: RequestHandler = async (req, res) => {
  try {
    const sitterID = req.params.id;
    const sitterInfoToUpdate = req.body;
    console.log("sitter id for update:", sitterID);
    console.log("sitter info to update:", sitterInfoToUpdate);
    const sitterUpdated = await Users.findOneAndUpdate(
      { _id: sitterID }, //key name in the filter should be accurate. Not UserID! That is in the other models. This ID is from the master table. 
      sitterInfoToUpdate
    );
    console.log("sitter updated:", sitterUpdated);
    res.send("sitter updated!");
  } catch (err) {
    res.send(err);
  }
};

export const updateBabysitterQualifications: RequestHandler = async (req, res) => {
  try {
    const sitterID = req.params.id;
    const sitterInfoToUpdate = req.body;
    console.log("sitter info to update:", sitterInfoToUpdate);
    const sitterQualificationsUpdated = await BSQualifications.findOneAndUpdate(
      { UserID: sitterID },  
      sitterInfoToUpdate
    );
    const updatedQual = await BSQualifications.findOne({ UserID: sitterQualificationsUpdated?.UserID}) //before ? it was saying null
    console.log("sitter updated:", updatedQual);
    res.send(updatedQual);
  } catch (err) {
    res.send(err);
  }
};

