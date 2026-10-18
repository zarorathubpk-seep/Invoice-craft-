import { TemplateId, LineItem, CurrencyCode } from '../types/invoice.ts';

export interface TemplatePreset {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  recommendedFor: string;
  templateId: TemplateId;
  accentColor: string;
  currency: CurrencyCode;
  items: LineItem[];
  defaultTerms: string;
  features: string[];
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'freelancer-invoice',
    name: 'Freelancer Invoice',
    category: 'Freelancing',
    tagline: 'Streamlined, clear, and focused on deliverables and hourly rates.',
    description: 'Designed specifically for independent solo professionals, copywriters, and developers who bill either by hour or flat project milestones.',
    recommendedFor: 'Freelance designers, writers, developers, and solo specialists.',
    templateId: 'modern_minimal',
    accentColor: '#2563EB',
    currency: 'USD',
    features: ['Hourly timesheet breakdown', 'Direct PayPal & Bank routing', 'Due on receipt or Net 14 options'],
    defaultTerms: 'Payment due within 14 days of issue. Direct deposit or PayPal preferred.',
    items: [
      { id: 'item_1', name: 'UI/UX Mobile App Design', description: 'Figma mockups, interactive prototypes, and design specs.', quantity: 24, unit: 'hours', rate: 95.00 },
      { id: 'item_2', name: 'Component System Setup', description: 'Design tokens and component documentation.', quantity: 1, unit: 'milestone', rate: 650.00 },
    ],
  },
  {
    id: 'small-business-invoice',
    name: 'Small Business Invoice',
    category: 'Small Business',
    tagline: 'Comprehensive corporate format with full tax and registration fields.',
    description: 'The standard choice for local retail businesses, commercial shops, and boutique companies that require detailed tax registration identifiers.',
    recommendedFor: 'Small businesses, LLCs, retail shops, and commercial suppliers.',
    templateId: 'classic',
    accentColor: '#102A43',
    currency: 'USD',
    features: ['Tax ID and Business Registration inputs', 'Inclusive/exclusive VAT/GST support', 'PO reference and project codes'],
    defaultTerms: 'Payment terms: Net 30. Unpaid balances subject to standard commercial terms.',
    items: [
      { id: 'item_1', name: 'Commercial Equipment Maintenance', description: 'Quarterly mechanical inspection and lubricant servicing.', quantity: 1, unit: 'service', rate: 850.00 },
      { id: 'item_2', name: 'Replacement Filters & O-Rings', description: 'OEM replacement seal kits (Lot #4820).', quantity: 4, unit: 'sets', rate: 65.00 },
    ],
  },
  {
    id: 'consultant-invoice',
    name: 'Consultant Invoice',
    category: 'Consulting',
    tagline: 'Executive advisory layout highlighting strategic milestones.',
    description: 'A prestigious, refined invoice suited for management consultants, legal advisors, executive coaches, and financial analysts.',
    recommendedFor: 'Management consultants, fractional executives, and advisors.',
    templateId: 'executive_navy',
    accentColor: '#1E293B',
    currency: 'USD',
    features: ['Executive typography', 'Milestone retainer breakdown', 'Confidentiality note in footer'],
    defaultTerms: 'Strategic retainer fee for advisory services. Net 15 days upon receipt.',
    items: [
      { id: 'item_1', name: 'Executive Strategy Advisory', description: 'Q4 market penetration roadmap and operational restructuring.', quantity: 1, unit: 'retainer', rate: 3500.00 },
      { id: 'item_2', name: 'Board Presentation Preparation', description: 'Data synthesis, deck synthesis, and leadership briefing.', quantity: 8, unit: 'hours', rate: 250.00 },
    ],
  },
  {
    id: 'graphic-designer-invoice',
    name: 'Graphic Designer Invoice',
    category: 'Creative & Design',
    tagline: 'Visually striking and clean for visual artists and illustrators.',
    description: 'Tailored for graphic designers, art directors, and 3D visualizers who want their invoices to reflect their sharp aesthetic standards.',
    recommendedFor: 'Graphic designers, branding studios, illustrators, and animators.',
    templateId: 'creative_freelancer',
    accentColor: '#0D9488',
    currency: 'USD',
    features: ['Creative visual layout', 'IP rights transfer statement', 'Milestone release approvals'],
    defaultTerms: 'All intellectual property rights transfer upon complete receipt of final balance.',
    items: [
      { id: 'item_1', name: 'Brand Identity Suite', description: 'Vector logo marks, brand guideline book, and typography palette.', quantity: 1, unit: 'package', rate: 2200.00 },
      { id: 'item_2', name: 'Packaging Vector Die-lines', description: 'Box packaging design and prepress print-ready production files.', quantity: 3, unit: 'SKUs', rate: 450.00 },
    ],
  },
  {
    id: 'contractor-invoice',
    name: 'Contractor Invoice',
    category: 'Trades & Construction',
    tagline: 'Labor and materials separation with job site location fields.',
    description: 'Ideal for general contractors, electricians, plumbers, carpenters, and construction trades needing to separate labor from materials.',
    recommendedFor: 'Independent tradespeople, contractors, and builders.',
    templateId: 'clean_corporate',
    accentColor: '#D97706',
    currency: 'USD',
    features: ['Labor & materials line items', 'Job site address documentation', 'Lien waiver acknowledgment'],
    defaultTerms: 'Net 15 days. All work performed to state code standards and manufacturer warranty.',
    items: [
      { id: 'item_1', name: 'Rough-in Electrical Wiring', description: 'Installation of 200A sub-panel and 12 dedicated branch circuits.', quantity: 32, unit: 'hours', rate: 85.00 },
      { id: 'item_2', name: 'Electrical Materials & Romex 12/2', description: 'UL-listed junction boxes, breakers, and wire spools.', quantity: 1, unit: 'lot', rate: 940.00 },
    ],
  },
  {
    id: 'service-invoice',
    name: 'Service Invoice',
    category: 'Services',
    tagline: 'Versatile, easy-to-read layout for service industries.',
    description: 'Perfect for cleaning companies, IT support firms, landscaping, and repair professionals.',
    recommendedFor: 'Service technicians, cleaning businesses, and IT support providers.',
    templateId: 'elegant_blue',
    accentColor: '#2563EB',
    currency: 'USD',
    features: ['Service date logs', 'Clear breakdown of hourly vs fixed rates', 'Immediate payment instructions'],
    defaultTerms: 'Thank you for choosing our services. Please settle within 7 business days.',
    items: [
      { id: 'item_1', name: 'On-site Network Diagnosis & Repair', description: 'Diagnosed router failure, replaced gateway switch, restored VoIP.', quantity: 4, unit: 'hours', rate: 120.00 },
      { id: 'item_2', name: 'Managed Firewall Configuration', description: 'Firmware upgrade and VLAN segment isolation.', quantity: 1, unit: 'service', rate: 250.00 },
    ],
  },
  {
    id: 'hourly-invoice',
    name: 'Hourly Invoice',
    category: 'Hourly & Time-tracking',
    tagline: 'Timesheet-optimized structure with rate-per-hour focus.',
    description: 'Designed for tutors, developers, lawyers, and virtual assistants who bill clients strictly on an hourly basis.',
    recommendedFor: 'Virtual assistants, software engineers, and hourly tutors.',
    templateId: 'modern_minimal',
    accentColor: '#102A43',
    currency: 'USD',
    features: ['Explicit hourly units', 'Logged task descriptions', 'Total billable hours tally'],
    defaultTerms: 'Timesheet logged and verified. Due within 15 days of issue.',
    items: [
      { id: 'item_1', name: 'Full-Stack Engineering (Week 1)', description: 'Database schema migration, API routing, and unit test coverage.', quantity: 35, unit: 'hours', rate: 80.00 },
      { id: 'item_2', name: 'Technical Code Review', description: 'Security audit and merge review for pull requests.', quantity: 5, unit: 'hours', rate: 80.00 },
    ],
  },
  {
    id: 'photography-invoice',
    name: 'Photography Invoice',
    category: 'Creative & Media',
    tagline: 'Licensing, usage rights, and equipment fees clearly defined.',
    description: 'Specialized for commercial and event photographers to document day rates, editing fees, and usage license grants.',
    recommendedFor: 'Commercial photographers, event shooters, and videographers.',
    templateId: 'creative_freelancer',
    accentColor: '#0F172A',
    currency: 'USD',
    features: ['Commercial licensing rights terms', 'Half-day/Full-day shoot rates', 'Digital asset delivery notice'],
    defaultTerms: 'Includes non-exclusive commercial digital usage rights. RAW files archived 12 months.',
    items: [
      { id: 'item_1', name: 'Full-Day Commercial Studio Shoot', description: 'Product staging, lighting setup, 8 hours on-location studio photography.', quantity: 1, unit: 'day', rate: 1600.00 },
      { id: 'item_2', name: 'High-Res Color Grading & Retouching', description: 'Hand retouching and web/print optimization for 30 hero shots.', quantity: 30, unit: 'images', rate: 35.00 },
    ],
  },
  {
    id: 'agency-invoice',
    name: 'Agency Invoice',
    category: 'Digital Agencies',
    tagline: 'Multi-team, retainer-ready invoice for digital marketing and PR firms.',
    description: 'High-volume agency invoice format accommodating retainers, campaign ad spend management, and creative deliverables.',
    recommendedFor: 'Digital agencies, marketing firms, and dev shops.',
    templateId: 'clean_corporate',
    accentColor: '#1D4ED8',
    currency: 'USD',
    features: ['Multi-disciplinary team items', 'Client department and PO tagging', 'Monthly retainer schedule'],
    defaultTerms: 'Monthly agency retainer. Net 30 days. Wire transfer preferred.',
    items: [
      { id: 'item_1', name: 'Search & Paid Media Management', description: 'Google Ads and LinkedIn ad management, bi-weekly optimization.', quantity: 1, unit: 'month', rate: 2500.00 },
      { id: 'item_2', name: 'Content Marketing & SEO Copywriting', description: '4 in-depth technical whitepapers and keyword optimization.', quantity: 4, unit: 'articles', rate: 600.00 },
    ],
  },
  {
    id: 'simple-business-invoice',
    name: 'Simple Business Invoice',
    category: 'General Business',
    tagline: 'Minimalist, no-fuss document that gets straight to the point.',
    description: 'A clean, universally accepted invoice format suitable for quick jobs and straightforward billing without complex configurations.',
    recommendedFor: 'Anyone needing a simple, fast, and elegant invoice.',
    templateId: 'classic',
    accentColor: '#2563EB',
    currency: 'USD',
    features: ['Minimalist layout', 'Instant readability', '1-page compact fit'],
    defaultTerms: 'Thank you for your business. Payment due upon receipt.',
    items: [
      { id: 'item_1', name: 'General Professional Services', description: 'Consultation and project execution as agreed.', quantity: 1, unit: 'flat fee', rate: 500.00 },
    ],
  },
];
