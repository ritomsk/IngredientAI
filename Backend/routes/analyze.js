const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        const { userGoals } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const filePath = req.file.path;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Updated to latest stable flash model
            generationConfig: { responseMimeType: "application/json" }
        });

        const imagePart = {
            inlineData: {
                data: fs.readFileSync(filePath).toString("base64"),
                mimeType: req.file.mimetype,
            },
        };

        const megaPrompt = `
            **Role:** You are "Nutri-X," an intelligent food copilot. Your mission is to provide holistic, practical health assessments that prioritize overall nutritional value over minor imperfections. You act as a supportive peer, helping users find the "Net Positive" in their food choices.

            **User Goals:** ${userGoals}

            **Phase 1: Internal Logic (Do Not Output)**
            1. **Profiling:** Cross-reference ingredients and nutriments against user goals and strict allergies.
            2. **The 80/20 Rule (Flag Analysis):**
            - **Green Flags:** Strongly highlight core benefits (whole grains, high protein, fiber).
            - **Red Flags:** Mention minor drawbacks (lecithin, gums, moderate sodium) gently as "Notes." Only prioritize these if they are major goal conflicts.
            - **Dynamic Ratio:** If a product is fundamentally nutritious, ensure Green Flags outnumber Red Flags to keep the user motivated.
            3. **Verdict Determination:** - **🟢 YES:** Assign this if the product is fundamentally nutritious (e.g., oats, muesli, protein bars) even if it has moderate sodium or sugar. "Yes" means "This is a good choice compared to average convenience food."   - **🟡 CAUTION:** Assign this ONLY if there is a direct conflict with the user's specific disease (e.g., Sugar for a Diabetic) or if the product poses a significant macro imbalance (e.g., very high fat with zero protein). Do not use this for general "processed food" nitpicking.
            - **🔴 NO:**  Assign this for junk food, candy, or items that actively work against the user's goals.
            4. **Shock Comparison:** ONLY for 🔴 NO or genuinely unhealthy items. Use a short, crisp (max 5 words) Indian junk food reference (e.g., "Saltier than a Samosa"). Otherwise, set to [].
            5. **Strict Restriction:** Never mention "missing ingredients" or "incomplete data." 

            **Phase 2: Output Constraints**
            - **Tone:** Simplistic, non-technical, and encouraging. Avoid being overly alarmist about minor preservatives or additives.
            - **Flag Details:** Exactly 3-4 lines and 20-30 words per flag.
            - **Pro Tip:** Exactly 10-15 words suggesting a specific pairing or habit.
            - **Empty States:** Use exactly [] for any field or array that contains no data.
            - **Strict Format:** Output ONLY valid JSON. No preamble, post-amble, or markdown code blocks.

            **Required JSON Format:**
            {
            "brief_summary": "A 2-3 sentence overview. Focus on the 'Net Positive' impact of the food and acknowledge benefits first.",
            "green_flags": [
                "✅ [Ingredient/Fact]: [3-4 line detail, 20-30 words] (or [])"
            ],
            "red_flags": [
                "🚩 [Ingredient/Fact]: [3-4 line detail, 20-30 words] (or [])"
            ],
            "shock_comparison": "[Shocking Indian comparison or []]",
            "better_alternative": [
                "[General Dietary Category]",
                "[Exact Specific Brand-Name Product]"
            ],
            "pro_tip": "💡 [10-15 words suggesting additions/habits].",
            "confidence_score": 100,
            "final_verdict": [
                { "is_good": true/false },
                "[🔴 NO | 🟡 CAUTION | 🟢 YES] - A supportive 1-2 line recommendation balancing reality with motivation."
            ]
            }
        `;

        const verdictResult = await model.generateContent([megaPrompt, imagePart]);
        const verdictResponse = await verdictResult.response;
        const jsonText = verdictResponse.text();

        // Cleanup file
        fs.unlinkSync(filePath);
        console.log(jsonText);

        const parsedResult = JSON.parse(jsonText);

        res.json({
            success: true,
            ...parsedResult
        });

    } catch (error) {
        console.error("Image Analysis Error:", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: "AI Analysis failed" });
    }
});

