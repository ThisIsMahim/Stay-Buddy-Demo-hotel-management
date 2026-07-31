import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useUser } from "@clerk/react";
import { api } from "../services/api";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
  onReviewAdded?: (review: any) => void;
}

const ReviewModal = ({ isOpen, onClose, hotelId, hotelName, onReviewAdded }: ReviewModalProps) => {
  const { user } = useUser();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    setSubmitting(true);
    try {
      // Ensure user is synced first
      await api.syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || "Valued Guest",
        avatar: user.imageUrl
      });

      const added = await api.submitReview({
        userId: user.id,
        userName: user.fullName || "Valued Guest",
        hotelId: hotelId,
        rating: rating,
        comment: comment,
        type: "REVIEW"
      });
      
      if (onReviewAdded) onReviewAdded(added);
      onClose();
      setComment("");
      setRating(5);
    } catch (error: any) {
      alert(error.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8 border-none shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
            Share your experience
          </DialogTitle>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">
            Story for {hotelName}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-8 h-8 cursor-pointer transition-all hover:scale-110 ${
                  n <= rating ? "text-violet-500 fill-violet-500" : "text-gray-200"
                }`}
                onClick={() => setRating(n)}
              />
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-50 border-2 border-transparent focus:border-violet-100 focus:bg-white rounded-2xl px-5 py-4 text-sm outline-none transition-all min-h-[140px] resize-none placeholder:text-gray-400 font-medium"
            placeholder="Tell us what you liked..."
          />

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-6 rounded-2xl shadow-lg shadow-violet-100 transition-all hover:shadow-xl active:scale-95 text-sm uppercase tracking-[0.2em]"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Post Review"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
