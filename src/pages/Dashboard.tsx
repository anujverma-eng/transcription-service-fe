// src/features/dashboard/Dashboard.tsx

import { JobDetailDialog } from "@/components/JobDetailDialog";
import { JobsTable } from "@/components/JobsTable";
import { UploadDialog } from "@/components/UploadDialog";
import { UsageStats } from "@/components/UsageStats";
import {
  fetchJobs,
  fetchUsage,
  fetchUsageStats,
  getJobDetail,
  presignAudio,
  queueTranscriptionJob,
  selectJobs,
  selectPagination,
  selectSelectedJob,
  selectTranscriptionError,
  selectTranscriptionStatus,
  selectUsage,
  selectUsageStats,
  setSelectedJob
} from "@/features/transcription/transcriptionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageNotificationDialog } from "@/components/ui/UsageNotification";
import { UsageStatsTable } from "@/components/UsageStatsTable";
import { getProfile } from "@/features/auth/authSlice";
import { paymentHistory } from "@/features/payment/paymentSlice";
import { uploadFileToS3WithProgress } from "@/features/transcription/s3UploadApi";
import { TranscriptionJob } from "@/features/transcription/transcriptionApi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, FileAudio2, Maximize2, Menu, Minimize2, RefreshCw, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "vaul";
import { Skeleton } from "@/components/ui/skeleton";
const MotionUploadCloud = motion(UploadCloud);

