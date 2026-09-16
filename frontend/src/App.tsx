import { useState } from "react";
import JobComponent from "./jobcomponent";
import JobsHandler, { type Job } from "./jobsHandler";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <div className="h-screen w-screen p-4 flex items-center flex-col gap-5 absolute">
      <JobComponent jobs={jobs} />
      <JobsHandler onJobsChange={setJobs} />
    </div>
  );
}