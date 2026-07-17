import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { productService } from '../../services/productService';
import ImageUploader from '../../components/ui/ImageUploader';
import Pagination from '../../components/shop/Pagination';
import { successToast, errorToast } from '../../utils/toast';

export default function AdminProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedActive, setSelectedActive] = useState('');
  const [selectedFeatured, setSelectedFeatured] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add / Edit / Delete Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [targetProduct, setTargetProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Games',
    platform: 'PS5',
    brand: 'GameHub',
    condition: 'New',
    price: '',
    discount: '0',
    stock: '10',
    images: [],
    featured: false,
    isActive: true,
    rentalAvailable: false,
    rentalPricePerDay: ''
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productService.getAllProductsAdmin();
      if (res.success) {
        setAllProducts(res.data || []);
      } else {
        setError('Failed to fetch admin product list.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Games',
      platform: 'PS5',
      brand: 'GameHub',
      condition: 'New',
      price: '',
      discount: '0',
      stock: '10',
      images: [],
      featured: false,
      isActive: true,
      rentalAvailable: false,
      rentalPricePerDay: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImagesChange = (urls) => {
    setFormData((prev) => ({
      ...prev,
      images: urls
    }));
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product) => {
    setTargetProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      category: product.category || 'Games',
      platform: product.platform || 'PS5',
      brand: product.brand || 'GameHub',
      condition: product.condition === 'Pre-owned' ? 'Used' : 'New',
      price: product.buyPrice || '',
      discount: product.discount || '0',
      stock: product.stock !== undefined ? product.stock.toString() : '10',
      images: product.images || [],
      featured: product.featured || false,
      isActive: product.isActive !== undefined ? product.isActive : true,
      rentalAvailable: product.rentalAvailable || false,
      rentalPricePerDay: product.rentalPricePerDay || ''
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (product) => {
    setTargetProduct(product);
    setShowDeleteModal(true);
  };

  // Add Product Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.brand) {
      errorToast('Please populate all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        platform: [formData.platform],
        brand: formData.brand,
        condition: formData.condition,
        price: parseFloat(formData.price) || 0,
        discount: parseFloat(formData.discount) || 0,
        stock: parseInt(formData.stock, 10) || 0,
        images: formData.images,
        featured: formData.featured,
        isActive: formData.isActive,
        rentalAvailable: formData.rentalAvailable,
        rentalPricePerDay: formData.rentalAvailable ? (parseFloat(formData.rentalPricePerDay) || 0) : 0
      };

      const res = await productService.createProduct(payload);
      if (res.success) {
        successToast('Product created successfully!');
        fetchProducts();
        setShowAddModal(false);
        resetForm();
      } else {
        errorToast(res.error || 'Failed to create product.');
      }
    } catch (err) {
      console.error(err);
      errorToast('Error occurred while adding product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Product Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.brand) {
      errorToast('Please populate all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        platform: [formData.platform],
        brand: formData.brand,
        condition: formData.condition,
        price: parseFloat(formData.price) || 0,
        discount: parseFloat(formData.discount) || 0,
        stock: parseInt(formData.stock, 10) || 0,
        images: formData.images,
        featured: formData.featured,
        isActive: formData.isActive,
        rentalAvailable: formData.rentalAvailable,
        rentalPricePerDay: formData.rentalAvailable ? (parseFloat(formData.rentalPricePerDay) || 0) : 0
      };

      const res = await productService.updateProduct(targetProduct.id, payload);
      if (res.success) {
        successToast('Product updated successfully!');
        fetchProducts();
        setShowEditModal(false);
      } else {
        errorToast(res.error || 'Failed to update product.');
      }
    } catch (err) {
      console.error(err);
      errorToast('Error occurred while editing product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product Submit
  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await productService.deleteProduct(targetProduct.id);
      if (res.success) {
        successToast('Product deleted successfully (soft delete).');
        fetchProducts();
        setShowDeleteModal(false);
      } else {
        errorToast(res.error || 'Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
      errorToast('Error occurred during deletion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchCategory = selectedCategory ? p.category === selectedCategory : true;
        const matchPlatform = selectedPlatform ? p.platform === selectedPlatform : true;
        
        const matchActive = selectedActive === 'active' 
          ? p.isActive 
          : selectedActive === 'inactive' 
          ? !p.isActive 
          : true;

        const matchFeatured = selectedFeatured === 'featured'
          ? p.featured
          : selectedFeatured === 'non-featured'
          ? !p.featured
          : true;

        return matchSearch && matchCategory && matchPlatform && matchActive && matchFeatured;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'price-asc') return (a.buyPrice || 0) - (b.buyPrice || 0);
        if (sortBy === 'price-desc') return (b.buyPrice || 0) - (a.buyPrice || 0);
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        return 0;
      });
  }, [allProducts, searchQuery, selectedCategory, selectedPlatform, selectedActive, selectedFeatured, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const skip = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(skip, skip + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset page when filters adjust
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPlatform, selectedActive, selectedFeatured, sortBy]);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-gaming text-xl font-black text-white tracking-wider uppercase">
            Platform Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredProducts.length} items in products collection database.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="h-10 px-5 rounded-xl bg-gaming-cyan text-gaming-black hover:bg-gaming-cyan/85 font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Add Product
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-gaming-card/30 border border-gaming-border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search catalog items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 transition-all"
            />
          </div>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-gaming-black/40 border border-gaming-border text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Games">Games</option>
            <option value="Consoles">Consoles</option>
            <option value="Hardware">Hardware</option>
            <option value="Accessories">Accessories</option>
          </select>

          {/* Platform Select */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-gaming-black/40 border border-gaming-border text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">All Platforms</option>
            <option value="PS5">PS5</option>
            <option value="PS4">PS4</option>
            <option value="XBOX">Xbox</option>
            <option value="PC">PC</option>
          </select>

          {/* Active filter */}
          <select
            value={selectedActive}
            onChange={(e) => setSelectedActive(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-gaming-black/40 border border-gaming-border text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Featured filter */}
          <select
            value={selectedFeatured}
            onChange={(e) => setSelectedFeatured(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-gaming-black/40 border border-gaming-border text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">All Featured</option>
            <option value="featured">Featured Only</option>
            <option value="non-featured">Standard Only</option>
          </select>

        </div>

        {/* Sorting Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gaming-border/30">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer border-none p-0"
            >
              <option value="newest">Created Date: Newest First</option>
              <option value="oldest">Created Date: Oldest First</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table view */}
      <div className="rounded-2xl border border-gaming-border bg-gaming-card/25 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-gaming-cyan animate-spin" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
              Syncing Catalog Database...
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sync Error</h4>
              <p className="text-xs text-slate-500 leading-normal">{error}</p>
            </div>
            <button
              onClick={fetchProducts}
              className="mt-2 h-9 px-4 rounded-xl border border-gaming-border bg-gaming-black/50 hover:bg-gaming-black text-xs font-bold text-white transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <AlertCircle className="h-10 w-10 text-slate-500" />
            <div className="space-y-1 text-center">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">No Products Found</h4>
              <p className="text-xs text-slate-500 leading-normal">
                No items match your active search filter query.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-gaming-border bg-gaming-black/30 font-gaming text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="py-4 px-5 w-16">Thumbnail</th>
                  <th className="py-4 px-5">Product Name</th>
                  <th className="py-4 px-5 w-32">Category</th>
                  <th className="py-4 px-5 w-24">Platform</th>
                  <th className="py-4 px-5 w-28">Buy Price</th>
                  <th className="py-4 px-5 w-28">Rent Price</th>
                  <th className="py-4 px-5 w-24">Stock</th>
                  <th className="py-4 px-5 w-24">Featured</th>
                  <th className="py-4 px-5 w-24">Active</th>
                  <th className="py-4 px-5 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gaming-border/30 text-xs">
                {paginatedProducts.map((p) => {
                  const hasStockAlert = p.stock <= 5;
                  return (
                    <tr key={p.id} className="hover:bg-gaming-black/15 transition-colors">
                      <td className="py-4 px-5">
                        <div className="w-10 h-10 rounded-lg border border-gaming-border overflow-hidden bg-gaming-black/40">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-5 font-semibold text-white">
                        <div className="truncate max-w-[200px]" title={p.title}>{p.title}</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                          {p.brand || 'GameHub'} • {p.condition}
                        </div>
                      </td>
                      <td className="py-4 px-5">{p.category}</td>
                      <td className="py-4 px-5 font-bold uppercase text-slate-400">{p.platform}</td>
                      <td className="py-4 px-5 font-bold text-white">${(p.buyPrice || 0).toFixed(2)}</td>
                      <td className="py-4 px-5">
                        {p.rentalAvailable ? (
                          <span className="font-bold text-gaming-cyan">${(p.rentalPricePerDay || 0).toFixed(2)}/d</span>
                        ) : (
                          <span className="text-slate-600 font-semibold">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`font-bold ${hasStockAlert ? 'text-red-500' : 'text-slate-300'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {p.featured ? (
                          <Star className="h-4.5 w-4.5 fill-gaming-cyan text-gaming-cyan" />
                        ) : (
                          <Star className="h-4.5 w-4.5 text-slate-600" />
                        )}
                      </td>
                      <td className="py-4 px-5">
                        {p.isActive ? (
                          <CheckCircle className="h-4.5 w-4.5 text-green-400" />
                        ) : (
                          <XCircle className="h-4.5 w-4.5 text-red-500" />
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 rounded-lg border border-gaming-border bg-gaming-black/30 hover:border-gaming-cyan hover:text-gaming-cyan transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(p)}
                            className="p-2 rounded-lg border border-gaming-border bg-gaming-black/30 hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination component */}
      {!isLoading && !error && filteredProducts.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD PRODUCT */}
      {/* ==================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/85 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-2xl bg-gaming-card border border-gaming-border rounded-3xl p-6 md:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
              <h3 className="font-gaming text-base font-bold text-white tracking-wider">
                Create Catalog Product
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded bg-gaming-black text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5 text-xs text-left">
              {/* Row 1: title, brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Marvel Spider-Man 2"
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Sony / Ubisoft / EA"
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Insert long product summary information..."
                  className="w-full p-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 resize-none leading-relaxed"
                />
              </div>

              {/* Row 2: category, platform, condition, stock */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Games">Games</option>
                    <option value="Consoles">Consoles</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Platform *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="PS5">PS5</option>
                    <option value="PS4">PS4</option>
                    <option value="XBOX">Xbox</option>
                    <option value="PC">PC</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="New">Brand New</option>
                    <option value="Used">Used</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Stock Limit
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>
              </div>

              {/* Row 3: price, discount, rental flag, rental price */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="59.99"
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Rental Option
                  </label>
                  <select
                    name="rentalAvailable"
                    value={formData.rentalAvailable ? 'true' : 'false'}
                    onChange={(e) => setFormData((p) => ({ ...p, rentalAvailable: e.target.value === 'true' }))}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="false">Purchase Only</option>
                    <option value="true">Rent & Buy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Rental Price / Day ($)
                  </label>
                  <input
                    type="number"
                    name="rentalPricePerDay"
                    step="0.01"
                    min="0"
                    disabled={!formData.rentalAvailable}
                    value={formData.rentalPricePerDay}
                    onChange={handleInputChange}
                    placeholder={formData.rentalAvailable ? '4.99' : 'N/A'}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60 disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Cover & Gallery Images upload */}
              <ImageUploader
                value={formData.images}
                onChange={handleImagesChange}
                multiple={true}
                label="Product Images Gallery"
              />

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-3">
                <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4.5 h-4.5 rounded border-gaming-border bg-gaming-black accent-gaming-cyan cursor-pointer"
                  />
                  Featured Listing
                </label>

                <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4.5 h-4.5 rounded border-gaming-border bg-gaming-black accent-gaming-cyan cursor-pointer"
                  />
                  Active Status (Online)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-gaming-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-11 px-6 rounded-xl border border-gaming-border hover:bg-gaming-black/45 text-slate-400 hover:text-white transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl bg-gaming-cyan text-gaming-black hover:bg-gaming-cyan/85 transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ==================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/85 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          
          <div className="relative w-full max-w-2xl bg-gaming-card border border-gaming-border rounded-3xl p-6 md:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
              <h3 className="font-gaming text-base font-bold text-white tracking-wider">
                Edit Catalog Product
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded bg-gaming-black text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5 text-xs text-left">
              {/* Row 1: title, brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Marvel Spider-Man 2"
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Sony / Ubisoft / EA"
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Insert long product summary information..."
                  className="w-full p-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 resize-none leading-relaxed"
                />
              </div>

              {/* Row 2: category, platform, condition, stock */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Games">Games</option>
                    <option value="Consoles">Consoles</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Platform *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="PS5">PS5</option>
                    <option value="PS4">PS4</option>
                    <option value="XBOX">Xbox</option>
                    <option value="PC">PC</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="New">Brand New</option>
                    <option value="Used">Used</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Stock Limit
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>
              </div>

              {/* Row 3: price, discount, rental flag, rental price */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="59.99"
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Rental Option
                  </label>
                  <select
                    name="rentalAvailable"
                    value={formData.rentalAvailable ? 'true' : 'false'}
                    onChange={(e) => setFormData((p) => ({ ...p, rentalAvailable: e.target.value === 'true' }))}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="false">Purchase Only</option>
                    <option value="true">Rent & Buy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Rental Price / Day ($)
                  </label>
                  <input
                    type="number"
                    name="rentalPricePerDay"
                    step="0.01"
                    min="0"
                    disabled={!formData.rentalAvailable}
                    value={formData.rentalPricePerDay}
                    onChange={handleInputChange}
                    placeholder={formData.rentalAvailable ? '4.99' : 'N/A'}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60 disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Cover & Gallery Images upload */}
              <ImageUploader
                value={formData.images}
                onChange={handleImagesChange}
                multiple={true}
                label="Product Images Gallery"
              />

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-3">
                <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4.5 h-4.5 rounded border-gaming-border bg-gaming-black accent-gaming-cyan cursor-pointer"
                  />
                  Featured Listing
                </label>

                <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4.5 h-4.5 rounded border-gaming-border bg-gaming-black accent-gaming-cyan cursor-pointer"
                  />
                  Active Status (Online)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-gaming-border/60">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="h-11 px-6 rounded-xl border border-gaming-border hover:bg-gaming-black/45 text-slate-400 hover:text-white transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl bg-gaming-cyan text-gaming-black hover:bg-gaming-cyan/85 transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: DELETE PRODUCT */}
      {/* ==================================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/85 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          
          <div className="relative w-full max-w-md bg-gaming-card border border-gaming-border rounded-2xl p-6 text-center space-y-6 z-10">
            <div className="mx-auto w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] animate-pulse">
              <AlertCircle className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider">
                Remove Catalog Product?
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                Are you sure you want to deactivate <strong className="text-white">"{targetProduct?.title}"</strong>?
                This action runs a soft delete deactivation.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="h-10 px-5 rounded-xl border border-gaming-border hover:bg-gaming-black/45 text-slate-400 hover:text-white transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deactivating
                  </>
                ) : (
                  'Yes, Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
