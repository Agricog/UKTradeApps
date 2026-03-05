import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Printer,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { trackEvent } from '../utils/analytics'
import NewsletterSignup from '../components/NewsletterSignup'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'

/* =========================================================================
   Types
   ========================================================================= */

interface JobTemplate {
  id: string
  name: string
  description: string
  category: string
  baseMaterialsCost: number
  baseLabourHours: number
  certificationFee: number
  isNotifiable: boolean
  notifiableReason: string | null
  unit: string
  minQty: number
  maxQty: number
}

interface SelectedJob {
  templateId: string
  quantity: number
}

interface BusinessDetails {
  businessName: string
  contactName: string
  phone: string
  email: string
  address: string
  schemeProvider: string
  registrationNumber: string
}

interface ClientDetails {
  name: string
  address: string
  phone: string
  email: string
}

interface LineItem {
  template: JobTemplate
  quantity: number
  materials: number
  labourHours: number
  labour: number
  certification: number
  subtotal: number
}

/* =========================================================================
   Pricing Data \u2014 UK 2025/26 Benchmarks
   ========================================================================= */

const JOB_TEMPLATES: JobTemplate[] = [
  {
    id: 'consumer-unit',
    name: 'Consumer Unit Upgrade',
    description: 'Replace existing consumer unit with 18th Edition compliant unit including RCBOs, testing and certification.',
    category: 'Installation',
    baseMaterialsCost: 280,
    baseLabourHours: 5,
    certificationFee: 60,
    isNotifiable: true,
    notifiableReason: 'Consumer unit replacement is notifiable under Part P of the Building Regulations.',
    unit: 'unit',
    minQty: 1,
    maxQty: 3,
  },
  {
    id: 'full-rewire-2bed',
    name: 'Full Rewire \u2014 2 Bed House',
    description: 'Complete rewire including new consumer unit, all circuits, sockets, switches, lighting and testing.',
    category: 'Rewire',
    baseMaterialsCost: 1200,
    baseLabourHours: 32,
    certificationFee: 120,
    isNotifiable: true,
    notifiableReason: 'Full rewire is notifiable under Part P of the Building Regulations.',
    unit: 'property',
    minQty: 1,
    maxQty: 1,
  },
  {
    id: 'full-rewire-3bed',
    name: 'Full Rewire \u2014 3 Bed House',
    description: 'Complete rewire including new consumer unit, all circuits, sockets, switches, lighting and testing.',
    category: 'Rewire',
    baseMaterialsCost: 1600,
    baseLabourHours: 40,
    certificationFee: 120,
    isNotifiable: true,
    notifiableReason: 'Full rewire is notifiable under Part P of the Building Regulations.',
    unit: 'property',
    minQty: 1,
    maxQty: 1,
  },
  {
    id: 'full-rewire-4bed',
    name: 'Full Rewire \u2014 4 Bed House',
    description: 'Complete rewire including new consumer unit, all circuits, sockets, switches, lighting and testing.',
    category: 'Rewire',
    baseMaterialsCost: 2100,
    baseLabourHours: 48,
    certificationFee: 120,
    isNotifiable: true,
    notifiableReason: 'Full rewire is notifiable under Part P of the Building Regulations.',
    unit: 'property',
    minQty: 1,
    maxQty: 1,
  },
  {
    id: 'partial-rewire',
    name: 'Partial Rewire (per room)',
    description: 'Rewire a single room including new cables, sockets, switches and lighting points.',
    category: 'Rewire',
    baseMaterialsCost: 250,
    baseLabourHours: 8,
    certificationFee: 60,
    isNotifiable: true,
    notifiableReason: 'New circuits in a rewire are notifiable under Part P.',
    unit: 'room',
    minQty: 1,
    maxQty: 8,
  },
  {
    id: 'socket-install',
    name: 'Socket Installation',
    description: 'Install new double socket with surface or flush mounting, including cable run from existing circuit.',
    category: 'Sockets & Switches',
    baseMaterialsCost: 22,
    baseLabourHours: 1.5,
    certificationFee: 0,
    isNotifiable: false,
    notifiableReason: null,
    unit: 'socket',
    minQty: 1,
    maxQty: 20,
  },
  {
    id: 'socket-outdoor',
    name: 'Outdoor Socket Installation',
    description: 'Install weatherproof IP66 outdoor socket with RCD protection and dedicated circuit.',
    category: 'Sockets & Switches',
    baseMaterialsCost: 65,
    baseLabourHours: 3,
    certificationFee: 40,
    isNotifiable: true,
    notifiableReason: 'New circuit in a special location (outdoors) is notifiable under Part P.',
    unit: 'socket',
    minQty: 1,
    maxQty: 4,
  },
  {
    id: 'light-fitting',
    name: 'Light Fitting Installation',
    description: 'Install or replace light fitting on existing circuit. Excludes cost of the fitting itself.',
    category: 'Lighting',
    baseMaterialsCost: 12,
    baseLabourHours: 1,
    certificationFee: 0,
    isNotifiable: false,
    notifiableReason: null,
    unit: 'fitting',
    minQty: 1,
    maxQty: 20,
  },
  {
    id: 'downlights',
    name: 'LED Downlight Installation',
    description: 'Supply and install fire-rated LED downlights including cutting holes, wiring and testing.',
    category: 'Lighting',
    baseMaterialsCost: 28,
    baseLabourHours: 0.75,
    certificationFee: 0,
    isNotifiable: false,
    notifiableReason: null,
    unit: 'downlight',
    minQty: 1,
    maxQty: 30,
  },
  {
    id: 'eicr',
    name: 'EICR (Electrical Installation Condition Report)',
    description: 'Full inspection and testing of domestic electrical installation with detailed report and recommendations.',
    category: 'Testing & Certification',
    baseMaterialsCost: 0,
    baseLabourHours: 3,
    certificationFee: 40,
    isNotifiable: false,
    notifiableReason: null,
    unit: 'property',
    minQty: 1,
    maxQty: 1,
  },
  {
    id: 'ev-charger',
    name: 'EV Charger Installation (7kW)',
    description: 'Supply and install 7kW EV charger with dedicated circuit from consumer unit, including earthing and testing.',
    category: 'EV & Renewables',
    baseMaterialsCost: 550,
    baseLabourHours: 5,
    certificationFee: 60,
    isNotifiable: true,
    notifiableReason: 'New circuit for EV charger is notifiable under Part P.',
    unit: 'charger',
    minQty: 1,
    maxQty: 2,
  },
  {
    id: 'smoke-alarm',
    name: 'Smoke Alarm Installation (Mains Wired)',
    description: 'Supply and install mains-wired interlinked smoke alarm with battery backup.',
    category: 'Fire Safety',
    baseMaterialsCost: 35,
    baseLabourHours: 1,
    certificationFee: 0,
    isNotifiable: false,
    notifiableReason: null,
    unit: 'alarm',
    minQty: 1,
    maxQty: 10,
  },
  {
    id: 'fault-finding',
    name: 'Fault Finding',
    description: 'Diagnose and locate electrical fault. Labour only \u2014 repair costs quoted separately once fault is identified.',
    category: 'Repairs',
    baseMaterialsCost: 0,
    baseLabourHours: 2,
    certificationFee: 0,
    isNotifiable: false,
    notifiableReason: null,
    unit: 'visit',
    minQty: 1,
    maxQty: 1,
  },
  {
    id: 'garden-lighting',
    name: 'Outdoor / Garden Lighting',
    description: 'Supply and install outdoor lighting circuit with IP-rated fittings, RCD protection and testing.',
    category: 'Lighting',
    baseMaterialsCost: 180,
    baseLabourHours: 6,
    certificationFee: 40,
    isNotifiable: true,
    notifiableReason: 'New circuit in a special location (outdoors) is notifiable under Part P.',
    unit: 'circuit',
    minQty: 1,
    maxQty: 3,
  },
  {
    id: 'fuseboard-inspection',
    name: 'Consumer Unit Visual Inspection',
    description: 'Visual inspection of consumer unit condition, labelling and compliance. No full EICR.',
    category: 'Testing & Certification',
    baseMaterialsCost: 0,
    baseLabourHours: 0.5,
    certificationFee: 0,
    isNotifiable: false,
    notifiableReason: null,
    unit: 'unit',
    minQty: 1,
    maxQty: 1,
  },
]

