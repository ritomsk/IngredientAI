import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="relative min-h-screen font-sans text-text-primary overflow-x-hidden">
            {/* Mesh Background */}
            <div className="mesh-background">
                <div className="mesh-blob blob-mint"></div>
                <div className="mesh-blob blob-coral"></div>
                <div className="mesh-blob blob-lavender"></div>
            </div>

            <div className="z-50 h-20">
                <Navbar />
            </div>

            <main className="relative z-10 flex flex-col items-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 mt-10">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
