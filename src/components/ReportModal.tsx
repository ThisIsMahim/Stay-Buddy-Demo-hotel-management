import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircle, Image, Loader2, Send, X } from "lucide-react";
import { api } from "@/services/api";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  hotelId: string;
  hotelName: string;
}

export default function ReportModal({ isOpen, onClose, userId, userName, hotelId, hotelName }: ReportModalProps) {
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please describe your issue.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await api.submitComplaint({
        userId,
        userName,
        hotelId,
        hotelName,
        description,
        imageUrl: previewUrl || undefined,
      });

      setSubmitted(true);
      setDescription("");
      setPreviewUrl(null);
      setTimeout(() => {
         setSubmitted(false);
         onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-slate-950 border border-slate-800 text-white rounded-3xl shadow-2xl">
        {submitted ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 animate-bounce">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
             </div>
             <h3 className="text-xl font-black uppercase tracking-tight text-white">Report Filed Successfully</h3>
             <p className="text-slate-400 text-sm max-w-sm">The integrity team is investigating this issue immediately. Details will be synced into Super Admin oversight shortly.</p>
             <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest pt-4">Closing dialog automatically...</p>
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 border-b border-slate-800 relative flex items-start gap-4 flex-row text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tight text-white mb-1">
                  Report Integrity Issue
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-xs">
                  Help us maintain booking standards. Reports are reviewed manually.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
                   <AlertCircle className="w-4 h-4" />
                   <p>{error}</p>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 block">Issue Description</label>
                <Textarea 
                  placeholder="Please describe the issue in detail... (e.g., hygiene, payment extortion, listing mismatch)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-slate-900 border-slate-800 focus-visible:ring-rose-500 text-sm h-32 rounded-2xl placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 block">Upload Evidence (Optional)</label>
                {previewUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-40">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setPreviewUrl(null)}
                      className="absolute top-2 right-2 p-1 bg-slate-900/80 rounded-full border border-slate-800 text-slate-400 hover:text-white transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:border-rose-500/50 hover:bg-slate-900/50 transition-all duration-300">
                    <Input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <Image className="w-8 h-8 text-slate-600 mb-2 group-hover:text-rose-500 transition-colors" />
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Add Photo Attachment</p>
                    <p className="text-[10px] text-slate-600 mt-1">JPEG, PNG up to 5MB</p>
                  </label>
                )}
              </div>
            </div>

            <DialogFooter className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/30">
              <Button variant="ghost" onClick={onClose} className="border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl px-5">
                 Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting} className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 font-black uppercase tracking-wider text-xs gap-2">
                 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                 Submit Report
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
