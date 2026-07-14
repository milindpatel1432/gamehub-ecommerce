import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Monitor } from 'lucide-react';
import { shopProducts } from '../../data/games';

export default function AdminConsoles() {
  const [consoles, setConsoles] = useState(
    shopProducts.filter((p) => p.category === 'Consoles')
  );
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentConsole, setCurrentConsole] = useState(null);

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

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    platform: 'PS5',
    buyPrice: '',
    rentPrice: '',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&auto=format&fit=crop&q=80',
    condition: 'Brand New',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newId = Math.max(...consoles.map((c) => c.id), 0) + 1;
    const newConsole = {
      id: newId,
      title: formData.title,
      platform: formData.platform,
      buyPrice: parseFloat(formData.buyPrice) || 0,
      rentPrice: parseFloat(formData.rentPrice) || null,
      image: formData.image,
      category: 'Consoles',
      condition: formData.condition,
      rating: 5.0,
      reviews: 0,
    };
    setConsoles([...consoles, newConsole]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setConsoles(
      consoles.map((c) =>
        c.id === currentConsole.id
          ? {
              ...c,
              title: formData.title,
              platform: formData.platform,
              buyPrice: parseFloat(formData.buyPrice) || 0,
              rentPrice: parseFloat(formData.rentPrice) || null,
              condition: formData.condition,
            }
          : c
      )
    );
    setShowEditModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this console?')) {
      setConsoles(consoles.filter((c) => c.id !== id));
    }
  };

  const openEditModal = (item) => {
    setCurrentConsole(item);
    setFormData({
      title: item.title,
      platform: item.platform,
      buyPrice: item.buyPrice,
      rentPrice: item.rentPrice || '',
      image: item.image,
      condition: item.condition,
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

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6 text-left">
      
      {/* Header toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <Monitor className="h-4.5 w-4.5 text-gaming-cyan" />
          Consoles Directory
        </h3>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="h-11 px-5 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Console
        </button>
      </div>

      {/* Consoles list table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-slate-300">
          <thead>
            <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
              <th className="py-3 px-2">Preview</th>
              <th className="py-3 px-2">Console Model</th>
              <th className="py-3 px-2">Platform</th>
              <th className="py-3 px-2">Purchase Price</th>
              <th className="py-3 px-2">Rental Rate</th>
              <th className="py-3 px-2">Condition</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gaming-border/30">
            {consoles.map((item) => (
              <tr key={item.id} className="hover:bg-gaming-black/20 transition-colors">
                <td className="py-3 px-2">
                  <div className="w-10 h-10 rounded overflow-hidden bg-gaming-black/25 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-3 px-2 font-bold text-white">{item.title}</td>
                <td className="py-3 px-2 text-slate-400">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-gaming-cyan border border-gaming-cyan/30 rounded px-1.5 py-0.5">
                    {item.platform || 'General'}
                  </span>
                </td>
                <td className="py-3 px-2 font-semibold text-white">${item.buyPrice.toFixed(2)}</td>
                <td className="py-3 px-2 text-slate-400">
                  {item.rentPrice ? `$${item.rentPrice.toFixed(2)}/mo` : 'N/A'}
                </td>
                <td className="py-3 px-2 text-slate-500">{item.condition}</td>
                <td className="py-3 px-2 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded bg-gaming-black border border-gaming-border hover:border-gaming-cyan text-slate-400 hover:text-gaming-cyan cursor-pointer inline-block"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
              <h4 className="font-gaming text-sm font-bold text-white tracking-wide">Add Console Model</h4>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Console Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. PlayStation 5 Pro Console"
                  className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                  >
                    <option value="PS5">PS5</option>
                    <option value="XBOX">Xbox Series X</option>
                    <option value="PC">PC</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Pre-owned">Pre-owned</option>
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
                    placeholder="499.99"
                    className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rent Price ($/mo)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    placeholder="29.99"
                    className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-gaming-border/60">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="h-10 px-6 rounded-full border border-gaming-border text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-full bg-gaming-cyan text-gaming-black font-bold text-xs"
              >
                Create Console
              </button>
            </div>
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
              <h4 className="font-gaming text-sm font-bold text-white tracking-wide">Edit Console</h4>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Console Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                  >
                    <option value="PS5">PS5</option>
                    <option value="XBOX">Xbox Series X</option>
                    <option value="PC">PC</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Pre-owned">Pre-owned</option>
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
                    className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rent Price ($/mo)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    className="block h-11 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-gaming-border/60">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="h-10 px-6 rounded-full border border-gaming-border text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-full bg-gaming-cyan text-gaming-black font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
