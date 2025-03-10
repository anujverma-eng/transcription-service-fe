// src/components/UsageNotificationDialog.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Gauge } from "lucide-react";

interface UsageNotificationDialogProps {
  totalLimit: number;
  totalUsedMinutes: number;
  remainingMinutes: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsageNotificationDialog({
  totalLimit,
  totalUsedMinutes,
  remainingMinutes,
  open,
  onOpenChange,
}: UsageNotificationDialogProps) {
  const percentageUsed = (totalUsedMinutes / totalLimit) * 100;
  const isLimitFinished = remainingMinutes < 0.5; // less than 30 seconds

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-medium">
            <Gauge className={`w-6 h-6 ${isLimitFinished ? "text-red-600" : "text-blue-600"}`} />
            {isLimitFinished ? "Usage Limit Reached" : "Usage Limit Approaching"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {isLimitFinished ? (
            <p className="text-sm text-gray-600">
              You have exhausted your daily transcription minutes. Upgrade now to continue using the service.
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              You've used {Math.round(percentageUsed)}% of your daily transcription minutes.
              Upgrade now to ensure uninterrupted service and unlock additional features.
            </p>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Daily Usage</span>
            <span className={`font-medium ${isLimitFinished ? "text-red-600" : "text-blue-600"}`}>
              {Math.round(percentageUsed)}%
            </span>
          </div>
          <Progress value={percentageUsed} className="h-2" />
        </div>
        <DialogFooter className="mt-4 flex justify-end">
          <Button
            onClick={() => (window.location.href = "/plans")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            Upgrade Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
