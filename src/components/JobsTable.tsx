import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  FileAudio2,
  FileText,
  Music,
  Trash2
} from "lucide-react";
import React from "react";
import { formatDistanceToNow } from "date-fns";


// Types
interface JobsTableProps {
  jobs: any[];
  status: string; // "idle" | "loading" | "succeeded" | "failed"
  error?: string | null;
  handleRowClick: (jobId: string) => void;
  handleDeleteJob: (e: React.MouseEvent, jobId: string) => void;
  handleDownloadAudio?: (e: React.MouseEvent, jobId: string) => void;
  handleDownloadTranscript?: (e: React.MouseEvent, jobId: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  setShowUploadDialog?: (e: boolean) => void;
}

export function JobsTable({
  jobs,
  status,
  error,
  handleRowClick,
  handleDeleteJob,
  handleDownloadAudio,
  handleDownloadTranscript,
}: JobsTableProps) {
  // 1) Error
  if (error) {
    return (
      <motion.div
        className="border border-red-500/50 bg-red-500/10 p-4 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-red-300 font-medium">Error: {error}</p>
      </motion.div>
    );
  }

  // 2) Loading => Skeleton
  if (status === "loading") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[60px] w-full rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  // 3) No Data
  if (!jobs?.length) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-64 text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-black/60">
          No transcriptions found, with the matching search{" "}
        </p>
      </motion.div>
    );
  }

  // Helper: determine file icon by extension
  function renderFileIcon(fileName: string) {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".mp3")) {
      return <Music className="text-[#8B5CF6] mr-2 h-5 w-5" />;
    } else if (lower.endsWith(".wav")) {
      // Optionally add another icon for wav
    }
    return <FileAudio2 className="text-gray-500 mr-2 h-5 w-5" />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] bg-white shadow-md rounded-md overflow-hidden">
          {/* Table Header Row */}
          <div className="px-4 py-2 border-b border-gray-300 bg-gray-100 shadow-sm">
            <div className="grid grid-cols-6 gap-2 text-[#1F2937] font-semibold uppercase text-sm">
              <span>File Name</span>
              <span className="text-center">Uploaded At</span>
              <span className="text-center">Duration</span>
              <span className="text-center">Usage Minutes</span>
              <span className="text-center">Status</span>
              <span className="text-right">Actions</span>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {jobs.map((job) => (
              <div
                key={job._id}
                className="grid grid-cols-6 gap-2 px-4 py-3 items-center border-b border-gray-100 hover:bg-gray-50 cursor-pointer h-[50px]"
                onClick={() => handleRowClick(job._id)}
              >
                {/* FILE NAME */}
                <div className="flex items-center">
                  {renderFileIcon(job.fileName)}
                  <span className="text-[#1F2937] font-medium truncate">
                    {job.fileName}
                  </span>
                </div>

                {/* UPLOADED AT */}
                <div className="text-center text-sm text-[#1F2937]">
                  {/* {new Date(job.createdAt).toLocaleString()} */}
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </div>

                {/* DURATION */}
                <div className="text-center text-sm text-[#1F2937]">
                  {job.durationText || `${job.durationInSeconds}s`}
                </div>

                {/* USAGE MINUTES */}
                <div className="text-center text-sm">
                  {job.isDeducted ? (
                    <span className="text-red-500">- {job.usageMinutes}</span>
                  ) : (
                    <span className="text-green-500">+ {job.usageMinutes}</span>
                  )}
                </div>

                {/* STATUS */}
                <div className="flex justify-center">
                  {renderStatus(job.status)}
                </div>

                {/* ACTIONS */}
                <div
                  className="flex justify-end items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#3B82F6]"
                    aria-label="View transcription"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(job._id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {handleDownloadAudio && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#3B82F6]"
                      aria-label="Download audio"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadAudio(e, job._id);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {handleDownloadTranscript && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#3B82F6]"
                      aria-label="Download text"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadTranscript(e, job._id);
                      }}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    aria-label="Delete transcription"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(e, job._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Replicate the “Chip” style for status. */
function renderStatus(status: string) {
  const s = status.toLowerCase();

  if (s === "completed") {
    return (
      <Badge className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
        Completed
      </Badge>
    );
  } else if (s === "processing") {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
        Processing
      </Badge>
    );
  } else if (s === "failed") {
    return (
      <Badge className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
        Failed
      </Badge>
    );
  }
  return (
    <Badge className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
      {status}
    </Badge>
  );
}