interface RegionOption {
  value: string
  label: string
  multiplier: number
}

const REGIONS: RegionOption[] = [
  { value: 'london', label: 'London', multiplier: 1.35 },
  { value: 'south-east', label: 'South East', multiplier: 1.15 },
  { value: 'south-west', label: 'South West', multiplier: 1.0 },
  { value: 'midlands', label: 'Midlands', multiplier: 0.95 },
  { value: 'north', label: 'North England', multiplier: 0.90 },
  { value: 'scotland', label: 'Scotland', multiplier: 0.92 },
  { value: 'wales', label: 'Wales', multiplier: 0.88 },
  { value: 'northern-ireland', label: 'Northern Ireland', multiplier: 0.85 },
]

const DEFAULT_REGION: RegionOption = REGIONS[2]
const BASE_HOURLY_RATE = 45

/* =========================================================================
   Structured Data
   ========================================================================= */

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Free Electrician Quote Generator',
      url: `${APP_URL}/quote`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      description: 'Free quote generator for UK electricians. Select common domestic jobs, adjust for your region, and generate a professional PDF quote in under 2 minutes.',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
        { '@type': 'ListItem', position: 2, name: 'Quote Generator', item: `${APP_URL}/quote` },
      ],
    },
  ],
}

/* =========================================================================
   Helpers
   ========================================================================= */

