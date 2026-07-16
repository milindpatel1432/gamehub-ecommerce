import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Gamepad } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { successToast, errorToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';
import ImageUploader from '../ui/ImageUploader';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    platform: 'PS5',
    buyPrice: '',
    rentPrice: '',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    condition: 'Brand New',
  });

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getGames();
      if (res.success && Array.isArray(res.data)) {
        // Map database fields to UI flat keys
        const mapped = res.data.map(product => ({
          id: product._id,
          title: product.title,
          platform: Array.isArray(product.platform) ? product.platform[0] : product.platform,
          buyPrice: product.price,
          rentPrice: product.rentalPricePerDay,
          image: product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
          condition: product.condition === 'Used' ? 'Pre-Owned' : 'Brand New',
          isActive: product.isActive
        }));
        setGames(mapped.filter(g => g.isActive !== false));
      }
    } catch (err) {
      console.error(err);
      errorToast('Failed to load games directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
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

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlatform = selectedPlatform ? g.platform === selectedPlatform : true;
      return matchSearch && matchPlatform;
    });
  }, [games, searchQuery, selectedPlatform]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const rentPriceVal = parseFloat(formData.rentPrice) || 0;
      const payload = {
        title: formData.title,
        description: 'High-quality gaming title added by admin.',
        brand: 'GameHub Catalog',
        category: 'Games',
        platform: [formData.platform],
        price: parseFloat(formData.buyPrice) || 0,
        rentalAvailable: rentPriceVal > 0,
        rentalPricePerDay: rentPriceVal,
        thumbnail: formData.image,
        images: [formData.image],
        condition: formData.condition === 'Pre-Owned' ? 'Used' : 'New',
        stock: 10,
        isActive: true
      };

      const res = await adminService.addGame(payload);
      if (res.success) {
        successToast('Game added successfully!');
        fetchGames();
        setShowAddModal(false);
        resetForm();
      } else {
        errorToast(res.message || 'Failed to add game.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || 'Error occurred while creating game product.');
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

      const res = await adminService.updateGame(currentGame.id, payload);
      if (res.success) {
        successToast('Game details updated!');
        fetchGames();
        setShowEditModal(false);
        resetForm();
      } else {
        errorToast(res.message || 'Failed to update game.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || 'Error occurred while editing game product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        const res = await adminService.deleteGame(id);
        if (res.success) {
          successToast('Game deleted successfully!');
          fetchGames();
        } else {
          errorToast(res.message || 'Failed to delete game.');
        }
      } catch (err) {
        console.error(err);
        errorToast('Error occurred while deleting game product.');
      }
    }
  };

  const openEditModal = (game) => {
    setCurrentGame(game);
    setFormData({
      title: game.title,
      platform: game.platform,
      buyPrice: game.buyPrice,
      rentPrice: game.rentPrice || '',
      image: game.image,
      condition: game.condition,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      platform: 'PS5',
      buyPrice: '',
      rentPrice: '',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
    });
    setCurrentGame(null);
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
          <Gamepad className="h-4.5 w-4.5 text-gaming-cyan" />
          Games Directory
        </h3>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="h-11 px-5 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add New Game
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </span>
          <input
            type="text"
            placeholder="Search game titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan"
          />
        </div>

        {/* Platform filter */}
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="h-11 rounded-xl bg-gaming-black border border-gaming-border text-xs font-bold text-white px-4 focus:outline-none focus:border-gaming-cyan cursor-pointer"
        >
          <option value="">All Platforms</option>
          <option value="PS5">PlayStation 5</option>
          <option value="XBOX">Xbox Series X</option>
          <option value="PC">PC Masters</option>
        </select>
      </div>

      {/* Games list table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-slate-300">
          <thead>
            <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
              <th className="py-3 px-2">Cover</th>
              <th className="py-3 px-2">Title</th>
              <th className="py-3 px-2">Platform</th>
              <th className="py-3 px-2">Buy Price</th>
              <th className="py-3 px-2">Rent Price</th>
              <th className="py-3 px-2">Condition</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gaming-border/30">
            {filteredGames.map((game) => (
              <tr key={game.id} className="hover:bg-gaming-black/20 transition-colors">
                <td className="py-3 px-2">
                  <div className="w-10 h-10 rounded overflow-hidden bg-gaming-black/25 flex-shrink-0">
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-3 px-2 font-bold text-white">{game.title}</td>
                <td className="py-3 px-2 text-slate-400">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-gaming-cyan border border-gaming-cyan/30 rounded px-1.5 py-0.5">
                    {game.platform || 'Digital'}
                  </span>
                </td>
                <td className="py-3 px-2 font-semibold text-white">${game.buyPrice.toFixed(2)}</td>
                <td className="py-3 px-2 text-slate-400">
                  {game.rentPrice ? `$${game.rentPrice.toFixed(2)}/day` : 'N/A'}
                </td>
                <td className="py-3 px-2 text-slate-500">{game.condition}</td>
                <td className="py-3 px-2 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(game)}
                    className="p-2 rounded bg-gaming-black border border-gaming-border hover:border-gaming-cyan text-slate-400 hover:text-gaming-cyan cursor-pointer inline-block"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(game.id)}
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

      {/* Add Game Modal */}
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
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Game Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white focus:outline-none focus:border-gaming-cyan"
                  placeholder="Grand Theft Auto VI"
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
                    placeholder="69.99"
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
                    placeholder="3.50"
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

      {/* Edit Game Modal */}
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
              <h4 className="font-gaming text-sm font-bold text-white tracking-wide">Edit Product</h4>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Game Title</label>
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
