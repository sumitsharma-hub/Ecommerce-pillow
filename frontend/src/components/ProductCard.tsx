import ImageCarousel from "./ImageCarousel";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  images?: { url: string }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0]?.url ?? "",
        quantity: 1,
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <ImageCarousel images={product.images?? []} />

      <h3 className="mt-4 font-semibold text-lg text-gray-800">
        {product.name}
      </h3>

      {product.description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="mt-auto">
        <p className="mt-3 text-xl font-bold text-gray-900">
          ₹{product.price}
        </p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={() => {
              handleAddToCart();
              navigate("/cart");
            }}
            className="flex-1 bg-violet-600 text-white py-2 rounded-full hover:bg-violet-700 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
