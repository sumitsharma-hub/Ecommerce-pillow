// pages/ProductDetails.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetProductByCodeQuery } from "../features/product/productApi";
import ImageCarousel from "../components/ImageCarousel";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addToCart, selectIsInCart } from "../features/cart/cartSlice";
import {
  useGetReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useCanReviewQuery,
} from "../features/review/reviewApi";
import Stars from "../components/Stars";
import ReviewForm from "../components/ReviewForm";
import StarRating from "../components/StarRating";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Footer from "../components/Footer";

export default function ProductDetails() {
  const { productCode } = useParams<{ productCode: string }>();
  const { data: product, isLoading } = useGetProductByCodeQuery(productCode!);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const qty = 1;

  const { data: reviews = [] } = useGetReviewsQuery(product?.id!, {
    skip: !product?.id,
  });

  const user = useAppSelector((state) => state.auth.user);

  const { data: canReviewData } = useCanReviewQuery(product?.id!, {
    skip: !product?.id || !user,
  });
  const canReview = canReviewData?.canReview ?? false;

  const hasReviewed = user
    ? reviews.some((r: any) => r.user.id === user.id)
    : false;

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const avgRating =
    reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
    (reviews.length || 1);

  const isInCart = useAppSelector(selectIsInCart(product?.id));

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-600 font-medium">Product not found</p>
        <Link
          to="/"
          className="text-green-700 hover:text-green-800 font-medium"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0]?.url ?? "",
        quantity: qty,
      }),
    );
  };

  const mrp = product.mrp ?? null;
  const discount =
    mrp && mrp > product.price
      ? Math.round(((mrp - product.price) / mrp) * 100)
      : 0;

  // Rating distribution for the summary
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium mb-6"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT — Images + Buttons */}
          <div className="lg:sticky lg:top-24 self-start space-y-6">
            <ImageCarousel images={product.images ?? []} variant="details" />

            <div className="flex gap-3">
              <button
                className="flex-1 h-14 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-semibold cursor-pointer"
                onClick={() => {
                  if (!isInCart) handleAddToCart();
                  else navigate("/cart");
                }}
              >
                <ShoppingCartOutlinedIcon fontSize="small" />
                {isInCart ? "Go to Cart" : "Add to Cart"}
              </button>

              <button
                className="flex-1 h-14 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold cursor-pointer"
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      buyNow: true,
                      product: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.images?.[0]?.url ?? "",
                        quantity: qty,
                      },
                    },
                  })
                }
              >
                <ShoppingBagOutlinedIcon fontSize="small" />
                Buy Now
              </button>
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <span className="inline-block text-xs font-semibold tracking-wide uppercase text-green-700 bg-green-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}

            {/* Product name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight -mt-2">
              {product.name}
            </h1>

            {/* Rating summary inline */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 -mt-2">
                <div className="flex items-center gap-1.5 bg-green-700 text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                  {avgRating.toFixed(1)} ★
                </div>
                <span className="text-sm text-gray-500">
                  Based on {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}

            {/* Price block */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-green-700">
                  ₹{product.price.toLocaleString()}
                </span>

                {mrp && mrp > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{mrp.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Inclusive of all taxes
              </p>

              {/* Trust badges row */}
              {/* <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                <TrustBadge
                  icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />}
                  text="Free shipping above ₹499"
                />
                <TrustBadge
                  icon={<CachedOutlinedIcon sx={{ fontSize: 18 }} />}
                  text="Easy 7-day returns"
                />
                <TrustBadge
                  icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />}
                  text="100% authentic"
                />
              </div> */}
            </div>

            {/* Ingredients & Description */}
            {product.ingredients && (
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <SpaOutlinedIcon
                    className="text-green-600"
                    sx={{ fontSize: 20 }}
                  />
                  <h2 className="text-base font-bold text-gray-900">
                    Key Ingredients
                  </h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line pl-7">
                  {product.ingredients}
                </p>
              </section>
            )}

            {product.description && (
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  About this product
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </section>
            )}

            {(product.ingredients || product.description) && (
              <hr className="border-gray-200" />
            )}

            {/* Shipping & Policies */}
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Shipping & Policies
              </h2>
              <div className="space-y-4">
                <PolicyRow
                  icon={<LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />}
                  title="Delivery"
                  description="Orders are dispatched within 1–2 business days. Standard delivery takes 4–7 business days depending on your location."
                />
                <PolicyRow
                  icon={<CachedOutlinedIcon sx={{ fontSize: 20 }} />}
                  title="Returns & Exchange"
                  description="We accept returns within 24 hours of delivery for damaged or unsealed products. Refunds are processed within 5–7 business days."
                />
                <PolicyRow
                  icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 20 }} />}
                  title="Quality Guarantee"
                  description="All our products go through rigorous quality checks. If you receive a damaged or defective item, we'll replace it at no extra cost."
                />
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Policy Quick Links */}
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-3">
                Know More
              </h2>
              <div className="space-y-0 rounded-xl border border-gray-200 overflow-hidden">
                <PolicyLink
                  to="/return-refund-policy"
                  icon={
                    <AssignmentReturnOutlinedIcon sx={{ fontSize: 20 }} />
                  }
                  label="Return & Refund Policy"
                />
                <PolicyLink
                  to="/shipping-policy"
                  icon={<LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />}
                  label="Shipping Policy"
                />
                <PolicyLink
                  to="/terms-and-conditions"
                  icon={<GavelOutlinedIcon sx={{ fontSize: 20 }} />}
                  label="Terms & Conditions"
                />
                <PolicyLink
                  to="/privacy-policy"
                  icon={<ShieldOutlinedIcon sx={{ fontSize: 20 }} />}
                  label="Privacy Policy"
                  last
                />
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Reviews Section */}
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Customer Reviews
              </h2>

              {/* Rating overview bar */}
              {reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 mt-4 mb-6">
                  <div className="flex flex-col items-center justify-center gap-1 min-w-[100px]">
                    <span className="text-4xl font-bold text-gray-900">
                      {avgRating.toFixed(1)}
                    </span>
                    <Stars rating={avgRating} />
                    <span className="text-xs text-gray-500 mt-1">
                      {reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {ratingCounts.map(({ star, count }) => {
                      const pct =
                        reviews.length > 0
                          ? Math.round((count / reviews.length) * 100)
                          : 0;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-4 text-right text-gray-600 font-medium">
                            {star}
                          </span>
                          <span className="text-yellow-500 text-xs">★</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-xs text-gray-400 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {reviews.length === 0 && (
                <p className="text-gray-400 text-sm mt-3 mb-4">
                  No reviews yet. Be the first to review this product!
                </p>
              )}

              {/* Individual reviews */}
              <div className="space-y-4 mt-4">
                {reviews.map((r: any) => {
                  const isEditing = editingReviewId === r.id;

                  return (
                    <article
                      key={r.id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {r.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-sm">
                              {r.user.name}
                            </span>
                            {isEditing ? (
                              <div className="mt-0.5">
                                <StarRating
                                  value={editRating}
                                  onChange={setEditRating}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Stars rating={r.rating} />
                              </div>
                            )}
                          </div>
                        </div>

                        {user?.id === r.user.id && (
                          <div className="flex gap-2 text-sm">
                            {!isEditing && (
                              <button
                                onClick={() => {
                                  setEditingReviewId(r.id);
                                  setEditRating(r.rating);
                                  setEditComment(r.comment ?? "");
                                }}
                                className="text-green-700 hover:text-green-800 flex items-center gap-1 font-medium cursor-pointer"
                              >
                                <EditIcon sx={{ fontSize: 16 }} />
                                Edit
                              </button>
                            )}

                            <button
                              onClick={() => deleteReview(r.id)}
                              className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <>
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="w-full border border-green-200 rounded-xl mt-3 p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            rows={3}
                          />

                          <div className="flex gap-3 mt-3">
                            <button
                              onClick={async () => {
                                await updateReview({
                                  id: r.id,
                                  rating: editRating,
                                  comment: editComment,
                                }).unwrap();
                                setEditingReviewId(null);
                              }}
                              className="bg-green-700 text-white px-5 py-2 rounded-xl hover:bg-green-800 font-medium text-sm cursor-pointer"
                            >
                              Save Changes
                            </button>

                            <button
                              onClick={() => setEditingReviewId(null)}
                              className="text-gray-600 hover:text-gray-800 font-medium text-sm cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        r.comment && (
                          <p className="text-gray-600 mt-2 text-sm pl-11">
                            {r.comment}
                          </p>
                        )
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Review CTA */}
              <div className="pt-4">
                {!user && (
                  <p className="text-sm text-gray-500">
                    Please{" "}
                    <Link
                      to="/login"
                      className="text-green-700 hover:text-green-800 font-medium underline"
                    >
                      login
                    </Link>{" "}
                    to write a review.
                  </p>
                )}

                {user && !canReview && (
                  <p className="text-sm text-gray-500">
                    Only verified buyers can write reviews.
                  </p>
                )}

                {user && canReview && hasReviewed && (
                  <p className="text-sm text-gray-500">
                    You have already reviewed this product.
                  </p>
                )}

                {user && canReview && !hasReviewed && (
                  <ReviewForm productId={product.id} />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ───── Helper Components ───── */

// function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
//   return (
//     <div className="flex items-center gap-1.5 text-xs text-gray-600">
//       <span className="text-green-600">{icon}</span>
//       {text}
//     </div>
//   );
// }

function PolicyRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function PolicyLink({
  to,
  icon,
  label,
  last = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  last?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${
        last ? "" : "border-b border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-green-600">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <ArrowForwardIosIcon sx={{ fontSize: 14 }} className="text-gray-400" />
    </Link>
  );
}