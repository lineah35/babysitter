import { RequestHandler } from "express";
import JobApplications from "../models/jobapplications.model";
import Qualifications from "../models/qualifications.model";

//Parents will see which sitters are interested.
export const interestedSitters: RequestHandler = async(req, res) => {
    //get sitter info from User collection (sitter ID), get info from Job Information collection.
    const parentID = req.params.id;
    const getJobs = await JobApplications.find({parentID: parentID, jobStatus: "applied"}).populate("sitterID").populate("jobID");
    console.log("getJobs:", getJobs);

    let interestedSittersData: any = [];

    for (let job of getJobs) {
        const sitterQualification = await Qualifications.findOne({UserID: job.sitterID?._id});
        let interestedSitter = {
            sitterInfo: job.sitterID,
            sitterQualification: sitterQualification,
            jobInfo: job.jobID
        }
        interestedSittersData.push(interestedSitter)
    }

    res.send(interestedSittersData)

    //We need access to the qualifications _id.

    // const getSitterID = getJobs.map( async (job:any) => { //type: any!
    //     const sitterID = job.sitterID?._id;
    //     const getQualifications = await Qualifications.find({UserID: sitterID});
    //     console.log("getQual:", getQualifications);
    //     const qualificationsObject = getQualifications.map((qualifications) => {return qualifications})
    //     console.log("qualificationsObject:", qualificationsObject);
    // })


}