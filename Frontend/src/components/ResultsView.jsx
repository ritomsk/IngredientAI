import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Lightbulb,
    Activity,
    Zap,
    RefreshCcw,
    ArrowRight,
    Info,
    ShieldCheck,
    AlertOctagon
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- COMPONENT: CIRCULAR CONFIDENCE METER ---
const ConfidenceMeter = ({ score = 0 }) => {
    const radius = 42;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);
    const strokeDashoffset = circumference - (safeScore / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90 overflow-visible drop-shadow-sm"
            >
                <defs>
                    <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <circle
                    stroke="#f3f4f6"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={normalizedRadius}
                    cx="50"
                    cy="50"
                    strokeLinecap="round"
                />
                <motion.circle
                    stroke="url(#meterGradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={normalizedRadius}
                    cx="50"
                    cy="50"
                    strokeLinecap="round"
                    style={{ strokeDasharray: circumference }}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="drop-shadow-md"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                <motion.span
                    className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    {safeScore}%
                </motion.span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Reliability
                </span>
            </div>
        </div>
    );
};

const ResultsView = ({ results, onReset }) => {
    const processedData = useMemo(() => {
        if (!results) return null;

        const parsePoint = (str, type) => {
            if (!str) return null;
            const cleanStr = str.replace(/^[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '');
            const [title, ...descParts] = cleanStr.split(':');
            return {
                name: title?.trim() || "Detail",
                description: descParts.join(':').trim() || title?.trim() || "",
                status: type
            };
        };

        const cleanText = (val) => {
            if (!val) return null;
            if (Array.isArray(val)) {
                return val.length > 0 && val[0] !== "" ? val[0] : null;
            }
            if (typeof val === 'string') {
                const trimmed = val.trim();
                if (trimmed === "" || trimmed === "[]" || trimmed.toLowerCase() === "none" || trimmed.toLowerCase() === "null") {
                    return null;
                }
                if (trimmed === '""' || trimmed === "''") return null;
                return trimmed;
            }
            return null;
        };

        const greenIngredients = (results.green_flags || []).map(str => parsePoint(str, 'safe')).filter(Boolean);
        const redIngredients = (results.red_flags || []).map(str => parsePoint(str, 'avoid')).filter(Boolean);

        // --- FIXED LOGIC START ---
        let calculatedStatus = 'caution';
        let verdictText = '';
        let isPositive = false;
        const rawVerdict = results.final_verdict;

        if (!rawVerdict) {
            // Handle empty/null case
            calculatedStatus = 'caution';
            verdictText = "Analysis inconclusive";
        }
        // CASE 1: Object format { is_good: boolean, recommendation: string }
        else if (typeof rawVerdict === 'object' && !Array.isArray(rawVerdict)) {
            isPositive = Boolean(rawVerdict.is_good);
            verdictText = rawVerdict.recommendation || "";
        }
        // CASE 2: Boolean
        else if (typeof rawVerdict === 'boolean') {
            isPositive = rawVerdict;
            verdictText = rawVerdict ? "Safe to consume" : "Avoid";
        }
        // CASE 3: Array [boolean/string, string]
        else if (Array.isArray(rawVerdict) && rawVerdict.length > 0) {
            const firstItem = rawVerdict[0];
            verdictText = rawVerdict[1] || String(firstItem);

            if (typeof firstItem === 'boolean') {
                isPositive = firstItem;
            } else if (typeof firstItem === 'object' && firstItem !== null && 'is_good' in firstItem) {
                isPositive = Boolean(firstItem.is_good);
            } else {
                isPositive = Boolean(firstItem); // Fallback
            }
        }
        // CASE 4: String
        else if (typeof rawVerdict === 'string') {
            verdictText = rawVerdict;
            const lowerRaw = rawVerdict.toLowerCase();
            if (lowerRaw.includes('yes') || lowerRaw.includes('true') || lowerRaw.includes('safe') || lowerRaw.includes('excellent')) {
                isPositive = true;
            } else {
                isPositive = !(lowerRaw.includes('avoid') || lowerRaw.includes('limit') || lowerRaw.includes('no'));
            }
        }

        // --- FINAL STATUS DETERMINATION ---
        // If explicitly flagged as Good, force SAFE status.
        if (isPositive) {
            calculatedStatus = 'safe';
        } else {
            // Otherwise, check keywords to distinguish between CAUTION and AVOID
            const lowerText = verdictText.toLowerCase();
            if (lowerText.includes('caution') || lowerText.includes('moderate') || lowerText.includes('warning')) {
                calculatedStatus = 'caution';
            } else {
                calculatedStatus = 'avoid';
            }
        }
        // --- FIXED LOGIC END ---

        let alternativeText = null;
        let alternativeProduct = null;
        const rawAlt = results.better_alternative;

        // Handle array or string for better_alternative
        if (Array.isArray(rawAlt)) {
            if (rawAlt.length > 0) alternativeText = rawAlt[0];
            if (rawAlt.length > 1) alternativeProduct = rawAlt[1];
        } else if (typeof rawAlt === 'string') {
            const cleaned = cleanText(rawAlt);
            if (cleaned) {
                alternativeText = cleaned;
                alternativeProduct = cleaned;
            }
        }

        const shock = cleanText(results.shock_comparison);
        const tip = cleanText(results.pro_tip);

        return {
            summary: results.brief_summary || "No summary available.",
            status: calculatedStatus,
            verdictMsg: verdictText,
            confidence: results.confidence_score || 0,
            ingredients: [...redIngredients, ...greenIngredients],
            proTip: tip,
            shockComparison: shock,
            betterAlternative: alternativeText,
            betterAlternativeProduct: alternativeProduct
        };
    }, [results]);

    const data = processedData || {
        summary: "Analysis unavailable.",
        status: 'caution',
        confidence: 0,
        ingredients: [],
        proTip: null
    };

    const statusConfig = {
        safe: {
            accent: "bg-emerald-500",
            bg: "bg-emerald-50/50",
            text: "text-emerald-700",
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-100",
            icon: ShieldCheck,
            label: "Excellent Choice"
        },
        caution: {
            accent: "bg-orange-500",
            bg: "bg-orange-50/50",
            text: "text-orange-700",
            iconColor: "text-orange-600",
            iconBg: "bg-orange-100",
            icon: AlertTriangle,
            label: "Consume with Caution"
        },
        avoid: {
            accent: "bg-rose-600",
            bg: "bg-rose-50/50",
            text: "text-rose-700",
            iconColor: "text-rose-600",
            iconBg: "bg-rose-100",
            icon: AlertOctagon,
            label: "Avoid / Limit"
        },
    };

    const currentStyle = statusConfig[data.status] || statusConfig.safe;

    const containerVars = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <motion.div
            variants={containerVars}
            initial="hidden"
            animate="show"
            className="w-full max-w-4xl mx-auto space-y-8 pb-20 font-sans"
        >
            {/* 1. HERO VERDICT SECTION */}
            <motion.div variants={itemVars} className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-slate-100">
                <div className={cn("h-2 w-full absolute top-0 left-0", currentStyle.accent)}></div>

                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">

                        <div className="flex-1 space-y-4">
                            {/* Header: Icon + Label */}
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-xl shrink-0", currentStyle.iconBg, currentStyle.iconColor)}>
                                    <currentStyle.icon className="w-8 h-8 md:w-9 md:h-9" strokeWidth={2.5} />
                                </div>
                                <h1 className={cn("text-3xl md:text-4xl font-extrabold tracking-tight", currentStyle.iconColor)}>
                                    {currentStyle.label}
                                </h1>
                            </div>

                            <p className="text-slate-600 leading-relaxed text-lg pt-1">
                                {data.summary}
                            </p>
                        </div>

                        {/* Confidence Meter */}
                        <div className="flex-shrink-0 pt-6 md:pt-0 pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-slate-100 md:border-transparent w-full md:w-auto flex justify-center">
                            <ConfidenceMeter score={data.confidence} />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 2. REALITY CHECK */}
            {data.shockComparison && (data.shockComparison.length > 0) && (
                <motion.div variants={itemVars} className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-rose-100 flex items-start gap-4 shadow-sm relative overflow-hidden">
                    <div className="bg-white p-3 rounded-full shadow-sm text-rose-500 hidden sm:block z-10">
                        <Zap size={24} fill="currentColor" className="opacity-20" />
                        <Zap size={24} className="absolute -mt-6" />
                    </div>
                    <div className="z-10">
                        <h3 className="text-rose-900 font-bold uppercase text-xs tracking-widest mb-1">Reality Check</h3>
                        <p className="text-rose-950 font-medium text-lg md:text-xl leading-snug">
                            "{data.shockComparison}"
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl"></div>
                </motion.div>
            )}

            {/* 3. ACTION GRID: Swaps & Tips */}
            {(data.betterAlternative || data.proTip) && (
                <motion.div variants={itemVars} className="grid md:grid-cols-2 gap-4">

                    {/* Swap Card */}
                    {data.betterAlternative && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                                    <RefreshCcw size={20} />
                                </div>
                                {data.betterAlternativeProduct && (
                                    <a
                                        href={`https://www.amazon.in/s?k=${encodeURIComponent(data.betterAlternativeProduct)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center bg-emerald-50 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        Find Item <ArrowRight size={12} className="ml-1" />
                                    </a>
                                )}
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Smart Swap</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Consider trying <span className="font-semibold text-emerald-700">{data.betterAlternative}</span> instead.
                            </p>
                        </div>
                    )}

                    {/* Pro Tip Card */}
                    {data.proTip && (
                        <div className={cn(
                            "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow",
                            !data.betterAlternative && "md:col-span-2"
                        )}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                                    <Info size={20} />
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Pro Tip</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {typeof data.proTip === 'string' ? data.proTip.replace('💡', '') : data.proTip}
                            </p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* 4. DETAILED BREAKDOWN SECTION */}
            {data.ingredients.length > 0 && (
                <motion.div variants={itemVars}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Activity size={20} className="text-slate-400" />
                            Detailed Breakdown
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {data.ingredients.map((item, index) => (
                            <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "p-2.5 rounded-xl shrink-0",
                                        item.status === 'avoid' ? 'bg-red-50 text-red-500' :
                                            item.status === 'safe' ? 'bg-emerald-50 text-emerald-500' :
                                                'bg-slate-100 text-slate-500'
                                    )}>
                                        {item.status === 'avoid' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-900">{item.name}</h4>
                                            <span className={cn(
                                                "w-2 h-2 rounded-full",
                                                item.status === 'avoid' ? 'bg-red-500' : 'bg-emerald-500'
                                            )}></span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* 5. BOTTOM ACTION */}
            <motion.div variants={itemVars} className="flex justify-center pt-8">
                <button
                    onClick={onReset}
                    className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg"
                >
                    <RefreshCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                    Analyze Another Product
                </button>
            </motion.div>
        </motion.div>
    );
};

export default ResultsView;