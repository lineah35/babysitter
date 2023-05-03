import { RequestHandler } from "express";
import Users from "../models/user.model";
import BSQualifications from "../models/qualifications.model";
import SitterPreferences from "../models/babysitterpref.model";
import JobInformation from "../models/jobinfo.model";
import JobApplications from "../models/jobapplications.model";
import moment from "moment";

//The purpose is to display the available jobs that match sitter's qualifications and parent pref. If some jobs have been hearted, they are displayed as well. The the displayed jobs no longer include the jobs applied for.
export const getSitterAvailableJobs: RequestHandler = async (req, res) => {
  try {
    const sitterID = req.params.id;
    const getUser = await Users.findById(sitterID);
    // console.log("getUser:", getUser);
    const dOB = moment(getUser?.dateOfBirth, "DD-MM-YYYY");
    const sitterAge = moment().diff(dOB, "y");
    console.log("sitterAge:", sitterAge);

    const getQualifications = await BSQualifications.findOne({
      UserID: sitterID,
    });
    // console.log("getQualifications:", getQualifications);
    let transportOption: any = getQualifications?.howGetToBabySitting;
    console.log("transportOption:", transportOption);
    if (
      transportOption ===
      "I need the parents I'm babysitting for to pick me up and drop me off."
    ) {
      transportOption = true;
    } else {
      transportOption = false;
    }

    // console.log("transportOption:", transportOption);
    var sitterQualifications = {
      minAge: { $lte: sitterAge }, //bear in mind we're thinking of the minimum age that parents have added!
      licenseRequired: getQualifications?.hasDrivingLicense,
      minGPA: { $lte: Number(getQualifications?.unweightedGpa) },
      genderPreferred: getUser?.gender,
      canTransportSitter: transportOption,
    };
    console.log("sitterQualifications", sitterQualifications);

    const matchPref = await SitterPreferences.find(sitterQualifications);
    console.log("matchPref:", matchPref);
    if (matchPref.length == 0) {
      res.send("No matches!");
      return //if there are no matches, the next code will not be executed.
    } 

    //now use parent id and get all the job info
    const getID = matchPref.map((parent) => {
      console.log("parent:", parent);
      const parentID = parent.UserID;
      return parentID;
    });

    console.log("getID:", getID);
    
    //Peruse jobs sitter (current user) has applied for. This function is executed when the sitter clicks on the heart button.
    const checkApplied = await JobApplications.find({ sitterID: sitterID })
    console.log("checkApplied:", checkApplied);

    //get job info posted by parents whose pref sitter's quals have matched with
    const jobsArr = await JobInformation.find({ UserID: { $in: getID } });
    console.log("jobsArr:", jobsArr);

    //extract job id(s)
    if (checkApplied.length > 0) {
      const jobsAppliedForIDs = checkApplied.map(job => job.jobID);
      console.log("jobsAppliedForIDs:", jobsAppliedForIDs); 

      //now that we have the job ID, we can display this job   
      const jobsArrExcludingAppliedForJobs = await JobInformation.find({ _id: {$nin: jobsAppliedForIDs}}); //$nin works too
      res.send(jobsArrExcludingAppliedForJobs);
    } else {
      res.send(jobsArr);
    }
    // res.send(jobsArr);

  } catch (error) {
    console.log(error);
  }
};
