// src/pages/HomePage.tsx
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { fetchPublicFeedback, fetchPublicPlans } from "@/features/public/publicSlice";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Clock,
  FileText,
  GraduationCap,
  Languages,
  Mic,
  Podcast,
  Star,
  User,
  Video,
  Volume2,
  Zap
} from "lucide-react";
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const publicState = useAppSelector((state) => state.public);
  const { plans, feedback, status } = publicState;

  useEffect(() => {
    if (plans.length === 0) dispatch(fetchPublicPlans());
    if (feedback.length === 0) dispatch(fetchPublicFeedback());
  }, [dispatch, plans.length, feedback.length]);
  
  if (auth.user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Real-time Transcription",
      description: "Instant audio-to-text conversion with 99% accuracy",
    },
    {
      icon: <Languages className="h-8 w-8" />,
      title: "50+ Languages",
      description: "Support for global languages and dialects",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "1 hour audio processed in 5 minutes",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Multi-Format Export",
      description: "TXT, DOCX, SRT, VTT and more",
    },
    {
      icon: <Volume2 className="h-8 w-8" />,
      title: "Audio Enhancement",
      description: "Noise reduction & audio cleanup",
    },
    {
      icon: <BadgeCheck className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "GDPR compliant & military-grade encryption",
    },
  ];

  const useCases = [
    { icon: <Podcast />, title: "Podcasters", text: "Generate show notes & transcripts automatically" },
    { icon: <GraduationCap />, title: "Students", text: "Lecture recordings to study notes in minutes" },
    { icon: <User />, title: "Journalists", text: "Interview transcription with speaker identification" },
    { icon: <Video />, title: "Creators", text: "Auto-generate subtitles for your videos" },
  ];

  const HeroVisual = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Animated Sound Waves */}
        
        
        <motion.div
          className="absolute w-96 h-96 rounded-full border-2 border-blue-400/30"
          animate={{
            scale: [1, 5],
            opacity: [1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full border-2 border-purple-400/30"
          animate={{
            scale: [1, 4],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full border-2 border-pink-400/30"
          animate={{
            scale: [1, 3],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full border-2 border-pink-400/30"
          animate={{
            scale: [1, 2],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full border-2 border-pink-400/30"
          animate={{
            scale: [1, 1],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
            delay: 2,
          }}
        />

        {/* Floating Music Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Central Orb */}
        <motion.div
          className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-200 opacity-30 shadow-2xl"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 backdrop-blur-xl rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Volume2 className="h-16 w-16 text-white animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="dark:bg-gray-950">
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-900/5 to-purple-900/5" />

        <HeroVisual />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block mb-6">
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-900 dark:text-blue-500 text-sm font-medium mb-4 backdrop-blur-lg">
                🎉 50,000+ Audio Files Processed Daily
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-700 to-purple-900 bg-clip-text text-transparent">
                From Sound to Text
              </span>
              <br />
              <span className="text-3xl md:text-5xl font-medium text-gray-1000 dark:text-gray-300 mt-4 block">
                AI-Powered Speech Recognition at Lightspeed
              </span>
            </h1>

            <motion.div className="flex gap-4 justify-center mt-12" whileHover={{ scale: 1.05 }}>
              <Button
                asChild
                className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-blue-200 to-purple-500 hover:from-blue-300 hover:to-purple-600 shadow-xl"
              >
                <Link to="/signup">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Trial - 90 mins Free
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-white/80" />
        </motion.div>
      </section>


      {/* Use Cases Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Who Uses Audio Transcription?
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Whether you're creating content, conducting research, or running a business - transform your audio
              workflow with precision transcription
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-6 text-center group"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white mx-auto transition-all group-hover:scale-110">
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{useCase.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transform Audio in 3 Simple Steps
            </h2>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="p-8 bg-white/5 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-200/10"
            >
              <div className="text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1</div>
              <h3 className="text-2xl font-semibold mb-4">Upload Audio/Video</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Drag & drop files or record directly. Supports MP3, WAV, MP4, and more
              </p>
            </motion.div>
  
            <motion.div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="p-8 bg-white/5 dark:bg-gray-800/50 backdrop-blur-lg rounded-full border-2 border-purple-500/30">
                  <Mic className="h-24 w-24 text-purple-500" />
                </div>
              </motion.div>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="p-8 bg-white/5 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-200/10"
            >
              <div className="text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3</div>
              <h3 className="text-2xl font-semibold mb-4">Download & Share</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Export in any format, share securely, or integrate with your tools
              </p>
            </motion.div>
          </div>
        </section>
  

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Why Choose Us?
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Revolutionize your workflow with AI-powered transcription that understands context, accents, and nuances
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Start Transcribing Today
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get 90 minutes free transcription every month. No credit card required
            </p>
          </div>

          {status === "succeeded" && (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className={cn(
                    "relative w-full max-w-md p-8 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-4",
                    index === 1 ? "scale-110 z-10 border-2 border-purple-500 shadow-2xl" : "border dark:border-gray-700"
                  )}
                >
                  {index === 1 && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm">
                      Best Value 🔥
                    </div>
                  )}

                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold mb-4">
                      {plan.isPaid ? `$${plan.price}` : "Free"}
                      {plan.isPaid && <span className="text-lg text-gray-500">/{plan.currency}</span>}
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg mb-6">
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">{plan.totalLimit} mins/day included</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Full Transcription</div>
                        <div className="text-sm">99% accuracy guarantee</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Export Formats</div>
                        <div className="text-sm">TXT, DOCX, SRT, VTT</div>
                      </div>
                    </li>
                    {plan.isPaid && (
                      <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Priority Processing</div>
                          <div className="text-sm">2x faster than free tier</div>
                        </div>
                      </li>
                    )}
                  </ul>

                  <Button className="w-full group" variant={index === 1 ? "default" : "outline"} size="lg">
                    {plan.isPaid ? "Start Professional Trial" : "Get Free Account"}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
            Need custom solutions?{" "}
            <Link to="/enterprise" className="text-purple-600 hover:underline">
              Explore Enterprise Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loved by Teams Worldwide
            </h2>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {feedback.map((fb, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl h-full"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < fb.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{fb.review}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        {fb.userName || "A"}
                      </div>
                      <div>
                        <div className="font-semibold">{fb.userName || "Anonymous"}</div>
                        <div className="text-sm text-gray-500">Verified User</div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="p-6">
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-gray-200">Happy Customers</div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="p-6">
              <div className="text-5xl font-bold mb-2">99%</div>
              <div className="text-gray-200">Accuracy Rate</div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="p-6">
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-gray-200">Minutes Transcribed</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
