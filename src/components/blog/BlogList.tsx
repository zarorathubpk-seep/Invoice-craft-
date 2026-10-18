import React, { useState } from 'react';
import { BLOG_ARTICLES, BlogArticle } from '../../data/blogArticles.ts';
import { BookOpen, Search, Clock, ArrowRight, User } from 'lucide-react';
import { AdPlaceholder } from '../common/AdPlaceholder.tsx';

interface BlogListProps {
  onSelectArticle: (slug: string) => void;
}

export const BlogList: React.FC<BlogListProps> = ({ onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Invoicing Guides',
    'Freelancing',
    'Small Business',
    'Business Documents',
    'Payment Terms',
    'Financial Productivity',
  ];

  const filteredArticles = BLOG_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = BLOG_ARTICLES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Small Business & Invoicing Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Business Billing & Invoicing Guides
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Comprehensive, actionable tutorials on commercial payment terms, professional document preparation, tax rules, and freelance cash flow management.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides or topics..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Featured Marquee Article (Shown when no search/cat filter active) */}
      {selectedCategory === 'All' && !searchQuery && featured && (
        <div
          onClick={() => onSelectArticle(featured.slug)}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
        >
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-blue-600">{featured.category}</span>
                <span>·</span>
                <span>{featured.publishedDate}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {featured.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{featured.author.name}</span>
              </div>
              <span className="font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-slate-900 p-8 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="text-[11px] font-mono tracking-widest text-teal-400 uppercase">Essential Primer</span>
              <p className="text-lg font-bold text-white">Commercial Invoicing Standards & Bookkeeping Records</p>
              <p className="text-xs text-slate-300">Understand the foundational mechanics of trade credit, invoice auditing, and tax documentation.</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article.slug)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group p-6 space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-blue-600 text-[11px] uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{article.publishedDate}</span>
              <span className="font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          <p className="text-sm">No articles found matching &quot;{searchQuery}&quot;.</p>
        </div>
      )}

      {/* Publisher Network Clean Ad Placeholder */}
      <AdPlaceholder slotId="blog-bottom-leaderboard" />
    </div>
  );
};
