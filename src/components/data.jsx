export const applicationData = {
    // Total number of applications
    totalApplications: 500,
  
    // Applicants grouped by status
    hired: 150,
    inProcess: 200,
    rejected: 150,
  
    // Data about applications based on gender
    applicationsByGender: {
      male: 300,
      female: 200,
    },
  
    // Decline reasons (what led to rejection)
    declineReasons: {
      "Lack of Experience": 50,
      "Cultural Fit": 30,
      "Salary Expectations": 70,
    },
  
    // Applications by job type
    applicationsByJobType: {
      "Software Engineer": 200,
      "Product Manager": 100,
      "Data Scientist": 50,
      "HR": 150,
    },
  
    // Applications by source (e.g., LinkedIn, Referral, etc.)
    applicationsBySource: {
      "LinkedIn": 200,
      "Indeed": 150,
      "Referral": 100,
      "Other": 50,
    },


jobApplicationData : [
        {
          jobTitle: "Software Engineer",
          totalApplications: 200,
          hired: 60,
          inProgress: 100,
          rejected: 40,
        },
        {
          jobTitle: "Product Manager",
          totalApplications: 100,
          hired: 40,
          inProgress: 50,
          rejected: 10,
        },
        {
          jobTitle: "Data Scientist",
          totalApplications: 50,
          hired: 20,
          inProgress: 20,
          rejected: 10,
        },
        {
          jobTitle: "HR",
          totalApplications: 150,
          hired: 50,
          inProgress: 100,
          rejected: 50,
        },
        {
          jobTitle: "UX Designer",
          totalApplications: 100,
          hired: 30,
          inProgress: 50,
          rejected: 20,
        },
      ],
  
    // Applications received daily (can be used for daily trend analysis)
    dailyApplications: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  
    // Monthly application trends
    monthlyApplications: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650],
  
    // Quarterly application trends
    quarterlyApplications: [500, 600, 700, 800],

    applicationsByJobTypeAndGender: [
        { jobType: "Software Engineer", male: 120, female: 80 },
        { jobType: "Data Scientist", male: 100, female: 60},
        { jobType: "Product Manager", male: 80, female: 120},
        { jobType: "UX Designer", male: 40, female: 60 },
      ],

      // applicationsBySource: [
      //   { source: "Job Board", applicants: 120 },
      //   { source: "Referral", applicants: 80 },
      //   { source: "LinkedIn", applicants: 50 },
      //   { source: "Company Website", applicants: 100 },
      //   { source: "Social Media", applicants: 70 },
      // ],
    
      // applicationsByJobType: [
      //   { jobType: "Full-time", applicants: 200 },
      //   { jobType: "Part-time", applicants: 100 },
      //   { jobType: "Contract", applicants: 80 },
      //   { jobType: "Internship", applicants: 40 },
      // ],
    
      applicationsByProcessStatus: [
        { processStatus: "HDFC", applicants: 150 },
        { processStatus: "GODREJ", applicants: 100 },
        { processStatus: "ICIC", applicants: 120 },
        { processStatus: "IDFC", applicants: 90 },
        { processStatus: "UPSTOX", applicants: 60 },
      ], 
  };