'use client';

import React, { useState } from 'react';
import { ChevronDown, Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface SortFilterProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ sortBy, setSortBy }) => {
  const [open, setOpen] = useState(false);
  const sortOptions = ["Top", "Récent", "Ancien"];
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    ville: '',
    technologie: '',
    entreprise: '',
    offre: '',
    audience: '',
    populaire: ''
  });

  const filterOptions = {
    ville: ['Casablanca', 'Rabat', 'Oujda', 'Marrakech'],
    technologie: ['React', 'Node.js', 'Python', 'Java'],
    entreprise: ['Google', 'Microsoft', 'Capgemini', 'Freelance'],
    offre: ['CDI', 'Stage', 'Freelance'],
    audience: ['100+', '500+', '1000+'],
    populaire: ['Top', 'Less'],
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Sort Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 h-px bg-gray-300 mt-1" />
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="ml-2 text-sm text-gray-600 flex items-center focus:outline-none">
            Sort by: <span className="ml-1 capitalize">{sortBy}</span>
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="mt-2 animate-in fade-in slide-in-from-top-2">
            {["Top", "Récent", "Ancien"].map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => setSortBy(option.toLowerCase())}
                className={sortBy === option.toLowerCase() ? "font-semibold" : ""}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-3 text-gray-600 hover:text-gray-900 transition"
        >
          <Settings2 className="h-5 w-5" />
        </button>
      </div>

      {/* Compact Filters */}
      {showFilters && (
        <div className="flex w-full flex-wrap grid grid-cols-3 gap-x-4 gap-y-2 px-10">
            {Object.entries(filterOptions).map(([key, values]) => (
            <div
                key={key}
                className="flex items-center justify-between space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-xs shadow-sm"
            >
                <span className="text-gray-500 capitalize whitespace-nowrap">{key}</span>
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                    {filters[key as keyof typeof filters] || "Tout"}
                    <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="animate-in fade-in slide-in-from-top-2">
                    {values.map((value) => (
                    <DropdownMenuItem
                        key={value}
                        onSelect={() => updateFilter(key, value)}
                    >
                        {value}
                    </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            ))}
        </div>
        )}
        <div className="flex-1 h-px bg-gray-300 mt-1" />
    </>
  );
};

export default SortFilter;
