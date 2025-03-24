// src/pages/ResetPasswordPage.tsx
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/features/auth/authSlice";
import type { ResetPasswordDto } from "@/features/auth/authTypes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import { Key, Loader2, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth.user, navigate]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password: string) => {
    return (
      password?.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please use a valid link from your email.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("No token provided.", { position: "bottom-left" });
      return;
    }

    if (!validatePassword(newPassword) && !validatePassword(confirmPassword)) {
      setPasswordError(
        "Password must contain at least 8 characters, uppercase, lowercase, number, and special character"
      );
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", { position: "bottom-left" });
      return;
    }

    const dto: ResetPasswordDto = { token, newPassword };
    const resultAction = await dispatch(resetPassword(dto));
    if (resetPassword.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload as string;
      toast.error(`Reset failed: ${errorMsg}`, { position: "bottom-left" });
    } else {
      toast.success("Password reset success! Logging you in...", { position: "bottom-left" });
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"
      >
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Key className="h-12 w-12 text-red-500/90 animate-pulse" />
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                Reset Failed
              </CardTitle>
              <p className="text-center text-gray-600 dark:text-gray-300 bg-red-50/50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
                {error}
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth?mode=login")}
                className="mt-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
              >
                Return to Login
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1">
            <Lock className="h-12 w-12 text-blue-500/90 mx-auto animate-pulse" />
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              New Password
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Secure your account with a new password
            </p>
          </CardHeader>

          <CardContent>
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                      placeholder="••••••••"
                    />
                  </div>
                  {passwordError && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {passwordError}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={auth.status === "loading"}
                className="w-full h-12 rounded-xl text-white text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                {auth.status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </motion.form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

}
