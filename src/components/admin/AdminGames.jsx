import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, X, Gamepad } from 'lucide-react';
import { shopProducts } from '../../data/games';

export default function AdminGames() {
  const [games, setGames] = useState(
    shopProducts.filter((p) => p.category === 'Games')
  );
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

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlatform = selectedPlatform ? g.platform === selectedPlatform : true;
      return matchSearch && matchPlatform;
    });
  }, [games, searchQuery, selectedPlatform]);

  const handleAdd = (e) => {
    e.preventDefault();
    const newId = Math.max(...games.map((g) => g.id), 0) + 1;
    const newGame = {
      id: newId,
      title: formData.title,
      platform: formData.platform,
      buyPrice: parseFloat(formData.buyPrice) || 0,
      rentPrice: parseFloat(formData.rentPrice) || null,
      image: formData.image,
      category: 'Games',
      condition: formData.condition,
      rating: 5.0,
      reviews: 0,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setGames([...games, newGame]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setGames(
      games.map((g) =>
        g.id === currentGame.id
          ? {
              ...g,
              title: formData.title,
              platform: formData.platform,
              buyPrice: parseFloat(formData.buyPrice) || 0,
              rentPrice: parseFloat(formData.rentPrice) || null,
              condition: formData.condition,
            }
          : g
      )
    );
    setShowEditModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      setGames(games.filter((g) => g.id !== id));
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
                  {game.rentPrice ? `$${game.rentPrice.toFixed(2)}/mo` : 'N/A'}
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
                  placeholder="e.g. Witcher Arena"
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
                    <option value="Digital Key">Digital Key</option>
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
                    placeholder="59.99"
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
                    placeholder="4.99"
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
                Create Game
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Game Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gaming-dark/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <form
            onSubmit={handleEdit}
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
                    <option value="Digital Key">Digital Key</option>
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
