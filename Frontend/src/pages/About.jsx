import React from 'react';
import { motion } from 'framer-motion';
// 👇 THIS WAS MISSING. It fixes the crash.
import { Heart, Users, ShieldCheck } from 'lucide-react';
import heroImage2 from '../assets/035D8739-3088-431C-8018-E4068707CFEE.jpeg';
import heroImage1 from '../assets/D75149C8-0774-4E7A-9338-5A595C2CE4F1.jpeg';

const About = () => {
    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    return (
        <div className="overflow-hidden mt-10">
            {/* Background Decor (Matching Home) */}


            <div className="max-w-7xl mx-auto px-6 py-0">

                {/* 1. Mission Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-24 max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                        Our Mission is <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Transparency.</span>
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed">
                        We believe everyone deserves to know exactly what they're putting into their bodies,
                        <span className="font-semibold text-neutral-text"> without needing a PhD in chemistry.</span>
                    </p>
                </motion.div>

                {/* 2. Alternating Feature Section: Image Left */}
                <div className="flex flex-col md:flex-row items-center gap-16 mb-32">
                    <motion.div
                        className="flex-1 w-full group relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Image Container with Hover Zoom */}
                        <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20">
                            <img
                                src={heroImage1}
                                alt="Healthy Ingredients"
                                className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Smart Ingredient Insights</h2>
                        <p className="text-gray-500 leading-relaxed text-lg mb-6">
                            NutriAI decodes complex labels instantly. We highlight the good, flag the bad, and explain the "why" behind every ingredient.
                        </p>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                    </motion.div>
                </div>

                {/* 3. Alternating Feature Section: Image Right */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-32">
                    <motion.div
                        className="flex-1 w-full group relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Image Container with Hover Zoom */}
                        <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20">
                            <img
                                src={heroImage2}
                                alt="Nutrition Analysis"
                                className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Smarter Food Decisions</h2>
                        <p className="text-gray-500 leading-relaxed text-lg mb-6">
                            Powered by AI, we break down confusing food labels into clear, honest explanations — helping you make confident choices in seconds.
                        </p>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                    </motion.div>
                </div>

                {/* 4. Who It's For Grid */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Who It's For</h2>
                        <p className="text-gray-500">Designed for anyone who cares about their health.</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: Heart,
                                title: 'Health Optimizers',
                                desc: 'Decode nutrient profiles and avoid ultra-processed additives to strictly align every meal with your fitness goals.'
                            },
                            {
                                icon: Users,
                                title: 'Concerned Parents',
                                desc: 'Safeguard your family by instantly identifying hidden sugars, artificial dyes, and preservatives before they reach the plate.'
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Dietary Management',
                                desc: 'Navigate allergies, IBS, or Celiac restrictions with confidence by flagging potential triggers instantly.'
                            }
                        ].map((card, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                // 👇 EXACT Home Page Effects: Zoom (scale-110), Green Glow, and Z-Index popping
                                className="group relative p-8 bg-white rounded-xl rounded-card shadow-sm border-light-grey transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-400/50 hover:z-50"
                            >
                                {/* Icon Circle - Pops on Hover */}
                                <div className="w-14 h-14 bg-emerald-50 text-primary rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                                    <card.icon size={28} />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-primary">
                                    {card.title}
                                </h3>

                                {/* Description - Professional & Clear */}
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