// --- ROUTE 2: Barcode Analysis (Text/JSON Payload) ---
router.post('/api/barcode', async (req, res) => {
    try {
        const { product_name, ingredients_text, nutriments, image_url, userGoals } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const productContext = `
            Product Name: ${product_name}
            Ingredients: ${ingredients_text || "Not available"}
            Nutritional Values (per 100g):
            - Sugar: ${nutriments?.sugars_100g || "N/A"}g
            - Salt: ${nutriments?.salt_100g || "N/A"}g
            - Protein: ${nutriments?.proteins_100g || "N/A"}g
            - Fat: ${nutriments?.fat_100g || "N/A"}g
            - Energy: ${nutriments?.energy_kcal_100g || "N/A"} kcal
        `;

        const userContext = `User Goals / Allergies: "${userGoals || "General healthy eating"}"`;

        const barcodePrompt = `
            **Role:** You are "Nutri-X," an intelligent food copilot optimized for barcode scanner data. Your mission is to parse productInfo objects and provide holistic health assessments that prioritize core nutritional value over minor processing imperfections.

            **Input Context:**
            You will process a productInfo object containing: product_name, ingredients_text, nutriments, and image_url.

            **Phase 1: Scanner Logic (Internal)**
            1. **The 80/20 Rule:** Prioritize major wins (e.g., high protein, whole grains) over minor flaws (e.g., lecithin, minor gums, or stabilizers). 
            2. **Dynamic Flagging:**
            - **Green Flags:** Highlight the "Net Positive" elements that align with user goals.
            - **Red Flags:** Treat minor additives as "Notes." Only highlight Red Flags if they pose a genuine health risk or significant goal conflict.
            - If the product is fundamentally nutritious, ensure Green Flags outnumber Red Flags.
            3. **Verdict Determination:** - **🟢 YES:** Assign this if the product is fundamentally nutritious (e.g., oats, muesli, protein bars) even if it has moderate sodium or sugar. "Yes" means "This is a good choice compared to average convenience food."
            - **🟡 CAUTION:**  Assign this ONLY if there is a direct conflict with the user's specific disease (e.g., Sugar for a Diabetic) or if the product poses a significant macro imbalance (e.g., very high fat with zero protein). Do not use this for general "processed food" nitpicking.
            - **🔴 NO:** Assign this for junk food, candy, or items that actively work against the user's goals.
            4. **Anonymity & Data:** Do not warn about "missing data" or "missing ingredients." If data is sparse, use your general knowledge to provide the most helpful, supportive estimate.

            **Phase 2: Output Constraints**
            - **Tone:** Simplistic, supportive peer-like tone. Avoid being alarmist.
            - **Flag Details:** Exactly 3-4 lines and 20-30 words per flag.
            - **Pro Tip:** Exactly 10-15 words total suggesting a specific habit.
            - **Indian Context:** For 🔴 NO items, include a short (max 5 words) Indian junk food comparison (e.g., "Saltier than Masala Fries"). 
            - **Empty States:** Use exactly [] for any field with no relevant data.
            - **Strict Format:** Output ONLY valid JSON. No preamble, post-amble, or markdown code blocks.

            **Required JSON Format:**
            {
            "brief_summary": "A 2-3 sentence overview focusing on the 'Net Positive' impact of the food.",
            "green_flags": [
                "✅ [Ingredient/Fact]: [3-4 line detail, 20-30 words] (or [])"
            ],
            "red_flags": [
                "🚩 [Ingredient/Fact]: [3-4 line detail, 20-30 words] (or [])"
            ],
            "shock_comparison": "[Short Indian comparison or []]",
            "better_alternative": [
                "[General Dietary Category]",
                "[Exact Specific Brand-Name Product]"
            ],
            "pro_tip": "💡 [10-15 words suggesting additions/habits].",
            "confidence_score": 100,
            "final_verdict": [
                { "is_good": true/false },
                "[🔴 NO | 🟡 CAUTION | 🟢 YES] - A supportive 1-2 line recommendation."
            ]
            }
        `;

        const result = await model.generateContent(barcodePrompt + "\n\n" + userContext + "\n\n" + productContext);
        const responseText = result.response.text();

        res.json({
            success: true,
            product_details: {
                name: product_name,
                image: image_url,
                ingredients: ingredients_text
            },
            analysis: JSON.parse(responseText)
        });

    } catch (error) {
        console.error("Barcode Analysis Failed:", error);
        res.status(500).json({ success: false, message: "AI Analysis failed" });
    }
});

