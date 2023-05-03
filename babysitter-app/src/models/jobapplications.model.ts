import { Schema, model, Document } from "mongoose";

export interface IJobApplications extends Document {
  sitterID?: any;
  jobID?: string;
  parentID?: string;
  jobStatus: string;
}

const JobApplicationsSchema: Schema = new Schema(
  {
    sitterID: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    jobID: {
      type: Schema.Types.ObjectId,
      ref: "JobInformation",
    },
    parentID: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    jobStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IJobApplications>(
  "JobApplications",
  JobApplicationsSchema
);
