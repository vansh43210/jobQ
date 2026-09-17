
import type { Job } from "./jobsHandler";

export function JobsData({ count, label, className = "" }: { count: number; label: string; className?: string }) {
    return (
        <div className={`border border-[#e2e2e2] rounded-lg flex flex-col justify-center items-center gap-2 sm:gap-3 md:gap-4 py-4 sm:py-6 md:py-8 px-2 ${className}`}>
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800">{count}</span>
            <span className="text-xs sm:text-sm font-semibold border border-gray-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-gray-600 text-center">
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
        <div className="w-full max-w-7xl border border-[#e2e2e2] rounded-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-3 sm:p-5 gap-3 sm:gap-4 md:gap-5">
            <JobsData count={total} label="Total jobs" className="col-span-2 sm:col-span-1" />
            <JobsData count={pending} label="Pending" />
            <JobsData count={running} label="Running" />
            <JobsData count={completed} label="Completed" />
            <JobsData count={failed} label="Failed" />
        </div>
    );
}
