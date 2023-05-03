import { RequestHandler } from "express";
import JobApplications from "../models/jobapplications.model";

export const selectedJobs: RequestHandler = async (req, res) => {
    try {
        const applicationInfo = req.body;
        const addApplication = new JobApplications(applicationInfo);
        await addApplication.save();
        res.send(addApplication);

    } catch (error) {
        console.log("error:", error);
    }
}

