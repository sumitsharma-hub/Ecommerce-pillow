import { useState, useRef } from "react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "../../features/admin/adminProductApi";
import { productFormSchema } from "../../validation/product.schema";

type ExistingImage = {
  id: number;
  url: string;
};

export default function AdminProducts() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  console.log('Base URL:', baseUrl);
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] =
    useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const [createImages, setCreateImages] = useState<File[]>([]);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newEditImages, setNewEditImages] = useState<File[]>([]);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const mapZodErrors = (issues: any[]) => {
    const errors: Record<string, string> = {};
    issues.forEach((issue) => {
      const key = issue.path[0];
      if (key) errors[key] = issue.message;
    });
    return errors;
  };

  /* ================= CREATE ================= */

  const handleCreate = async () => {
    const parsed = productFormSchema.safeParse({
      name: createForm.name,
      price: Number(createForm.price),
      category: createForm.category,
      description: createForm.description,
      images: createImages,
    });

    if (!parsed.success) {
      setCreateErrors(mapZodErrors(parsed.error.issues));
      return;
    }

    setCreateErrors({});

    try {
      const formData = new FormData();
      formData.append("name", createForm.name);
      formData.append("price", createForm.price);
      formData.append("category", createForm.category);
      formData.append("description", createForm.description);

      createImages.forEach((file) => {
        formData.append("images", file);
      });

      await createProduct(formData).unwrap();

      setCreateForm({ name: "", price: "", category: "", description: "" });
      setCreateImages([]);
      setCreateErrors({});
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
      setCreateErrors({ submit: "Failed to create product. Please try again." });
    }
  };

  /* ================= EDIT ================= */

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      description: product.description || "",
    });
    setExistingImages(product.images || []);
    setNewEditImages([]);
    setEditErrors({});
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const parsed = productFormSchema.partial().safeParse({
      name: editForm.name,
      price: Number(editForm.price),
      category: editForm.category,
      description: editForm.description,
      images: [...existingImages, ...newEditImages],
    });

    if (!parsed.success) {
      setEditErrors(mapZodErrors(parsed.error.issues));
      return;
    }

    setEditErrors({});

    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("price", editForm.price);
      formData.append("category", editForm.category);
      formData.append("description", editForm.description);

      existingImages.forEach((img) =>
        formData.append("existingImageIds", String(img.id))
      );

      newEditImages.forEach((file) => {
        formData.append("images", file);
      });

      await updateProduct({ id: editingId, data: formData }).unwrap();

      setEditingId(null);
      setEditErrors({});
      setNewEditImages([]);
      setExistingImages([]);
    } catch (error) {
      console.error("Error updating product:", error);
      setEditErrors({ submit: "Failed to update product. Please try again." });
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({ name: "", price: "", category: "", description: "" });
    setCreateImages([]);
    setCreateErrors({});
  };

  const closeEditModal = () => {
    setEditingId(null);
    setEditForm({ name: "", price: "", category: "", description: "" });
    setExistingImages([]);
    setNewEditImages([]);
    setEditErrors({});
  };

  const filteredProducts = products.filter(
    (p: any) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl transition-all font-semibold text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-4">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No products found</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 text-violet-600 font-medium hover:text-violet-700"
            >
              Add your first product
            </button>
          </div>
        ) : (
          filteredProducts.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-violet-50 to-rose-50 overflow-hidden">
                {product.images?.[0]?.url ? (
                  <img
                    src={`${baseUrl}${product.images[0].url}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-violet-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Image count badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                  {product.images?.length || 0} images
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-violet-600 transition-colors">
                      {product.name}
                    </h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-violet-50 text-violet-600 text-xs font-medium rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">₹{product.price?.toLocaleString()}</p>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => startEdit(product)}
                    className="flex-1 px-4 py-2.5 bg-violet-50 text-violet-600 rounded-xl hover:bg-violet-100 transition-all font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(product.id)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal onClose={closeCreateModal} title="Add New Product">
          <ProductForm
            form={createForm}
            setForm={setCreateForm}
            images={createImages}
            setImages={setCreateImages}
            errors={createErrors}
            onSubmit={handleCreate}
            onCancel={closeCreateModal}
            loading={isCreating}
            submitLabel="Create Product"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editingId && (
        <Modal onClose={closeEditModal} title="Edit Product">
          <ProductForm
            form={editForm}
            setForm={setEditForm}
            images={newEditImages}
            setImages={setNewEditImages}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
            errors={editErrors}
            onSubmit={handleUpdate}
            onCancel={closeEditModal}
            loading={isUpdatingProduct}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Product</h2>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= PRODUCT FORM ================= */

interface ProductFormProps {
  form: {
    name: string;
    price: string;
    category: string;
    description: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    name: string;
    price: string;
    category: string;
    description: string;
  }>>;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages?: ExistingImage[];
  setExistingImages?: React.Dispatch<React.SetStateAction<ExistingImage[]>>;
  errors: Record<string, string>;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  submitLabel: string;
}

function ProductForm({
  form,
  setForm,
  images,
  setImages,
  existingImages = [],
  setExistingImages,
  errors,
  onSubmit,
  onCancel,
  loading,
  submitLabel,
}: ProductFormProps) {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id: number) => {
    if (setExistingImages) {
      setExistingImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      {/* Error Alert */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Memory Foam Pillow"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all ${
              errors.name ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 1999"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all ${
              errors.price ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Bedroom, Living Room"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all ${
            errors.category ? "border-red-300" : "border-gray-200"
          }`}
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Describe your product..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all resize-none"
        />
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images <span className="text-red-500">*</span>
        </label>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Current Images</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200"
                >
                  <img
                    src={`${baseUrl}${img.url}`}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Preview */}
        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">
              {existingImages.length > 0 ? "New Images to Upload" : "Selected Images"}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border-2 border-violet-200 bg-violet-50"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-violet-500 text-white text-xs rounded-full font-medium">
                      New
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-violet-500 bg-violet-50"
              : "border-gray-300 hover:border-violet-400 hover:bg-violet-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                isDragging ? "bg-violet-200" : "bg-violet-100"
              }`}
            >
              <svg
                className={`w-7 h-7 transition-colors ${
                  isDragging ? "text-violet-600" : "text-violet-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-700">
                {isDragging ? "Drop images here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>
        </div>

        {errors.images && (
          <p className="mt-2 text-sm text-red-500">{errors.images}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
}

/* ================= MODAL ================= */

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
      </div>
    </div>
  );
}