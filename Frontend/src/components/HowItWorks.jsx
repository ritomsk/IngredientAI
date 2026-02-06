import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Activity, Search } from 'lucide-react';

const steps = [
    {
        icon: Scan,
        title: "1. Scan or Search",
        description: "Upload a photo of the label or type in the product name."
    },
    {
        icon: Activity,
        title: "2. AI Analysis",
        description: "Our engine breaks down every ingredient against scientific databases."
    },
    {
        icon: Search,
        title: "3. Get Clarity",
        description: "Receive a transparent analysis and detailed breakdown."
    }
];

const HowItWorks = () => {
    return (
        <section className="py-24 z-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                // Move the entrance delay here so it doesn't slow down the hover
                                transition: { duration: 0.5, delay: index * 0.2 }
                            }}
                            viewport={{ once: true }}
                            // Add this line for the smooth scale effect
                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-emerald-300 transition-shadow duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
