// src/features/dashboard/components/JobDetailDialog.tsx

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileAudio2, RefreshCw, Trash2, Text, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JobDetailDialogProps {
  showJobDetailDialog: boolean;
  setShowJobDetailDialog: (open: boolean) => void;
  selectedJob: any;
  handleRefreshLinks: () => void;
  handleDeleteJob?: (e: React.MouseEvent, jobId: string) => void;
}

export function JobDetailDialog({
  showJobDetailDialog,
  setShowJobDetailDialog,
  selectedJob,
  handleRefreshLinks,
  handleDeleteJob,
}: JobDetailDialogProps) {

  const [transcriptText, setTranscriptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch transcript on open
  useEffect(() => {
    async function fetchTranscript() {
      setIsLoading(true);
      try {
        const res = await fetch(selectedJob.transcriptionFileLink);
        if (!res.ok) {
          throw new Error(`Failed to fetch transcript (status: ${res.status})`);
        }
        const textData = await res.text();
        setTranscriptText(textData);
      } catch (error: any) {
        toast.error("Failed to load transcript: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (showJobDetailDialog && selectedJob?.transcriptionFileLink) {
      setTranscriptText("");
      fetchTranscript();
    }
  }, [showJobDetailDialog, selectedJob?.transcriptionFileLink]);

  // If no job, show a simple fallback dialog
  if (!selectedJob) {
    return (
      <Dialog open={showJobDetailDialog} onOpenChange={setShowJobDetailDialog}>
        <DialogContent>
          <div className="p-4">
            <p className="text-sm text-gray-600">No job selected.</p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowJobDetailDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Destructure
  const { _id, fileName, status, audioFileLink, transcriptionFileLink } = selectedJob;

  // Handlers
  const handleDelete = (e: React.MouseEvent) => {
    if (!handleDeleteJob) return;
    e.stopPropagation();
    handleDeleteJob(e, _id);
    setShowJobDetailDialog(false);
  };

  const handleDownload = async (url: string, type: "audio" | "transcript") => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${fileName}_${type}.${type === "audio" ? "mp3" : "txt"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Download failed: " + error, { position: "bottom-left" });
    }
  };

  // Refresh => re-fetch transcript & handleRefreshLinks
  const handleRefresh = () => {
    if (transcriptionFileLink) {
      fetch(transcriptionFileLink)
        .then(async (res) => {
          if (!res.ok) throw new Error(`Status: ${res.status}`);
          const textData = await res.text();
          setTranscriptText(textData);
        })
        .catch((err) => {
          toast.error("Failed to refresh transcript: " + err);
        });
    }
    handleRefreshLinks();
  };

  return (
    <Dialog open={showJobDetailDialog} onOpenChange={setShowJobDetailDialog}>
      <DialogContent
        className={cn(
          "w-full max-w-[90vw] md:max-w-5xl", // Very wide on larger screens
          "bg-white text-gray-900 rounded-lg shadow-2xl p-0"
        )}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between w-full">
            {/* Left: Large Icon, File Name, Status */}
            <div className="flex items-center gap-3">
              {/* Larger Icon - color it (we can add fill if you have a fill variant) */}
              <FileAudio2 className="h-8 w-8 text-purple-600" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-purple-700">{fileName}</DialogTitle>
                {/* Status Badge on second line */}
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-1 w-fit text-sm font-medium px-2 py-1 capitalize",
                    status === "completed" && "bg-green-100 text-green-800",
                    status === "processing" && "bg-yellow-100 text-yellow-800",
                    status === "failed" && "bg-red-100 text-red-800"
                  )}
                >
                  {status.toLowerCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-md" onClick={handleRefresh}>
                      <RefreshCw className="h-10 w-10 text-gray-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={5}
                    align="center"
                    className="bg-white text-gray-800 px-2 py-1 rounded-md shadow"
                  >
                    <p>Refresh</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Delete */}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-2 bg-gray-100 hover:bg-gray-100 rounded-md" onClick={handleDelete} title="Delete">
                      <Trash2 className="h-10 w-10 text-red-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={5}
                    align="center"
                    className="bg-white text-gray-800 px-2 py-1 rounded-md shadow"
                  >
                    Delete
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Download Audio */}
              {audioFileLink && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="p-2 bg-gray-100 hover:bg-gray-100 rounded-md"
                        onClick={() => handleDownload(audioFileLink, "audio")}
                        title="Download Audio"
                      >
                        <Download className="h-10 w-10 text-blue-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={5}
                      align="center"
                      className="bg-white text-gray-800 px-2 py-1 rounded-md shadow"
                    >
                      Download Audio
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Download Text */}
              {transcriptionFileLink && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="p-2 bg-gray-100 hover:bg-gray-100 rounded-md"
                        onClick={() => handleDownload(transcriptionFileLink, "transcript")}
                        title="Download Transcript"
                      >
                        <Text className="h-10 w-10 text-blue-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={5}
                      align="center"
                      className="bg-white text-gray-800 px-2 py-1 rounded-md shadow"
                    >
                      Download Transcription
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6 space-y-6"
        >
          {/* Transcript */}
          {transcriptionFileLink && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Read Transcript</p>
              </div>
              <ScrollArea className="h-68 rounded-md border border-gray-200 bg-gray-50 p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Loading transcript...</span>
                  </div>
                ) : transcriptText ? (
                  <pre className="whitespace-pre-wrap break-all font-sans text-sm leading-relaxed text-gray-700">
                    {transcriptText}
                  </pre>
                ) : (
                  <p className="text-center text-sm text-gray-400">Transcript content not available</p>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Audio Preview */}
          {audioFileLink && (
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Audio Preview</p>
              <audio controls src={audioFileLink} className="w-full rounded-md" />
            </div>
          )}
        </motion.div>

        {/* Footer with smaller padding */}
        <DialogFooter className="px-6 py-3 border-t border-gray-200 flex justify-end">
          <Button variant="outline" onClick={() => setShowJobDetailDialog(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
