import ImageCarousel from "./ImageCarousel";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addToCart, selectIsInCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

interface Product {
  id: number;
  productCode: string;
  name: string;
  description?: string;
  price: number;
  mrp?: number; // ✅ added
  images?: { url: string }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isInCart = useAppSelector(selectIsInCart(product.id));

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images?.[0]?.url ?? "",
          quantity: 1,
        }),
      );
    } else {
      navigate("/cart");
    }
  };

  const goToDetails = () => {
    navigate(`/products/${product.productCode}`);
  };

  // ✅ same logic as ProductDetails
  const mrp = product.mrp ?? null;
  const hasDiscount = !!mrp && mrp > product.price;
  const discount = hasDiscount
    ? Math.round(((mrp - product.price) / mrp) * 100)
    : 0;

  return (
    <article
      onClick={goToDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetails();
        }
      }}
      className="h-full bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 p-2.5 sm:p-3 lg:p-4 flex flex-col cursor-pointer group"
    >
      {/* Image */}
      <ImageCarousel images={product.images ?? []} variant="card" />

      {/* Content */}
      <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 sm:pt-4">
          {/* ✅ Price block */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-base sm:text-lg lg:text-xl font-bold text-emerald-700">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {hasDiscount && (
              <>
                <p className="text-xs sm:text-sm text-gray-400 line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </p>
                <span className="text-[10px] sm:text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-2.5 sm:mt-3 grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-full bg-gray-900 text-white py-2 sm:py-2.5 rounded-xl hover:bg-black transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5"
            >
              <ShoppingCartOutlinedIcon fontSize="small" />
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/checkout", {
                  state: {
                    buyNow: true,
                    product: {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      imageUrl: product.images?.[0]?.url ?? "",
                      quantity: 1,
                    },
                  },
                });
              }}
              className="w-full bg-emerald-600 text-white py-2 sm:py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5"
            >
              <ShoppingBagOutlinedIcon fontSize="small" />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}