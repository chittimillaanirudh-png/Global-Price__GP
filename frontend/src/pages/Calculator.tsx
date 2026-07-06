// src/pages/Calculator.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { 
  Calculator, Info, Download, ArrowUpRight, ArrowDownRight, 
  Check, Search, HelpCircle, AlertTriangle, ListFilter, ArrowUpDown, RefreshCw 
} from "lucide-react";

import { CountryData, ProductCategory, ExchangeRates, GPResult, CountryPrediction, ToastMessage, ParsedData } from "../types";
import { CATEGORIES } from "../data/categories";
import { COUNTRIES } from "../data/countries";
import { CountrySearch } from "../components/CountrySearch";
import { ProcessingAnimation } from "../components/ProcessingAnimation";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { CustomSelect } from "../components/CustomSelect";
import { calculateGPFromParsedData, parseChatGPTResponse, validateParsedData, predictCountryPriceRange } from "../engine/calculateGP";
import { fetchExchangeRates } from "../engine/fetchRates";
import { fetchWorldBankPPP, fetchWorldBankCPI, fetchWorldBankGDP, fetchCommodityPrices, CommodityPrices } from "../engine/fetchWorldBank";
import { GPCharts } from "../components/GPCharts";

interface CalculatorProps {
  addToast: (type: 'success' | 'error' | 'warning', title: string, msg: string) => void;
  setApiOffline: (offline: boolean) => void;
}

type SortOption = "price-low-high" | "price-high-low" | "alphabetical";

