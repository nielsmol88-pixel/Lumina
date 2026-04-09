"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User } from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import LeadForm from "@/components/public/LeadForm";
import type { BlogArticle } from "@/data/blog-articles";

interface ArticleLayoutProps {
  article: BlogArticle;
}

const ArticleLayout = ({ article }: ArticleLayoutProps) => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Article Header */}
      <section className="pt-28 md:pt-36 pb-12 md:pb-16 bg-cream">
        <div className="container-luxury max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Blog
            </Link>

            <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-champagne-dark mb-4">
              {article.categoryLabel}
            </span>

            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span>{article.publishDate}</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-12 md:py-20">
        <div className="container-luxury max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            {article.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-foreground/85 leading-[1.85] text-base md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* CTA Divider */}
          <div className="mt-16 pt-12 border-t border-border">
            <div className="text-center">
              <p className="text-champagne-dark text-sm uppercase tracking-[0.15em] font-medium mb-3">
                ¿Le ha resultado útil este artículo?
              </p>
              <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground mb-2">
                Solicite su Evaluación Personalizada
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Nuestro equipo médico puede analizar su caso concreto con la
                misma profundidad y rigor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            author: {
              "@type": "Organization",
              name: article.author,
            },
            datePublished: article.publishDate,
            publisher: {
              "@type": "Organization",
              name: "LÚMINA",
              url: "https://honesteyedoctor4.lovable.app",
            },
          }),
        }}
      />

      <LeadForm />
      <Footer />
    </main>
  );
};

export default ArticleLayout;


