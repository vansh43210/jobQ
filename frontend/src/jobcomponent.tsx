
import type { Job } from "./jobsHandler";

export function JobsData({ count, label }: { count: number; label: string }) {
    return (
        <div className="border border-[#e2e2e2] rounded-lg flex flex-col justify-center items-center gap-4 py-8">
            <span className="text-6xl font-extrabold text-gray-800">{count}</span>
            <span className="text-sm font-semibold border border-gray-200 px-3 py-1 rounded-md text-gray-600">
                {label}
            </span>
        </div>
    );
}

export default function JobComponent({ jobs = [] }: { jobs?: Job[] }) {
    const total = jobs.length;
    const pending = jobs.filter((j) => j.status === "pending").length;
    const running = jobs.filter((j) => j.status === "running").length;
    const completed = jobs.filter((j) => j.status === "completed").length;
    const failed = jobs.filter((j) => j.status === "failed").length;

    return (
        <div className="w-[97%] border border-[#e2e2e2] rounded-2xl grid grid-cols-5 p-5 gap-5">
            <JobsData count={total} label="Total jobs" />
            <JobsData count={pending} label="Pending" />
            <JobsData count={running} label="Running" />
            <JobsData count={completed} label="Completed" />
            <JobsData count={failed} label="Failed" />
        </div>
    );
}