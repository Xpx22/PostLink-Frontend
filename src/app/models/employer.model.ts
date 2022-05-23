import {JobPost} from "./job.model"

export interface Employer{
  _id: string,
  companyName: string,
  logoPath: string,
	phoneNumber: string,
	website: string,
  email: string,
  city: string,
  country: string,
	jobPosts: JobPost[], //array of objectIDs of jobposts
	bookmarks: string[] //array of userIDs
}
