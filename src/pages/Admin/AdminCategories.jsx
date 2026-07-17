import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import ImageUploader from '../../components/ui/ImageUploader';
import Pagination from '../../components/shop/Pagination';
import { successToast, errorToast } from '../../utils/toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc'); // name-asc, name-desc, date-newest, date-oldest, count-high, count-low

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add / Edit / Delete Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [targetCategory, setTargetCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track if user manually touched slug input in create form
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await categoryService.getAllCategories();
      if (res.success) {
        setCategories(res.data || []);
      } else {
        setError('Failed to fetch categories list.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading taxonomies.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (nameStr) => {
    return nameStr
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
      .replace(/\s+/g, '-')         // replace spaces with hyphens
      .replace(/-+/g, '-');         // remove duplicate hyphens
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      isActive: true
    });
    setIsSlugManuallyEdited(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!isSlugManuallyEdited) {
        updated.slug = generateSlug(val);
      }
      return updated;
    });
  };

  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
    }));
  };

  const handleImageChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url
    }));
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (category) => {
    setTargetCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive !== undefined ? category.isActive : true
    });
    setIsSlugManuallyEdited(true);
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (category) => {
    setTargetCategory(category);
    setShowDeleteModal(true);
  };

  // Add Category Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      errorToast('Name and slug are required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await categoryService.createCategory(formData);
      if (res.success) {
        successToast('Category created successfully!');
        fetchCategories();
        setShowAddModal(false);
        resetForm();
      } else {
        errorToast(res.error || 'Failed to create category.');
      }
    } catch (err) {
      console.error(err);
      errorToast('Error occurred while adding category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Category Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      errorToast('Name and slug are required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await categoryService.updateCategory(targetCategory.id, formData);
      if (res.success) {
        successToast('Category updated successfully!');
        fetchCategories();
        setShowEditModal(false);
      } else {
        errorToast(res.error || 'Failed to update category.');
      }
    } catch (err) {
      console.error(err);
      errorToast('Error occurred while editing category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category Submit
  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await categoryService.deleteCategory(targetCategory.id);
      if (res.success) {
        successToast('Category deleted successfully.');
        fetchCategories();
        setShowDeleteModal(false);
      } else {
        errorToast(res.error || 'Failed to delete category.');
      }
    } catch (err) {
      console.error(err);
      errorToast('Error occurred during deletion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter & Sort Logic
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        const matchSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'date-newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'date-oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === 'count-high') return (b.productCount || 0) - (a.productCount || 0);
        if (sortBy === 'count-low') return (a.productCount || 0) - (b.productCount || 0);
        return 0;
      });
  }, [categories, searchQuery, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const paginatedCategories = useMemo(() => {
    const skip = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(skip, skip + itemsPerPage);
  }, [filteredCategories, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-gaming text-xl font-black text-white tracking-wider uppercase">
            Categories & Taxonomies
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredCategories.length} categories used to group products catalog.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="h-10 px-5 rounded-xl bg-gaming-cyan text-gaming-black hover:bg-gaming-cyan/85 font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Add Category
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-gaming-card/30 border border-gaming-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </span>
          <input
            type="text"
            placeholder="Search category name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 transition-all"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-gaming-black/40 border border-gaming-border text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="date-newest">Date: Newest First</option>
            <option value="date-oldest">Date: Oldest First</option>
            <option value="count-high">Product Count: High to Low</option>
            <option value="count-low">Product Count: Low to High</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="rounded-2xl border border-gaming-border bg-gaming-card/25 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-gaming-cyan animate-spin" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
              Loading Taxonomies...
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
              onClick={fetchCategories}
              className="mt-2 h-9 px-4 rounded-xl border border-gaming-border bg-gaming-black/50 hover:bg-gaming-black text-xs font-bold text-white transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <FolderOpen className="h-10 w-10 text-slate-500" />
            <div className="space-y-1 text-center">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">No Categories Found</h4>
              <p className="text-xs text-slate-500 leading-normal">
                No taxonomies match your active search filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-slate-300">
              <thead>
                <tr className="border-b border-gaming-border bg-gaming-black/30 font-gaming text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="py-4 px-5 w-24">Image</th>
                  <th className="py-4 px-5">Category Name</th>
                  <th className="py-4 px-5 w-48">Slug</th>
                  <th className="py-4 px-5">Description</th>
                  <th className="py-4 px-5 w-32">Total Products</th>
                  <th className="py-4 px-5 w-28">Active Status</th>
                  <th className="py-4 px-5 w-36">Created Date</th>
                  <th className="py-4 px-5 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gaming-border/30 text-xs">
                {paginatedCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gaming-black/15 transition-colors">
                    <td className="py-4 px-5">
                      <div className="w-10 h-10 rounded-lg border border-gaming-border overflow-hidden bg-gaming-black/40">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gaming-cyan/5 text-gaming-cyan">
                            <FolderOpen className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 font-semibold text-white">{cat.name}</td>
                    <td className="py-4 px-5 font-mono text-[10px] text-slate-400">{cat.slug}</td>
                    <td className="py-4 px-5">
                      <div className="truncate max-w-[200px]" title={cat.description}>
                        {cat.description || <span className="text-slate-600 font-semibold">No description</span>}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-white px-2 py-0.5 rounded bg-gaming-black/40 border border-gaming-border/60">
                        {cat.productCount || 0} Products
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {cat.isActive ? (
                        <span className="text-green-400 font-bold flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" />
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold flex items-center gap-1.5">
                          <XCircle className="h-4 w-4" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-slate-400">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-2 rounded-lg border border-gaming-border bg-gaming-black/30 hover:border-gaming-cyan hover:text-gaming-cyan transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(cat)}
                          className="p-2 rounded-lg border border-gaming-border bg-gaming-black/30 hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !error && filteredCategories.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD CATEGORY */}
      {/* ==================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/85 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-lg bg-gaming-card border border-gaming-border rounded-3xl p-6 md:p-8 space-y-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
              <h3 className="font-gaming text-base font-bold text-white tracking-wider">
                Create Taxonomy Category
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded bg-gaming-black text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5 text-xs text-left">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Games, Consoles, Hardware"
                  className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Slug (Auto-generated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. games, consoles, hardware"
                  className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60 font-mono text-slate-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Summary of category catalog contents..."
                  className="w-full p-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 resize-none leading-relaxed"
                />
              </div>

              {/* Cover Image */}
              <ImageUploader
                value={formData.image}
                onChange={handleImageChange}
                multiple={false}
                label="Category Cover Image"
              />

              {/* Toggle isActive */}
              <div className="pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4.5 h-4.5 rounded border-gaming-border bg-gaming-black accent-gaming-cyan cursor-pointer"
                  />
                  Active Status (Visible to users)
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
                    'Add Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT CATEGORY */}
      {/* ==================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/85 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          
          <div className="relative w-full max-w-lg bg-gaming-card border border-gaming-border rounded-3xl p-6 md:p-8 space-y-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
              <h3 className="font-gaming text-base font-bold text-white tracking-wider">
                Edit Taxonomy Category
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded bg-gaming-black text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5 text-xs text-left">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange} // no auto slug in edit mode
                  placeholder="e.g. Games, Consoles, Hardware"
                  className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Slug (Auto-generated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. games, consoles, hardware"
                  className="w-full h-11 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 focus:outline-none focus:border-gaming-cyan/60 font-mono text-slate-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Summary of category catalog contents..."
                  className="w-full p-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Cover Image */}
              <ImageUploader
                value={formData.image}
                onChange={handleImageChange}
                multiple={false}
                label="Category Cover Image"
              />

              {/* Toggle isActive */}
              <div className="pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4.5 h-4.5 rounded border-gaming-border bg-gaming-black accent-gaming-cyan cursor-pointer"
                  />
                  Active Status (Visible to users)
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
      {/* MODAL: DELETE CATEGORY */}
      {/* ==================================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/85 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          
          <div className="relative w-full max-w-md bg-gaming-card border border-gaming-border rounded-2xl p-6 text-center space-y-6 z-10">
            <div className="mx-auto w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <AlertCircle className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider">
                Remove Taxonomy Category?
              </h3>
              
              {targetCategory?.productCount > 0 ? (
                <div className="text-xs text-red-400 border border-red-500/30 rounded-xl bg-red-500/5 p-4 leading-normal text-left space-y-1">
                  <p className="font-bold flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertCircle className="h-4 w-4" />
                    Action Denied
                  </p>
                  <p>
                    Category <strong className="text-white">"{targetCategory?.name}"</strong> contains <strong>{targetCategory?.productCount}</strong> assigned products.
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    To maintain database relational integrity, you must reassign or remove these products before this category can be deleted.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 leading-normal">
                  Are you sure you want to delete <strong className="text-white">"{targetCategory?.name}"</strong>?
                  This action is permanent and cannot be undone.
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="h-10 px-5 rounded-xl border border-gaming-border hover:bg-gaming-black/45 text-slate-400 hover:text-white transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px]"
              >
                {targetCategory?.productCount > 0 ? 'Close' : 'Cancel'}
              </button>
              
              {targetCategory?.productCount === 0 && (
                <button
                  onClick={handleDeleteSubmit}
                  disabled={isSubmitting}
                  className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Deleting
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
