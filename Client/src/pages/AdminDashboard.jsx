import { GripVertical, ImagePlus, PackagePlus, Percent, RefreshCw, Tags, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { products as fallbackProducts } from "../data/products.js";
import { apiRequest, clearApiCache } from "../utils/api.js";
import { formatCurrency } from "../utils/currency.js";

const emptyProduct = {
  title: "",
  slug: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  catalog: "Core",
  stock: "",
  sizes: "S, M, L, XL",
  colors: "",
  images: [""]
};

const orderStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toProductPayload(form) {
  return {
    ...form,
    price: Number(form.price),
    discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
    stock: Number(form.stock || 0),
    sizes: form.sizes.split(",").map((item) => item.trim()).filter(Boolean),
    colors: form.colors.split(",").map((item) => item.trim()).filter(Boolean),
    images: form.images.map((item) => item.trim()).filter(Boolean)
  };
}

function createImagePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function displayPrice(product) {
  return formatCurrency(product.discountPrice || product.price);
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [dragIndex, setDragIndex] = useState(null);

  const activeProducts = products.length ? products : fallbackProducts;
  const openOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
  const averageDiscount = useMemo(() => {
    const discounted = products.filter((product) => product.discountPrice && product.discountPrice < product.price);
    if (!discounted.length) return 0;
    const total = discounted.reduce((sum, product) => sum + (1 - product.discountPrice / product.price) * 100, 0);
    return Math.round(total / discounted.length);
  }, [products]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [summaryData, productData, categoryData, orderData] = await Promise.all([
        apiRequest("/admin/summary", { auth: true, cacheMs: 15000 }),
        apiRequest("/products", { cacheMs: 15000 }),
        apiRequest("/categories", { cacheMs: 30000 }),
        apiRequest("/orders", { auth: true })
      ]);
      setSummary(summaryData.summary);
      setProducts(productData.products);
      setCategories(categoryData.categories);
      setOrders(orderData.orders);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function updateProductField(field, value) {
    setProductForm((form) => ({
      ...form,
      [field]: value,
      slug: field === "title" && !form.slug ? slugify(value) : form.slug
    }));
  }

  function updateImageField(index, value) {
    setProductForm((form) => {
      const images = [...form.images];
      images[index] = value;
      return { ...form, images };
    });
  }

  function addImageSlot() {
    setProductForm((form) => ({ ...form, images: [...form.images, ""] }));
  }

  function removeImageSlot(index) {
    setProductForm((form) => {
      const images = form.images.filter((_, itemIndex) => itemIndex !== index);
      return { ...form, images: images.length ? images : [""] };
    });
  }

  function moveImageSlot(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;

    setProductForm((form) => {
      const images = [...form.images];
      const [moved] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, moved);
      return { ...form, images };
    });
  }

  async function appendImageFiles(files, targetIndex = null) {
    const items = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!items.length) return;

    const previews = await Promise.all(items.map((file) => createImagePreview(file)));
    setProductForm((form) => {
      const images = [...form.images];

      if (targetIndex === null) {
        images.push(...previews);
      } else {
        const next = [...images];
        let insertIndex = targetIndex;
        previews.forEach((preview) => {
          next[insertIndex] = preview;
          insertIndex += 1;
        });
        return { ...form, images: next };
      }

      return { ...form, images };
    });
  }

  function handleGalleryDrop(event, targetIndex = null) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files?.length) {
      appendImageFiles(files, targetIndex);
    }
    setDragIndex(null);
  }

  async function createProduct(event) {
    event.preventDefault();
    setMessage("");

    try {
      await apiRequest("/products", {
        method: "POST",
        auth: true,
        body: JSON.stringify(toProductPayload(productForm))
      });
      setProductForm(emptyProduct);
      clearApiCache("/products");
      await loadDashboard();
      setMessage("Product added.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function updateProduct(product, patch) {
    setMessage("");
    try {
      await apiRequest(`/products/${product._id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(patch)
      });
      clearApiCache("/products");
      await loadDashboard();
      setMessage("Product updated.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteProduct(product) {
    setMessage("");
    try {
      await apiRequest(`/products/${product._id}`, {
        method: "DELETE",
        auth: true
      });
      clearApiCache("/products");
      await loadDashboard();
      setMessage("Product archived.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function createCategory(event) {
    event.preventDefault();
    setMessage("");

    try {
      await apiRequest("/categories", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          ...categoryForm,
          slug: categoryForm.slug || slugify(categoryForm.name)
        })
      });
      setCategoryForm({ name: "", slug: "" });
      clearApiCache("/categories");
      await loadDashboard();
      setMessage("Category created.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function updateOrderStatus(order, status) {
    setMessage("");
    try {
      await apiRequest(`/orders/${order._id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status, paymentStatus: status === "paid" ? "paid" : order.paymentStatus })
      });
      await loadDashboard();
      setMessage("Order status updated.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  const stats = [
    { label: "Active products", value: summary?.products ?? activeProducts.length },
    { label: "Catalogs", value: summary?.categories ?? categories.length },
    { label: "Open orders", value: openOrders },
    { label: "Avg discount", value: `${averageDiscount}%` }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cedar">Admin</p>
          <h1 className="mt-2 text-4xl font-black">Mithri dashboard</h1>
          <p className="mt-3 max-w-2xl text-black/60">Manage products, stock, catalogs, discounts, pricing, and order status.</p>
        </div>
        <Button variant="secondary" onClick={loadDashboard}>
          <RefreshCw className="mr-2" size={17} />
          Refresh
        </Button>
      </div>

      {message ? <p className="mb-5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-cedar shadow-sm">{message}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-black/55">{stat.label}</p>
            <p className="mt-2 text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <form className="rounded-lg border border-black/10 bg-white p-6 shadow-sm" onSubmit={createProduct}>
            <div className="mb-5 flex items-center gap-3">
              <PackagePlus className="text-cedar" />
              <h2 className="text-xl font-black">Add product</h2>
            </div>
            <div className="mb-5 rounded-xl border border-dashed border-cedar/40 bg-paper/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-cedar">Cover photo / Gallery</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
                    Add multiple photos, drag them to reorder, or drop files directly into the gallery.
                  </p>
                </div>
                <Button type="button" variant="secondary" onClick={addImageSlot}>
                  <ImagePlus className="mr-2" size={17} />
                  Add photo
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Product title" required value={productForm.title} onChange={(event) => updateProductField("title", event.target.value)} />
              <Input label="Slug" required value={productForm.slug} onChange={(event) => updateProductField("slug", event.target.value)} />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Category</span>
                <select
                  className="focus-ring w-full rounded-md border border-black/15 bg-white px-4 py-3 text-sm"
                  required
                  value={productForm.category}
                  onChange={(event) => updateProductField("category", event.target.value)}
                >
                  <option value="">Choose category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <Input label="Catalog" value={productForm.catalog} onChange={(event) => updateProductField("catalog", event.target.value)} />
              <Input label="Price" required type="number" min="0" value={productForm.price} onChange={(event) => updateProductField("price", event.target.value)} />
              <Input label="Discount price" type="number" min="0" value={productForm.discountPrice} onChange={(event) => updateProductField("discountPrice", event.target.value)} />
              <Input label="Stock" type="number" min="0" value={productForm.stock} onChange={(event) => updateProductField("stock", event.target.value)} />
              <Input label="Colors" value={productForm.colors} onChange={(event) => updateProductField("colors", event.target.value)} />
              <Input label="Sizes" value={productForm.sizes} onChange={(event) => updateProductField("sizes", event.target.value)} />
              <div className="md:col-span-2">
                <div
                  className="rounded-xl border border-dashed border-cedar/40 bg-paper p-4"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleGalleryDrop(event)}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-sm font-black uppercase tracking-[0.22em] text-ink">Image gallery</span>
                      <p className="mt-1 text-xs font-semibold text-black/45">
                        Drop image files here or paste a link into any slot below.
                      </p>
                    </div>
                    <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-paper">
                      First image = cover
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {productForm.images.map((image, index) => (
                      <div
                        key={`product-image-${index}`}
                        className="grid gap-3 rounded-md border border-black/10 bg-white p-3 md:grid-cols-[88px_1fr_auto]"
                        draggable
                        onDragStart={() => setDragIndex(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          if (dragIndex !== null && dragIndex !== index) {
                            moveImageSlot(dragIndex, index);
                          } else {
                            handleGalleryDrop(event, index);
                          }
                        }}
                      >
                        <div className="flex items-center justify-center overflow-hidden rounded-md border border-black/10 bg-mist">
                          {image ? (
                            <img src={image} alt="" className="h-20 w-full object-cover" />
                          ) : (
                            <div className="flex h-20 w-full items-center justify-center text-xs font-black uppercase tracking-[0.2em] text-black/30">
                              Empty
                            </div>
                          )}
                        </div>
                        <label className="block">
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-cedar">Photo link</span>
                          <Input
                            label=""
                            placeholder="Paste a URL or drop an image file"
                            value={image}
                            onChange={(event) => updateImageField(index, event.target.value)}
                            onDrop={(event) => handleGalleryDrop(event, index)}
                            onDragOver={(event) => event.preventDefault()}
                          />
                        </label>
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            className="focus-ring mt-8 inline-flex h-11 w-11 items-center justify-center rounded-md border border-black/15 bg-white text-ink hover:border-cedar hover:text-cedar"
                            aria-label={`Drag photo ${index + 1}`}
                            title="Drag to reorder"
                          >
                            <GripVertical size={18} />
                          </button>
                          <button
                            type="button"
                            className="focus-ring mt-8 inline-flex h-11 w-11 items-center justify-center rounded-md border border-black/15 bg-white text-rust hover:border-rust hover:text-rust"
                            aria-label={`Remove photo ${index + 1}`}
                            onClick={() => removeImageSlot(index)}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-ink">Description</span>
              <textarea
                className="focus-ring min-h-28 w-full rounded-md border border-black/15 bg-white px-4 py-3 text-sm"
                required
                value={productForm.description}
                onChange={(event) => updateProductField("description", event.target.value)}
              />
            </label>
            <Button className="mt-4" type="submit">Add product</Button>
          </form>

          <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
            <div className="border-b border-black/10 p-5">
              <h2 className="text-xl font-black">Products</h2>
            </div>
            {loading ? (
              <p className="p-5 text-sm font-semibold text-black/55">Loading dashboard...</p>
            ) : (
              <div className="divide-y divide-black/10">
                {products.map((product) => (
                  <ProductAdminRow key={product._id} product={product} onSave={updateProduct} onDelete={deleteProduct} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <form className="rounded-lg border border-black/10 bg-white p-6 shadow-sm" onSubmit={createCategory}>
            <div className="mb-5 flex items-center gap-3">
              <Tags className="text-cedar" />
              <h2 className="text-xl font-black">Categories</h2>
            </div>
            <Input label="Category name" required value={categoryForm.name} onChange={(event) => setCategoryForm((form) => ({ ...form, name: event.target.value }))} />
            <Input className="mt-3" label="Slug" value={categoryForm.slug} onChange={(event) => setCategoryForm((form) => ({ ...form, slug: event.target.value }))} />
            <Button className="mt-4 w-full" variant="secondary" type="submit">Create category</Button>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category._id} className="rounded-full bg-cedar/10 px-3 py-1 text-sm font-bold text-cedar">{category.name}</span>
              ))}
            </div>
          </form>

          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Percent className="text-rust" />
              <h2 className="text-xl font-black">Orders</h2>
            </div>
            <div className="space-y-3">
              {orders.length ? orders.slice(0, 8).map((order) => (
                <div key={order._id} className="rounded-md border border-black/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{order.user?.name ?? "Customer"}</p>
                      <p className="text-sm text-black/55">{formatCurrency(order.total)} / {order.items.length} item(s)</p>
                    </div>
                    <select
                      className="focus-ring rounded-md border border-black/15 bg-white px-2 py-1 text-sm font-semibold"
                      value={order.status}
                      onChange={(event) => updateOrderStatus(order, event.target.value)}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )) : <p className="text-sm text-black/55">No orders yet.</p>}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ProductAdminRow({ product, onSave, onDelete }) {
  const [price, setPrice] = useState(product.price);
  const [discountPrice, setDiscountPrice] = useState(product.discountPrice ?? "");
  const [stock, setStock] = useState(product.stock);

  return (
    <div className="grid gap-4 p-5 lg:grid-cols-[1fr_120px_140px_110px_auto] lg:items-end">
      <div>
        <p className="font-bold">{product.title}</p>
        <p className="text-sm text-black/55">
          {product.category?.name ?? "Uncategorized"} / {product.catalog} / {displayPrice(product)}
        </p>
      </div>
      <Input label="Price" type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} />
      <Input label="Discount" type="number" min="0" value={discountPrice} onChange={(event) => setDiscountPrice(event.target.value)} />
      <Input label="Stock" type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} />
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => onSave(product, {
            price: Number(price),
            discountPrice: discountPrice ? Number(discountPrice) : null,
            stock: Number(stock)
          })}
        >
          Save
        </Button>
        <Button className="px-3 text-rust" variant="ghost" aria-label={`Delete ${product.title}`} onClick={() => onDelete(product)}>
          <Trash2 size={17} />
        </Button>
      </div>
    </div>
  );
}
