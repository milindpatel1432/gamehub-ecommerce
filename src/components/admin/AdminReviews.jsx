import { useState, useEffect } from 'react';
import { Trash2, Star, MessageSquare } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { successToast, errorToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await reviewService.getAllReviews();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(r => ({
          id: r._id,
          customer: r.user?.fullName || 'Guest User',
          email: r.user?.email || 'N/A',
          productTitle: r.product?.title || 'Unknown Product',
          productCategory: r.product?.category || 'General',
          productPlatform: r.product?.platform || 'General',
          rating: r.rating,
          comment: r.comment,
          date: new Date(r.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        }));
        setReviews(mapped);
      }
    } catch (err) {
      console.error(err);
      errorToast('Failed to load user reviews directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id, customer, productTitle) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the review by ${customer} on "${productTitle}"?`);
    if (!confirmDelete) return;

    try {
      const res = await reviewService.deleteReview(id);
      if (res.success) {
        successToast('Review deleted successfully!');
        setReviews(reviews.filter(r => r.id !== id));
      } else {
        errorToast(res.message || 'Failed to delete review.');
      }
    } catch (err) {
      console.error(err);
      errorToast('Error occurred while deleting review.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[40vh] w-full items-center justify-center bg-gaming-card/45 rounded-2xl border border-gaming-border">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <MessageSquare className="h-4.5 w-4.5 text-gaming-cyan" />
          User Reviews & Ratings
        </h3>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-slate-500 py-4">No reviews have been submitted by customers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-slate-300">
            <thead>
              <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Product</th>
                <th className="py-3 px-2">Rating</th>
                <th className="py-3 px-2">Comment</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gaming-border/30">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-gaming-black/20 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-bold text-white">{rev.customer}</div>
                    <div className="text-[10px] text-slate-500">{rev.email}</div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="font-bold text-white">{rev.productTitle}</div>
                    <div className="text-[10px] text-gaming-cyan uppercase tracking-wider">
                      {rev.productPlatform} | {rev.productCategory}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            rev.rating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-2 max-w-xs truncate" title={rev.comment}>
                    {rev.comment}
                  </td>
                  <td className="py-4 px-2 text-slate-400">{rev.date}</td>
                  <td className="py-4 px-2 text-right">
                    <button
                      onClick={() => handleDelete(rev.id, rev.customer, rev.productTitle)}
                      title="Delete Review"
                      className="p-2 rounded bg-gaming-black border border-gaming-border hover:border-red-500 text-slate-400 hover:text-red-500 cursor-pointer inline-block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
