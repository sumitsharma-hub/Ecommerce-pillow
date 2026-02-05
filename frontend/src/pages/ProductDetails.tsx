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
import Footer from "../components/Footer";

export default function ProductDetails() {
  const { productCode } = useParams<{ productCode: string }>();
  const { data: product, isLoading } = useGetProductByCodeQuery(productCode!);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const qty  = 1;
//   const [qty, setQty] = useState(1);

  const { data: reviews = [] } = useGetReviewsQuery(product?.id!, {
    skip: !product?.id,
  });

  const user = useAppSelector((state) => state.auth.user);

  const { data: canReviewData } = useCanReviewQuery(product?.id!, {
    skip: !product?.id || !user,
  });
  const canReview = canReviewData?.canReview ?? false;

  const hasReviewed = user ? reviews.some((r) => r.user.id === user.id) : false;

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  const isInCart = useAppSelector(selectIsInCart(product?.id));

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Product not found
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images + Quick Actions */}
        <div className="sticky top-24 self-start lg:col-span-1">
          <ImageCarousel images={product.images ?? []} variant="details" />

          <div className="mt-6 flex gap-2">
            {/* <button
              onClick={handleAddToCart}
              className="flex-1 h-15 text-m bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
            >
              <ShoppingCartOutlinedIcon fontSize="small" />
              Add to Cart
            </button> */}
            <button
              className="flex-1 h-15 text-m bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
              onClick={() => {
                if (!isInCart) handleAddToCart();
                else navigate("/cart");
              }}
            >
              <ShoppingCartOutlinedIcon />
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>

            {/* <button
              onClick={handleAddToCart}
              className="flex-1 h-15 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-m font-medium cursor-pointer"
            >
              <ShoppingBagOutlinedIcon fontSize="small" />
              Buy Now
            </button> */}
            <button
              className="flex-1 h-15 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-m font-medium cursor-pointer"
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

        {/* Product Info */}
        <div className="lg:col-span-1 space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium"
          >
            <ArrowBackIosNewIcon fontSize="small" />
            Back to products
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-green-700">
              {avgRating.toFixed(1)}
            </span>
            <Stars rating={avgRating} />
            <span className="text-sm text-gray-500">
              ({reviews.length} reviews)
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
            <p className="text-3xl font-bold text-green-700 mb-4">
              ₹{product.price.toLocaleString()}
            </p>
          </div>

          <Section title="Ingredients">
            <p className="text-gray-600">
              Premium natural ingredients, breathable organic cotton,
              hypoallergenic materials sourced from sustainable farms.
            </p>
          </Section>

          {/* Reviews */}
          <section className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>

            <div className="space-y-4 mb-6">
              {reviews.map((r) => {
                const isEditing = editingReviewId === r.id;

                return (
                  <article
                    key={r.id}
                    className="border-b border-green-50 pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isEditing ? (
                          <StarRating
                            value={editRating}
                            onChange={setEditRating}
                          />
                        ) : (
                          <Stars rating={r.rating} />
                        )}
                        <span className="font-semibold text-gray-800">
                          {r.user.name}
                        </span>
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
                              <EditIcon fontSize="small" />
                              Edit
                            </button>
                          )}

                          <button
                            onClick={() => deleteReview(r.id)}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
                          >
                            <DeleteIcon fontSize="small" />
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
                          className="w-full border border-green-200 rounded-xl mt-3 p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                            className="bg-green-700 text-white px-5 py-2 rounded-xl hover:bg-green-800 font-medium"
                          >
                            Save Changes
                          </button>

                          <button
                            onClick={() => setEditingReviewId(null)}
                            className="text-gray-600 hover:text-gray-800 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 mt-3 ml-8">{r.comment}</p>
                    )}
                  </article>
                );
              })}
            </div>

            <div>
              {!user && (
                <p className="text-sm text-gray-500">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-green-700 hover:text-green-800 font-medium"
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
      <Footer />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-600">{children}</div>
    </div>
  );
}
