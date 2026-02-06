import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ArrowRightLeft } from 'lucide-react'; // Added ArrowRightLeft
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 z-10">
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium text-emerald-800 bg-emerald-50/30 border-emerald-100/50 shadow-sm"
            >
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Food Safety Analysis</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1]"
            >
                Decode Your Food <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    Instantly
                </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-text-body max-w-2xl leading-relaxed"
            >
                Make informed decisions about what you eat. Scan labels or paste ingredients
                to get an instant, plain-english breakdown of risks and benefits.
            </motion.p>

            {/* CTA Buttons Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
            >
                {/* EXISTING: Start Analysis Button (Primary Action) */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to="/chat"
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-text-primary rounded-full hover:bg-gray-800 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    >
                        <span>Start Analysis</span>
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-b-full pointer-events-none" />
                    </Link>
                </motion.div>

                {/* NEW: Compare Button (Secondary Action) */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to="/compare"
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text-primary transition-all duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-emerald-200 shadow-sm hover:shadow-md"
                    >
                        <ArrowRightLeft className="w-5 h-5 mr-2 text-emerald-600 group-hover:text-emerald-700" />
                        <span>Compare Products</span>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;