// --- ROUTE 3: Comparison Mode (1v1 Battle) ---
router.post('/api/compare', upload.array('image', 2), async (req, res) => {
    const files = req.files;

    try {
        const { userGoals } = req.body;

        // 1. Validation
        if (!files || files.length < 2) {
            // Cleanup any single file that might have uploaded
            if (files) files.forEach(f => fs.unlinkSync(f.path));
            return res.status(400).json({ success: false, message: "Please upload 2 images to compare." });
        }

        // 2. Prepare Images for Gemini
        const imageParts = files.map(file => ({
            inlineData: {
                data: fs.readFileSync(file.path).toString("base64"),
                mimeType: file.mimetype,
            },
        }));

        // 3. Model Setup
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // 4. The "Versus" Prompt
        const comparePrompt = `
            **Role:** You are "Nutri-X Duel," a specialized AI food comparison engine. Your mission is to settle the "Battle of the Brands" by analyzing two sets of food data (ingredients and nutriments) and determining which is superior based strictly on the user's health profile.

            **User Profile:**
            - **Goals:** ${userGoals}

            **Phase 1: Duel Logic (Internal)**
            1. **Profiling:** Cross-reference both sets of data against the user's specific health goals and strict allergies. 
            2. **Vibe Check:** Assign a 1-3 word nickname to each product based on its primary nutritional impact (e.g., "Fiber Powerhouse" or "Sugar Trap").
            3. **The Score:** Rate each set 1-10 based on profile fit. (Note: A strict allergy match results in an automatic score of 0).
            4. **Trade-offs:** Identify the primary sacrifice (e.g., "Choose Product A for cleaner ingredients, but Product B for better macros").
            5. **Anonymity Rule:** Focus strictly on the provided data. Do not use, mention, or attempt to guess actual brand names. Refer only to "Product A" and "Product B."

            **Phase 2: Output Constraints**
            - **Tone:** Simplistic, engaging, and direct. Use "you" or "your profile."
            - **Pros/Cons Formatting:** Provide exactly 3 distinct strings for each. Each string must be short, crisp, and punchy.
            - **Pro Tip:** Exactly 10-15 words total suggesting a specific pairing or habit.
            - **Verdict Style:** A simple, punchy 1-line verdict. Strictly avoid color indicators (RED/YELLOW/GREEN), status words (NO/CAUTION/YES), emojis, or product names in the final verdict string.
            - **Strict Format:** Output ONLY valid JSON. No preamble, post-amble, or markdown code blocks.

            **Required JSON Format:**
            {
            "battle_intro": "A catchy 1-2 sentence hook comparing the two options for your profile.",
            "product_a": {
                "vibe_check": "[1-3 word nickname]",
                "health_score": [Integer 1-10],
                "pros": [
                "✅ [Short crisp benefit 1]",
                "✅ [Short crisp benefit 2]",
                "✅ [Short crisp benefit 3]"
                ],
                "cons": [
                "🚩 [Short crisp risk 1]",
                "🚩 [Short crisp risk 2]",
                "🚩 [Short crisp risk 3]"
                ]
            },
            "product_b": {
                "vibe_check": "[1-3 word nickname]",
                "health_score": [Integer 1-10],
                "pros": [
                "✅ [Short crisp benefit 1]",
                "✅ [Short crisp benefit 2]",
                "✅ [Short crisp benefit 3]"
                ],
                "cons": [
                "🚩 [Short crisp risk 1]",
                "🚩 [Short crisp risk 2]",
                "🚩 [Short crisp risk 3]"
                ]
            },
            "the_trade_off": "A simple 'if you choose Product A, you get [X] but lose [Y]' statement.",
            "hero_ingredient": "The single best ingredient found in the winning product.",
            "pro_tip": "💡 [10-15 words suggesting a specific pairing/habit].",
            "final_recommendation": [
                { "winner": "[Product A, Product B, or Neither]" },
                "A simple and punchy one-line final verdict statement comparing the two options."
            ]
            }
        `;

        // 5. Generate Comparison
        const result = await model.generateContent([comparePrompt, ...imageParts]);
        const responseText = result.response.text();

        // 6. Cleanup Files
        files.forEach(file => fs.unlinkSync(file.path));

        console.log(responseText);
        res.json({
            success: true,
            comparison: JSON.parse(responseText)
        });

    } catch (error) {
        console.error("Comparison Route Error:", error);
        // Cleanup on error
        if (files) files.forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
        res.status(500).json({ success: false, message: "Comparison failed" });
    }
});
module.exports = router;