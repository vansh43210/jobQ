import { useState } from "react";
import JobComponent from "./jobcomponent";
import JobsHandler, { type Job } from "./jobsHandler";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <div className="min-h-screen w-full p-3 sm:p-5 md:p-6 lg:p-8 flex items-center flex-col gap-4 sm:gap-5 box-border">
      <JobComponent jobs={jobs} />
      <JobsHandler onJobsChange={setJobs} />
    </div>
  );
}