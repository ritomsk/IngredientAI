import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Sparkles, X, ScanLine, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import AnalysisLoader from './AnalysisLoader';
import ResultsView from './ResultsView';
import BarcodeScanner from './BarcodeScanner';

// Helper: Convert Webcam Base64 to a real File object
const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const ChatInterface = () => {
    // State Management
    const [mode, setMode] = useState('input'); // input | scanning | camera | loading | results
    const [inputValue, setInputValue] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [error, setError] = useState(null);

    // Camera Refs & State
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const [facingMode, setFacingMode] = useState("environment");

    // --- 1. BARCODE LOGIC ---
    const handleBarcodeScanned = async (barcode) => {
        setMode('loading');
        setError(null);
        try {
            console.log("Checking Database for:", barcode);
            const offResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const offData = await offResponse.json();

            if (offData.status === 1) {
                const product = offData.product;
                const payload = {
                    product_name: product.product_name,
                    ingredients_text: product.ingredients_text,
                    nutriments: product.nutriments,
                    image_url: product.image_front_url,
                    userGoals: inputValue || "General health check"
                };

                const backendResponse = await fetch('http://localhost:3001/api/barcode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!backendResponse.ok) throw new Error("AI Processing failed");
                const data = await backendResponse.json();

                const normalizedData = {
                    ...data.analysis,
                    product_data: data.product_details
                };
                setApiResponse(normalizedData);
                setMode('results');
            } else {
                setError("Product not found. Please take a photo instead.");
                setMode('input');
            }
        } catch (err) {
            console.error("Barcode flow failed:", err);
            setError("Could not fetch product data. Please try uploading a photo.");
            setMode('input');
        }
    };

    // --- 2. CAMERA LOGIC ---
    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            const file = dataURLtoFile(imageSrc, "camera_capture.jpg");
            setSelectedImage(file);
            setPreviewUrl(imageSrc);
            setMode('input');
        }
    }, [webcamRef]);

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    // --- 3. EXISTING HANDLERS ---
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const clearFile = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAnalyze = async () => {
        if (!inputValue.trim() && !selectedImage) return;

        setMode('loading');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('userGoals', inputValue);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await fetch('http://localhost:3001/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const data = await response.json();
            setApiResponse(data);
            setMode('results');

        } catch (err) {
            console.error("Analysis failed:", err);
            setError("Failed to analyze ingredients. Please try again.");
            setMode('input');
        }
    };

    const handleReset = () => {
        setInputValue('');
        clearFile();
        setApiResponse(null);
        setMode('input');
    };

    return (
        <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center p-4 overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-3xl -z-10" />

            <div className="w-full md:max-w-3xl mx-auto z-10">
                <AnimatePresence mode="wait">

                    {/* --- MODE: INPUT --- */}
                    {mode === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full space-y-8"
                        >
                            {/* Hero Heading */}
                            <div className="text-center space-y-3 mb-10">
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
                                    What are we <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">eating today?</span>
                                </h1>
                                <p className="text-lg text-gray-500 max-w-xl mx-auto font-light">
                                    Paste ingredients, scan a barcode, or snap a photo. We'll handle the science.
                                </p>
                            </div>

                            {/* Error Toast */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl text-sm text-center border border-red-100 shadow-sm mx-auto max-w-md"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Main Input Card */}
                            <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-500/10 border border-gray-100 overflow-hidden relative transition-all focus-within:outline-none focus-within:ring-0 duration-300 hover:shadow-emerald-500/20 group">
                                <div className="p-1">
                                    {/* File Input (Hidden) */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    {/* Image Preview - FIXED: Restored 'X' button functionality */}
                                    <AnimatePresence>
                                        {previewUrl && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-6 pt-6"
                                            >
                                                <div className="relative w-full h-56 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Label Preview"
                                                        className="w-full h-full object-cover"
                                                    />

                                                    {/* 👇 RESTORED: Always visible remove button on top-right */}
                                                    <button
                                                        onClick={clearFile}
                                                        className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10 shadow-lg"
                                                        title="Remove Image"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Text Area */}
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={selectedImage ? "Describe your health goals or concerns..." : "Type ingredients here, paste text, or describe your health goals..."}
                                        className="w-full min-h-[140px] bg-transparent border-none resize-none focus-within:outline-none focus-within:ring-0 focus:ring-0 text-lg text-gray-700 placeholder:text-gray-400 p-8 leading-relaxed selection:bg-emerald-100"
                                    />
                                </div>

                                {/* Action Toolbar */}
                                <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

                                    {/* Tools */}
                                    <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "p-3 rounded-xl transition-all duration-200 flex items-center gap-2 group/btn",
                                                selectedImage ? "bg-emerald-100 text-emerald-700" : "hover:bg-white hover:shadow-sm text-gray-500 hover:text-emerald-600"
                                            )}
                                            title="Upload Photo"
                                        >
                                            <Upload className="w-5 h-5" />
                                            <span className="text-sm font-medium hidden md:inline">Upload</span>
                                        </button>

                                        <button
                                            onClick={() => setMode('camera')}
                                            className="p-3 rounded-xl transition-all duration-200 flex items-center gap-2 hover:bg-white hover:shadow-sm text-gray-500 hover:text-emerald-600"
                                            title="Take Photo"
                                        >
                                            <Camera className="w-5 h-5" />
                                            <span className="text-sm font-medium hidden md:inline">Camera</span>
                                        </button>

                                        <button
                                            onClick={() => setMode('scanning')}
                                            className="p-3 rounded-xl transition-all duration-200 flex items-center gap-2 hover:bg-white hover:shadow-sm text-gray-500 hover:text-blue-600"
                                            title="Scan Barcode"
                                        >
                                            <ScanLine className="w-5 h-5" />
                                            <span className="text-sm font-medium hidden md:inline">Barcode</span>
                                        </button>

                                        <span className="text-xs text-gray-300 ml-2 font-mono hidden md:inline">
                                            {inputValue.length > 0 && `${inputValue.length} chars`}
                                        </span>
                                    </div>

                                    {/* Main Action Button */}
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!inputValue.trim() && !selectedImage}
                                        className={cn(
                                            "w-full md:w-auto relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-300 rounded-full shadow-md overflow-hidden",
                                            (inputValue.trim() || selectedImage)
                                                ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-lg hover:scale-105 shadow-emerald-500/25"
                                                : "bg-gray-200 cursor-not-allowed text-gray-400 shadow-none"
                                        )}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            Analyze Ingredients
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- MODE: CAMERA --- */}
                    {mode === 'camera' && (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-[600px] relative rounded-[2rem] overflow-hidden bg-black shadow-2xl border-4 border-white"
                        >
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: facingMode }}
                                className="w-full h-full object-cover"
                            />

                            {/* Camera UI Overlay */}
                            <div className="absolute inset-0 flex flex-col justify-between p-6">
                                <div className="flex justify-between items-start">
                                    <button
                                        onClick={() => setMode('input')}
                                        className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                    <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-sm font-medium">
                                        Photo Mode
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-8 pb-4">
                                    <button
                                        onClick={toggleCamera}
                                        className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all"
                                    >
                                        <RefreshCcw className="w-6 h-6" />
                                    </button>

                                    <button
                                        onClick={capturePhoto}
                                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/20 transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-full transition-transform group-hover:scale-90" />
                                    </button>

                                    <div className="w-12" /> {/* Spacer for balance */}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- MODE: SCANNING --- */}
                    {/* 👇 FIXED: Removed bg-black and dark padding */}
                    {mode === 'scanning' && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full bg-white rounded-[2rem] p-4 shadow-2xl border border-gray-100 overflow-hidden"
                        >
                            <div className="relative rounded-3xl overflow-hidden bg-gray-50">
                                <BarcodeScanner
                                    onScanSuccess={handleBarcodeScanned}
                                />
                            </div>
                            <div className="text-center py-6">
                                <p className="text-gray-500 font-medium">Point your camera at a barcode</p>
                                <button
                                    onClick={() => setMode('input')}
                                    className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Cancel Scanning
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* --- MODE: LOADING --- */}
                    {mode === 'loading' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full py-12"
                        >
                            <AnalysisLoader />
                        </motion.div>
                    )}

                    {/* --- MODE: RESULTS --- */}
                    {mode === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="w-full"
                        >
                            <ResultsView results={apiResponse} onReset={handleReset} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChatInterface;