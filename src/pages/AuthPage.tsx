// src/pages/AuthPage.tsx
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { forgotPassword, loginUser, signUpUser } from "@/features/auth/authSlice";
import type { ForgotPasswordDto, LoginDto, SignUpDto } from "@/features/auth/authTypes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Building, Loader2, Lock, Mail, ShieldCheck, User, Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const AuthVisuals = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 overflow-hidden">
    <motion.div
      className="absolute w-96 h-96 bg-purple-300/10 rounded-full -top-48 -left-48"
      animate={{ scale: [1, 2, 1], rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute w-96 h-96 bg-blue-300/10 rounded-full -bottom-48 -right-48"
      animate={{ scale: [1, 2, 1] }}
      transition={{ duration: 15, repeat: Infinity }}
    />
  </div>
);

export default function AuthPage() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // if user is already logged in => redirect to dashboard
  useEffect(() => {
    if (auth.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth.user, navigate]);

  const [searchParams] = useSearchParams();
  const modeParam = (searchParams.get("mode") as "login" | "signup" | "forgot") || "login";
  const [mode, setMode] = useState<"signup" | "login" | "forgot">(modeParam);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  // const [phoneNumber, setPhoneNumber] = useState("");
  const [organization, setOrganization] = useState("");
  // const [country, setCountry] = useState("IN");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const [showAuthModal, setShowAuthModal] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    return (
      password?.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const handleModeSwitch = (m: typeof mode) => {
    setMode(m);
    setEmail("");
    setPassword("");
    setName("");
    setForgotEmail("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(""); // Clear error when typing

    // Validate after 500ms of no typing
    if (mode === "signup" || mode === "login") {
      setTimeout(() => {
        if (!validateEmail(newEmail) && newEmail?.length > 0) {
          setEmailError("Please enter a valid email address");
        }
      }, 100);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(""); // Clear error when typing

    // Validate after 500ms of no typing
    if (mode === "signup" && newPassword?.length > 0) {
      setTimeout(() => {
        if (!validatePassword(newPassword)) {
          setPasswordError(
            "Password must contain at least 8 characters, uppercase, lowercase, number, and special character"
          );
        }
      }, 500);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    const dto: LoginDto = { email, password };
    const resultAction = await dispatch(loginUser(dto));
    if (loginUser.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload as string;
      toast.error("Login failed: " + errorMsg, { position: "bottom-left" });
    } else {
      toast.success("Login success!", { position: "bottom-left" });
      // slice will set user => effect => nav /dashboard
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, uppercase, lowercase, number, and special character"
      );
      return;
    }
    const dto: SignUpDto = { email, password, name };
    const resultAction = await dispatch(signUpUser(dto));
    if (signUpUser.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload as string;
      toast.error("Sign Up failed: " + errorMsg, { position: "bottom-left" });
    } else {
      toast.success("Sign Up success!", { position: "bottom-left" });
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const dto: ForgotPasswordDto = { email: forgotEmail };
    const resultAction = await dispatch(forgotPassword(dto));
    if (forgotPassword.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload as string;
      toast.error("Forgot password failed: " + errorMsg, { position: "bottom-left" });
    } else {
      toast.success("Reset link sent. Check your email.", { position: "bottom-left" });
      setMode("login");
    }
  };

  const handleGoogleLogin = () => {
    // redirect to your backend
    const BACKEND = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:3000";
    window.location.href = BACKEND + "/api/v1/auth/google";
  };

  return (
    <div className="min-h-max my-9 h-full w-full flex items-center justify-center p-2 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="w-full max-w-6xl flex bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Visual Section */}
        <div className="hidden md:block flex-1 relative bg-gradient-to-br from-blue-600 to-purple-600">
          <AuthVisuals />
          <div className="relative z-10 p-12 h-full flex flex-col justify-between text-white">
            <div>
              <h2 className="text-4xl font-bold mb-4">Transform Audio to Text</h2>
              <p className="text-lg opacity-90">AI-Powered Speech Recognition with 99% Accuracy</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Volume2 className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">50+ Languages Supported</h3>
                  <p className="text-sm opacity-80">Real-time transcription & translation</p>
                </div>
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">Enterprise Security</h3>
                  <p className="text-sm opacity-80">GDPR compliant & military-grade encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center p-2 bg-white dark:bg-gray-900">
          <Card className="w-full max-w-lg border-0 shadow-none">
            <CardHeader className="px-0">
              {mode === "forgot" ? (
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Reset Password
                </CardTitle>
              ) : (
                <Tabs value={mode} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full h-14 bg-gray-100 dark:bg-gray-800 rounded-xl p-2">
                    <TabsTrigger
                      value="login"
                      onClick={() => handleModeSwitch("login")}
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 h-10"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      onClick={() => handleModeSwitch("signup")}
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 h-10"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </CardHeader>

            <CardContent className="px-0 flex flex-col h-[550px]">
              <div className="space-y-6 flex-1 overflow-y-auto p-4">
                {(mode === "login" || mode === "signup") && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-12 gap-3 text-base border-gray-300 dark:border-gray-600"
                      onClick={handleGoogleLogin}
                    >
                      <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        {" "}
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />{" "}
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />{" "}
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />{" "}
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />{" "}
                      </svg>
                      Continue with Google
                    </Button>
                    <div className="relative my-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
                        <span className="text-sm font-medium text-gray-400 dark:text-gray-400 bg-background/80 px-2 rounded-full backdrop-blur-sm">
                          OR
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
                      </div>
                    </div>
                  </>
                )}

                <AnimatePresence mode="wait">
                  {mode === "login" && (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleLogin}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="hello@example.com"
                              value={email}
                              onChange={handleEmailChange}
                              className="pl-10 h-12 rounded-xl"
                            />
                          </div>
                          {emailError && <motion.p className="text-red-500 text-sm mt-1">{emailError}</motion.p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <PasswordInput
                              placeholder="••••••••"
                              value={password}
                              onChange={handlePasswordChange}
                              className="pl-10 h-12 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-amber-50"
                      >
                        {auth.status === "loading" ? <Loader2 className="animate-spin" /> : "Login"}
                      </Button>
                    </motion.form>
                  )}

                  {mode === "signup" && (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSignup}
                      className="space-y-6"
                    >
                      <div className="grid gap-4">
                        <div className="flex gap-4">
                          {/* Full Name */}
                          <div className="space-y-2 flex-1">
                            <Label className="text-sm font-medium">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 h-12 rounded-xl"
                              />
                            </div>
                          </div>

                          {/* Organization */}
                          <div className="space-y-2 flex-1">
                            <Label className="text-sm font-medium text-gray-500">Organization (optional)</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="Company Name"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                                className="pl-10 h-12 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="hello@example.com"
                              value={email}
                              onChange={handleEmailChange}
                              className="pl-10 h-12 rounded-xl"
                            />
                          </div>
                          {emailError && <motion.p className="text-red-500 text-sm mt-1">{emailError}</motion.p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <PasswordInput
                              placeholder="••••••••"
                              value={password}
                              onChange={handlePasswordChange}
                              className="pl-10 h-12 rounded-xl"
                            />
                          </div>
                          {passwordError && <motion.p className="text-red-500 text-sm mt-1">{passwordError}</motion.p>}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-amber-50"
                      >
                        {auth.status === "loading" ? <Loader2 className="animate-spin" /> : "Create Account"}
                      </Button>
                    </motion.form>
                  )}

                  {mode === "forgot" && (
                    <motion.form
                      key="forgot"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleForgot}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="hello@example.com"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              className="pl-10 h-12 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {auth.status === "loading" ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-center pt-4">
                <Button
                  variant="link"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  onClick={() => {
                    if (mode === "login") handleModeSwitch("forgot");
                    else if (mode === "signup") handleModeSwitch("login");
                    else handleModeSwitch("login");
                  }}
                >
                  {mode === "login" && "Forgot password?"}
                  {mode === "signup" && "Already have an account?"}
                  {mode === "forgot" && "Return to login"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
  //     <div className="w-full max-w-6xl flex bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
  //       {/* Visual Section */}
  //       <div className="hidden md:block flex-1 relative bg-gradient-to-br from-blue-600 to-purple-600">
  //         <AuthVisuals />
  //         <div className="relative z-10 p-12 h-full flex flex-col justify-between text-white">
  //           <div>
  //             <h2 className="text-4xl font-bold mb-4">Transform Audio to Text</h2>
  //             <p className="text-lg opacity-90">AI-Powered Speech Recognition with 99% Accuracy</p>
  //           </div>
  //           <div className="space-y-4">
  //             <div className="flex items-center gap-4">
  //               <Volume2 className="h-8 w-8" />
  //               <div>
  //                 <h3 className="font-semibold">50+ Languages Supported</h3>
  //                 <p className="text-sm opacity-80">Real-time transcription & translation</p>
  //               </div>
  //             </div>
  //             <Separator className="bg-white/20" />
  //             <div className="flex items-center gap-4">
  //               <ShieldCheck className="h-8 w-8" />
  //               <div>
  //                 <h3 className="font-semibold">Enterprise Security</h3>
  //                 <p className="text-sm opacity-80">GDPR compliant & military-grade encryption</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Form Section (40%) */}
  //       <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
  //         <Card className="w-full max-w-lg border-0 shadow-none">
  //           <CardHeader className="px-0">
  //             <Tabs value={mode} className="w-full">
  //               <TabsList className="grid grid-cols-2 w-full h-14 bg-gray-100 dark:bg-gray-800 rounded-xl p-2">
  //                 <TabsTrigger
  //                   value="login"
  //                   onClick={() => handleModeSwitch("login")}
  //                   className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 h-10"
  //                 >
  //                   Login
  //                 </TabsTrigger>
  //                 <TabsTrigger
  //                   value="signup"
  //                   onClick={() => handleModeSwitch("signup")}
  //                   className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 h-10"
  //                 >
  //                   Sign Up
  //                 </TabsTrigger>
  //               </TabsList>
  //             </Tabs>
  //           </CardHeader>

  //           <CardContent className="px-0 space-y-6">
  //             <Button
  //               variant="outline"
  //               className="w-full h-12 gap-3 text-base border-gray-300 dark:border-gray-600"
  //               onClick={handleGoogleLogin}
  //             >
  //               <svg width="20" height="20" viewBox="0 0 48 48">
  //                 {/* Google SVG */}
  //               </svg>
  //               Continue with Google
  //             </Button>

  //             <Separator className="my-6 text-gray-300 dark:text-gray-600" />

  //             <AnimatePresence mode="wait">
  //               {mode === "login" ? (
  //                 <motion.form
  //                   key="login"
  //                   initial={{ opacity: 0 }}
  //                   animate={{ opacity: 1 }}
  //                   exit={{ opacity: 0 }}
  //                   onSubmit={handleLogin}
  //                   className="space-y-6"
  //                 >
  //                   <div className="space-y-4">
  //                     <div className="space-y-2">
  //                       <Label className="text-sm font-medium">Email</Label>
  //                       <div className="relative">
  //                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  //                         <Input
  //                           type="email"
  //                           placeholder="hello@example.com"
  //                           value={email}
  //                           onChange={handleEmailChange}
  //                           className="pl-10 h-12 rounded-xl"
  //                         />
  //                       </div>
  //                       {emailError && <motion.p className="text-red-500 text-sm mt-1">{emailError}</motion.p>}
  //                     </div>

  //                     <div className="space-y-2">
  //                       <Label className="text-sm font-medium">Password</Label>
  //                       <div className="relative">
  //                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  //                         <PasswordInput
  //                           placeholder="••••••••"
  //                           value={password}
  //                           onChange={handlePasswordChange}
  //                           className="pl-10 h-12 rounded-xl"
  //                         />
  //                       </div>
  //                     </div>
  //                   </div>

  //                   <Button
  //                     type="submit"
  //                     className="w-full h-12 rounded-xl text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
  //                   >
  //                     {auth.status === "loading" ? <Loader2 className="animate-spin" /> : "Login"}
  //                   </Button>
  //                 </motion.form>
  //               ) : (
  //                 <motion.form
  //                   key="signup"
  //                   initial={{ opacity: 0 }}
  //                   animate={{ opacity: 1 }}
  //                   exit={{ opacity: 0 }}
  //                   onSubmit={handleSignup}
  //                   className="space-y-6"
  //                 >
  //                   <div className="grid gap-4">
  //                     <div className="space-y-2">
  //                       <Label className="text-sm font-medium">Full Name</Label>
  //                       <div className="relative">
  //                         <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  //                         <Input
  //                           placeholder="John Doe"
  //                           value={name}
  //                           onChange={(e) => setName(e.target.value)}
  //                           className="pl-10 h-12 rounded-xl"
  //                         />
  //                       </div>
  //                     </div>

  //                     <div className="space-y-2">
  //                       <Label className="text-sm font-medium">Email</Label>
  //                       <div className="relative">
  //                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  //                         <Input
  //                           type="email"
  //                           placeholder="hello@example.com"
  //                           value={email}
  //                           onChange={handleEmailChange}
  //                           className="pl-10 h-12 rounded-xl"
  //                         />
  //                       </div>
  //                       {emailError && <motion.p className="text-red-500 text-sm mt-1">{emailError}</motion.p>}
  //                     </div>

  //                     <div className="grid grid-cols-2 gap-4">
  //                       <div className="space-y-2">
  //                         <Label className="text-sm font-medium">Country</Label>
  //                         <div className="relative">
  //                           <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  //                           <select
  //                             value={country}
  //                             onChange={(e) => setCountry(e.target.value)}
  //                             className="w-full pl-10 h-12 rounded-xl border bg-background"
  //                           >
  //                             {countryList.map((c) => (
  //                               <option key={c.code} value={c.code}>
  //                                 {c.name}
  //                               </option>
  //                             ))}
  //                           </select>
  //                         </div>
  //                       </div>

  //                       <div className="space-y-2">
  //                         {/* <Label className="text-sm font-medium">Phone Number</Label> */}
  //                         <div className="relative">
  //                           <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  //                           <PhoneInput
  //                             country={country.toLowerCase()}
  //                             value={phoneNumber}
  //                             onChange={setPhoneNumber}
  //                             inputClass="w-full pl-10 h-12 rounded-xl"
  //                             containerClass="!w-full"
  //                           />
  //                         </div>
  //                       </div>
  //                     </div>

  //                     <div className="space-y-2">
  //                       <Label className="text-sm font-medium text-gray-500">Organization (optional)</Label>
  //                       <div className="relative">
  //                         <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  //                         <Input
  //                           placeholder="Company Name"
  //                           value={organization}
  //                           onChange={(e) => setOrganization(e.target.value)}
  //                           className="pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-600"
  //                         />
  //                       </div>
  //                     </div>

  //                     <div className="space-y-2">
  //                       <Label className="text-sm font-medium">Password</Label>
  //                       <div className="relative">
  //                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  //                         <PasswordInput
  //                           placeholder="••••••••"
  //                           value={password}
  //                           onChange={handlePasswordChange}
  //                           className="pl-10 h-12 rounded-xl"
  //                         />
  //                         {passwordError && <motion.p className="text-red-500 text-sm mt-1">{passwordError}</motion.p>}
  //                       </div>
  //                     </div>
  //                   </div>

  //                   <Button
  //                     type="submit"
  //                     className="w-full h-12 rounded-xl text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
  //                   >
  //                     {auth.status === "loading" ? <Loader2 className="animate-spin" /> : "Create Account"}
  //                   </Button>
  //                 </motion.form>
  //               )}
  //             </AnimatePresence>

  //             <div className="text-center">
  //               <Button
  //                 variant="link"
  //                 className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
  //                 onClick={() => handleModeSwitch(mode === "login" ? "forgot" : "login")}
  //               >
  //                 {mode === "login" ? "Forgot password?" : "Already have an account?"}
  //               </Button>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
  //     <Card className="w-full max-w-md backdrop-blur-lg bg-white/50 dark:bg-gray-900/50 shadow-xl rounded-2xl">
  //       <CardHeader className="space-y-1">
  //         <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
  //           {mode === "login" && "Welcome Back"}
  //           {mode === "signup" && "Create Account"}
  //           {mode === "forgot" && "Reset Password"}
  //         </CardTitle>
  //       </CardHeader>

  //       <CardContent className="grid gap-4">
  //         {(mode === "login" || mode === "signup") && (
  //           <>
  //             <Button
  //               variant="outline"
  //               className="w-full gap-3 bg-white hover:bg-gray-50 dark:bg-white dark:hover:bg-gray-50 dark:text-gray-900 text-gray-900 border border-gray-200 font-medium text-sm h-10"
  //               onClick={handleGoogleLogin}
  //             >
  //               <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  //                 <path
  //                   fill="#EA4335"
  //                   d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
  //                 />
  //                 <path
  //                   fill="#4285F4"
  //                   d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
  //                 />
  //                 <path
  //                   fill="#FBBC05"
  //                   d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
  //                 />
  //                 <path
  //                   fill="#34A853"
  //                   d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
  //                 />
  //               </svg>
  //               Continue with Google
  //             </Button>
  //             <Separator className="my-2" />
  //           </>
  //         )}

  //         {mode === "login" && (
  //           <form onSubmit={handleLogin} className="space-y-4">
  //             <div className="space-y-2">
  //               <Label className="text-sm font-medium">Email</Label>
  //               <Input
  //                 type="email"
  //                 placeholder="hello@example.com"
  //                 value={email}
  //                 onChange={handleEmailChange}
  //                 className="rounded-lg py-2 px-4 focus-visible:ring-blue-500"
  //                 required
  //               />
  //               {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
  //             </div>
  //             <div className="space-y-2">
  //               <Label className="text-sm font-medium">Password</Label>
  //               <PasswordInput
  //                 placeholder="••••••••"
  //                 value={password}
  //                 onChange={handlePasswordChange}
  //                 className="rounded-lg py-2 px-4 focus-visible:ring-blue-500"
  //                 required
  //               />
  //               {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
  //             </div>
  //             <Button
  //               type="submit"
  //               disabled={auth.status === "loading"}
  //               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
  //             >
  //               {auth.status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
  //             </Button>
  //           </form>
  //         )}

  //         {mode === "signup" && (
  //           <form onSubmit={handleSignup} className="space-y-4">
  //             <div className="space-y-2">
  //               <Label className="text-sm font-medium">Name</Label>
  //               <Input
  //                 type="text"
  //                 placeholder="John Doe"
  //                 value={name}
  //                 onChange={(e) => setName(e.target.value)}
  //                 className="rounded-lg py-2 px-4 focus-visible:ring-blue-500"
  //                 required
  //               />
  //             </div>
  //             <div className="space-y-2">
  //               <Label className="text-sm font-medium">Email</Label>
  //               <Input
  //                 type="email"
  //                 placeholder="hello@example.com"
  //                 value={email}
  //                 onChange={handleEmailChange}
  //                 className="rounded-lg py-2 px-4 focus-visible:ring-blue-500"
  //                 required
  //               />
  //               {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
  //             </div>
  //             <div className="space-y-4">
  //               {/* Name field remains same */}

  //               {/* Country Select */}
  //               <div className="space-y-2">
  //                 <Label className="text-sm font-medium">Country</Label>
  //                 <select
  //                   value={country}
  //                   onChange={(e) => setCountry(e.target.value)}
  //                   className="w-full p-2 border rounded-lg bg-background"
  //                 >
  //                   {countryList.map((c) => (
  //                     <option key={c.code} value={c.code}>
  //                       {c.name} ({c.dial_code})
  //                     </option>
  //                   ))}
  //                 </select>
  //               </div>

  //               {/* Phone Number */}
  //               <div className="space-y-2">
  //                 <Label className="text-sm font-medium">Phone Number (optional)</Label>
  //                 <PhoneInput
  //                   country={country.toLowerCase()}
  //                   value={phoneNumber}
  //                   onChange={(value) => setPhoneNumber(value)}
  //                   inputClass="w-full p-2 border rounded-lg"
  //                 />
  //               </div>

  //               {/* Organization */}
  //               <div className="space-y-2">
  //                 <Label className="text-sm font-medium">Organization (optional)</Label>
  //                 <Input
  //                   type="text"
  //                   placeholder="Company Name"
  //                   value={organization}
  //                   onChange={(e) => setOrganization(e.target.value)}
  //                 />
  //               </div>

  //               {/* Email field remains same */}

  //               {/* Password Field */}
  //               <div className="space-y-2">
  //                 <Label className="text-sm font-medium">Create Password</Label>
  //                 <PasswordInput placeholder="••••••••" value={password} onChange={handlePasswordChange} />
  //                 {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
  //               </div>
  //             </div>
  //             <Button
  //               type="submit"
  //               disabled={auth.status === "loading"}
  //               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
  //             >
  //               {auth.status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
  //             </Button>
  //           </form>
  //         )}

  //         {mode === "forgot" && (
  //           <form onSubmit={handleForgot} className="space-y-4">
  //             <div className="space-y-2">
  //               <Label className="text-sm font-medium">Email</Label>
  //               <Input
  //                 type="email"
  //                 placeholder="hello@example.com"
  //                 value={forgotEmail}
  //                 onChange={(e) => setForgotEmail(e.target.value)}
  //                 className="rounded-lg py-2 px-4 focus-visible:ring-blue-500"
  //                 required
  //               />
  //             </div>
  //             <Button
  //               type="submit"
  //               disabled={auth.status === "loading"}
  //               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
  //             >
  //               {auth.status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
  //             </Button>
  //           </form>
  //         )}
  //       </CardContent>

  //       <CardFooter className="flex flex-col gap-3">
  //         {mode === "login" && (
  //           <>
  //             <p className="text-sm text-gray-600 dark:text-gray-400">
  //               Don't have an account?{" "}
  //               <Button
  //                 variant="link"
  //                 className="text-blue-600 px-0 hover:text-blue-700 dark:text-blue-400"
  //                 onClick={() => handleModeSwitch("signup")}
  //               >
  //                 Sign up
  //               </Button>
  //             </p>
  //             <Button
  //               variant="link"
  //               className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 px-0"
  //               onClick={() => handleModeSwitch("forgot")}
  //             >
  //               Forgot password?
  //             </Button>
  //           </>
  //         )}

  //         {mode === "signup" && (
  //           <p className="text-sm text-gray-600 dark:text-gray-400">
  //             Already have an account?{" "}
  //             <Button
  //               variant="link"
  //               className="text-blue-600 px-0 hover:text-blue-700 dark:text-blue-400"
  //               onClick={() => handleModeSwitch("login")}
  //             >
  //               Login here
  //             </Button>
  //           </p>
  //         )}

  //         {mode === "forgot" && (
  //           <Button
  //             variant="link"
  //             className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 px-0"
  //             onClick={() => handleModeSwitch("login")}
  //           >
  //             Return to Login
  //           </Button>
  //         )}
  //       </CardFooter>
  //     </Card>
  //   </div>
  // );
}
