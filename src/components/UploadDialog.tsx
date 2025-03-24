// src/features/dashboard/components/UploadDialog.tsx

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { FileAudio2, Loader2, UploadCloud, X } from "lucide-react";
import React from "react";
import { CircularProgressRing } from "./ui/CircularProgressRing";
import { SearchableSelect } from "./ui/SearchableSelect";
import { toast } from "sonner";

const AVAILABLE_LANGUAGES = [
  { label: "Afrikaans", value: "Afrikaans" },
  { label: "Amharic", value: "Amharic" },
  { label: "Assamese", value: "Assamese" },
  { label: "Albanian", value: "Albanian" },
  { label: "Armenian", value: "Armenian" },
  { label: "Arabic", value: "Arabic" },
  { label: "Azerbaijani", value: "Azerbaijani" },
  { label: "Belarusian", value: "Belarusian" },
  { label: "Bengali", value: "Bengali" },
  { label: "Breton", value: "Breton" },
  { label: "Basque", value: "Basque" },
  { label: "Bosnian", value: "Bosnian" },
  { label: "Bashkir", value: "Bashkir" },
  { label: "Cantonese", value: "Cantonese" },
  { label: "Bulgarian", value: "Bulgarian" },
  { label: "Croatian", value: "Croatian" },
  { label: "Czech", value: "Czech" },
  { label: "Chinese", value: "Chinese" },
  { label: "Catalan", value: "Catalan" },
  { label: "Dutch", value: "Dutch" },
  { label: "Danish", value: "Danish" },
  { label: "English", value: "English" },
  { label: "Estonian", value: "Estonian" },
  { label: "French", value: "French" },
  { label: "Finnish", value: "Finnish" },
  { label: "Faroese", value: "Faroese" },
  { label: "German", value: "German" },
  { label: "Greek", value: "Greek" },
  { label: "Galician", value: "Galician" },
  { label: "Georgian", value: "Georgian" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Haitian Creole", value: "Haitian Creole" },
  { label: "Hawaiian", value: "Hawaiian" },
  { label: "Hausa", value: "Hausa" },
  { label: "Hebrew", value: "Hebrew" },
  { label: "Hindi", value: "Hindi" },
  { label: "Hungarian", value: "Hungarian" },
  { label: "Icelandic", value: "Icelandic" },
  { label: "Italian", value: "Italian" },
  { label: "Indonesian", value: "Indonesian" },
  { label: "Javanese", value: "Javanese" },
  { label: "Japanese", value: "Japanese" },
  { label: "Khmer", value: "Khmer" },
  { label: "Kannada", value: "Kannada" },
  { label: "Kazakh", value: "Kazakh" },
  { label: "Korean", value: "Korean" },
  { label: "Lingala", value: "Lingala" },
  { label: "Latvian", value: "Latvian" },
  { label: "Lithuanian", value: "Lithuanian" },
  { label: "Latin", value: "Latin" },
  { label: "Lao", value: "Lao" },
  { label: "Luxembourgish", value: "Luxembourgish" },
  { label: "Myanmar", value: "Myanmar" },
  { label: "Malagasy", value: "Malagasy" },
  { label: "Maltese", value: "Maltese" },
  { label: "Marathi", value: "Marathi" },
  { label: "Maori", value: "Maori" },
  { label: "Macedonian", value: "Macedonian" },
  { label: "Mongolian", value: "Mongolian" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Malay", value: "Malay" },
  { label: "Nynorsk", value: "Nynorsk" },
  { label: "Nepali", value: "Nepali" },
  { label: "Norwegian", value: "Norwegian" },
  { label: "Occitan", value: "Occitan" },
  { label: "Pashto", value: "Pashto" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "Persian", value: "Persian" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Polish", value: "Polish" },
  { label: "Romanian", value: "Romanian" },
  { label: "Russian", value: "Russian" },
  { label: "Spanish", value: "Spanish" },
  { label: "Slovak", value: "Slovak" },
  { label: "Swedish", value: "Swedish" },
  { label: "Sanskrit", value: "Sanskrit" },
  { label: "Serbian", value: "Serbian" },
  { label: "Slovenian", value: "Slovenian" },
  { label: "Swahili", value: "Swahili" },
  { label: "Sinhala", value: "Sinhala" },
  { label: "Shona", value: "Shona" },
  { label: "Sindhi", value: "Sindhi" },
  { label: "Somali", value: "Somali" },
  { label: "Sundanese", value: "Sundanese" },
  { label: "Tatar", value: "Tatar" },
  { label: "Tibetan", value: "Tibetan" },
  { label: "Tagalog", value: "Tagalog" },
  { label: "Turkmen", value: "Turkmen" },
  { label: "Tamil", value: "Tamil" },
  { label: "Tajik", value: "Tajik" },
  { label: "Thai", value: "Thai" },
  { label: "Telugu", value: "Telugu" },
  { label: "Turkish", value: "Turkish" },
  { label: "Ukrainian", value: "Ukrainian" },
  { label: "Urdu", value: "Urdu" },
  { label: "Uzbek", value: "Uzbek" },
  { label: "Vietnamese", value: "Vietnamese" },
  { label: "Welsh", value: "Welsh" },
  { label: "Yoruba", value: "Yoruba" },
  { label: "Yiddish", value: "Yiddish" },
];

  const LANGUAGE_MAPPING: Record<string, string[]> = {
    "Afrikaans": ["English", "Afrikaans"],
    "Amharic": ["English", "Amharic"],
    "Assamese": ["English", "Assamese"],
    "Albanian": ["English", "Albanian"],
    "Armenian": ["English", "Armenian"],
    "Arabic": ["English", "Arabic"],
    "Azerbaijani": ["English", "Azerbaijani"],
    "Belarusian": ["English", "Belarusian"],
    "Bengali": ["English", "Bengali"],
    "Breton": ["English", "Breton"],
    "Basque": ["English", "Basque"],
    "Bosnian": ["English", "Bosnian"],
    "Bashkir": ["English", "Bashkir"],
    "Cantonese": ["English", "Cantonese"],
    "Bulgarian": ["English", "Bulgarian"],
    "Croatian": ["English", "Croatian"],
    "Czech": ["English", "Czech"],
    "Chinese": ["English", "Chinese"],
    "Catalan": ["English", "Catalan"],
    "Dutch": ["English", "Dutch"],
    "Danish": ["English", "Danish"],
    "English": ["English"],
    "Estonian": ["English", "Estonian"],
    "French": ["English", "French"],
    "Finnish": ["English", "Finnish"],
    "Faroese": ["English", "Faroese"],
    "German": ["English", "German"],
    "Greek": ["English", "Greek"],
    "Galician": ["English", "Galician"],
    "Georgian": ["English", "Georgian"],
    "Gujarati": ["English", "Gujarati"],
    "Haitian Creole": ["English", "Haitian Creole"],
    "Hawaiian": ["English", "Hawaiian"],
    "Hausa": ["English", "Hausa"],
    "Hebrew": ["English", "Hebrew"],
    "Hindi": ["English", "Hindi"],
    "Hungarian": ["English", "Hungarian"],
    "Icelandic": ["English", "Icelandic"],
    "Italian": ["English", "Italian"],
    "Indonesian": ["English", "Indonesian"],
    "Javanese": ["English", "Javanese"],
    "Japanese": ["English", "Japanese"],
    "Khmer": ["English", "Khmer"],
    "Kannada": ["English", "Kannada"],
    "Kazakh": ["English", "Kazakh"],
    "Korean": ["English", "Korean"],
    "Lingala": ["English", "Lingala"],
    "Latvian": ["English", "Latvian"],
    "Lithuanian": ["English", "Lithuanian"],
    "Latin": ["English", "Latin"],
    "Lao": ["English", "Lao"],
    "Luxembourgish": ["English", "Luxembourgish"],
    "Myanmar": ["English", "Myanmar"],
    "Malagasy": ["English", "Malagasy"],
    "Maltese": ["English", "Maltese"],
    "Marathi": ["English", "Marathi"],
    "Maori": ["English", "Maori"],
    "Macedonian": ["English", "Macedonian"],
    "Mongolian": ["English", "Mongolian"],
    "Malayalam": ["English", "Malayalam"],
    "Malay": ["English", "Malay"],
    "Nynorsk": ["English", "Nynorsk"],
    "Nepali": ["English", "Nepali"],
    "Norwegian": ["English", "Norwegian"],
    "Occitan": ["English", "Occitan"],
    "Pashto": ["English", "Pashto"],
    "Punjabi": ["English", "Punjabi"],
    "Persian": ["English", "Persian"],
    "Portuguese": ["English", "Portuguese"],
    "Polish": ["English", "Polish"],
    "Romanian": ["English", "Romanian"],
    "Russian": ["English", "Russian"],
    "Spanish": ["English", "Spanish"],
    "Slovak": ["English", "Slovak"],
    "Swedish": ["English", "Swedish"],
    "Sanskrit": ["English", "Sanskrit"],
    "Serbian": ["English", "Serbian"],
    "Slovenian": ["English", "Slovenian"],
    "Swahili": ["English", "Swahili"],
    "Sinhala": ["English", "Sinhala"],
    "Shona": ["English", "Shona"],
    "Sindhi": ["English", "Sindhi"],
    "Somali": ["English", "Somali"],
    "Sundanese": ["English", "Sundanese"],
    "Tatar": ["English", "Tatar"],
    "Tibetan": ["English", "Tibetan"],
    "Tagalog": ["English", "Tagalog"],
    "Turkmen": ["English", "Turkmen"],
    "Tamil": ["English", "Tamil"],
    "Tajik": ["English", "Tajik"],
    "Thai": ["English", "Thai"],
    "Telugu": ["English", "Telugu"],
    "Turkish": ["English", "Turkish"],
    "Ukrainian": ["English", "Ukrainian"],
    "Urdu": ["English", "Urdu"],
    "Uzbek": ["English", "Uzbek"],
    "Vietnamese": ["English", "Vietnamese"],
    "Welsh": ["English", "Welsh"],
    "Yoruba": ["English", "Yoruba"],
    "Yiddish": ["English", "Yiddish"],
  };

const MotionUploadCloud = motion(UploadCloud);

interface UploadDialogProps {
  showUploadDialog: boolean;
  setShowUploadDialog: (v: boolean) => void;
  selectedFile: File | null;
  setSelectedFile: (f: File | null) => void;
  handleUploadClick: () => void;
  status: string;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  isUploading: boolean;
  uploadProgress: number;
  remainingMinutes: number; // New prop for remaining minutes (in minutes)
  setSourceLanguage: (f: string) => void;
  setTranscriptLanguage: (f: string) => void;
  sourceLanguage: string
  transcriptLanguage: string

}

export function UploadDialog({
  showUploadDialog,
  setShowUploadDialog,
  selectedFile,
  setSelectedFile,
  handleUploadClick,
  status,
  dragActive,
  handleDrag,
  handleDrop,
  isUploading,
  uploadProgress,
  remainingMinutes,
  setSourceLanguage,
  setTranscriptLanguage,
  sourceLanguage,
  transcriptLanguage,

}: UploadDialogProps) {
  // Helper to format file sizes
  function formatFileSize(bytes: number): string {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Remove the selected file
  function handleRemoveFile() {
    setSelectedFile(null);
  }

  // const languagesSame =
  //   sourceLanguage && transcriptLanguage && sourceLanguage === transcriptLanguage;


  // Define threshold for remaining minutes (30 seconds = 0.5 minutes)
  const threshold = 0.5;
  if (remainingMinutes < threshold) {
    return (
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent
          className={cn(
            "w-full max-w-md rounded-xl shadow-xl bg-white p-6 overflow-hidden transition-all"
          )}
        >
          <DialogHeader className="pb-2 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-red-600">
              Upload Disabled
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm">
              Your remaining usage is less than 30 seconds. You cannot upload any more audio files until you upgrade your plan.
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowUploadDialog(false)}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={() => window.location.href = "/plans"}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Upgrade Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogContent
        className={cn(
          "w-full max-w-[70vw] md:max-w-2xl rounded-xl shadow-xl bg-white p-0 overflow-hidden transition-all"
        )}
      >
        <AnimatePresence>
          {isUploading && (
            <motion.div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative flex flex-col items-center justify-center py-8">
                <CircularProgressRing progress={uploadProgress} />
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  Uploading Files
                </h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  {uploadProgress}% completed. Please don't close this window.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialog Header with Title & Dropdowns */}
        <DialogHeader className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
            <DialogTitle
              className={cn(
                "text-xl font-bold text-transparent bg-clip-text",
                "bg-gradient-to-r from-blue-500 to-purple-500"
              )}
            >
              New Transcription
            </DialogTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <SearchableSelect
                label="Source Language"
                value={sourceLanguage}
                onChange={(value) => {
                  setSourceLanguage(value);
                  // Reset transcript language when source changes
                  setTranscriptLanguage("");
                }}
                options={AVAILABLE_LANGUAGES}
                placeholder="Select Source"
              />
              <SearchableSelect
                label="Transcript Language"
                value={transcriptLanguage}
                onChange={setTranscriptLanguage}
                options={sourceLanguage ? LANGUAGE_MAPPING[sourceLanguage].map(lang => ({ label: lang, value: lang })) : []}
                placeholder="Select Transcript"
                disabled={!sourceLanguage}
              />
            </div>
          </div>
          {/* {languagesSame && (
            <p className="mt-2 text-sm text-red-600">
              Source and Transcript languages cannot be the same.
            </p>
          )} */}
        </DialogHeader>

        {/* Drag & Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "m-4 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
            dragActive
              ? "border-purple-400 bg-purple-50/50"
              : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/10",
            selectedFile && "bg-purple-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* Hidden file input */}
          <Input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files?.length > 0) {
                const file = e.target.files[0];
                const maxSize = 25 * 1024 * 1024; // 25MB in bytes
                
                if (file.size > maxSize) {
                  toast.error("File size exceeds 25MB limit. Please choose a smaller file.");
                  handleRemoveFile();
                  return;
                }
                
                setSelectedFile(file);
              }
            }}
          />

          {/* No file selected */}
          {!selectedFile && (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-full">
                <MotionUploadCloud
                  className="text-purple-600 w-10 h-10"
                  animate={{
                    y: [-5, 5, -5],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <h3 className="text-lg font-medium text-gray-800">
                Drag &amp; Drop Audio Files
              </h3>
              <p className="text-gray-500">
                or click to browse from your computer
              </p>
              <Button
                variant="secondary"
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center gap-2"
                onClick={() => {
                  const fileInput = document.querySelector(
                    'input[type="file"][accept^="audio"]'
                  ) as HTMLInputElement;
                  fileInput?.click();
                }}
              >
                <MotionUploadCloud
                  className="h-4 w-4"
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
                Browse Files
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: MP3, WAV, M4A, FLAC (Max 500MB)
              </p>
            </div>
          )}

          {/* File selected summary */}
          {selectedFile && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-left w-full">
                <h4 className="text-sm font-semibold text-gray-800">
                  Selected File
                </h4>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <FileAudio2 className="text-purple-600 w-6 h-6" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size || 0)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowUploadDialog(false)}
            disabled={isUploading}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadClick}
            disabled={
              !selectedFile ||
              status === "loading" ||
              isUploading ||
              !sourceLanguage ||
              !transcriptLanguage ||
              remainingMinutes < threshold
            }
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isUploading || status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <MotionUploadCloud
                  className="h-4 w-4 mr-2"
                  animate={{
                    y: [-1, 1, -1],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                Start Transcription
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
