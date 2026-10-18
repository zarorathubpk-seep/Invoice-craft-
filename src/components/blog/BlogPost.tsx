import React, { useEffect } from 'react';
import { BLOG_ARTICLES, BlogArticle } from '../../data/blogArticles.ts';
import { ArrowLeft, Clock, Calendar, User, ChevronRight, HelpCircle, Wrench, Share2 } from 'lucide-react';
import { AdPlaceholder } from '../common/AdPlaceholder.tsx';

interface BlogPostProps {
  slug: string;
  onBackToBlog: () => void;
  onSelectArticle: (slug: string) => void;
  onNavigateToTool: (route: string) => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({
  slug,
  onBackToBlog,
  onSelectArticle,
  onNavigateToTool,
}) => {
  const article = BLOG_ARTICLES.find(a => a.slug === slug) || BLOG_ARTICLES[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Related articles in same or complementary category
  const relatedArticles = BLOG_ARTICLES.filter(a => a.slug !== article.slug).slice(0, 3);

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-3 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <button onClick={onBackToBlog} className="hover:text-blue-600 transition-colors">Blog</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-700 font-medium">{article.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
          </nav>

          <button
            onClick={onBackToBlog}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Guides
          </button>
        </div>
      </div>

      {/* Article Header Container */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 space-y-4">
        {/* Category & Metadata */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="font-semibold text-blue-600 uppercase tracking-wider">{article.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.publishedDate}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
        </div>

        {/* H1 Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Short Introduction */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal pt-2">
          {article.content.intro}
        </p>

        {/* Author Bio Line & SEO Keyword Badge */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{article.author.name}</p>
              <p className="text-[11px] text-slate-400">{article.author.role}</p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Topic: <span className="text-slate-600">{article.keyword}</span>
          </div>
        </div>

        {/* Featured Visual Illustration Banner */}
        <div className="my-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-sm flex flex-col justify-center items-center text-center space-y-2 border border-slate-800">
          <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full uppercase tracking-wider">
            InvoiceCraft Educational Brief
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white max-w-xl">
            {article.title}
          </h2>
          <p className="text-xs text-slate-300 max-w-md">
            Verified small business workflow and professional billing standard.
          </p>
        </div>
      </header>

      {/* Main Content Layout with Sticky Table of Contents */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Table of Contents (Desktop Sticky Sidebar) */}
          <aside className="lg:col-span-4 hidden lg:block" aria-label="Table of contents">
            <div className="sticky top-24 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
              <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Table of Contents</h2>
              <nav className="space-y-2">
                {article.tableOfContents.map((toc) => (
                  <a
                    key={toc.id}
                    href={`#${toc.id}`}
                    className="block text-slate-600 hover:text-blue-600 transition-colors py-0.5 leading-snug"
                  >
                    {toc.title}
                  </a>
                ))}
              </nav>

              {/* Related Tool CTA inside sidebar */}
              {article.content.relatedTools[0] && (
                <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Recommended Tool</span>
                  <p className="font-semibold text-slate-800">{article.content.relatedTools[0].name}</p>
                  <button
                    onClick={() => onNavigateToTool(article.content.relatedTools[0].path)}
                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-colors"
                  >
                    Open Generator
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Body Content */}
          <div className="lg:col-span-8 space-y-8 text-slate-800 text-sm leading-relaxed max-w-2xl">
            {article.content.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-3 scroll-mt-24">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-2 border-t border-slate-100">
                  {section.title}
                </h2>
                {section.body.map((para, i) => (
                  <p key={i} className="text-slate-700 text-base leading-relaxed">
                    {para}
                  </p>
                ))}
                {section.keyTakeaway && (
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 my-4">
                    <strong className="block text-blue-950 mb-1">Key Takeaway:</strong>
                    {section.keyTakeaway}
                  </div>
                )}
              </section>
            ))}

            {/* Non-intrusive Ad Zone between editorial content and FAQs */}
            <AdPlaceholder slotId={`article-${article.slug}-mid`} />

            {/* FAQs Accordion / List */}
            {article.content.faqs && article.content.faqs.length > 0 && (
              <section id="faqs" className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                  {article.content.faqs.map((faq, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <h3 className="font-semibold text-sm text-slate-900">{faq.question}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Helpful Related Tools Banner */}
            <section className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Applicable InvoiceCraft Tools</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {article.content.relatedTools.map((tool, i) => (
                  <div
                    key={i}
                    onClick={() => onNavigateToTool(tool.path)}
                    className="p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer space-y-1"
                  >
                    <p className="font-bold text-xs text-blue-600">{tool.name}</p>
                    <p className="text-[11px] text-slate-500">{tool.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Related Guides Footer Section */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 border-t border-slate-200 mt-16 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Recommended Next Reads</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => (
            <div
              key={rel.id}
              onClick={() => onSelectArticle(rel.slug)}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{rel.category}</span>
                <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">{rel.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{rel.readTime}</span>
                <span className="font-semibold text-blue-600">Read &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </article>
  );
};