// A helper to read audio duration
async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };

    audio.onerror = () => {
      reject(new Error("Unable to load audio metadata."));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      audio.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Add this component before the Dashboard component
const TableSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const usage = useAppSelector(selectUsage);
  const usageStats = useAppSelector(selectUsageStats);
  const jobs = useAppSelector(selectJobs);
  const error = useAppSelector(selectTranscriptionError);
  const selectedJob = useAppSelector(selectSelectedJob);
  const status = useAppSelector(selectTranscriptionStatus);
  const pagination = useAppSelector(selectPagination);

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showJobDetailDialog, setShowJobDetailDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [transcriptLanguage, setTranscriptLanguage] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [_queryInSearch, setQueryInSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("transcriptions");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Combine loading states into one
  const [isLoading, setIsLoading] = useState(true);

  // Handle page changes
  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchJobs({ page, limit, query: _queryInSearch }))
      .finally(() => setIsLoading(false));
  }, [page, limit, dispatch, _queryInSearch]);

  // Initial fetch for other data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(getProfile()),
          dispatch(paymentHistory()),
          dispatch(fetchUsage()),
          dispatch(fetchUsageStats()),
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [dispatch]);

  // Add this near your other state declarations
  const [showInitialTooltip, setShowInitialTooltip] = useState(true);

  // Add this effect after your other useEffects
  useEffect(() => {
    // Show tooltip for 2 seconds when component mounts
    const timer = setTimeout(() => {
      setShowInitialTooltip(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }

  async function handleUploadClick() {
    if (!selectedFile) {
      toast.error("Please select an audio file first!");
      return;
    }
    if (!selectedFile.type.startsWith("audio/")) {
      toast.error("Only audio files are accepted!");
      return;
    }

    setIsUploading(true);
    let durationSeconds = 0;
    try {
      durationSeconds = Math.floor(await getAudioDuration(selectedFile));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to read audio duration. Please try another file.");
      resetDialog();
      return;
    }

    if (!usage) {
      toast.error("Usage not loaded yet. Please wait...");
      resetDialog();
      return;
    }

    const minutesNeeded = Math.ceil(durationSeconds / 60);
    if (minutesNeeded > usage.remainingMinutes) {
      toast.error("Not enough daily minutes to upload this file.");
      resetDialog();
      return;
    }

    // Minimum 10s check
    if (durationSeconds < 10) {
      toast.error("Audio must be at least 10 seconds.");
      resetDialog();
      return;
    }

    const fileName = selectedFile.name;
    const mimeType = selectedFile.type;

    // 1) Presign
    let presignData: { presignedUrl: string; s3Key: string };
    try {
      const res = await dispatch(presignAudio({ fileName, duration: durationSeconds, mimeType })).unwrap();
      presignData = res;
    } catch (err: any) {
      toast.error(err);
      resetDialog();
      return;
    }

    try {
      await uploadFileToS3WithProgress(presignData.presignedUrl, selectedFile, mimeType, (progress) => {
        setUploadProgress(progress);
      });
      toast.success("File uploaded to S3 successfully!");
    } catch (err: any) {
      toast.error(`S3 upload failed: ${err.message || err}`);
      resetDialog();
      return;
    }

    // 3) Queue Job
    try {
      await dispatch(
        queueTranscriptionJob({
          s3Key: presignData.s3Key,
          duration: durationSeconds,
          fileName,
          sourceLanguage,
          transcriptLanguage,
        })
      ).unwrap();
      toast.success("Job queued successfully!");

      // Refresh usage & job list
      dispatch(fetchUsage());
      dispatch(fetchJobs({ page, limit, query: _queryInSearch }));

      setShowUploadDialog(false);
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(`Failed to queue job: ${err}`);
    } finally {
      resetDialog();
    }
  }

  function resetDialog() {
    setIsUploading(false);
    setUploadProgress(0);
    setSelectedFile(null);
  }

  function handleRowClick(jobId: string) {
    dispatch(getJobDetail(jobId))
      .unwrap()
      .then((data) => {
        let job = jobs.find((j) => j._id === jobId);
        job = { ...job, ...data } as TranscriptionJob;
        dispatch(setSelectedJob(job || null));
        setShowJobDetailDialog(true);
      })
      .catch((err) => toast.error(err));
  }

  function handleRefreshLinks() {
    if (!selectedJob || !selectedJob?._id) return;
    dispatch(getJobDetail(selectedJob._id))
      .unwrap()
      .then(() => {
        toast.success("Links refreshed!");
      })
      .catch((err) => toast.error(err));
  }

  function renderPagination() {
    if (!pagination || pagination?.totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between px-1">
        <Button 
          variant="outline" 
          disabled={pagination.page <= 1 || isLoading} 
          onClick={() => {
            const newPage = Math.max(1, page - 1);
            setPage(newPage);
          }}
        >
          Prev
        </Button>
        <p className="text-sm text-[#1F2937]">
          Page {pagination.page} of {pagination.totalPages}
        </p>
        <Button
          variant="outline"
          disabled={pagination.page >= pagination.totalPages || isLoading}
          onClick={() => {
            const newPage = Math.min(pagination.totalPages, page + 1);
            setPage(newPage);
          }}
        >
          Next
        </Button>
      </div>
    );
  }

  // Determine if the usage is nearing its limit (remaining < 40 seconds)
  const thresholdMinutes = 30 / 60; // ~0.67 minutes
  const showUsageNotification = (usage && usage?.remainingMinutes < thresholdMinutes) || false;
  const [notificationOpen, setNotificationOpen] = React.useState(showUsageNotification);
  React.useEffect(() => {
    if (usage && usage.remainingMinutes < thresholdMinutes) {
      setNotificationOpen(true);
    } else {
      setNotificationOpen(false);
    }
  }, [usage, thresholdMinutes]);

  if (!jobs?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
      >
        <div className="max-w-md text-center space-y-6 px-4">
          {/* Animated Illustration */}
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 10 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-blue-500/10 rounded-full backdrop-blur-sm">
              <MotionUploadCloud
                className="h-12 w-12 text-[#3B82F6]"
                strokeWidth={1.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Text content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">No Transcriptions Yet</h2>
            <p className="text-gray-500">Get started by uploading your first audio file for transcription.</p>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={() => setShowUploadDialog(true)}
            className="rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white"
          >
            <MotionUploadCloud
              className="h-4 w-4 mr-2"
              animate={{
                y: [-2, 2, -2],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            Start New Transcription
          </Button>
        </div>

        <UploadDialog
          showUploadDialog={showUploadDialog}
          setShowUploadDialog={setShowUploadDialog}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleUploadClick={handleUploadClick}
          status={status}
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          remainingMinutes={usage?.remainingMinutes || 0}
          setSourceLanguage={setSourceLanguage}
          setTranscriptLanguage={setTranscriptLanguage}
          sourceLanguage={sourceLanguage}
          transcriptLanguage={transcriptLanguage}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen p-4 bg-gray-50">
      <UsageNotificationDialog
        totalLimit={usage?.totalLimit || 0}
        totalUsedMinutes={usage?.totalUsedMinutes || 0}
        remainingMinutes={usage?.remainingMinutes || 0}
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
      />
      <div className="max-w-6xl mx-auto space-y-6 relative">
        {/* Conditionally render header row and UsageStats when not expanded */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              key="header-usage"
              // Smooth expand/collapse by animating height from 0 to "auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              // Ensure content is clipped while animating
              className="overflow-hidden space-y-6"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <motion.h1
                  className="text-2xl md:text-3xl font-bold text-gray-800"
                  layout
                  transition={{ duration: 0.2 }}
                >
                  Dashboard
                </motion.h1>
              </div>

              {/* Inline UsageStats */}
              <UsageStats usage={usage} status={status} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* TABS Section */}
        <div className="relative">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex gap-2 p-1 bg-gray-100 rounded-full mb-4">
              <TabsTrigger
                value="transcriptions"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
              >
                <FileAudio2 className="h-4 w-4" />
                <span>Transcriptions</span>
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Usage Statistics</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1 => Transcriptions */}
            <TabsContent value="transcriptions" className="space-y-4">
              <div className="flex w-full justify-end items-center gap-2">
                <div className="relative w-1/2">
                  <Input
                    placeholder="Search transcriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 rounded-md w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSearchQuery("");
                      setIsLoading(true);
                      dispatch(fetchJobs({ page: 1, limit, query: "" }))
                        .finally(() => setIsLoading(false));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  onClick={() => {
                    setPage(1);
                    setIsLoading(true);
                    setQueryInSearch(searchQuery);
                    dispatch(fetchJobs({ page: 1, limit, query: _queryInSearch }))
                      .finally(() => setIsLoading(false));
                  }}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] transition-colors text-white shadow-lg px-4 py-2 rounded-md"
                >
                  Search
                </Button>

                {/* NEW: Refresh Button */}
                <Button
                  onClick={() => {
                    // Re-fetch jobs using current page, limit, and searchQuery
                    dispatch(fetchJobs({ page, limit, query: _queryInSearch }));
                  }}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] transition-colors text-white shadow-lg px-4 py-2 rounded-md flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>

              <div className="h-[540px] overflow-y-auto relative bg-white rounded-lg shadow-sm">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableSkeleton />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <JobsTable
                      jobs={jobs}
                      status={status}
                      error={error}
                      handleRowClick={handleRowClick}
                      currentPage={pagination?.page}
                      totalPages={pagination?.totalPages}
                      onPageChange={(p) => setPage(p)}
                      setShowUploadDialog={setShowUploadDialog}
                    />
                  </motion.div>
                )}
              </div>

              {renderPagination()}
            </TabsContent>

            {/* Tab 2 => UsageStatsTable */}
            <TabsContent value="statistics" className="space-y-4">
              <UsageStatsTable usageStats={usageStats || []} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Buttons (New Transcription, Usage Stats Drawer, Expand/Collapse) - top-right */}
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          {/* New Transcription Button */}
          <motion.button
            key="btn-transcription"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowUploadDialog(true)}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md px-3 py-2
                       transition-transform duration-200 hover:scale-105 flex items-center space-x-1"
          >
            <MotionUploadCloud className="h-5 w-5" />
            <span>New Transcription</span>
          </motion.button>

          {/* Usage Stats Drawer Button */}
          {expanded && (
            <motion.button
              key="btn-drawer"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(true)}
              className="bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2
                         transition-transform duration-200 hover:scale-105 flex items-center space-x-1"
            >
              <Menu className="h-5 w-5" />
              <span>Stats</span>
            </motion.button>
          )}

          {/* Expand/Collapse Button */}
          {expanded ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    key="collapse"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 5 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => setExpanded(false)}
                    className="bg-gray-100 hover:bg-gray-200 rounded-md p-2
                             transition-transform duration-200 hover:scale-105"
                  >
                    <Minimize2 className="h-5 w-5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={5}
                  align="center"
                  className="bg-gray-200 text-sm text-gray-800 rounded-md shadow transition-all"
                >
                  <p>Collapse dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip open={showInitialTooltip}>
                <TooltipTrigger asChild>
                  <motion.button
                    key="expand"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      y: showInitialTooltip ? [0, -4, 0] : 0
                    }}
                    transition={{ 
                      duration: 0.2,
                      y: {
                        duration: 0.5,
                        repeat: 3,
                        ease: "easeInOut"
                      }
                    }}
                    onClick={() => setExpanded(true)}
                    className="bg-gray-100 hover:bg-gray-200 rounded-md p-2
                             transition-transform duration-200 hover:scale-105"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={5}
                  align="center"
                  className="bg-gray-200 text-sm text-gray-800 rounded-md shadow transition-all animate-bounce"
                >
                  <p>Click to expand dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Drawer for Usage Stats (visible in expanded mode) */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          {/* Hidden trigger — we manually open via onClick above */}
          <button className="hidden" />
        </DrawerTrigger>
        <DrawerContent>
          {/* <DrawerHeader> */}
          {/* <DrawerTitle className="text-2xl">Usage Stats</DrawerTitle> */}
          {/* </DrawerHeader> */}
          <UsageStats usage={usage} status={status} />
        </DrawerContent>
      </Drawer.Root>

      {/* Upload Dialog */}
      <UploadDialog
        showUploadDialog={showUploadDialog}
        setShowUploadDialog={setShowUploadDialog}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleUploadClick={handleUploadClick}
        status={status}
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        remainingMinutes={usage?.remainingMinutes || 0}
        setSourceLanguage={setSourceLanguage}
        setTranscriptLanguage={setTranscriptLanguage}
        sourceLanguage={sourceLanguage}
        transcriptLanguage={transcriptLanguage}
      />

      {/* Job Detail Dialog */}
      <JobDetailDialog
        showJobDetailDialog={showJobDetailDialog}
        setShowJobDetailDialog={setShowJobDetailDialog}
        selectedJob={selectedJob}
        handleRefreshLinks={handleRefreshLinks}
      />
    </motion.div>
  );
}