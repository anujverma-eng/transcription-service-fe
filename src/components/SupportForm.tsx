import { sendSupportMessage } from "@/api/publicApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { toast } from "sonner";
import { 
  Mail, 
  MessageSquareText, 
  Send, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

export default function SupportForm() {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !email || !message) {
      toast.error("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      await sendSupportMessage({ subject, email, message });
      toast.success("Message sent successfully! We'll respond within 24 hours.");
      setSubject("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl w-full mx-auto"
    >
      <Card className="bg-background/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl border-0">
        <div className="mb-4 space-y-2 text-center">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl mb-4">
            <MessageSquareText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Contact Support
          </h2>
          <p className="text-muted-foreground">
            We'll get back to you within 24 hours
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="flex items-center gap-2 text-foreground">
                <AlertCircle className="h-4 w-4" />
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                className="rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="rounded-xl h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2 text-foreground">
              <MessageSquareText className="h-4 w-4" />
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              className="rounded-xl min-h-[150px]"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full rounded-xl h-14 text-lg bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}