import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Database, RefreshCw, Save, X, Sparkles, Check, 
  AlertTriangle, Clock, Layers, Globe, Copy, ArrowUpRight, Terminal
} from 'lucide-react';
import { ParsedData } from '../types';
import { COUNTRIES } from '../data/countries';
import { fetchLatestMarketDataFromDB, saveMarketDataToDB, fetchGeminiDataFromBackend } from '../services/api';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
  adminId: string;
  addToast: (type: 'success' | 'error' | 'warning', title: string, msg: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  adminToken,
  adminId,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'editor'>('current');
  const [currentDataset, setCurrentDataset] = useState<ParsedData | null>(null);
  const [datasetMetadata, setDatasetMetadata] = useState<any>(null);
  const [isLoadingDB, setIsLoadingDB] = useState(false);

  // Editor states
  const [jsonInput, setJsonInput] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorError, setEditorError] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Load current dataset on open
  useEffect(() => {
    if (isOpen) {
      loadLatestData();
    }
  }, [isOpen]);

  const loadLatestData = async () => {
    setIsLoadingDB(true);
    try {
      const res = await fetchLatestMarketDataFromDB();
      if (res.data) {
        setCurrentDataset(res.data);
        setDatasetMetadata(res.metadata);
        if (!jsonInput) {
          setJsonInput(JSON.stringify(res.data, null, 2));
        }
      }
    } catch (err: any) {
      console.error('Failed to load DB market data:', err);
    } finally {
      setIsLoadingDB(false);
    }
  };

  if (!isOpen) return null;

  // Master Prompt Generator for all 195 countries
  const getMasterAdminPrompt = () => {
    const allCountryCodes = COUNTRIES.map(c => c.code).join(", ");
    return `Please act as a global trade economist. I am analyzing a reference global product basket to calibrate market friction factors (theta) and purchasing power adjustments across 195 countries.

Please provide the following data for all 195 countries in a strict JSON format EXACTLY like this (do not include markdown formatting or extra text, just raw JSON):
{
  "BaseRetailCost": 1000,
  "CountryTaxRate": 0.10,
  "CountryDutyRate": 0.05,
  "LogisticsPremium": 1.05,
  "RetailMargin": 0.15,
  "GlobalPurchasingPower": 1.00,
  "ExchangeRate": 1.00,
  "CPICurrent": 100,
  "CPIBase": 100,
  "KnownMarketPrice": 1000,
  "TargetCountries": {
    "<Country Code>": {
      "IsAvailable": true,
      "CountryTaxRate": 0.10,
      "CountryDutyRate": 0.05,
      "LogisticsPremium": 1.05,
      "RetailMargin": 0.15,
      "ExchangeRate": 1.00,
      "CPICurrent": 100,
      "CPIBase": 100,
      "KnownMarketPrice": 1000
    }
  }
}

IMPORTANT REQUIREMENTS:
1. Please include parameters for ALL 195 countries in TargetCountries using their 2-letter ISO codes:
${allCountryCodes}
2. If the product is NOT officially available, sold, or distributed in a particular country (e.g., region-locked, unsold, or restricted), set "IsAvailable": false and "KnownMarketPrice": null for that country. If available, set "IsAvailable": true.`;
  };

  const handleCopyMasterPrompt = () => {
    navigator.clipboard.writeText(getMasterAdminPrompt());
    setCopiedPrompt(true);
    addToast('success', 'Master Prompt Copied!', 'Master 195-country Gemini prompt copied to clipboard.');
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  // Handler to generate fresh data via backend Gemini API
  const handleGenerateFreshData = async () => {
    setIsGenerating(true);
    setEditorError('');
    try {
      const prompt = getMasterAdminPrompt();
      const freshData = await fetchGeminiDataFromBackend(prompt);
      setJsonInput(JSON.stringify(freshData, null, 2));
      addToast('success', 'AI Generation Complete', 'Generated fresh 195-country market parameters via Gemini AI.');
    } catch (err: any) {
      setEditorError(err.message || 'Failed to generate data via Gemini AI.');
      addToast('error', 'AI Generation Failed', err.message || 'Could not fetch fresh data.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler to save JSON into MongoDB Atlas
  const handleSaveToMongoDB = async () => {
    setEditorError('');
    if (!jsonInput.trim()) {
      setEditorError('JSON input cannot be empty.');
      return;
    }

    let parsed: ParsedData;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (e) {
      setEditorError('Invalid JSON syntax. Please check formatting.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveMarketDataToDB(parsed, adminToken, customTitle || undefined);
      addToast('success', 'Published to MongoDB Atlas', 'Real-time market parameters successfully updated in database!');
      setCurrentDataset(parsed);
      setDatasetMetadata(res.metadata);
      setActiveTab('current');
    } catch (err: any) {
      setEditorError(err.message || 'Failed to save dataset to MongoDB Atlas.');
      addToast('error', 'Save Failed', err.message || 'Could not update database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl p-6 sm:p-8 rounded-2xl glass-card border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.2)] space-y-6 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Admin Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bebas text-2xl tracking-widest text-white">ADMIN CONTROL PANEL</h2>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-400">
                    ID: {adminId}
                  </span>
                </div>
                <p className="text-xs text-white/60 font-geist">Global Price Database Management & Real-Time Market Feed</p>
              </div>
            </div>

            {/* MongoDB Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Database className="w-4 h-4 animate-pulse" />
              <span>MongoDB Atlas Connected</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 gap-4">
            <button
              onClick={() => setActiveTab('current')}
              className={`pb-3 font-bebas text-lg tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'current'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> ACTIVE DATABASE DATASET
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`pb-3 font-bebas text-lg tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'editor'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" /> UPDATE / PUBLISH NEW DATASET
            </button>
          </div>

          {/* TAB 1: CURRENT ACTIVE DATASET */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              {isLoadingDB ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <p className="text-sm font-geist text-white/60">Fetching active dataset from MongoDB Atlas...</p>
                </div>
              ) : currentDataset ? (
                <div className="space-y-6">
                  {/* Dataset Metadata Box */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {datasetMetadata?.title || 'Active Daily Global Dataset'}
                        </h4>
                        <p className="text-xs text-white/50 font-mono">
                          Last Updated: {datasetMetadata?.updatedAt ? new Date(datasetMetadata.updatedAt).toLocaleString() : 'Recently'} | By: {datasetMetadata?.updatedBy || 'Admin'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={loadLatestData}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-geist text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reload
                    </button>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                      <p className="text-[11px] font-mono text-white/50">BASE COST</p>
                      <p className="text-lg font-bebas text-amber-400 mt-1">${currentDataset.BaseRetailCost}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                      <p className="text-[11px] font-mono text-white/50">TAX RATE</p>
                      <p className="text-lg font-bebas text-amber-400 mt-1">{(currentDataset.CountryTaxRate * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                      <p className="text-[11px] font-mono text-white/50">DUTY RATE</p>
                      <p className="text-lg font-bebas text-amber-400 mt-1">{(currentDataset.CountryDutyRate * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                      <p className="text-[11px] font-mono text-white/50">COUNTRIES</p>
                      <p className="text-lg font-bebas text-amber-400 mt-1">
                        {currentDataset.TargetCountries ? Object.keys(currentDataset.TargetCountries).length : 195}
                      </p>
                    </div>
                  </div>

                  {/* Raw Data Viewer */}
                  <div>
                    <h4 className="text-xs font-mono text-white/50 mb-2">RAW STORED JSON DATASET (MONGODB ATLAS)</h4>
                    <textarea
                      readOnly
                      value={JSON.stringify(currentDataset, null, 2)}
                      className="w-full h-56 p-4 rounded-xl bg-black border border-white/10 text-xs font-mono text-amber-400/90 resize-none outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <Globe className="w-12 h-12 text-amber-400/40 mx-auto" />
                  <p className="text-sm font-geist text-white/70">No active dataset stored in MongoDB Atlas yet.</p>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bebas tracking-widest hover:bg-amber-500/30 cursor-pointer"
                  >
                    CREATE FIRST DATASET NOW
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPDATE / PUBLISH NEW DATASET */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* SECTION 1: MASTER GEMINI PROMPT */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bebas text-lg tracking-widest text-white">MASTER 195-COUNTRY GEMINI PROMPT</h3>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400/80">
                    Includes 195 Country Codes
                  </span>
                </div>

                <p className="text-xs font-geist text-white/70 leading-relaxed">
                  Copy this master prompt to query Gemini AI directly for real-time market parameters ($θ$, tax, duty, logistics, margins, PPP) across all 195 countries, then paste the resulting JSON output below.
                </p>

                {/* Readonly Master Prompt Box */}
                <textarea
                  readOnly
                  value={getMasterAdminPrompt()}
                  className="w-full h-44 p-4 rounded-xl bg-black border border-white/10 text-xs font-mono text-white/80 resize-none outline-none focus:border-amber-500/50 select-text cursor-text"
                />

                {/* Prompt Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleCopyMasterPrompt}
                    className="w-full sm:w-1/3 h-12 rounded-xl font-bebas text-base tracking-[0.15em] bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/30 text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> COPIED TO CLIPBOARD!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-amber-400" /> COPY MASTER PROMPT
                      </>
                    )}
                  </button>

                  <a
                    href="https://gemini.google.com/app?hl=en-IN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-1/3 h-12 rounded-xl font-bebas text-base tracking-[0.15em] bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-white/10 text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4 text-amber-400" /> OPEN GEMINI AI WEB
                  </a>

                  <button
                    onClick={handleGenerateFreshData}
                    disabled={isGenerating}
                    className="w-full sm:w-1/3 h-12 rounded-xl font-bebas text-base tracking-[0.15em] liquid-glass bg-amber-500/15 border border-amber-500/30 hover:border-amber-400 text-white flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 text-amber-400 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'GENERATING VIA AI...' : 'RUN VIA BACKEND API'}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {editorError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-xs text-red-200">{editorError}</p>
                </div>
              )}

              {/* SECTION 2: PASTE OR EDIT MARKET JSON */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-white/50 mb-1">DATASET TITLE / NOTE (OPTIONAL)</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g., Daily Global Market Feed - Sept 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-sm font-geist text-white outline-none focus:border-amber-500/50 select-text cursor-text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/50 mb-1">JSON MARKET DATASET (PASTE GEMINI AI OUTPUT HERE)</label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="{\n  &quot;BaseRetailCost&quot;: 1000,\n  ...\n}"
                    className="w-full h-64 p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-amber-400 focus:border-amber-500/50 outline-none transition-colors select-text cursor-text"
                  />
                </div>
              </div>

              {/* SECTION 3: PUBLISH TO MONGODB ATLAS */}
              <button
                onClick={handleSaveToMongoDB}
                disabled={isSaving}
                className="w-full h-14 rounded-xl font-bebas text-lg tracking-[0.15em] liquid-glass bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-white flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                    SAVING TO MONGODB ATLAS...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 text-amber-400" />
                    SAVE & PUBLISH TO MONGODB ATLAS
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
