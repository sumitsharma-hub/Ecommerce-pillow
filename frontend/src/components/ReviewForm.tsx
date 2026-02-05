import { useState } from "react";
import { useAddReviewMutation } from "../features/review/reviewApi";
import StarRating from "./StarRating";

export default function ReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [addReview, { isLoading }] = useAddReviewMutation();

  const submit = async () => {
    try {
      await addReview({ productId, rating, comment }).unwrap();
      setComment("");
      alert("Review submitted");
    } catch (err: any) {
      alert(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border">
      <h3 className="font-semibold mb-2">Write a Review</h3>

      <StarRating value={rating} onChange={setRating} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded-lg mt-3 p-2"
        placeholder="Share your experience (optional)"
      />

      <button
        onClick={submit}
        disabled={isLoading}
        className="mt-3 bg-violet-600 text-white px-4 py-2 rounded-lg"
      >
        Submit Review
      </button>
    </div>
  );
}
