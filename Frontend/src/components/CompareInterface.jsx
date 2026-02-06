import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ArrowRightLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import AnalysisLoader from './AnalysisLoader';
// IMPORT THE NEW COMPONENT
import ComparisonResultsView from './ComparisonResultsView';

const CompareInterface = () => {
    // State
    const [mode, setMode] = useState('input'); // input | loading | results
    const [userGoals, setUserGoals] = useState('');
    const [images, setImages] = useState({ A: null, B: null });
    const [previews, setPreviews] = useState({ A: null, B: null });
    const [comparisonResult, setComparisonResult] = useState(null);
    const [error, setError] = useState(null);

    // Refs
    const inputRefA = useRef(null);
    const inputRefB = useRef(null);

    const handleFileSelect = (e, side) => {
        const file = e.target.files[0];
        if (file) {
            setImages(prev => ({ ...prev, [side]: file }));
            setPreviews(prev => ({ ...prev, [side]: URL.createObjectURL(file) }));
        }
    };

    const clearFile = (side) => {
        setImages(prev => ({ ...prev, [side]: null }));
        setPreviews(prev => ({ ...prev, [side]: null }));
        if (side === 'A' && inputRefA.current) inputRefA.current.value = '';
        if (side === 'B' && inputRefB.current) inputRefB.current.value = '';
    };

    const handleCompare = async () => {
        if (!images.A || !images.B) return;
        setMode('loading');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('userGoals', userGoals);
            formData.append('image', images.A);
            formData.append('image', images.B);

            const response = await fetch('http://localhost:3001/api/compare', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error("Comparison failed");

            const data = await response.json();

            // Note: Ensure your backend returns the data inside 'comparison' key 
            // OR adjust this line if it returns the object directly.
            // Based on previous prompt, it was data.comparison
            setComparisonResult(data.comparison || data);

            setMode('results');

        } catch (err) {
            console.error(err);
            setError("Failed to compare products. Please try again.");
            setMode('input');
        }
    };

    const handleReset = () => {
        setImages({ A: null, B: null });
        setPreviews({ A: null, B: null });
        setComparisonResult(null);
        setMode('input');
    };

    return (

        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-3xl -z-10" />
            <AnimatePresence mode="wait">

                {/* --- INPUT MODE --- */}
                {mode === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center space-y-3">
                            <h2 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
                                Food <span className="text-emerald-600">Face-Off</span>
                            </h2>
                            <p className="text-lg text-text-body max-w-2xl mx-auto">
                                Upload two products to see which one wins for your health goals.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center border border-red-100 animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="glass p-6 md:p-8 rounded-3xl shadow-glass space-y-8 relative">
                            {/* Goals Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">
                                    Your Goals
                                </label>
                                <textarea
                                    value={userGoals}
                                    onChange={(e) => setUserGoals(e.target.value)}
                                    placeholder="e.g. High protein, Low sugar, or Weight loss..."
                                    className="w-full h-20 bg-white/50 border border-border-glass focus-within:outline-none focus-within:ring-0 rounded-xl p-4 text-base text-text-primary placeholder:text-text-muted/70 focus:ring-0 outline-none resize-none transition-all"
                                />
                            </div>

                            {/* Dual Upload Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200">
                                    <span className="font-black text-slate-400 text-xs">VS</span>
                                </div>

                                <UploadBox
                                    side="A"
                                    preview={previews.A}
                                    inputRef={inputRefA}
                                    onSelect={(e) => handleFileSelect(e, 'A')}
                                    onClear={() => clearFile('A')}
                                />
                                <UploadBox
                                    side="B"
                                    preview={previews.B}
                                    inputRef={inputRefB}
                                    onSelect={(e) => handleFileSelect(e, 'B')}
                                    onClear={() => clearFile('B')}
                                />
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={handleCompare}
                                    disabled={!images.A || !images.B}
                                    className={cn(
                                        "group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg",
                                        (images.A && images.B)
                                            ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-glow-green hover:scale-105"
                                            : "bg-gray-200 cursor-not-allowed text-gray-400 shadow-none"
                                    )}
                                >
                                    <ArrowRightLeft className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                                    Start Battle
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- LOADING MODE --- */}
                {mode === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center justify-center"
                    >
                        <AnalysisLoader text="Simulating matchup..." />
                    </motion.div>
                )}

                {/* --- RESULTS MODE (NEW COMPONENT) --- */}
                {mode === 'results' && comparisonResult && (
                    <ComparisonResultsView result={comparisonResult} onReset={handleReset} />
                )}

            </AnimatePresence>
        </div>
    );
};

// --- Reusable Upload Box (Kept local for simplicity) ---
const UploadBox = ({ side, preview, inputRef, onSelect, onClear }) => (
    <div className="relative group">
        <input
            type="file"
            ref={inputRef}
            onChange={onSelect}
            accept="image/*"
            className="hidden"
        />

        {preview ? (
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-emerald-100 bg-white shadow-sm group-hover:shadow-md transition-all">
                <img src={preview} alt={`Product ${side}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={onClear}
                        className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500/80 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm text-slate-700">
                    Product {side}
                </div>
            </div>
        ) : (
            <button
                onClick={() => inputRef.current?.click()}
                className="w-full h-64 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-400 bg-gray-50/50 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center gap-4 group"
            >
                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-emerald-500" />
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-600 group-hover:text-emerald-700">Add Product {side}</p>
                    <p className="text-xs text-gray-400 mt-1">Click to upload image</p>
                </div>
            </button>
        )}
    </div>
);

export default CompareInterface;