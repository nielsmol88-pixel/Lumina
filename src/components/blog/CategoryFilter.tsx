"use client";

import type { ArticleCategory } from "@/data/blog-articles";
import { categoryLabels } from "@/data/blog-articles";

interface CategoryFilterProps {
  active: ArticleCategory | "all";
  onChange: (category: ArticleCategory | "all") => void;
}

const CategoryFilter = ({ active, onChange }: CategoryFilterProps) => {
  const categories: Array<{ value: ArticleCategory | "all"; label: string }> = [
    { value: "all", label: "Todos" },
    ...Object.entries(categoryLabels).map(([value, label]) => ({
      value: value as ArticleCategory,
      label,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {categories.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
            active === value
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;


