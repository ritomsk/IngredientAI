import React from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    AlertOctagon,
    Scale,
    Check,
    X,
    Sparkles,
    RefreshCcw,
    ArrowRightLeft,
    Lightbulb
} from 'lucide-react';
import { cn } from '../lib/utils';

// Reusable Score Meter
const HealthScoreMeter = ({ score, colorClass }) => {
    const radius = 36;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const safeScore = Number(score) || 0;

    // If score is 9/10, we want 90% fill.
    const strokeDashoffset = circumference - (safeScore / 10) * circumference;

    return (
        <div className="relative flex items-center justify-center w-20 h-20">
            <svg height="100%" width="100%" viewBox="0 0 100 100" className="-rotate-90">
                {/* Background Circle */}
                <circle
                    stroke="#e2e8f0"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx="50"
                    cy="50"
                />
                {/* Progress Circle */}
                <motion.circle
                    stroke="currentColor"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx="50"
                    cy="50"
                    className={colorClass}
                    style={{ strokeDasharray: circumference }}
                    initial={{ strokeDashoffset: circumference }} // Start empty
                    animate={{ strokeDashoffset: strokeDashoffset }} // Animate to 9/10
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <span className={cn("absolute text-xl font-bold", colorClass)}>
                {safeScore}<span className="text-xs opacity-60"></span>
            </span>
        </div>
    );
};

