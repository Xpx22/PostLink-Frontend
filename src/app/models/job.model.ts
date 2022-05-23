export interface JobPost{
  _id: string,
  creator: string,
  companyName: string,
  logoPath: string,
  phoneNumber: string,
  website: string,
  email: string,
  city: string,
  country: string,
  description: string,
  requiredSkills: string[],
  goodToHaveSkills: string[],
	dateUploaded: String,
	positionName: string,
	homeOffice: boolean,
	salaryMin: number,
	salaryMax: number
}
