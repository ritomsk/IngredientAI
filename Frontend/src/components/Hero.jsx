import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ArrowRightLeft } from 'lucide-react'; // Added ArrowRightLeft
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 z-10 mt-20">
            <div className="absolute top-0 left-1/4 w-200 h-150 bg-emerald-100/50 rounded-full blur-3xl -z-100" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-3xl -z-100" />

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:stext-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight"
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
                className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed"
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
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
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
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm hover:shadow-md"
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