const ComparisonResultsView = ({ result, onReset }) => {
    // 1. Parse Winner Data
    const winnerObj = result?.final_recommendation?.[0] || {};
    const winnerName = winnerObj?.winner || "Unknown";
    const winnerReason = result?.final_recommendation?.[1] || "Analysis complete.";

    // 2. Determine Theme based on Winner
    // FORCE EMERALD (GREEN) THEME IF A OR B WINS
    let theme = {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-800",
        icon: Scale
    };

    if (winnerName === "Product A" || winnerName === "Product B") {
        theme = { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: Trophy };
    } else if (winnerName === "Neither") {
        theme = { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: AlertOctagon };
    }

    const containerVars = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Helper to safely render strings
    const safeText = (text) => typeof text === 'string' ? text : "";

    return (
        <motion.div
            variants={containerVars}
            initial="hidden"
            animate="show"
            className="w-full max-w-6xl mx-auto space-y-8 pb-20"
        >
            {/* --- HEADER: BATTLE SUMMARY --- */}
            <motion.div variants={itemVars} className={cn("rounded-3xl p-8 border text-center relative overflow-hidden", theme.bg, theme.border)}>
                <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                    <div className={cn("inline-flex items-center gap-2 px-10 py-2.5 rounded-full bg-emerald-400/80 backdrop-blur-sm border border-black/5 text-lg  font-bold uppercase tracking-wider", theme.text)}>
                        <theme.icon className="w-4 h-4" />
                        Winner: {winnerName === "Neither" ? "No Safe Choice" : winnerName === "Tie" ? "It's a Draw" : `${winnerName}`}
                    </div>

                    <h1 className="text-3xl md:text-3xl font-black text-slate-900 leading-tight">
                        {safeText(winnerReason)}
                    </h1>

                    <p className="text-slate-600 text-lg font-medium leading-relaxed">
                        {safeText(result?.battle_intro)}
                    </p>
                </div>
                {/* Background Decor */}
                <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl -mr-20 -mt-20 pointer-events-none bg-current", theme.text)} />
                <div className={cn("absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl -ml-20 -mb-20 pointer-events-none bg-current", theme.text)} />
            </motion.div>

            {/* --- MAIN GRID: HEAD TO HEAD --- */}
            <div className="grid md:grid-cols-2 gap-6">
                <ProductCard
                    data={result?.product_a}
                    label="Product A"
                    isWinner={winnerName === "Product A"}
                    color="emerald"
                />
                <ProductCard
                    data={result?.product_b}
                    label="Product B"
                    isWinner={winnerName === "Product B"}
                    color="blue"
                />
            </div>

            {/* --- THE TRADE OFF --- */}
            <motion.div variants={itemVars} className="glass p-8 rounded-3xl border border-indigo-100 bg-indigo-50/30">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl shrink-0">
                        <ArrowRightLeft className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-indigo-900">The Trade Off</h3>
                        <p className="text-slate-700 text-lg leading-relaxed">
                            {safeText(result?.the_trade_off)}
                        </p>
                        {result?.hero_ingredient && result.hero_ingredient !== "None" && (
                            <div className="pt-2">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-100/50 text-indigo-700 text-sm font-bold">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Hero Ingredient: {safeText(result.hero_ingredient)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* --- PRO TIP --- */}
            <motion.div variants={itemVars} className="glass p-6 rounded-2xl border border-amber-100 bg-amber-50/40 flex gap-4 items-start">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0 mt-1">
                    <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wide mb-1">Pro Tip</h4>
                    <p className="text-amber-800 leading-relaxed font-medium">
                        {typeof result?.pro_tip === 'string'
                            ? result.pro_tip.replace('💡', '')
                            : "Check the ingredients carefully before consuming."}
                    </p>
                </div>
            </motion.div>

            {/* --- RESET BUTTON --- */}
            <motion.div variants={itemVars} className="flex justify-center pt-8">
                <button
                    onClick={onReset}
                    className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg"
                >
                    <RefreshCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                    Compare Another Pair
                </button>
            </motion.div>
        </motion.div>
    );
};

// --- SUB-COMPONENT: PRODUCT CARD ---
const ProductCard = ({ data, label, isWinner, color }) => {
    if (!data) return null;

    // Logic: If Winner -> Force Green (Emerald). If Loser -> Red.

    let borderClass = "border-slate-100";
    let shadowClass = "shadow-sm hover:shadow-md";
    let badgeBg = "bg-emerald-500";
    let scoreColor = "text-emerald-600";
    let checkIconColor = "text-emerald-700";

    if (isWinner) {
        // WINNER = ALWAYS GREEN (Subtle)
        borderClass = "border-emerald-500 ring-4 ring-emerald-500/10";
        badgeBg = "bg-emerald-500";
        scoreColor = "text-emerald-600";
        checkIconColor = "text-emerald-700";
    } else {
        // LOSER = RED (Subtle Red Shadow)
        borderClass = "border-red-200";
        shadowClass = "shadow-red-100 hover:shadow-red-200 shadow-lg";
        scoreColor = "text-red-500";
        checkIconColor = "text-emerald-700"; // Keep 'The Good' list green or neutral
    }

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
            className={cn("bg-white rounded-3xl p-6 md:p-8 border relative overflow-hidden transition-all", borderClass, shadowClass)}
        >
            {isWinner && (
                <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-xl text-xs font-bold uppercase tracking-wider text-white shadow-sm", badgeBg)}>
                    Winner
                </div>
            )}

            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">"{data.vibe_check || 'Analysis'}"</h3>
                </div>
                {/* Score Meter with dynamic color */}
                <HealthScoreMeter score={data.health_score} colorClass={scoreColor} />
            </div>

            <div className="space-y-6">
                {/* PROS */}
                <div>
                    <h4 className={cn("text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2", checkIconColor)}>
                        <Check className="w-4 h-4" /> The Good
                    </h4>
                    <ul className="space-y-2">
                        {(data.pros || []).map((pro, i) => (
                            <li key={i} className="text-sm text-slate-600 pl-4 border-l-2 border-slate-100 leading-relaxed">
                                {typeof pro === 'string' ? pro.replace('✅', '').trim() : pro}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CONS */}
                <div>
                    <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <X className="w-4 h-4" /> The Bad
                    </h4>
                    <ul className="space-y-2">
                        {(data.cons || []).map((con, i) => (
                            <li key={i} className="text-sm text-slate-600 pl-4 border-l-2 border-red-100 leading-relaxed">
                                {typeof con === 'string' ? con.replace('🚩', '').trim() : con}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default ComparisonResultsView;