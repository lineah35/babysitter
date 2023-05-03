import { RequestHandler } from "express";
import JobApplications from "../models/jobapplications.model";

//In jobinfo controller, at the end, sitter could see available jobs excluding the ones applied for. Here, sitter can see jobs applied for with full detail.

export const displayJobsAppliedFor: RequestHandler = async (req, res) => {
  const sitterID = req.params.id;
  try {
      const checkApplied = await JobApplications.find({sitterID: sitterID, jobStatus: "applied"}).populate("jobID"); //all info available because of the reference mentioned in the model!
      console.log("checkApplied:", checkApplied);
      res.send(checkApplied);
   
  } catch (e) {
    console.log(e);
  }
};
