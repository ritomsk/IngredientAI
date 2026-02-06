import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logoImage from '../assets/0B6E24C8-60A3-413F-B7F4-7F30949899DB.jpeg';
import logoImage2 from '../assets/0882D437-77DF-4A58-8590-933A1A27D12B_4_5005_c.jpeg';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // FIX 1: Use useLocation to get the current route path automatically
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] border-b bg-white border-gray-100 shadow-sm transition-all duration-300 ${isScrolled
                ? 'bg-white/90 backdrop-blur-md shadow-sm'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* 1. Logo: Changed to Link to prevent refresh */}
                <Link to="/" className="text-2xl flex items-center font-bold text-emerald-600 tracking-tight font-sans">
                    <img src={logoImage} alt="Logo" className="w-15 h-15" />
                    <img src={logoImage2} alt="Logo" className="w-30 h-10 mb-2" />
                </Link>

                {/* 2. Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        // FIX 2: Check if the current URL matches the link's href
                        const isActive = location.pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="relative px-1 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                            >
                                {link.name}
                                {/* FIX 3: Conditionally render based on URL match, not state */}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-underline"
                                        className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-emerald-500"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    <button
                        onClick={() => {
                            navigate('/chat');
                            setIsMobileMenuOpen(false);
                        }}
                        className="bg-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-600 transition-all hover:scale-105 shadow-lg shadow-emerald-200">
                        Analyze a Product
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-full transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden absolute w-full shadow-xl"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-lg font-medium transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-600'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => {
                                    navigate('/chat');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium shadow-md hover:bg-emerald-600 transition-colors mt-2">
                                Analyze a Product
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;