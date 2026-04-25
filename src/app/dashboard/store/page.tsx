'use client';

import { useState } from 'react';
import {
  Wifi,
  Shield,
  Bot,
  Search,
  FileText,
  CreditCard,
  Trash2,
  Users,
  Ticket,
  Smartphone,
  Send,
  TrendingUp,
  ChevronRight,
  Activity,
  Package,
  BarChart3,
  X,
  HelpCircle,
  Bell,
} from 'lucide-react';

// Section 1: Active Services
const activeServices = [
  { id: 'airtime', name: 'Airtime', desc: 'Auto-send', icon: Wifi, color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { id: 'stk', name: 'STK Push', desc: 'Collect', icon: Smartphone, color: 'bg-amber-50', iconColor: 'text-amber-600' },
  { id: 'nexora', name: 'Nexora AI', desc: 'Insights', icon: Bot, color: 'bg-violet-50', iconColor: 'text-violet-600' },
];

// Section 2: Financial Services
const financialServices = [
  { id: 'crb', name: 'CRB Check', icon: Shield, color: 'bg-sky-50', iconColor: 'text-sky-600' },
  { id: 'chama', name: 'ChamaFlow', icon: Users, color: 'bg-rose-50', iconColor: 'text-rose-600' },
  { id: 'pesalink', name: 'Pesalink', icon: Send, color: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { id: 'ledger', name: 'P&L Ledger', icon: BarChart3, color: 'bg-teal-50', iconColor: 'text-teal-600' },
];

// Section 3: Business Tools
const businessTools = [
  { id: 'receipts', name: 'Receipts', icon: FileText, color: 'bg-stone-50', iconColor: 'text-stone-600' },
  { id: 'invoices', name: 'Invoices', icon: CreditCard, color: 'bg-red-50', iconColor: 'text-red-600' },
  { id: 'bulk_sms', name: 'Bulk SMS', icon: Send, color: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'qr', name: 'QR Code', icon: CreditCard, color: 'bg-purple-50', iconColor: 'text-purple-600' },
  { id: 'bill', name: 'Bill Mgr', icon: FileText, color: 'bg-orange-50', iconColor: 'text-orange-600' },
  { id: 'pos', name: 'PoS Smart', icon: Smartphone, color: 'bg-indigo-50', iconColor: 'text-indigo-600' },
];

// Section 4: Logistics & Operations
const logisticsServices = [
  { id: 'fleet', name: 'Fleet', icon: Package, color: 'bg-slate-50', iconColor: 'text-slate-600' },
  { id: 'route', name: 'Routes', icon: Trash2, color: 'bg-lime-50', iconColor: 'text-lime-600' },
  { id: 'fuel', name: 'Fuel', icon: TrendingUp, color: 'bg-yellow-50', iconColor: 'text-yellow-600' },
  { id: 'tikiti', name: 'Tikiti', icon: Ticket, color: 'bg-fuchsia-50', iconColor: 'text-fuchsia-600' },
];

// Section 5: Compliance & Growth
const complianceServices = [
  { id: 'odpc', name: 'ODPC', icon: Shield, color: 'bg-gray-50', iconColor: 'text-gray-600' },
  { id: 'growth', name: 'Growth', icon: TrendingUp, color: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'loyalty', name: 'Loyalty', icon: Bell, color: 'bg-amber-50', iconColor: 'text-amber-600' },
  { id: 'analytics', name: 'Analytics', icon: Activity, color: 'bg-cyan-50', iconColor: 'text-cyan-600' },
];

export default function StorePage() {
  const [selectedService, setSelectedService] = useState<any>(null);

  const ServiceIcon = ({ service }: { service: any }) => {
    const IconComponent = service.icon;
    return (
      <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
        <IconComponent className={`w-6 h-6 ${service.iconColor} stroke-[1.5]`} />
      </div>
    );
  };

  const SectionTitle = ({ title, action }: { title: string; action?: string }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
      {action && (
        <button className="text-[11px] text-[#8B1D1D] font-bold flex items-center gap-0.5">
          {action} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      
      {/* ==================== CENTERED CLEAN HEADER ==================== */}
      <header className="px-6 pt-12 pb-8 bg-white border-b border-slate-50">
        <div className="flex justify-between items-center relative">
          {/* Left Icon */}
          <button className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
            <HelpCircle className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Centered Title */}
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight absolute left-1/2 -translate-x-1/2">
            Services
          </h1>

          {/* Right Search Icon */}
          <button className="p-2 text-gray-400 hover:text-[#8B1D1D] transition-colors">
            <Search className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      </header>

      <main className="pb-24 pt-6">
        
        {/* ==================== SECTION 1: Your Services ==================== */}
        <div className="px-6">
          <SectionTitle title="Active Deployment" action="Manage" />
          <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
            {activeServices.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="flex flex-col items-center gap-2 min-w-[80px] group"
              >
                <div className={`w-16 h-16 ${service.color} rounded-[24px] flex items-center justify-center group-active:scale-95 transition-transform shadow-sm`}>
                  <service.icon className={`w-7 h-7 ${service.iconColor} stroke-[1.5]`} />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[12px] font-bold text-slate-800">{service.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{service.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== SECTION 2: Financial Intelligence ==================== */}
        <div className="px-6 mt-10">
          <SectionTitle title="Financial Intelligence" action="See All" />
          <div className="grid grid-cols-4 gap-y-8">
            {financialServices.map((service) => (
              <button key={service.id} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-2 group">
                <ServiceIcon service={service} />
                <span className="text-[11px] font-bold text-slate-600 text-center leading-tight">{service.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== SECTION 3: Business Automation ==================== */}
        <div className="px-6 mt-12">
          <SectionTitle title="Business Automation" action="See All" />
          <div className="grid grid-cols-4 gap-y-8">
            {businessTools.map((service) => (
              <button key={service.id} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-2 group">
                <ServiceIcon service={service} />
                <span className="text-[11px] font-bold text-slate-600 text-center leading-tight">{service.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== SECTION 4: Logistics & Operations ==================== */}
        <div className="px-6 mt-12">
          <SectionTitle title="Logistics & Operations" action="See All" />
          <div className="grid grid-cols-4 gap-y-8">
            {logisticsServices.map((service) => (
              <button key={service.id} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-2 group">
                <ServiceIcon service={service} />
                <span className="text-[11px] font-bold text-slate-600 text-center leading-tight">{service.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== SECTION 5: Compliance & Growth ==================== */}
        <div className="px-6 mt-12">
          <SectionTitle title="Compliance & Growth" />
          <div className="grid grid-cols-4 gap-y-8">
            {complianceServices.map((service) => (
              <button key={service.id} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-2 group">
                <ServiceIcon service={service} />
                <span className="text-[11px] font-bold text-slate-600 text-center leading-tight">{service.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== SUBTLE BRAND ELEMENT ==================== */}
        <div className="px-6 mt-14 flex flex-col items-center">
          <div className="w-8 h-0.5 bg-slate-100 rounded-full mb-3" />
          <p className="text-[11px] text-slate-300 font-medium tracking-wide">
            Powered by <span className="text-slate-400 font-bold">XecoFlow</span>
          </p>
          <p className="text-[9px] text-slate-300/70 mt-0.5">
            Business Intelligence on M-Pesa
          </p>
        </div>

      </main>

      {/* ==================== SERVICE DETAIL DRAWER ==================== */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className="relative bg-white rounded-t-[32px] w-full max-w-md p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 ${selectedService.color} rounded-[28px] flex items-center justify-center mb-4 shadow-sm`}>
                <selectedService.icon className={`w-10 h-10 ${selectedService.iconColor} stroke-[1.5]`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{selectedService.name}</h3>
              <p className="text-slate-500 text-sm mt-2 px-4">
                Professional merchant tool powered by XecoFlow Intelligence.
              </p>
            </div>

            {/* Connect to Till */}
            <div className="bg-slate-50 rounded-2xl p-4 mt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Connect to Till</p>
              <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700">
                <option>Till #123456 (Active)</option>
                <option>Till #567890</option>
              </select>
            </div>

            {/* Pricing */}
            <div className="text-center mt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {selectedService.price || 'Free'}
              </p>
            </div>

            <button className="w-full bg-[#8B1D1D] text-white py-4 rounded-[20px] font-bold mt-5 shadow-lg shadow-[#8B1D1D]/20 active:scale-[0.98] transition-transform">
              Activate Service
            </button>
            <button onClick={() => setSelectedService(null)} className="w-full py-4 text-slate-400 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}