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

  return (
    <article
      onClick={goToDetails}
      className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 p-4 flex flex-col cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goToDetails()}
    >
      {/* Image */}
      <ImageCarousel images={product.images ?? []} variant="card" />

      {/* Content */}
      <div className="mt-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          {/* Price */}
          <p className="text-xl font-bold text-green-700">
            ₹{product.price.toLocaleString()}
          </p>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl"
            >
              <ShoppingCartOutlinedIcon fontSize="small" />
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
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
