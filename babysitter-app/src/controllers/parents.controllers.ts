import { RequestHandler } from "express";
import Users from "../models/user.model";
import SitterPreferences from "../models/babysitterpref.model";
import JobInformation from "../models/jobinfo.model";
import bcrypt from "bcrypt";


export const createParentUser: RequestHandler = async (req, res) => {
    const parentData = req.body; 

    try {
      parentData.password = bcrypt.hashSync(req.body.password, 10);
      const storeParentInfo = new Users(parentData);
      await storeParentInfo.save();
      res.send(storeParentInfo);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const createParentPreferences: RequestHandler = async (req, res) => {
    const parentPreferences = req.body; 

    try {
      const storeParentPreferences = new SitterPreferences(parentPreferences);
      await storeParentPreferences.save();
      res.send(storeParentPreferences);
    } catch (err) {
      console.log(err);
    }
  };

  export const addJobInfo: RequestHandler = async (req, res) => {
    const jobinfo = req.body;

    try{
        const storeJobInfo = new JobInformation(jobinfo);
        await storeJobInfo.save();
        res.send(storeJobInfo);
    } catch(err) {
        console.log(err);
    }
  }

  //updating info

  export const updateParentUser: RequestHandler = async (req, res) => {
    try {
      const parentId = req.params.id;
      const updatedParentUser = await Users.findOneAndUpdate({ _id: parentId }, req.body);
      const parentUserUpdated = await Users.findOne({ _id: updatedParentUser?._id });
      res.send(parentUserUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  export const updateJobInfo: RequestHandler = async (req, res) => {
    try {
      const parentId = req.params.id;
      const updatedJobInfo = await JobInformation.findOneAndUpdate({ UserID: parentId }, req.body);
      const JobInfoUpdated = await JobInformation.findOne({ UserID: updatedJobInfo?.UserID });
      res.send(JobInfoUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  export const updateBSPref: RequestHandler = async (req, res) => {
    const sitterID = req.params.id;
    try {
      const sitterPrefUpdated = await SitterPreferences.findOneAndUpdate({ UserID: sitterID }, req.body);
      const updatedPref = await SitterPreferences.findOne({ UserID: sitterPrefUpdated?.UserID })
      res.send(updatedPref);
    } catch (err) {
      console.log(err);
    }
  }

  //delete job info

  export const deleteJob: RequestHandler = async (req, res) => {
    const parentDocID = req.params.id; //_id because a specific document is being deleted.
    console.log("parentDocID:", parentDocID);
    try {
      const deleteJob = await JobInformation.findByIdAndDelete({ _id: parentDocID});
      res.send(deleteJob);
      console.log("Job entry deleted.");
      
    } catch (err) {
      console.log(err);
    }
  }

  //delete account
  export const deleteUser: RequestHandler = async (req, res) => {
    const parentID = req.params.id;
    try {
      const deleteParentUser = await Users.findOneAndDelete({ _id: parentID}); //findbyid expects _id (unique identifier). findOne expects any filter.
      const deleteSitterPref = await SitterPreferences.findOneAndDelete({ UserID: parentID});
      const deleteJobInfo = await JobInformation.deleteMany({ UserID: parentID});
      res.send(deleteJobInfo);
      console.log("Job entry deleted.");
      
    } catch (err) {
      console.log(err);
    }
  }