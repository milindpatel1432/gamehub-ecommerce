import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Monitor } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { successToast, errorToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';
import ImageUploader from '../ui/ImageUploader';

export default function AdminConsoles() {
  const [consoles, setConsoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentConsole, setCurrentConsole] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    platform: 'PS5',
    buyPrice: '',
    rentPrice: '',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&auto=format&fit=crop&q=80',
    condition: 'Brand New',
  });

  const fetchConsoles = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getConsoles();
      if (res.success && Array.isArray(res.data)) {
        // Map database fields to UI flat keys
        const mapped = res.data.map(product => ({
          id: product._id,
          title: product.title,
          platform: Array.isArray(product.platform) ? product.platform[0] : product.platform,
          buyPrice: product.price,
          rentPrice: product.rentalPricePerDay,
          image: product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&auto=format&fit=crop&q=80',
          condition: product.condition === 'Used' ? 'Pre-Owned' : 'Brand New',
          isActive: product.isActive
        }));
        setConsoles(mapped.filter(c => c.isActive !== false));
      }
    } catch (err) {
      console.error(err);
      errorToast('Failed to load consoles directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsoles();
  }, []);

  // Close modals on Escape keypress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setShowEditModal(false);
      }
    };
    if (showAddModal || showEditModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal, showEditModal]);

  const filteredConsoles = useMemo(() => {
    return consoles.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [consoles, searchQuery]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const rentPriceVal = parseFloat(formData.rentPrice) || 0;
      const payload = {
        title: formData.title,
        description: 'Console systems and premium accessories.',
        brand: 'GameHub Catalog',
        category: 'Consoles',
        platform: [formData.platform],
        price: parseFloat(formData.buyPrice) || 0,
        rentalAvailable: rentPriceVal > 0,
        rentalPricePerDay: rentPriceVal,
        thumbnail: formData.image,
        images: [formData.image],
        condition: formData.condition === 'Pre-Owned' ? 'Used' : 'New',
        stock: 5,
        isActive: true
      };

      const res = await adminService.addConsole(payload);
      if (res.success) {
        successToast('Console product added!');
        fetchConsoles();
        setShowAddModal(false);
        resetForm();
      } else {
        errorToast(res.message || 'Failed to add console.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || 'Error occurred while creating console product.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const rentPriceVal = parseFloat(formData.rentPrice) || 0;
      const payload = {
        title: formData.title,
        platform: [formData.platform],
        price: parseFloat(formData.buyPrice) || 0,
        rentalAvailable: rentPriceVal > 0,
        rentalPricePerDay: rentPriceVal,
        thumbnail: formData.image,
        images: [formData.image],
        condition: formData.condition === 'Pre-Owned' ? 'Used' : 'New'
      };

      const res = await adminService.updateConsole(currentConsole.id, payload);
      if (res.success) {
        successToast('Console details updated!');
        fetchConsoles();
        setShowEditModal(false);
        resetForm();
      } else {
        errorToast(res.message || 'Failed to update console.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || 'Error occurred while editing console product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this console?')) {
      try {
        const res = await adminService.deleteConsole(id);
        if (res.success) {
          successToast('Console deleted successfully!');
          fetchConsoles();
        } else {
          errorToast(res.message || 'Failed to delete console.');
        }
      } catch (err) {
        console.error(err);
        errorToast('Error occurred while deleting console product.');
      }
    }
  };

  const openEditModal = (consoleItem) => {
    setCurrentConsole(consoleItem);
    setFormData({
      title: consoleItem.title,
      platform: consoleItem.platform,
      buyPrice: consoleItem.buyPrice,
      rentPrice: consoleItem.rentPrice || '',
      image: consoleItem.image,
      condition: consoleItem.condition,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      platform: 'PS5',
      buyPrice: '',
      rentPrice: '',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
    });
    setCurrentConsole(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-[40vh] w-full items-center justify-center bg-gaming-card/45 rounded-2xl border border-gaming-border">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6 text-left">
      
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <Monitor className="h-4.5 w-4.5 text-gaming-cyan" />
          Consoles Inventory
        </h3>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="h-11 px-5 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Console/Gear
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="h-4 w-4 text-slate-500" />
        </span>
        <input
          type="text"
          placeholder="Search gear models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan"
        />
      </div>

      {/* Consoles list table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-slate-300">
          <thead>
            <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
              <th className="py-3 px-2">Gear model</th>
              <th className="py-3 px-2">Platform</th>
              <th className="py-3 px-2">Buy Price</th>
              <th className="py-3 px-2">Rent Price</th>
              <th className="py-3 px-2">Condition</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gaming-border/30">
            {filteredConsoles.map((consoleItem) => (
              <tr key={consoleItem.id} className="hover:bg-gaming-black/20 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded overflow-hidden bg-gaming-black/25 flex-shrink-0">
                      <img src={consoleItem.image} alt={consoleItem.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-white">{consoleItem.title}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-slate-400">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-gaming-cyan border border-gaming-cyan/30 rounded px-1.5 py-0.5">
                    {consoleItem.platform || 'General'}
                  </span>
                </td>
                <td className="py-3 px-2 font-semibold text-white">${consoleItem.buyPrice.toFixed(2)}</td>
                <td className="py-3 px-2 text-slate-400">
                  {consoleItem.rentPrice ? `$${consoleItem.rentPrice.toFixed(2)}/day` : 'N/A'}
                </td>
                <td className="py-3 px-2 text-slate-500">{consoleItem.condition}</td>
                <td className="py-3 px-2 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(consoleItem)}
                    className="p-2 rounded bg-gaming-black border border-gaming-border hover:border-gaming-cyan text-slate-400 hover:text-gaming-cyan cursor-pointer inline-block"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(consoleItem.id)}
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

      {/* Add Console Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleAdd}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-gaming-card border border-gaming-border rounded-3xl p-6 space-y-4 text-left z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gaming-border/60">
              <h4 className="font-gaming text-sm font-bold text-white tracking-wide">Add New Product</h4>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gear Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                  placeholder="Xbox Series X Elite"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                  >
                    <option value="PS5">PlayStation 5</option>
                    <option value="XBOX">Xbox Series X</option>
                    <option value="PC">PC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Pre-Owned">Pre-Owned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Buy Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                    placeholder="499.00"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rent Price ($/day)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                    placeholder="15.00"
                  />
                </div>
              </div>

              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                multiple={false}
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider transition-colors cursor-pointer pt-0.5 mt-2"
            >
              Add to Catalog
            </button>
          </form>
        </div>
      )}

      {/* Edit Console Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <form
            onSubmit={handleEdit}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-gaming-card border border-gaming-border rounded-3xl p-6 space-y-4 text-left z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gaming-border/60">
              <h4 className="font-gaming text-sm font-bold text-white tracking-wide">Edit Details</h4>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gear Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                  >
                    <option value="PS5">PlayStation 5</option>
                    <option value="XBOX">Xbox Series X</option>
                    <option value="PC">PC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Pre-Owned">Pre-Owned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Buy Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rent Price ($/day)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                  />
                </div>
              </div>

              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                multiple={false}
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider transition-colors cursor-pointer pt-0.5 mt-2"
            >
              Update Details
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
