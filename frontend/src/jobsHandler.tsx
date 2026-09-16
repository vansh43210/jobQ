/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

const api = 'http://localhost:3000'
export type Job = {
    job_id: string | number;
    job_title: string;
    status: string;
    type: string;
    createdAt: string;
};

export default function JobsHandler({
    onJobsChange,
}: {
    onJobsChange?: (jobs: Job[]) => void;
} = {}) {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setCreate] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [jobType, setJobType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        onJobsChange?.(jobs);
    }, [jobs, onJobsChange]);

    async function getAllJobs() {
        setLoading(true);
        try {
            const response = await fetch(`${api}/jobs`);
            if (response.ok) {
                const result = await response.json();
                const data = Array.isArray(result) ? result : (result.data ?? []);
                setJobs(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllJobs();
    }, []);

    async function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!jobTitle.trim() || !jobType.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${api}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        jobTitle: jobTitle.trim(),
                        jobType: jobType.trim(),
                    },
                }),
            });
            if (response.ok) {
                setJobTitle("");
                setJobType("");
                setCreate(false);
                await getAllJobs();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function updateJobStatus(job: Job, reqStatus: string) {
        try {
            const response = await fetch(`${api}/jobs/${job.job_id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentStatus: job.status,
                    requestedStatus: reqStatus
                })
            });
            if (response.ok) {
                const updatedJob: Job = await response.json();
                setJobs(jobs =>
                    jobs.map(j =>
                        j.job_id === updatedJob.job_id ? updatedJob : j
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteJob(id: string | number) {
        try {
            const response = await fetch(`${api}/jobs/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setJobs(prev => prev.filter(j => j.job_id !== id));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const ALLOWED_TRANSITIONS: Record<string, string[]> = {
        pending: ["running"],
        running: ["completed", "failed"],
        completed: [],
        failed: [],
    };

    const statusStyles: Record<string, string> = {
        pending:
            "bg-yellow-50 text-yellow-700 border-yellow-300 focus:ring-yellow-200",
        running: "bg-blue-50 text-blue-700 border-blue-300 focus:ring-blue-200",
        completed:
            "bg-green-50 text-green-700 border-green-300 focus:ring-green-200",
        failed: "bg-red-50 text-red-700 border-red-300 focus:ring-red-200",
    };

    return (
        <div className="w-[97%] border border-[#e2e2e2] rounded-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e2e2]">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        Job Queue
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Manage and monitor your jobs
                    </p>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setCreate((prev) => !prev)}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 active:scale-95 transition-all duration-150 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm cursor-pointer"
                    >
                        <span className="text-lg leading-none">{isCreating ? "✕" : "+"}</span>
                        Create Job
                    </button>

                    {/* Create Job Form opened just to the side of Create Job button */}
                    {isCreating && (
                        <div className="absolute right-0 mt-2 z-50 w-80 bg-white border border-[#e2e2e2] rounded-xl shadow-xl p-4">
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2e2e2]">
                                <h3 className="text-sm font-bold text-gray-800">Create New Job</h3>
                                <button
                                    type="button"
                                    onClick={() => setCreate(false)}
                                    className="text-gray-400 hover:text-gray-600 text-xs px-1 rounded cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Job Type
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={jobType}
                                        onChange={(e) => setJobType(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setCreate(false)}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium cursor-pointer transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !jobTitle.trim() || !jobType.trim()}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold cursor-pointer transition shadow-sm"
                                    >
                                        {isSubmitting ? "Creating..." : "Save Job"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-[#e2e2e2] text-gray-500 uppercase text-xs tracking-wider">
                            <th className="text-left px-6 py-3 font-semibold">Job ID</th>
                            <th className="text-left px-6 py-3 font-semibold">Job Title</th>
                            <th className="text-left px-6 py-3 font-semibold">Job Type</th>
                            <th className="text-left px-6 py-3 font-semibold">Time</th>
                            <th className="text-left px-6 py-3 font-semibold">Status</th>
                            <th className="text-left px-6 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-sm font-medium">Loading jobs...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : jobs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <span className="text-sm font-medium text-gray-600">No jobs created yet</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job, idx) => (
                                <tr
                                    key={job.job_id}
                                    className={`border-b border-[#e2e2e2] hover:bg-gray-50 transition-colors duration-100 ${idx === jobs.length - 1 ? "border-b-0" : ""
                                        }`}
                                >
                                    {/* Job ID */}
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {job.job_id}
                                        </span>
                                    </td>

                                    {/* Job Title */}
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {job.job_title}
                                    </td>

                                    {/* Job Type */}
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {job.type}
                                        </span>
                                    </td>

                                    {/* Time */}
                                    <td className="px-6 py-4 text-gray-500">
                                        {job.createdAt ? new Date(job.createdAt).toLocaleString() : "—"}
                                    </td>

                                    {/* Status Dropdown */}
                                    <td className="px-6 py-4">
                                        <select
                                            value={job.status} 
                                            onChange={(e) =>{ updateJobStatus(job, e.target.value)}}
                                            className={`border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 cursor-pointer transition-colors duration-150 ${statusStyles[job.status]
                                                }`}
                                        >
                                            {/* Current status shown as the display label */}
                                            <option value={job.status} disabled>
                                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                            </option>

                                            {/* Allowed transitions */}
                                            {ALLOWED_TRANSITIONS[job.status]?.map((s) => (
                                                <option key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Delete Button */}
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => deleteJob(job.job_id)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 active:scale-95 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