export const CalculatorPage: React.FC<CalculatorProps> = ({ addToast, setApiOffline }) => {
  // --- Form Input States ---
  const [productName, setProductName] = useState("");
  const [variant, setVariant] = useState("");
  const [category, setCategory] = useState<ProductCategory>(CATEGORIES[0]);
  const [homeCountry, setHomeCountry] = useState<CountryData>();
  const [localPrice, setLocalPrice] = useState("");
  const [priorityCountry, setPriorityCountry] = useState<CountryData>();

  // --- Engine Data States ---
  const [rates, setRates] = useState<ExchangeRates>({});
  const [pppData, setPppData] = useState<{ [code: string]: number }>({});
  const [cpiData, setCpiData] = useState<{ [code: string]: number }>({});
  const [gdpData, setGdpData] = useState<{ [code: string]: number }>({});
  const [commodityPrices, setCommodityPrices] = useState<CommodityPrices>();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- GPT Flow States ---
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [chatGptResponse, setChatGptResponse] = useState("");
  const [gptError, setGptError] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  // --- UI Lifecycle States ---
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState<GPResult>();
  const [predictions, setPredictions] = useState<CountryPrediction[]>([]);

  // --- Table Controls ---
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price-low-high");
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);

  // --- Load all parameters & metrics ---
  useEffect(() => {
    const loadEconomicMetrics = async () => {
      setIsLoadingData(true);
      try {
        const [ratesRes, pppRes, cpiRes, gdpRes, commoditiesRes] = await Promise.all([
          fetchExchangeRates(),
          fetchWorldBankPPP(),
          fetchWorldBankCPI(),
          fetchWorldBankGDP(),
          fetchCommodityPrices()
        ]);

        setRates(ratesRes.rates);
        setPppData(pppRes.data);
        setCpiData(cpiRes.data);
        setGdpData(gdpRes.data);
        setCommodityPrices(commoditiesRes.data);

        const isOffline = ratesRes.expired || pppRes.expired || cpiRes.expired || gdpRes.expired || commoditiesRes.expired;
        setApiOffline(isOffline);

        setDataLoaded(true);
        
        // Auto-select USA or India as initial country
        const defaultHome = COUNTRIES.find(c => c.code === "US") || COUNTRIES[0];
        setHomeCountry(defaultHome);
      } catch (err) {
        console.error("Metric bootstrap failed", err);
        addToast("error", "Bootstrap Failure", "Could not assemble global parameters. Running fully offline with fallbacks.");
        setApiOffline(true);
        setDataLoaded(true);
        
        // Prepare fallbacks
        const fallbackRates: ExchangeRates = {};
        const fallbackPpp: { [code: string]: number } = {};
        const fallbackCpi: { [code: string]: number } = {};
        const fallbackGdp: { [code: string]: number } = {};
        
        for (const country of COUNTRIES) {
          fallbackRates[country.currency] = country.ppp_fallback;
          fallbackPpp[country.code] = country.ppp_fallback;
          fallbackCpi[country.code] = 100;
          fallbackGdp[country.code] = country.gdp_ppp_billion;
        }
        
        setRates(fallbackRates);
        setPppData(fallbackPpp);
        setCpiData(fallbackCpi);
        setGdpData(fallbackGdp);
        
        const defaultHome = COUNTRIES.find(c => c.code === "US") || COUNTRIES[0];
        setHomeCountry(defaultHome);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadEconomicMetrics();
  }, [addToast, setApiOffline]);

  // Handle Step 1
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !variant || !homeCountry || !localPrice) {
      addToast("error", "Input Error", "Please provide all required fields (Product, Variant, Country, Price).");
      return;
    }

    const priceNum = parseFloat(localPrice.replace(/,/g, ""));
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast("error", "Invalid Price", "Please enter a valid numeric local price.");
      return;
    }
    setStep(2);
  };

  // Generate ChatGPT prompt
  const generatePrompt = () => {
    return `Please act as a global trade economist. I am analyzing the product "${productName} ${variant}" in ${homeCountry?.name} (Category: ${category.name}). The local retail price is ${localPrice} ${homeCountry?.currency}.
Please provide the following data for ${homeCountry?.name} AND for as many target countries as you have reliable data for, in a strict JSON format EXACTLY like this (do not include markdown formatting or extra text, just the raw JSON):
{
  "BaseRetailCost": <the base retail cost in ${homeCountry?.currency} before any taxes or duties in ${homeCountry?.name}>,
  "CountryTaxRate": <average sales tax/VAT in decimal for ${homeCountry?.name}>,
  "CountryDutyRate": <average import duty for this category in decimal for ${homeCountry?.name}>,
  "LogisticsPremium": <logistics index score modifier for ${homeCountry?.name}>,
  "RetailMargin": <typical retail margin for this category in decimal for ${homeCountry?.name}>,
  "GlobalPurchasingPower": <PPP conversion factor to USD for ${homeCountry?.name}>,
  "ExchangeRate": <Current exchange rate to USD for ${homeCountry?.name}>,
  "CPICurrent": <Current Consumer Price Index for ${homeCountry?.name}>,
  "CPIBase": <Base Consumer Price Index (e.g. 2010=100) for ${homeCountry?.name}>,
  "KnownMarketPrice": <Your known real market price for the product in ${homeCountry?.name}, or null if unknown>,
  "TargetCountries": {
    "<Country Code (e.g., US, GB, IN)>": {
      "CountryTaxRate": <tax/VAT in decimal>,
      "CountryDutyRate": <import duty in decimal>,
      "LogisticsPremium": <logistics modifier>,
      "RetailMargin": <retail margin>,
      "ExchangeRate": <Exchange rate to USD>,
      "CPICurrent": <Current CPI>,
      "CPIBase": <Base CPI>,
      "KnownMarketPrice": <Your known real market price for the product in this target country, or null if unknown>
    }
  }
}`;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    addToast("success", "Copied!", "Prompt copied to clipboard. Open ChatGPT to paste it.");
  };

  const handleChatGPTParse = () => {
    if (!chatGptResponse.trim()) {
      setGptError("Please paste the ChatGPT response.");
      return;
    }
    const parsed = parseChatGPTResponse(chatGptResponse);
    if (!parsed) {
      setGptError("Could not find valid JSON in the response. Please ensure ChatGPT outputted the JSON block.");
      return;
    }
    const { isValid, missingKeys } = validateParsedData(parsed);
    if (!isValid) {
      setGptError(`Missing required keys: ${missingKeys.join(", ")}`);
      return;
    }
    
    setGptError("");
    setParsedData(parsed);
    setIsCalculating(true);
    setStep(4);
  };

  const handleSolverCompletion = () => {
    setIsCalculating(false);
    
    const priceNum = parseFloat(localPrice.replace(/,/g, ""));
    if (!homeCountry || !parsedData) return;

    // Run Forward Engine
    const gpResult = calculateGPFromParsedData(parsedData, homeCountry, category);
    setCalculationResult(gpResult);

    // Run Reverse Predictions for all 195 countries
    const homeRates = rates[homeCountry.currency] ?? homeCountry.ppp_fallback;
    const userPriceUSD = priceNum / homeRates;

    // Determine Top 20 countries by GDP to mark as "Verified Data" (since they have the most reliable macro data)
    const sortedByGDP = [...COUNTRIES].sort((a, b) => b.gdp_ppp_billion - a.gdp_ppp_billion);
    const top20Codes = new Set(sortedByGDP.slice(0, 20).map(c => c.code));

    const list: CountryPrediction[] = COUNTRIES.map((c) => {
      const pred = predictCountryPriceRange(gpResult.GP, c, category, parsedData);
      const targetRates = rates[c.currency] ?? c.ppp_fallback;
      const predictedUSD = pred.midpoint / targetRates;
      
      const vs_user_percent = userPriceUSD > 0 
        ? ((predictedUSD - userPriceUSD) / userPriceUSD) * 100 
        : 0;

      // Ensure min is always lower than max
      const min = Math.min(pred.min, pred.max);
      const max = Math.max(pred.min, pred.max);

      return {
        country: c,
        predicted_price: pred.midpoint,
        predicted_price_min: min,
        predicted_price_max: max,
        theta: pred.theta,
        vs_user_percent,
        is_cheaper: predictedUSD < userPriceUSD,
        is_priority: priorityCountry?.code === c.code,
        is_verified: top20Codes.has(c.code) || c.code === homeCountry.code
      };
    });

    setPredictions(list);
    setShowResults(true);
    addToast("success", "Calculation Complete", `Analyzed value and predicted pricing across ${list.length} countries successfully.`);
  };

  // Filter & Sort Predictions
  const getFilteredPredictions = () => {
    const q = searchQuery.toLowerCase();
    
    // Split into priority item and normal items
    const matching = predictions.filter(p => p.country.name.toLowerCase().includes(q));
    
    let sorted = [...matching];

    if (sortBy === "price-low-high") {
      sorted.sort((a, b) => {
        const aUSD = a.predicted_price / (rates[a.country.currency] ?? a.country.ppp_fallback);
        const bUSD = b.predicted_price / (rates[b.country.currency] ?? b.country.ppp_fallback);
        return aUSD - bUSD;
      });
    } else if (sortBy === "price-high-low") {
      sorted.sort((a, b) => {
        const aUSD = a.predicted_price / (rates[a.country.currency] ?? a.country.ppp_fallback);
        const bUSD = b.predicted_price / (rates[b.country.currency] ?? b.country.ppp_fallback);
        return bUSD - aUSD;
      });
    } else if (sortBy === "alphabetical") {
      sorted.sort((a, b) => a.country.name.localeCompare(b.country.name));
    }

    // If priority country exists and matches query, make sure it is isolated out of normal sorting
    // so it always stays at the absolute top of the UI
    if (priorityCountry) {
      const priorityItem = sorted.find(p => p.country.code === priorityCountry.code);
      if (priorityItem) {
        const listWithoutPriority = sorted.filter(p => p.country.code !== priorityCountry.code);
        return { priorityItem, normalList: listWithoutPriority };
      }
    }

    return { priorityItem: null, normalList: sorted };
  };

  const { priorityItem, normalList } = getFilteredPredictions();

  // Export predictions as CSV
  const exportToCSV = () => {
    if (!calculationResult) return;
    try {
      const headers = ["Country", "Currency", "Symbol", "Predicted Price", "Theta Factor", "% vs Home Country", "GP Value Used"];
      const rows = predictions.map(p => [
        p.country.name,
        p.country.currency,
        p.country.symbol,
        p.predicted_price.toFixed(2),
        p.theta.toFixed(3),
        p.vs_user_percent.toFixed(2),
        calculationResult.GP.toFixed(3)
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      const cleanProdName = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const dateStr = new Date().toISOString().split('T')[0];
      
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `GP_${cleanProdName}_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast("success", "Export Successful", "Data sheets ready for download.");
    } catch (e) {
      addToast("error", "Export Failed", "Could not assemble CSV output streams.");
    }
  };

  // Export ONLY the Global Price Card as an elegant ATM/Bank Card PDF
  const exportCardToPDF = async () => {
    if (!calculationResult || !homeCountry) return;

    try {
      const cardElement = document.getElementById("gp-standard-card-export") || document.getElementById("gp-standard-card");
      if (!cardElement) {
        addToast("error", "Download Failed", "Could not find the card element in the document.");
        return;
      }

      // Render the card cleanly using html-to-image with skipFonts and forced layout dimensions
      const imgData = await toPng(cardElement, {
        width: 450,
        height: 285,
        pixelRatio: 2.0, // High density and lightweight
        backgroundColor: "#0d0a05",
        skipFonts: true, // Prevents external font loading CORS errors from blocking the canvas rendering in sandboxed iframes
        style: {
          width: "450px",
          height: "285px",
          transform: "scale(1)",
          borderRadius: "24px",
        }
      });

      // Standard ATM card size in mm
      const imgWidth = 158;
      const imgHeight = 100; // 158 / 1.58 = 100

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [imgWidth, imgHeight],
      });

      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');

      const fileProdName = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`GP_Card_${fileProdName || "standard_basket"}.pdf`);
      
      addToast("success", "Card Downloaded", "The Global Price Card PDF has been saved successfully.");
    } catch (e) {
      console.error(e);
      addToast("error", "Download Failed", "Could not render exact card structure to PDF.");
    }
  };

  // Export predictions as PDF (with Global Card embedded on top and dark theme)
  const exportToPDF = async () => {
    if (!calculationResult || !homeCountry) return;
    addToast("warning", "Preparing Export", "Rendering your report PDF with the Global Card...");

    try {
      const cardElement = document.getElementById("gp-standard-card-export") || document.getElementById("gp-standard-card");
      if (!cardElement) {
        addToast("error", "Export Failed", "Could not locate the Global Card component.");
        return;
      }

      // Capture the gorgeous Global Card image
      const cardImgData = await toPng(cardElement, {
        width: 450,
        height: 285,
        pixelRatio: 2.0, // Crisp resolution
        backgroundColor: "#0d0a05",
        skipFonts: true, // Prevents external font loading CORS errors from blocking the canvas rendering in sandboxed iframes
        style: {
          width: "450px",
          height: "285px",
          transform: "scale(1)",
          borderRadius: "24px",
        }
      });

      // 2. Initialize jsPDF in standard A4 portrait mode (210mm x 297mm)
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // 3. Define branding colors
      const amberColor = { r: 245, g: 158, b: 11 }; // #f59e0b

      // 4. Fill Page 1 Background with Deep Charcoal Black
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, 210, 297, "F");

      // 5. Draw GP Standard Card centered near the top of Page 1
      const cardWidth = 110;
      const cardHeight = cardWidth / 1.58; // Exactly matches 1.58 credit card aspect ratio
      const cardX = (210 - cardWidth) / 2;
      doc.addImage(cardImgData, "PNG", cardX, 15, cardWidth, cardHeight, undefined, 'FAST');

      // 6. Draw Report Headers underneath the card on Page 1
      let y = 102;
      
      doc.setTextColor(amberColor.r, amberColor.g, amberColor.b);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("GLOBAL VALUE METRIC REPORT", 14, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(`Calibrated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}  |  Universal Price Index (GP Standard)`, 14, y);
      y += 12;

      // 7. Render Core Product Metadata Box
      doc.setFillColor(20, 20, 20);
      doc.setDrawColor(35, 35, 35);
      doc.rect(14, y, 182, 22, "FD");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(160, 160, 160);
      doc.text("Product Name:", 18, y + 8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(productName.toUpperCase(), 44, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 160, 160);
      doc.text("Product Category:", 110, y + 8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(category.name.toUpperCase(), 144, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 160, 160);
      doc.text("Base Country:", 18, y + 15);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(homeCountry.name, 44, y + 15);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 160, 160);
      doc.text("Base Retail Cost:", 110, y + 15);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(amberColor.r, amberColor.g, amberColor.b);
      doc.text(`${homeCountry.symbol}${parseFloat(localPrice).toLocaleString()} (${homeCountry.currency})`, 144, y + 15);
      
      y += 34;

      // 8. Render Table Section Header
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("WORLDWIDE VALUATION COMPARISONS", 14, y);
      y += 6;

      // Draw Table Header
      doc.setFillColor(25, 25, 25);
      doc.rect(14, y, 182, 8, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(180, 180, 180);
      doc.text("Country", 18, y + 5.5);
      doc.text("Currency", 75, y + 5.5);
      doc.text("Predicted Price", 105, y + 5.5);
      doc.text("vs Base Country Price", 145, y + 5.5);
      y += 8;

      // Helper to add dark page background & headers for multi-page lists
      const startNewDarkPage = () => {
        doc.addPage();
        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, 210, 297, "F");
        
        let py = 15;
        doc.setFillColor(25, 25, 25);
        doc.rect(14, py, 182, 8, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(180, 180, 180);
        doc.text("Country", 18, py + 5.5);
        doc.text("Currency", 75, py + 5.5);
        doc.text("Predicted Price", 105, py + 5.5);
        doc.text("vs Base Country Price", 145, py + 5.5);
        return py + 8;
      };

      // 9. Render Rows
      predictions.forEach((pred, index) => {
        // Handle pagination
        if (y > 275) {
          y = startNewDarkPage();
        }

        // Zebra stripes in dark theme
        if (index % 2 === 1) {
          doc.setFillColor(16, 16, 16);
          doc.rect(14, y, 182, 8, "F");
        }

        const isHome = pred.country.code === homeCountry.code;
        const isPriority = pred.country.code === priorityCountry?.code;

        if (isHome) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(74, 222, 128); // Green highlight for home country in dark theme
        } else if (isPriority) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(251, 146, 60); // Orange highlight for priority country
        } else {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(220, 220, 220); // Off-white for general lists
        }

        const vsText = isHome 
          ? "BASE PRICE" 
          : pred.vs_user_percent === 0 
            ? "Baseline" 
            : `${pred.vs_user_percent > 0 ? "+" : ""}${pred.vs_user_percent.toFixed(1)}% ${pred.is_cheaper ? "cheaper" : "costlier"}`;

        const countryLabel = `${pred.country.name} (${pred.country.code})${isHome ? " [HOME]" : ""}${isPriority ? " [PRIORITY]" : ""}`;

        doc.setFontSize(8.5);
        doc.text(countryLabel.substring(0, 36), 18, y + 5.5);
        
        doc.setFont("courier", "normal"); // Monospace look for currency in dark report
        doc.setFontSize(8.5);
        doc.text(pred.country.currency, 75, y + 5.5);
        
        doc.setFont("helvetica", isHome || isPriority ? "bold" : "normal");
        doc.text(`${pred.country.symbol}${pred.predicted_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 105, y + 5.5);
        
        doc.setFont("helvetica", "normal");
        doc.text(vsText, 145, y + 5.5);

        y += 8;
      });

      // Save document
      const cleanProdName = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`GP_Worldwide_Report_${cleanProdName}.pdf`);
      addToast("success", "PDF Export Complete", "Your dark-themed worldwide report with card header has been downloaded.");
    } catch (err) {
      console.error(err);
      addToast("error", "PDF Export Failed", "Could not compile PDF format streams.");
    }
  };

  const isFormValid = productName.trim().length > 0 && homeCountry !== undefined && localPrice.trim().length > 0;

  return (
    <div className="relative z-10 w-full min-h-screen pt-24 px-6 sm:px-10 pb-20">
      
      {/* Page Header - Only render when inputting */}
      {!showResults && (
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <h1 className="font-bebas text-5xl sm:text-6xl tracking-widest text-white">GP CALCULATOR</h1>
          <p className="font-geist text-sm sm:text-base font-light text-white/60 max-w-2xl mx-auto leading-relaxed">
            Enter any product and its local market price. We calculate its universal GP value standard and predict realistic, local prices in all other 195 countries on Earth.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* State 1: Bootstrapping parameters */}
        {isLoadingData && (
          <motion.div
            key="bootstrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-4 py-20"
          >
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="font-bebas tracking-widest text-sm text-amber-400">LOADING ECONOMIC MATRIX</span>
          </motion.div>
        )}

        {/* State 2: Active calculation solver */}
        {isCalculating && (
          <motion.div
            key="solving"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="py-12"
          >
            <ProcessingAnimation onComplete={handleSolverCompletion} />
          </motion.div>
        )}

        {/* Step 1: Normal Formulation Panel */}
        {step === 1 && !isCalculating && !isLoadingData && dataLoaded && !showResults && (
          <motion.div
            key="formPanel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleStep1Submit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                <Calculator className="text-amber-400 w-5 h-5" />
                <h2 className="font-bebas text-lg tracking-widest text-white">INPUT PRODUCT VALUATION</h2>
              </div>

              {/* Input 1: Product Name */}
              <div className="flex flex-col gap-2">
                <label className="font-geist text-xs text-white/50 tracking-[0.2em] uppercase font-medium">PRODUCT NAME</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. iPhone 16 Pro, Nike Air Max, Petrol..."
                  className="px-4 h-12 rounded-xl bg-white/3 border border-white/8 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] outline-none text-sm text-white/90 font-geist transition-all"
                />
              </div>

              {/* Input 2: Variant */}
              <div className="flex flex-col gap-2">
                <label className="font-geist text-xs text-white/50 tracking-[0.2em] uppercase font-medium">VARIANT / MODEL</label>
                <input
                  type="text"
                  required
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder="e.g. 256GB, Base model, 1L..."
                  className="px-4 h-12 rounded-xl bg-white/3 border border-white/8 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] outline-none text-sm text-white/90 font-geist transition-all"
                />
              </div>

              {/* Input 3: Product Category */}
              <div className="flex flex-col gap-2">
                <CustomSelect
                  label="PRODUCT CATEGORY"
                  options={CATEGORIES}
                  value={category.id}
                  onChange={(val) => {
                    const found = CATEGORIES.find(c => c.id === val);
                    if (found) setCategory(found);
                  }}
                  placeholder="Select Category"
                />
                <span className="text-[10px] text-white/40 italic">
                  Defines specific tax thresholds, retail margins, and custom duties.
                </span>
              </div>

              {/* Grid for Country + Local Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Input 4: Home Country */}
                <CountrySearch
                  label="YOUR COUNTRY"
                  selected={homeCountry}
                  onSelect={setHomeCountry}
                  placeholder="Select home country..."
                />

                {/* Input 5: Local Price */}
                <div className="flex flex-col gap-2">
                  <label className="font-geist text-xs text-white/50 tracking-[0.2em] uppercase font-medium">
                    LOCAL PRICE {homeCountry && `(${homeCountry.currency})`}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-white/40 font-geist text-sm">{homeCountry?.symbol || "$"}</span>
                    <input
                      type="text"
                      required
                      value={localPrice}
                      onChange={(e) => {
                        // Allow only numbers and commas
                        const clean = e.target.value.replace(/[^0-9.]/g, "");
                        setLocalPrice(clean);
                      }}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 h-12 rounded-xl bg-white/3 border border-white/8 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] outline-none text-sm text-white/90 font-geist transition-all"
                    />
                  </div>
                </div>

              </div>

              {/* Optional Priority Country */}
              <CountrySearch
                label="SHOW THIS COUNTRY FIRST (OPTIONAL)"
                selected={priorityCountry}
                onSelect={setPriorityCountry}
                placeholder="Select priority target country..."
              />

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!productName.trim() || !variant.trim() || !homeCountry || !localPrice.trim()}
                  className={`w-full h-14 rounded-xl font-bebas text-lg tracking-[0.15em] flex items-center justify-center gap-2 transition-all ${
                    (productName.trim() && variant.trim() && homeCountry && localPrice.trim()) 
                      ? "liquid-glass bg-amber-500/15 border border-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] text-white cursor-pointer"
                      : "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                  }`}
                >
                  CONTINUE TO VERIFICATION
                </button>
              </div>

            </form>
          </motion.div>
        )}

        {/* Step 2: ChatGPT Prompt Generation */}
        {step === 2 && !isCalculating && !showResults && (
          <motion.div
            key="promptPanel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="text-amber-400 w-5 h-5" />
                  <h2 className="font-bebas text-lg tracking-widest text-white">STEP 2: GET VERIFIED DATA</h2>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="text-white/40 hover:text-white text-xs font-geist transition-colors cursor-pointer"
                >
                  Back
                </button>
              </div>

              <p className="text-sm font-light text-white/70 leading-relaxed">
                To calculate a highly accurate Global Price, we need to strip away local friction factors. 
                Please copy the prompt below, paste it into ChatGPT, and bring back the resulting JSON block.
              </p>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-500/0 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <textarea
                  readOnly
                  value={generatePrompt()}
                  className="relative w-full h-48 p-4 rounded-xl bg-black border border-white/10 text-xs font-mono text-white/80 resize-none outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={copyPrompt}
                  className="w-full sm:w-1/2 h-14 rounded-xl font-bebas text-lg tracking-[0.15em] bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> COPY PROMPT
                </button>
                <a
                  href="https://chatgpt.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-1/2 h-14 rounded-xl font-bebas text-lg tracking-[0.15em] liquid-glass bg-amber-500/15 border border-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] text-white cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowUpRight className="w-5 h-5 text-amber-400" /> OPEN CHATGPT
                </a>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-center">
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-geist tracking-wide uppercase cursor-pointer"
                >
                  I have the data, proceed to paste →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Paste ChatGPT JSON Response */}
        {step === 3 && !isCalculating && !showResults && (
          <motion.div
            key="pastePanel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="text-amber-400 w-5 h-5" />
                  <h2 className="font-bebas text-lg tracking-widest text-white">STEP 3: ANALYZE DATA</h2>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="text-white/40 hover:text-white text-xs font-geist transition-colors cursor-pointer"
                >
                  Back
                </button>
              </div>

              <p className="text-sm font-light text-white/70 leading-relaxed">
                Paste the JSON data outputted by ChatGPT into the box below.
              </p>

              {gptError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-400 text-sm">Validation Error</h4>
                    <p className="text-xs text-red-200/70 mt-1">{gptError}</p>
                    <p className="text-xs text-red-200/50 mt-2 font-mono italic">
                      If ChatGPT missed fields, tell it: "You missed some fields. Please provide the exact JSON structure requested."
                    </p>
                  </div>
                </div>
              )}

              <textarea
                value={chatGptResponse}
                onChange={(e) => setChatGptResponse(e.target.value)}
                placeholder="{\n  &quot;BaseRetailCost&quot;: 1000,\n  ...\n}"
                className="w-full h-64 p-4 rounded-xl bg-black/50 border border-white/10 text-sm font-mono text-amber-500/90 focus:border-amber-500/50 outline-none resize-y transition-colors"
              />

              <div className="pt-4">
                <button
                  onClick={handleChatGPTParse}
                  className="w-full h-14 rounded-xl font-bebas text-lg tracking-[0.15em] liquid-glass bg-amber-500/15 border border-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] text-white cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <Search className="w-5 h-5 text-amber-400" /> VALIDATE & CALCULATE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESULTS LAYOUT ── */}
      {showResults && calculationResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mt-8 space-y-12"
        >
          {/* Back/Recalculate Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-6 gap-4">
            <button
              onClick={() => {
                setShowResults(false);
              }}
              className="flex items-center gap-2.5 px-4 h-11 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/10 text-white/85 hover:text-white transition-all cursor-pointer font-sans text-xs tracking-wider uppercase font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              Go Back to Recalculation
            </button>
            <div className="flex flex-col text-left sm:text-right">
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase">VALUATION ENGINE PIPELINE</span>
              <h2 className="font-bebas text-2xl text-white tracking-widest uppercase mt-0.5">{productName || "Product Valuation"}</h2>
            </div>
          </div>
          {/* GP Display Card Container with Outside Download Button */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md px-2 sm:px-0">
              
              {/* Outside Download Symbol on the right side (aligned with bottom of card) */}
              <button
                onClick={exportCardToPDF}
                className="absolute right-4 -bottom-12 sm:bottom-4 sm:-right-14 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/10 text-white transition-all cursor-pointer shadow-lg focus:outline-none z-20"
                title="Download Global Price Card as PDF"
              >
                <Download className="w-4 h-4 stroke-[2] text-amber-400" />
              </button>
              {/* Hidden Card specifically for PDF Export to avoid responsive shifting */}
              <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
                <div 
                  id="gp-standard-card-export" 
                  className="gp-result-card p-6 text-left overflow-hidden relative border border-amber-500/25 shadow-[0_20px_50px_rgba(245,158,11,0.12)] rounded-3xl bg-gradient-to-br from-[#1a1308] to-[#030303] flex flex-col justify-between"
                  style={{ width: '450px', height: '285px' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent opacity-60 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col">
                      <span className="font-bebas text-lg tracking-[0.25em] text-white">GLOBAL PRICE CARD</span>
                      <span className="text-[7px] text-amber-500/70 uppercase tracking-widest font-mono">Universal Standard Metric</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 px-2 rounded text-amber-400 font-bebas text-[10px] tracking-wider shrink-0">
                      GP STANDARD
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 relative z-10">
                    <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/50 relative overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-amber-900/40" />
                      <div className="absolute inset-y-0 left-1/2 w-px bg-amber-900/40" />
                      <div className="absolute inset-y-0 left-1/4 w-px bg-amber-900/20" />
                      <div className="absolute inset-y-0 right-1/4 w-px bg-amber-900/20" />
                      <div className="absolute top-1/4 inset-x-0 h-px bg-amber-900/20" />
                      <div className="absolute bottom-1/4 inset-x-0 h-px bg-amber-900/20" />
                      <div className="absolute top-1/2 left-1/2 w-3.5 h-2.5 bg-amber-400/80 -translate-x-1/2 -translate-y-1/2 rounded border border-amber-600/30" />
                    </div>
                    <svg className="w-4 h-4 text-amber-500/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v-1.5a2.25 2.25 0 0 1 2.25-2.25Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v-1.5a2.25 2.25 0 0 1 2.25-2.25Z" />
                    </svg>
                  </div>

                  <div className="my-3 relative z-10">
                    <span className="text-white/35 font-mono text-[7px] uppercase tracking-wider block mb-0.5">SERIAL</span>
                    <div className="font-mono text-3xl font-semibold text-white tracking-[0.18em] flex items-center gap-1 drop-shadow-[0_0_12px_rgba(245,158,11,0.55)]">
                      <span>GP</span>
                      <span className="text-amber-500">-</span>
                      <span>{calculationResult.GP.toFixed(3)}</span>
                      <span className="text-white/20 text-xs ml-1 tracking-normal font-sans">UNITS</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-2 border-t border-white/5 relative z-10 mt-0">
                    <div className="flex flex-col max-w-full min-w-0">
                      <span className="text-[7px] text-white/30 uppercase tracking-widest font-mono">PRODUCT</span>
                      <span className="font-bebas text-sm text-amber-200 tracking-wider truncate uppercase mt-0.5" title={productName}>
                        {productName || "STANDARD BASKET"}
                      </span>
                      <div className="flex flex-wrap gap-2 text-[7px] font-mono text-white/45 mt-1">
                        <span>CONF: <span className="text-green-400 font-bold">{calculationResult.confidence.toUpperCase()}</span></span>
                        <span>THETA: <span className="text-amber-400 font-bold">{calculationResult.theta.toFixed(3)}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* GP Display Card (Styled as a gorgeous High-End ATM / Bank Card) */}
              <div 
                id="gp-standard-card" 
                className="gp-result-card p-5 sm:p-6 text-left overflow-hidden relative border border-amber-500/25 shadow-[0_20px_50px_rgba(245,158,11,0.12)] rounded-3xl bg-gradient-to-br from-[#1a1308] to-[#030303] w-full aspect-auto min-h-[240px] sm:aspect-[1.58/1] sm:min-h-0 flex flex-col justify-between"
              >
                {/* Subtle gloss/holo stripe overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent opacity-60 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Top Row: Card Issuer & Logo */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col">
                    <span className="font-bebas text-sm sm:text-lg tracking-[0.2em] sm:tracking-[0.25em] text-white">GLOBAL PRICE CARD</span>
                    <span className="text-[6px] sm:text-[7px] text-amber-500/70 uppercase tracking-widest font-mono">Universal Standard Metric</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 sm:px-2 rounded text-amber-400 font-bebas text-[8px] sm:text-[10px] tracking-wider shrink-0">
                    GP STANDARD
                  </div>
                </div>

                {/* Middle Row: Gold Chip & Hologram Wifi indicator */}
                <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 relative z-10">
                  {/* Gold Chip */}
                  <div className="w-8 h-6 sm:w-10 sm:h-8 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/50 relative overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
                    {/* Chip Micro-circuit lines */}
                    <div className="absolute inset-x-0 top-1/2 h-px bg-amber-900/40" />
                    <div className="absolute inset-y-0 left-1/2 w-px bg-amber-900/40" />
                    <div className="absolute inset-y-0 left-1/4 w-px bg-amber-900/20" />
                    <div className="absolute inset-y-0 right-1/4 w-px bg-amber-900/20" />
                    <div className="absolute top-1/4 inset-x-0 h-px bg-amber-900/20" />
                    <div className="absolute bottom-1/4 inset-x-0 h-px bg-amber-900/20" />
                    <div className="absolute top-1/2 left-1/2 w-3 h-2 sm:w-3.5 sm:h-2.5 bg-amber-400/80 -translate-x-1/2 -translate-y-1/2 rounded border border-amber-600/30" />
                  </div>
                  {/* WiFi contactless icon */}
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v-1.5a2.25 2.25 0 0 1 2.25-2.25Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v-1.5a2.25 2.25 0 0 1 2.25-2.25Z" />
                  </svg>
                </div>

                {/* Central Number: Animated GP Value, formatted like credit card digits */}
                <div className="my-2 sm:my-3 relative z-10">
                  <span className="text-white/35 font-mono text-[6px] sm:text-[7px] uppercase tracking-wider block mb-0.5">SERIAL</span>
                  <div className="font-mono text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-[0.14em] sm:tracking-[0.18em] flex items-center gap-1 drop-shadow-[0_0_12px_rgba(245,158,11,0.55)]">
                    <span>GP</span>
                    <span className="text-amber-500">-</span>
                    <AnimatedCounter from={0.000} to={calculationResult.GP} decimals={3} suffix="" />
                    <span className="text-white/20 text-[9px] sm:text-xs ml-1 tracking-normal font-sans">UNITS</span>
                  </div>
                </div>

                {/* Bottom Row: Cardholder Name, Info */}
                <div className="flex justify-between items-end pt-1.5 sm:pt-2 border-t border-white/5 relative z-10 mt-1 sm:mt-0">
                  <div className="flex flex-col max-w-full min-w-0">
                    <span className="text-[6px] sm:text-[7px] text-white/30 uppercase tracking-widest font-mono">PRODUCT</span>
                    <span className="font-bebas text-xs sm:text-sm text-amber-200 tracking-wider truncate uppercase mt-0.5" title={productName}>
                      {productName || "STANDARD BASKET"}
                    </span>
                    <div className="flex flex-wrap gap-2 text-[6px] sm:text-[7px] font-mono text-white/45 mt-1">
                      <span>CONF: <span className="text-green-400 font-bold">{calculationResult.confidence.toUpperCase()}</span></span>
                      <span>THETA: <span className="text-amber-400 font-bold">{calculationResult.theta.toFixed(3)}</span></span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Why Normal Exchange Rate Fails - Dynamic Metrological Insights */}
          <div className="glass-card rounded-2xl p-5 border border-amber-500/10 bg-amber-500/[0.01] max-w-md mx-auto flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1 text-left text-[11px] text-white/60">
              <h4 className="font-sans font-bold text-white tracking-wider uppercase text-[9px] text-amber-400">Why the normal exchange rate fails</h4>
              <p className="leading-relaxed font-light">
                Standard forex conversions only represent financial capital velocities. They completely ignore local pricing friction: <strong className="text-white">tariffs</strong>, <strong className="text-white">regional VAT/sales taxes</strong>, and <strong className="text-white">Purchasing Power Parity (PPP)</strong>.
              </p>
              <p className="leading-relaxed font-light">
                Converting <strong className="text-white">{homeCountry?.symbol || "$"}{parseFloat(localPrice).toLocaleString()}</strong> directly via standard multipliers fails to predict realistic retail costs. The GP standard resolves this by filtering local markups and adjustment factors (<strong className="text-white">theta θ</strong>).
              </p>
            </div>
          </div>

          {/* Dynamic Interactive Charts */}
          <GPCharts predictions={predictions} rates={rates} homeCountry={homeCountry} />

          {/* Predict Table and Filters Header */}
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bebas text-2xl tracking-widest text-white">WORLDWIDE ESTIMATIONS</h3>
                <p className="font-geist text-xs text-white/50">Predicted costs and margins calibrated for all 195 countries</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                {/* Search country */}
                <div className="relative flex items-center w-full sm:w-60 h-10 bg-white/3 border border-white/8 rounded-lg px-3">
                  <Search className="w-4 h-4 text-white/30 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by country name..."
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Sorting options */}
                <div className="flex items-center gap-1 bg-white/3 border border-white/8 rounded-lg p-1">
                  <button
                    onClick={() => setSortBy("price-low-high")}
                    className={`px-2.5 py-1 text-[11px] font-medium tracking-wide rounded transition-colors cursor-pointer ${
                      sortBy === "price-low-high" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    Price ↑
                  </button>
                  <button
                    onClick={() => setSortBy("price-high-low")}
                    className={`px-2.5 py-1 text-[11px] font-medium tracking-wide rounded transition-colors cursor-pointer ${
                      sortBy === "price-high-low" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    Price ↓
                  </button>
                  <button
                    onClick={() => setSortBy("alphabetical")}
                    className={`px-2.5 py-1 text-[11px] font-medium tracking-wide rounded transition-colors cursor-pointer ${
                      sortBy === "alphabetical" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    A-Z
                  </button>
                </div>

                {/* Details toggle (Mobile only) */}
                <button
                  onClick={() => setShowDetailsMobile(!showDetailsMobile)}
                  className="sm:hidden flex items-center justify-center w-10 h-10 bg-white/3 border border-white/8 rounded-lg text-white/50 hover:text-white cursor-pointer"
                  title="Toggle Columns"
                >
                  <ListFilter className="w-4 h-4" />
                </button>

                {/* PDF export */}
                <button
                  onClick={exportToPDF}
                  className="h-10 px-4 flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 text-white font-bebas text-xs tracking-wider hover:border-white/30 transition-all cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  EXPORT PDF
                </button>
              </div>
            </div>

            {/* predictions table container */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-black/20">
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  
                  {/* Sticky Table Header */}
                  <thead>
                    <tr className="border-b border-white/5 bg-white/2 backdrop-blur-md sticky top-0 z-20 text-[10px] font-geist text-white/40 font-semibold tracking-wider uppercase">
                      <th className="py-4 px-6">Country</th>
                      <th className="py-4 px-4 text-center">Currency</th>
                      <th className="py-4 px-4 text-right">Predicted Range</th>
                      <th className={`py-4 px-4 text-right sm:table-cell ${showDetailsMobile ? 'table-cell' : 'hidden'}`}>vs Home Country</th>
                      <th className={`py-4 px-6 text-right sm:table-cell ${showDetailsMobile ? 'table-cell' : 'hidden'}`}>Adjustment (θ)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* Render Priority Country First (if set and match query) */}
                    {priorityItem && (
                      <tr className="border-b border-amber-500/20 bg-amber-950/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)] text-sm group">
                        <td className="py-4.5 px-6 font-medium text-white flex items-center gap-3">
                          <span className="text-xl shrink-0">{priorityItem.country.flag}</span>
                          <div className="truncate flex flex-col items-start gap-1">
                            <span className="block font-semibold">{priorityItem.country.name}</span>
                            <div className="flex gap-2 items-center">
                              <span className="inline-block text-[9px] bg-amber-500/20 text-amber-300 font-bebas tracking-wider px-1.5 py-0.5 rounded uppercase">
                                PRIORITY COUNTRY
                              </span>
                              {priorityItem.is_verified ? (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-green-500/20 text-green-400 font-geist px-1.5 py-0.5 rounded uppercase border border-green-500/30 font-bold">
                                  <Check className="w-2.5 h-2.5" /> Verified Data
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/20 text-amber-400 font-geist px-1.5 py-0.5 rounded uppercase border border-amber-500/30 font-bold">
                                  <AlertTriangle className="w-2.5 h-2.5" /> Estimated
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4.5 px-4 text-center font-mono text-xs text-amber-300 font-semibold uppercase">
                          {priorityItem.country.currency}
                        </td>
                        <td className="py-4.5 px-4 text-right font-semibold text-white text-base">
                          <span className="text-white/40 text-xs mr-1">{priorityItem.country.symbol}</span>
                          {priorityItem.predicted_price_min.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                          <span className="text-white/30 mx-1">—</span>
                          {priorityItem.predicted_price_max.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td className={`py-4.5 px-4 text-right sm:table-cell ${showDetailsMobile ? 'table-cell' : 'hidden'}`}>
                          {priorityItem.vs_user_percent === 0 ? (
                            <span className="text-white/30 text-xs">Baseline</span>
                          ) : priorityItem.is_cheaper ? (
                            <span className="text-green-400 font-medium inline-flex items-center gap-0.5 text-xs">
                              <ArrowDownRight className="w-3.5 h-3.5" />
                              {Math.abs(priorityItem.vs_user_percent).toFixed(1)}% cheaper
                            </span>
                          ) : (
                            <span className="text-red-400 font-medium inline-flex items-center gap-0.5 text-xs">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              {priorityItem.vs_user_percent.toFixed(1)}% costlier
                            </span>
                          )}
                        </td>
                        <td className={`py-4.5 px-6 text-right sm:table-cell ${showDetailsMobile ? 'table-cell' : 'hidden'}`}>
                          <span className="inline-block px-2 py-0.5 text-[10px] rounded bg-white/5 text-white/50 border border-white/5 font-mono">
                            {priorityItem.theta.toFixed(3)}
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Divider row for priority division */}
                    {priorityItem && normalList.length > 0 && (
                      <tr className="bg-white/1">
                        <td colSpan={5} className="py-2.5 px-6 text-[10px] font-bebas tracking-[0.2em] text-white/30 border-y border-white/5">
                          ALL REGIONAL COMPARISONS
                        </td>
                      </tr>
                    )}

                    {/* Render list entries */}
                    {normalList.length > 0 ? (
                      normalList.map((pred, i) => {
                        const isEven = i % 2 === 0;
                        const isHome = pred.country.code === homeCountry?.code;

                        return (
                          <tr
                            key={pred.country.code}
                            className={`border-b border-white/3 text-xs md:text-sm hover:bg-white/2 transition-colors ${
                              isEven ? "bg-white/0.5" : "bg-transparent"
                            } ${isHome ? "bg-amber-500/5 shadow-[inset_0_0_15px_rgba(245,158,11,0.03)]" : ""}`}
                          >
                            <td className="py-3.5 px-6 font-medium text-white flex items-center gap-3">
                              <span className="text-lg shrink-0">{pred.country.flag}</span>
                              <div className="truncate flex flex-col items-start gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white/90">{pred.country.name}</span>
                                  {isHome && (
                                    <span className="inline-block text-[9px] bg-amber-500/20 text-amber-300 font-bebas tracking-wider px-1.5 py-0.5 rounded uppercase">
                                      HOME
                                    </span>
                                  )}
                                </div>
                                {pred.is_verified ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] bg-green-500/20 text-green-400 font-geist px-1.5 py-0.5 rounded uppercase border border-green-500/30 font-bold">
                                    <Check className="w-2.5 h-2.5" /> Verified Data
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/20 text-amber-400 font-geist px-1.5 py-0.5 rounded uppercase border border-amber-500/30 font-bold">
                                    <AlertTriangle className="w-2.5 h-2.5" /> Estimated
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono text-xs text-white/40">
                              {pred.country.currency}
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-white text-sm md:text-base">
                              <span className="text-white/30 text-xs font-normal mr-1">{pred.country.symbol}</span>
                              {pred.predicted_price_min.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                              <span className="text-white/20 font-normal mx-1 text-xs">—</span>
                              {pred.predicted_price_max.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </td>
                            <td className={`py-3.5 px-4 text-right sm:table-cell ${showDetailsMobile ? 'table-cell' : 'hidden'}`}>
                              {isHome ? (
                                <span className="text-amber-400 font-bebas tracking-wider text-xs">BASE PRICE</span>
                              ) : pred.vs_user_percent === 0 ? (
                                <span className="text-white/30 text-xs">Baseline</span>
                              ) : pred.is_cheaper ? (
                                <span className="text-green-400 font-medium inline-flex items-center gap-0.5 text-xs">
                                  <ArrowDownRight className="w-3.5 h-3.5" />
                                  {Math.abs(pred.vs_user_percent).toFixed(1)}% cheaper
                                </span>
                              ) : (
                                <span className="text-red-400 font-medium inline-flex items-center gap-0.5 text-xs">
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                  {pred.vs_user_percent.toFixed(1)}% costlier
                                </span>
                              )}
                            </td>
                            <td className={`py-3.5 px-6 text-right sm:table-cell ${showDetailsMobile ? 'table-cell' : 'hidden'}`}>
                              <span className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-white/5 text-white/35 font-mono">
                                {pred.theta.toFixed(3)}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-20 font-geist text-sm text-white/40">
                          No results match the country search filters.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>

            </div>

          </div>

        </motion.div>
      )}

    </div>
  );
};
export default CalculatorPage;
