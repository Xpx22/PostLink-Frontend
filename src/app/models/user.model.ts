import { JobPost } from "./job.model";

export interface User{
  _id: string,
  fullname: string,
  // dateOfBirth: String,
	phoneNumber: String,
  email: String,
	// city: String,
	// country: String,
	// skills: String[],
  // homeOffice: boolean,
  cvPath: string,
  // gender: boolean,
	appliedPosts: JobPost[],
	bookmarks: JobPost[]
}
