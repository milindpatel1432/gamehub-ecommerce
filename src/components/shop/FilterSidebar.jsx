import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { categories } from '../../data/categories';

export default function FilterSidebar({ onFilterChange }) {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const platforms = [
    { id: 'ps5', label: 'PS5' },
    { id: 'ps4', label: 'PS4' },
    { id: 'xbox', label: 'Xbox Series X/S' },
  ];

  const productTypes = ['Games', 'Consoles'];
  const transactionTypes = ['Buy', 'Rent'];

  const handlePlatformChange = (id) => {
    let updated;
    if (selectedPlatforms.includes(id)) {
      updated = selectedPlatforms.filter((p) => p !== id);
    } else {
      updated = [...selectedPlatforms, id];
    }
    setSelectedPlatforms(updated);
    triggerFilter({ platforms: updated });
  };

  const handleTypeChange = (type) => {
    let updated;
    if (selectedTypes.includes(type)) {
      updated = selectedTypes.filter((t) => t !== type);
    } else {
      updated = [...selectedTypes, type];
    }
    setSelectedTypes(updated);
    triggerFilter({ types: updated });
  };

  const handleTransactionChange = (mode) => {
    let updated;
    if (selectedTransactions.includes(mode)) {
      updated = selectedTransactions.filter((m) => m !== mode);
    } else {
      updated = [...selectedTransactions, mode];
    }
    setSelectedTransactions(updated);
    triggerFilter({ transactions: updated });
  };

  const handleCategoryChange = (name) => {
    let updated;
    if (selectedCategories.includes(name)) {
      updated = selectedCategories.filter((c) => c !== name);
    } else {
      updated = [...selectedCategories, name];
    }
    setSelectedCategories(updated);
    triggerFilter({ categories: updated });
  };

  const triggerFilter = (changes) => {
    if (onFilterChange) {
      onFilterChange({
        platforms: selectedPlatforms,
        types: selectedTypes,
        transactions: selectedTransactions,
        categories: selectedCategories,
        ...changes,
      });
    }
  };

  const handleClearAll = () => {
    setSelectedPlatforms([]);
    setSelectedTypes([]);
    setSelectedTransactions([]);
    setSelectedCategories([]);
    if (onFilterChange) {
      onFilterChange({
        platforms: [],
        types: [],
        transactions: [],
        categories: [],
      });
    }
  };

  return (
    <div className="w-full lg:w-64 bg-gaming-card/40 border border-gaming-border rounded-2xl p-6 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
        <div className="flex items-center gap-2 font-gaming font-extrabold text-white text-base uppercase tracking-wider">
          <SlidersHorizontal className="h-4.5 w-4.5 text-gaming-cyan" />
          Filters
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs font-semibold text-slate-500 hover:text-gaming-cyan transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Platform Filter */}
      <div className="space-y-4">
        <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
          Platform
        </h4>
        <div className="space-y-3">
          {platforms.map((plat) => (
            <label
              key={plat.id}
              className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(plat.id)}
                onChange={() => handlePlatformChange(plat.id)}
                className="h-4.5 w-4.5 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <span className="group-hover:text-gaming-cyan transition-colors">
                {plat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Product Type Filter */}
      <div className="space-y-4">
        <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
          Product Type
        </h4>
        <div className="space-y-3">
          {productTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="h-4.5 w-4.5 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <span className="group-hover:text-gaming-cyan transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Transaction Type Filter */}
      <div className="space-y-4">
        <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
          Transaction Type
        </h4>
        <div className="space-y-3">
          {transactionTypes.map((mode) => (
            <label
              key={mode}
              className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedTransactions.includes(mode)}
                onChange={() => handleTransactionChange(mode)}
                className="h-4.5 w-4.5 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <span className="group-hover:text-gaming-cyan transition-colors">
                {mode}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter from categories.js */}
      <div className="space-y-4">
        <h4 className="font-gaming text-xs font-bold text-white uppercase tracking-wider">
          Category
        </h4>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label
              key={cat.name}
              className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => handleCategoryChange(cat.name)}
                className="h-4.5 w-4.5 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <span className="group-hover:text-gaming-cyan transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
