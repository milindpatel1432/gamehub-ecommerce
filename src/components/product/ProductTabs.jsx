import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { successToast, errorToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProductTabs({ product, onRatingChange }) {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Edit states
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  const fetchReviews = async () => {
    if (!product?.id) return;
    setIsLoading(true);
    try {
      const res = await reviewService.getProductReviews(product.id);
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(r => ({
          id: r._id,
          user: r.user,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt
        }));
        setReviews(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product?.id]);

  const hasReviewed = reviews.some(r => user && r.user?._id === user.id);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await reviewService.createReview(product.id, newRating, newComment);
      if (res.success) {
        successToast('Review submitted successfully!');
        setNewComment('');
        setNewRating(5);
        fetchReviews();
        // Trigger parent callback to refresh details page totals
        if (onRatingChange) onRatingChange();
      }
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (rev) => {
    setEditingReviewId(rev.id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditComment('');
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      const res = await reviewService.updateReview(editingReviewId, editRating, editComment);
      if (res.success) {
        successToast('Review updated successfully!');
        setEditingReviewId(null);
        fetchReviews();
        if (onRatingChange) onRatingChange();
      }
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || 'Failed to update review.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        const res = await reviewService.deleteReview(id);
        if (res.success) {
          successToast('Review deleted successfully!');
          fetchReviews();
          if (onRatingChange) onRatingChange();
        }
      } catch (err) {
        console.error(err);
        errorToast('Failed to delete review.');
      }
    }
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'rental', label: 'Rental Terms' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="w-full text-left space-y-6 pt-6">
      {/* Tabs list header */}
      <div className="flex border-b border-gaming-border pb-px overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-6 text-sm font-semibold tracking-wide border-b-2 whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-gaming-cyan text-gaming-cyan'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels content */}
      <div className="min-h-36">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-slate-300 text-sm leading-relaxed"
          >
            {activeTab === 'description' && (
              <p>
                {product?.description || "No description available."}
              </p>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 max-w-md pt-2">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Publisher/Brand</span>
                  <p className="text-sm font-bold text-white mt-0.5">{product?.brand || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Genre/Category</span>
                  <p className="text-sm font-bold text-white mt-0.5">{product?.category || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Platforms</span>
                  <p className="text-sm font-bold text-white mt-0.5">{product?.platform || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Condition</span>
                  <p className="text-sm font-bold text-white mt-0.5">{product?.condition || 'N/A'}</p>
                </div>
              </div>
            )}

            {activeTab === 'rental' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl border border-gaming-border bg-gaming-card/30">
                  <h5 className="font-gaming text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Security Deposit
                  </h5>
                  <p className="text-xs text-slate-400">
                    A fully-refundable deposit of $40.00 is required at checkout. This is fully returned once the physical disc/console is returned.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-gaming-border bg-gaming-card/30">
                  <h5 className="font-gaming text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Delivery & Returns
                  </h5>
                  <p className="text-xs text-slate-400">
                    Pre-paid return shipping envelopes are included. Just drop the item in any local mailbox when your rental duration expires.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 pt-2">
                {/* Submit Review Form (if logged in and hasn't reviewed yet) */}
                {isAuthenticated ? (
                  !hasReviewed ? (
                    <form onSubmit={handleSubmitReview} className="p-5 rounded-2xl border border-gaming-border bg-gaming-card/30 space-y-4 text-left">
                      <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
                        Write a Review
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400 mr-2">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="text-yellow-500 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`h-5 w-5 ${newRating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <textarea
                          required
                          rows="3"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="What did you think of the game? Share your gameplay experience..."
                          className="w-full p-3 rounded-lg bg-gaming-black border border-gaming-border text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 px-6 rounded-lg bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : null
                ) : (
                  <p className="text-xs text-slate-500">
                    Please <Link to="/login" className="text-gaming-cyan hover:underline">log in</Link> to review this product.
                  </p>
                )}

                {/* Reviews List */}
                {isLoading ? (
                  <div className="flex py-6 justify-center">
                    <LoadingSpinner />
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No reviews yet for this product. Be the first to share your thoughts!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => {
                      const isOwner = user && rev.user?._id === user.id;
                      const isEditing = editingReviewId === rev.id;

                      return (
                        <div key={rev.id} className="border-b border-gaming-border/60 pb-4 last:border-0 text-left">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white text-sm">
                                  {rev.user?.fullName || 'Anonymous User'}
                                </span>
                                {isOwner && (
                                  <span className="text-[8px] uppercase tracking-wider bg-gaming-cyan/10 text-gaming-cyan border border-gaming-cyan/25 rounded px-1.5 py-0.5">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3.5 w-3.5 ${
                                      (isEditing ? editRating : rev.rating) >= star
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-slate-700'
                                    }`}
                                  />
                                ))}
                                <span className="text-[10px] text-slate-500 ml-1.5">
                                  {new Date(rev.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Owner actions (Edit / Delete) */}
                            {isOwner && !isEditing && (
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => startEdit(rev)}
                                  className="text-xs text-gaming-cyan hover:underline cursor-pointer font-bold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="text-xs text-red-500 hover:underline cursor-pointer font-bold"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          {isEditing ? (
                            <form onSubmit={handleUpdateReview} className="mt-3 space-y-3">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setEditRating(star)}
                                    className="text-yellow-500 cursor-pointer"
                                  >
                                    <Star className={`h-4.5 w-4.5 ${editRating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} />
                                  </button>
                                ))}
                              </div>
                              <textarea
                                required
                                rows="2"
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-gaming-black border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="submit"
                                  className="h-8 px-4 rounded bg-gaming-cyan text-gaming-black font-bold text-xs cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="h-8 px-4 rounded border border-gaming-border text-slate-400 font-bold text-xs cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{rev.comment}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
