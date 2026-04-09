"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogArticle } from "@/data/blog-articles";

interface ArticleCardProps {
  article: BlogArticle;
  index: number;
}

const categoryColors: Record<string, string> = {
  autoridad: "bg-foreground text-primary-foreground",
  lifestyle: "bg-champagne text-foreground",
  testimonios: "bg-muted text-foreground",
};

const ArticleCard = ({ article, index }: ArticleCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group block h-full rounded-lg border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:shadow-card hover:border-champagne/40"
      >
        {/* Category badge */}
        <span
          className={`inline-block text-xs font-medium uppercase tracking-[0.12em] px-3 py-1 rounded-full mb-4 ${categoryColors[article.category] ?? "bg-muted text-foreground"}`}
        >
          {article.categoryLabel}
        </span>

        {/* Title */}
        <h3 className="font-serif text-lg md:text-xl font-medium text-foreground leading-snug mb-3 group-hover:text-champagne-dark transition-colors duration-300">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{article.publishDate}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>
          <span className="flex items-center gap-1 text-champagne-dark font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Leer <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;