function formatGBP(amount: number): string {
  return '\u00a3' + amount.toFixed(2)
}

function generateQuoteNumber(): string {
  const now = new Date()
  const y = now.getFullYear().toString().slice(-2)
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const r = Math.floor(Math.random() * 900 + 100)
  return `Q${y}${m}${d}-${r}`
}

/* =========================================================================
   QuoteBuilderPage Component
   ========================================================================= */

export default function QuoteBuilderPage() {
  const printRef = useRef<HTMLDivElement>(null)

  const [selectedJobs, setSelectedJobs] = useState<SelectedJob[]>([])
  const [region, setRegion] = useState('south-west')
  const [vatRegistered, setVatRegistered] = useState(false)
  const [cisDeduction, setCisDeduction] = useState(false)
  const [labourRateOverride, setLabourRateOverride] = useState<string>('')
  const [validityDays, setValidityDays] = useState(30)

  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    schemeProvider: '',
    registrationNumber: '',
  })

  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: '',
    address: '',
    phone: '',
    email: '',
  })

  const [showQuote, setShowQuote] = useState(false)
  const [quoteNumber] = useState(generateQuoteNumber)

  const regionData: RegionOption = REGIONS.find((r) => r.value === region) ?? DEFAULT_REGION
  const effectiveHourlyRate: number = labourRateOverride
    ? Number(labourRateOverride)
    : BASE_HOURLY_RATE * regionData.multiplier

  const addJob = (templateId: string) => {
    const existing = selectedJobs.find((j) => j.templateId === templateId)
    if (existing) return
    setSelectedJobs((prev) => [...prev, { templateId, quantity: 1 }])
  }

  const removeJob = (templateId: string) => {
    setSelectedJobs((prev) => prev.filter((j) => j.templateId !== templateId))
  }

  const updateQuantity = (templateId: string, delta: number) => {
    setSelectedJobs((prev) =>
      prev.map((j) => {
        if (j.templateId !== templateId) return j
        const template = JOB_TEMPLATES.find((t) => t.id === templateId)
        if (!template) return j
        const newQty = Math.max(template.minQty, Math.min(template.maxQty, j.quantity + delta))
        return { ...j, quantity: newQty }
      }),
    )
  }

  const lineItems: LineItem[] = selectedJobs
    .map((job) => {
      const template = JOB_TEMPLATES.find((t) => t.id === job.templateId)
      if (!template) return null

      const materials = template.baseMaterialsCost * job.quantity
      const labourHours = template.baseLabourHours * job.quantity
      const labour = labourHours * effectiveHourlyRate
      const certification = template.certificationFee > 0 ? template.certificationFee : 0

      return {
        template,
        quantity: job.quantity,
        materials,
        labourHours,
        labour,
        certification,
        subtotal: materials + labour + certification,
      }
    })
    .filter((item): item is LineItem => item !== null)

  const totalMaterials: number = lineItems.reduce((sum: number, item: LineItem) => sum + item.materials, 0)
  const totalLabour: number = lineItems.reduce((sum: number, item: LineItem) => sum + item.labour, 0)
  const totalCertification: number = lineItems.reduce((sum: number, item: LineItem) => sum + item.certification, 0)
  const subtotal: number = totalMaterials + totalLabour + totalCertification
  const vatAmount: number = vatRegistered ? subtotal * 0.2 : 0
  const cisAmount: number = cisDeduction ? totalLabour * 0.2 : 0
  const grandTotal: number = subtotal + vatAmount - cisAmount

  const hasNotifiableWork: boolean = lineItems.some((item: LineItem) => item.template.isNotifiable)
  const totalLabourHours: number = lineItems.reduce((sum: number, item: LineItem) => sum + item.labourHours, 0)

  const handleGenerateQuote = () => {
    if (selectedJobs.length === 0) return
    trackEvent('quote_generated', {
      region,
      job_count: selectedJobs.length,
      total: grandTotal,
    })
    setShowQuote(true)
  }

  const handlePrint = () => {
    trackEvent('quote_printed')
    window.print()
  }

  const handleEdit = () => {
    setShowQuote(false)
  }

  const today = new Date()
  const validUntil = new Date(today.getTime() + validityDays * 24 * 60 * 60 * 1000)
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  if (showQuote) {
    return (
      <>
        <Helmet>
          <title>Quote {quoteNumber} | UKTradeApps Quote Generator</title>
          <meta name="robots" content="noindex, nofollow" />
          <style>{`
            @media print {
              body * { visibility: hidden !important; }
              #print-quote, #print-quote * { visibility: visible !important; }
              #print-quote { position: absolute; left: 0; top: 0; width: 100%; padding: 20mm; font-size: 11pt; }
              .no-print { display: none !important; }
            }
          `}</style>
        </Helmet>

        <div className="no-print sticky top-0 z-40 border-b border-surface-200 bg-white">
          <div className="container-app flex h-16 items-center justify-between">
            <button type="button" onClick={handleEdit} className="btn-secondary text-sm">
              <ArrowLeft className="h-4 w-4" />
              Edit quote
            </button>
            <button type="button" onClick={handlePrint} className="btn-primary text-sm">
              <Printer className="h-4 w-4" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        <div id="print-quote" ref={printRef} className="mx-auto max-w-3xl bg-white px-6 py-10 sm:px-10">
          <div className="flex items-start justify-between border-b border-surface-200 pb-6">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-surface-900">
                {businessDetails.businessName || 'Your Business Name'}
              </h1>
              {businessDetails.contactName && (
                <p className="mt-1 text-sm text-surface-600">{businessDetails.contactName}</p>
              )}
              {businessDetails.address && (
                <p className="text-sm text-surface-600">{businessDetails.address}</p>
              )}
              {businessDetails.phone && (
                <p className="text-sm text-surface-600">{businessDetails.phone}</p>
              )}
              {businessDetails.email && (
                <p className="text-sm text-surface-600">{businessDetails.email}</p>
              )}
              {businessDetails.schemeProvider && (
                <p className="mt-2 text-xs font-medium text-brand-700">
                  {businessDetails.schemeProvider}
                  {businessDetails.registrationNumber && ` \u2014 ${businessDetails.registrationNumber}`}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold text-brand-700">QUOTE</p>
              <p className="mt-1 text-sm text-surface-600">{quoteNumber}</p>
              <p className="mt-2 text-sm text-surface-600">Date: {formatDate(today)}</p>
              <p className="text-sm text-surface-600">Valid until: {formatDate(validUntil)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-surface-200 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">Quote for</p>
            <p className="mt-1 font-semibold text-surface-900">
              {clientDetails.name || 'Client Name'}
            </p>
            {clientDetails.address && (
              <p className="text-sm text-surface-600">{clientDetails.address}</p>
            )}
            {clientDetails.phone && (
              <p className="text-sm text-surface-600">{clientDetails.phone}</p>
            )}
            {clientDetails.email && (
              <p className="text-sm text-surface-600">{clientDetails.email}</p>
            )}
          </div>

          <table className="mt-6 w-full text-sm">
            <thead>
              <tr className="border-b-2 border-surface-300 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">
                <th className="pb-2 pr-2">Description</th>
                <th className="pb-2 pr-2 text-center">Qty</th>
                <th className="pb-2 pr-2 text-right">Materials</th>
                <th className="pb-2 pr-2 text-right">Labour</th>
                <th className="pb-2 pr-2 text-right">Cert/Test</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item: LineItem) => (
                <tr key={item.template.id} className="border-b border-surface-100">
                  <td className="py-3 pr-2">
                    <p className="font-medium text-surface-900">{item.template.name}</p>
                    <p className="mt-0.5 text-xs text-surface-500">{item.template.description}</p>
                  </td>
                  <td className="py-3 pr-2 text-center text-surface-700">{item.quantity}</td>
                  <td className="py-3 pr-2 text-right text-surface-700">
                    {item.materials > 0 ? formatGBP(item.materials) : '\u2014'}
                  </td>
                  <td className="py-3 pr-2 text-right text-surface-700">
                    {formatGBP(item.labour)}
                    <span className="block text-xs text-surface-400">
                      ({item.labourHours}h @ {formatGBP(effectiveHourlyRate)}/h)
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right text-surface-700">
                    {item.certification > 0 ? formatGBP(item.certification) : '\u2014'}
                  </td>
                  <td className="py-3 text-right font-medium text-surface-900">
                    {formatGBP(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between text-surface-600">
                <span>Materials</span>
                <span>{formatGBP(totalMaterials)}</span>
              </div>
              <div className="flex justify-between text-surface-600">
                <span>Labour ({totalLabourHours.toFixed(1)} hours)</span>
                <span>{formatGBP(totalLabour)}</span>
              </div>
              {totalCertification > 0 && (
                <div className="flex justify-between text-surface-600">
                  <span>Testing & Certification</span>
                  <span>{formatGBP(totalCertification)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-surface-200 pt-1 font-medium text-surface-900">
                <span>Subtotal</span>
                <span>{formatGBP(subtotal)}</span>
              </div>
              {vatRegistered && (
                <div className="flex justify-between text-surface-600">
                  <span>VAT (20%)</span>
                  <span>{formatGBP(vatAmount)}</span>
                </div>
              )}
              {cisDeduction && (
                <div className="flex justify-between text-amber-700">
                  <span>CIS Deduction (20% of labour)</span>
                  <span>-{formatGBP(cisAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-surface-900 pt-2 font-display text-lg font-bold text-surface-900">
                <span>Total</span>
                <span>{formatGBP(grandTotal)}</span>
              </div>
            </div>
          </div>

          {hasNotifiableWork && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              <p className="font-semibold">Part P Building Regulations Notice</p>
              <p className="mt-1">
                This quote includes work that is notifiable under Part P of the Building Regulations.
                A notification will be submitted to the relevant scheme provider upon completion,
                and a Building Regulations Compliance Certificate will be issued.
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-surface-200 pt-4 text-xs text-surface-500 leading-relaxed">
            <p className="font-semibold text-surface-700">Terms & Conditions</p>
            <p className="mt-1">
              This quote is valid for {validityDays} days from the date above.
              Payment terms: 50% deposit on acceptance, balance on completion.
              All work carried out in accordance with BS 7671:2018+A2:2022.
              {vatRegistered ? ' All prices include VAT at 20%.' : ' Not VAT registered.'}
              {cisDeduction ? ' CIS deductions applied as per HMRC requirements.' : ''}
              {' '}Any additional work not covered in this quote will be agreed in writing before commencing.
            </p>
          </div>

          <div className="mt-8 border-t border-surface-200 pt-4 text-center text-xs text-surface-400">
            Quote generated with UKTradeApps \u2014 uktradeapps.co.uk
          </div>
        </div>

        <div className="no-print">
          <NewsletterSignup
            source="quote-builder"
            heading="Like this tool?"
            description="Get a weekly roundup of free tools, new apps and deals for UK electricians. No spam."
          />
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Free Electrician Quote Generator | UK Pricing | UKTradeApps</title>
        <meta
          name="description"
          content="Free quote generator for UK electricians. Select domestic jobs, adjust for your region, and create a professional PDF quote in under 2 minutes. No signup required."
        />
        <link rel="canonical" href={`${APP_URL}/quote`} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:title" content="Free Electrician Quote Generator | UKTradeApps" />
        <meta property="og:description" content="Create professional electrical quotes in under 2 minutes. Free, no signup. UK pricing and Part P compliance built in." />
        <meta property="og:image" content={`${APP_URL}/og-uktradeapps.jpg`} />
        <meta property="og:url" content={`${APP_URL}/quote`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Electrician Quote Generator | UKTradeApps" />
        <meta name="twitter:description" content="Create professional electrical quotes in under 2 minutes. Free, no signup." />
        <meta name="twitter:image" content={`${APP_URL}/og-uktradeapps.jpg`} />
        <meta name="author" content="UKTradeApps \u2014 Autaimate Portfolio" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <a href="#main-content" className="skip-nav">Skip to main content</a>

      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
        <nav className="container-app flex h-16 items-center justify-between" aria-label="Main navigation">
          <Link to="/" className="font-display text-xl font-bold text-brand-700">
            UK<span className="text-accent-500">Trade</span>Apps
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/electricians" className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 lg:block">
              Electricians
            </Link>
            <Link to="/quiz" className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 sm:block">
              Find My Stack
            </Link>
            <Link to="/submit" className="btn-primary text-sm">List Your App</Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden bg-brand-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(63,104,235,0.3),transparent)]" />
          <div className="container-app relative py-12 text-center sm:py-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500 text-white">
              <Zap className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Free Electrician <span className="text-accent-400">Quote Generator</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface-300">
              Select your jobs, adjust for your region, and generate a
              professional quote ready to send to clients. Under 2 minutes. No
              signup.
            </p>
          </div>
        </section>

        <div className="section-spacing bg-surface-50">
          <div className="container-app">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <div className="card">
                  <h2 className="font-display text-xl font-bold text-surface-900">
                    Select jobs
                  </h2>
                  <p className="mt-1 text-sm text-surface-500">
                    Click to add jobs to your quote. Adjust quantities after adding.
                  </p>

                  {['Installation', 'Rewire', 'Sockets & Switches', 'Lighting', 'Testing & Certification', 'EV & Renewables', 'Fire Safety', 'Repairs'].map((category) => {
                    const jobs = JOB_TEMPLATES.filter((t) => t.category === category)
                    if (jobs.length === 0) return null
                    return (
                      <div key={category} className="mt-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                          {category}
                        </h3>
                        <div className="mt-2 space-y-2">
                          {jobs.map((template) => {
                            const isSelected = selectedJobs.some((j) => j.templateId === template.id)
                            const selectedJob = selectedJobs.find((j) => j.templateId === template.id)
                            return (
                              <div
                                key={template.id}
                                className={`rounded-lg border-2 px-4 py-3 transition-all ${
                                  isSelected
                                    ? 'border-brand-600 bg-brand-50'
                                    : 'border-surface-200 bg-white'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-surface-900">{template.name}</p>
                                      {template.isNotifiable && (
                                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-2xs font-medium text-amber-700">
                                          Part P
                                        </span>
                                      )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-surface-500">{template.description}</p>
                                  </div>

                                  {isSelected ? (
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(template.id, -1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-300 bg-white text-surface-600 hover:bg-surface-50"
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus className="h-3.5 w-3.5" />
                                      </button>
                                      <span className="w-8 text-center font-medium text-surface-900">
                                        {selectedJob?.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(template.id, 1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-300 bg-white text-surface-600 hover:bg-surface-50"
                                        aria-label="Increase quantity"
                                      >
                                        <Plus className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeJob(template.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                                        aria-label="Remove job"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => addJob(template.id)}
                                      className="flex h-8 items-center gap-1 rounded-md bg-brand-600 px-3 text-xs font-medium text-white hover:bg-brand-700"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                      Add
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="card">
                  <h2 className="font-display text-xl font-bold text-surface-900">
                    Your business details
                  </h2>
                  <p className="mt-1 text-sm text-surface-500">
                    Appears on the quote header. Optional but recommended for a professional look.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <input type="text" placeholder="Business name" value={businessDetails.businessName} onChange={(e) => setBusinessDetails({ ...businessDetails, businessName: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    <input type="text" placeholder="Contact name" value={businessDetails.contactName} onChange={(e) => setBusinessDetails({ ...businessDetails, contactName: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    <input type="tel" placeholder="Phone number" value={businessDetails.phone} onChange={(e) => setBusinessDetails({ ...businessDetails, phone: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    <input type="email" placeholder="Email address" value={businessDetails.email} onChange={(e) => setBusinessDetails({ ...businessDetails, email: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    <input type="text" placeholder="Business address" value={businessDetails.address} onChange={(e) => setBusinessDetails({ ...businessDetails, address: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:col-span-2" />
                    <input type="text" placeholder="Scheme provider (e.g. NICEIC, NAPIT)" value={businessDetails.schemeProvider} onChange={(e) => setBusinessDetails({ ...businessDetails, schemeProvider: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    <input type="text" placeholder="Registration number" value={businessDetails.registrationNumber} onChange={(e) => setBusinessDetails({ ...businessDetails, registrationNumber: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                </div>

                <div className="card">
                  <h2 className="font-display text-xl font-bold text-surface-900">
                    Client details
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <input type="text" placeholder="Client name" value={clientDetails.name} onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    <input type="tel" placeholder="Client phone" value={clientDetails.phone} onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    <input type="text" placeholder="Client address" value={clientDetails.address} onChange={(e) => setClientDetails({ ...clientDetails, address: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:col-span-2" />
                    <input type="email" placeholder="Client email" value={clientDetails.email} onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })} className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card">
                  <h2 className="font-display text-lg font-bold text-surface-900">
                    Pricing settings
                  </h2>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-surface-700">
                        Region
                      </label>
                      <select
                        id="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        {REGIONS.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label} ({'\u00d7'}{r.multiplier.toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="hourly-rate" className="block text-sm font-medium text-surface-700">
                        Hourly rate override
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400">{'\u00a3'}</span>
                        <input
                          id="hourly-rate"
                          type="number"
                          min="20"
                          max="150"
                          step="1"
                          value={labourRateOverride}
                          onChange={(e) => setLabourRateOverride(e.target.value)}
                          placeholder={effectiveHourlyRate.toFixed(0)}
                          className="w-full rounded-lg border border-surface-300 bg-white py-2 pl-7 pr-3 text-sm text-surface-900 placeholder-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                      </div>
                      <p className="mt-1 text-2xs text-surface-400">
                        Leave blank to use regional average ({'\u00a3'}{(BASE_HOURLY_RATE * regionData.multiplier).toFixed(0)}/h)
                      </p>
                    </div>

                    <div>
                      <label htmlFor="validity" className="block text-sm font-medium text-surface-700">
                        Quote valid for (days)
                      </label>
                      <input
                        id="validity"
                        type="number"
                        min="7"
                        max="90"
                        value={validityDays}
                        onChange={(e) => setValidityDays(Number(e.target.value) || 30)}
                        className="mt-1 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        id="vat"
                        type="checkbox"
                        checked={vatRegistered}
                        onChange={(e) => setVatRegistered(e.target.checked)}
                        className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                      />
                      <label htmlFor="vat" className="text-sm text-surface-700">
                        VAT registered (add 20%)
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        id="cis"
                        type="checkbox"
                        checked={cisDeduction}
                        onChange={(e) => setCisDeduction(e.target.checked)}
                        className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                      />
                      <label htmlFor="cis" className="text-sm text-surface-700">
                        CIS deduction (20% of labour)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="card border-brand-200 bg-brand-50">
                  <h2 className="font-display text-lg font-bold text-brand-900">
                    Quote summary
                  </h2>

                  {selectedJobs.length === 0 ? (
                    <p className="mt-3 text-sm text-brand-700">
                      Add jobs from the left to see your quote total.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2 text-sm">
                      {lineItems.map((item: LineItem) => (
                        <div key={item.template.id} className="flex justify-between text-brand-800">
                          <span>
                            {item.template.name}
                            {item.quantity > 1 ? ` \u00d7${item.quantity}` : ''}
                          </span>
                          <span className="font-medium">{formatGBP(item.subtotal)}</span>
                        </div>
                      ))}

                      <div className="border-t border-brand-200 pt-2">
                        <div className="flex justify-between text-brand-800">
                          <span>Subtotal</span>
                          <span className="font-medium">{formatGBP(subtotal)}</span>
                        </div>
                        {vatRegistered && (
                          <div className="flex justify-between text-brand-700">
                            <span>VAT (20%)</span>
                            <span>{formatGBP(vatAmount)}</span>
                          </div>
                        )}
                        {cisDeduction && (
                          <div className="flex justify-between text-amber-700">
                            <span>CIS deduction</span>
                            <span>-{formatGBP(cisAmount)}</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t-2 border-brand-600 pt-2">
                        <div className="flex justify-between font-display text-xl font-bold text-brand-900">
                          <span>Total</span>
                          <span>{formatGBP(grandTotal)}</span>
                        </div>
                        <p className="mt-1 text-2xs text-brand-600">
                          {totalLabourHours.toFixed(1)} hours estimated labour
                        </p>
                      </div>
                    </div>
                  )}

                  {hasNotifiableWork && (
                    <div className="mt-4 flex items-start gap-2 rounded-md bg-amber-100 px-3 py-2 text-xs text-amber-800">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                      <span>Includes Part P notifiable work</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleGenerateQuote}
                    disabled={selectedJobs.length === 0}
                    className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Generate quote
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="mt-3 flex items-center gap-1.5 text-2xs text-brand-600">
                    <Info className="h-3 w-3 flex-shrink-0" />
                    Prices are UK regional averages. Adjust to match your rates.
                  </p>
                </div>

                <div className="card">
                  <h2 className="font-display text-lg font-bold text-surface-900">
                    Need quoting software?
                  </h2>
                  <p className="mt-2 text-sm text-surface-600">
                    Compare the best quoting and estimating tools for UK electricians in our directory.
                  </p>
                  <Link to="/electricians" className="btn-secondary mt-4 w-full justify-center text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Browse electrician apps
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-surface-200 bg-white py-10">
        <div className="container-app text-center text-xs text-surface-400">
          {'\u00a9'} {new Date().getFullYear()} UKTradeApps. Part of the Autaimate portfolio. All rights reserved.
        </div>
      </footer>
    </>
  )
}
