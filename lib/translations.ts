export type Language = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'mr' | 'pa' | 'bn' | 'gu';

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const translations = {
    en: {
        title: "AgriSense AI",
        getStarted: "Get Started",
        chat: "Chat",
        analysis: "Analysis",
        newChat: "New Chat",
        thinking: "Thinking...",
        howCanIHelp: "How can I help you today?",
        chatDesc: "Ask me anything about crops, farming, soil, pests, irrigation, market prices, or government schemes.",
        footerWarning: "AgriSense AI can make mistakes. Verify important farming decisions with local experts.",

        // Landing Page
        heroTitle: "Smart Crop Recommendations",
        heroSubtitle: "Get AI-powered crop suggestions based on comprehensive soil, weather, and satellite data.",
        startAnalyzing: "Start Analyzing Your Farm",
        poweredBy: "Powered by RAG + LLM Technology",
        features: {
            dataIntegration: { title: "Data Integration", desc: "Combines soil, weather, and satellite data for accurate recommendations" },
            ragLlm: { title: "AI Powered", desc: "Uses scientific research and guides to provide evidence-based suggestions" },
            location: { title: "Localized Analysis", desc: "Get recommendations based on your exact field coordinates" },
            yield: { title: "Yield Predictions", desc: "AI-powered yield forecasts based on historical data" },
            sustainable: { title: "Sustainable Practices", desc: "Management practices aligned with global farming guidelines" },
            soil: { title: "Soil Analysis", desc: "Deep dive into soil health and composition" },
            weather: { title: "Weather Aware", desc: "Real-time and historical weather pattern analysis" },
            roi: { title: "ROI Forecast", desc: "Predict financial returns and investment efficiency" }
        },
        dataSources: {
            soil: "Soil Analysis",
            weather: "Weather Data",
            topography: "Topography",
            remote: "Remote Sensing"
        },
        howItWorks: {
            title: "How It Works",
            step1: { title: "Input Location", desc: "Provide your field coordinates or location details" },
            step2: { title: "AI Analysis", desc: "System analyzes multi-source data and research" },
            step3: { title: "Get Recommendations", desc: "Receive evidence-based suggestions with scores" }
        },
        cta: {
            title: "Ready to Optimize Your Crop Selection?",
            desc: "Join thousands of farmers making data-driven decisions",
            button: "Start Your Free Analysis"
        },

        // Analysis Form
        farmDetails: "Farm Details",
        location: "Location",
        landSize: "Land Size (acres)",
        budget: "Budget (₹)",
        soilType: "Soil Type",
        waterSource: "Water Source",
        season: "Season",
        prevCrop: "Previous Crop",
        generate: "Generate AI Recommendations",
        analyzing: "Analyzing Weather, Soil & Historical Data...",
        results: "Top Recommended Crops",

        // Results & Charts
        why: "Why this crop?",
        yield: "Yield",
        roi: "ROI",
        investment: "Investment",
        profit: "Profit",
        requirements: "Requirements",
        water: "Water",
        nitrogen: "Nitrogen",
        phosphorus: "Phosphorus",
        potassium: "Potassium",
        fertilizers: "Fertilizer Mix",
        alternatives: "Potential Alternatives",
        expertTip: "Expert Tip",
        askAi: "Ask AI",

        // Charts
        comparativeAnalytics: "Comparative Analytics",
        profitPotential: "Profit Potential",
        roiComparison: "ROI Comparison",
        npkRequirements: "NPK Requirements",
        waterReq: "Water Requirements",
        deepDive: "Deep Dive",
        resourceProfile: "Resource Profile",
        nutrientWaterRadar: "Nutrient & Water Requirements Radar",
        financialReport: "Financial Integrity Report",
        marketReturns: "Estimated market returns & resource allocation",

        // Placeholders & Selects
        selectSoil: "Select soil type...",
        selectWater: "Select water source...",
        selectSeason: "Select season...",
        locationPlaceholder: "e.g., Shivamogga, Karnataka",
        prevCropPlaceholder: "e.g., rice, wheat",
        alternativeDesc: "Crops sharing similar growth profiles",
        expertTipDesc: "These alternatives are resilient pivots if primary seeds are unavailable or market prices shift unfavorably.",
        financialDisclaimer: "These projections are synthesized from historical yield patterns and current commodity indexes. Actual results depends on localized climate variations and precision farming adherence.",
        dataReference: "Data Reference",
        dataReferenceDesc: "Powered by weather intelligence, AI reasoning, and historical crop performance records.",
        marginAnalysis: "Margin Analysis",
        crop: "Crop",
        year: "Year",
        area: "Area (ha)",
        production: "Production",
        rainfall: "Rainfall",
        soils: { black: "Black (Regur)", red: "Red Soil", alluvial: "Alluvial", sandy: "Sandy", laterite: "Laterite", clay: "Clay", loamy: "Loamy", sandyLoam: "Sandy Loam" },
        waterSources: { borewell: "Borewell", canal: "Canal Irrigation", rain: "Rain-fed Only", river: "River/Stream", drip: "Drip Irrigation", sprinkler: "Sprinkler", tank: "Tank/Pond" },
        seasonsList: { kharif: "Kharif (Jun–Oct)", rabi: "Rabi (Nov–Mar)", zaid: "Zaid/Summer (Mar–Jun)", year: "Year-round" },
        errorMessages: { location: "Location is required", landSize: "Enter a valid land size", budget: "Enter a valid budget", soil: "Select your soil type", water: "Select water source", season: "Select the planting season" },
        dashboard: {
            nextSteps: "Next Steps",
            monitoring: "Weather Monitoring",
            monitoringDesc: "Track weather forecasts and rainfall predictions. Plant timing is crucial for optimal performance. Subscribe to agricultural weather alerts.",
            disclaimerTitle: "Disclaimer",
            disclaimerDesc: "These recommendations combine real-time weather, historical agricultural data, and AI reasoning. Actual results may vary based on micro-climate, soil quality, pest management, and market prices. Consult local experts and get soil testing done before final decisions. Profit estimates are indicative, not guaranteed.",
            footerText: "Powered by AI & Historical Agricultural Data · AgriSense Intelligence Platform",
            actions: [
                { title: 'Soil Testing', desc: 'Get soil tested for NPK levels and pH balance.', steps: ['Contact local agri department', 'Collect samples from multiple spots', 'Wait 7-10 days for results'] },
                { title: 'Seed Procurement', desc: 'Source certified seeds from authorized dealers.', steps: ['Verify seed certification', 'Check germination rate (85%+)', 'Buy 10% extra for contingency'] },
                { title: 'Water Management', desc: 'Plan irrigation based on daily water requirements.', steps: ['Install drip irrigation', 'Check water table levels', 'Plan for monsoon/dry season'] },
                { title: 'Budget Planning', desc: 'Allocate funds for seeds, fertilizers, and labor.', steps: ['Keep 20% buffer for emergencies', 'Explore agricultural loans', 'Consider crop insurance'] }
            ]
        }
    },
    hi: {
        title: "AgriSense AI",
        getStarted: "शुरू करें",
        chat: "चैट",
        analysis: "विश्लेषण",
        newChat: "नई चैट",
        thinking: "सोच रहा है...",
        howCanIHelp: "मैं आज आपकी कैसे सहायता कर सकता हूँ?",
        chatDesc: "फसलों, खेती, मिट्टी, कीटों, सिंचाई, बाजार मूल्यों या सरकारी योजनाओं के बारे में मुझसे कुछ भी पूछें।",
        footerWarning: "AgriSense AI गलतियां कर सकता है। महत्वपूर्ण कृषि निर्णय स्थानीय विशेषज्ञों के साथ सत्यापित करें।",

        // Landing Page
        heroTitle: "स्मार्ट फसल अनुशंसा",
        heroSubtitle: "मिट्टी, मौसम और उपग्रह डेटा के आधार पर AI-संचालित फसल सुझाव प्राप्त करें।",
        startAnalyzing: "अपने खेत का विश्लेषण शुरू करें",
        poweredBy: "RAG + LLM तकनीक द्वारा संचालित",
        features: {
            dataIntegration: { title: "डेटा एकीकरण", desc: "सटीक अनुशंसाओं के लिए मिट्टी, मौसम और उपग्रह डेटा को जोड़ता है" },
            ragLlm: { title: "AI द्वारा संचालित", desc: "साक्ष्य-आधारित सुझाव प्रदान करने के लिए वैज्ञानिक शोध का उपयोग करता है" },
            location: { title: "स्थानीयकृत विश्लेषण", desc: "अपने खेत के सटीक निर्देशांक के आधार पर अनुशंसाएं प्राप्त करें" },
            yield: { title: "पैदावार की भविष्यवाणी", desc: "ऐतिहासिक डेटा के आधार पर AI-संचालित पैदावार पूर्वानुमान" },
            sustainable: { title: "स्थाई प्रथाएं", desc: "वैश्विक कृषि दिशानिर्देशों के अनुरूप प्रबंधन प्रथाएं" },
            soil: { title: "मिट्टी विश्लेषण", desc: "मिट्टी के स्वास्थ्य और संरचना का गहरा विश्लेषण" },
            weather: { title: "मौसम जागरूक", desc: "वास्तविक समय और ऐतिहासिक मौसम पैटर्न विश्लेषण" },
            roi: { title: "ROI पूर्वानुमान", desc: "वित्तीय लाभ और निवेश दक्षता का अनुमान लगाएं" }
        },
        dataSources: {
            soil: "मिट्टी का विश्लेषण",
            weather: "मौसम का डेटा",
            topography: "स्थलाकृति",
            remote: "रिमोट सेंसिंग"
        },
        howItWorks: {
            title: "यह कैसे काम करता है",
            step1: { title: "स्थान दर्ज करें", desc: "अपने खेत की जानकारी या स्थान का विवरण दें" },
            step2: { title: "AI विश्लेषण", desc: "प्रणाली बहु-स्रोत डेटा और शोध का विश्लेषण करती है" },
            step3: { title: "अनुशंसाएँ प्राप्त करें", desc: "स्कोर के साथ साक्ष्य-आधारित सुझाव प्राप्त करें" }
        },
        cta: {
            title: "अपनी फसल के चयन को अनुकूलित करने के लिए तैयार हैं?",
            desc: "डेटा-आधारित निर्णय लेने वाले हजारों किसानों से जुड़ें",
            button: "अपना निःशुल्क विश्लेषण शुरू करें"
        },

        // Analysis Form
        farmDetails: "खेत का विवरण",
        location: "स्थान",
        landSize: "भूमि का आकार (एकड़)",
        budget: "बजट (₹)",
        soilType: "मिट्टी का प्रकार",
        waterSource: "पानी का स्रोत",
        season: "सीजन",
        prevCrop: "पिछली फसल",
        generate: "AI अनुशंसाएँ प्राप्त करें",
        analyzing: "मौसम, मिट्टी और ऐतिहासिक डेटा का विश्लेषण कर रहा है...",
        results: "शीर्ष अनुशंसित फसलें",

        // Results & Charts
        why: "यह फसल क्यों?",
        yield: "पैदावार",
        roi: "लाभ",
        investment: "निवेश",
        profit: "मुनाफा",
        requirements: "आवश्यकताएं",
        water: "पानी",
        nitrogen: "नाइट्रोजन",
        phosphorus: "फास्फोरस",
        potassium: "पोटेशियम",
        fertilizers: "उर्वरक मिश्रण",
        alternatives: "संभावित विकल्प",
        expertTip: "विशेषज्ञ टिप",
        askAi: "AI से पूछें",

        // Charts
        comparativeAnalytics: "तुलनात्मक विश्लेषण",
        profitPotential: "मुनाफे की संभावना",
        roiComparison: "निवेश पर लाभ की तुलना",
        npkRequirements: "NPK आवश्यकताएं",
        waterReq: "पानी की आवश्यकताएं",
        deepDive: "गहन विश्लेषण",
        resourceProfile: "संसाधन रूपरेखा",
        nutrientWaterRadar: "पोषक तत्व और जल आवश्यकता रडार",
        financialReport: "वित्तीय अखंडता रिपोर्ट",
        marketReturns: "अनुमानित बाजार रिटर्न और संसाधन आवंटन",

        // Placeholders & Selects
        selectSoil: "मिट्टी का प्रकार चुनें...",
        selectWater: "पानी का स्रोत चुनें...",
        selectSeason: "सीजन चुनें...",
        locationPlaceholder: "जैसे: शिवमोगा, कर्नाटक",
        prevCropPlaceholder: "जैसे: चावल, गेहूं",
        alternativeDesc: "समान विकास प्रोफाइल वाली फसलें",
        expertTipDesc: "यदि प्राथमिक बीज उपलब्ध नहीं हैं या बाजार की कीमतें प्रतिकूल रूप से बदलती हैं, तो ये विकल्प लचीले होते हैं।",
        financialDisclaimer: "ये अनुमान ऐतिहासिक पैदावार पैटर्न और वर्तमान कमोडिटी इंडेक्स से संश्लेषित हैं। वास्तविक परिणाम स्थानीय जलवायु परिवर्तनों पर निर्भर करते हैं।",
        dataReference: "डेटा संदर्भ",
        dataReferenceDesc: "मौसम की जानकारी, AI तर्क और ऐतिहासिक फसल प्रदर्शन रिकॉर्ड द्वारा संचालित।",
        marginAnalysis: "मार्जिन विश्लेषण",
        crop: "फसल",
        year: "वर्ष",
        area: "क्षेत्र (हेक्टेयर)",
        production: "उत्पादन",
        rainfall: "वर्षा",
        soils: { black: "काली मिट्टी (रेगुर)", red: "लाल मिट्टी", alluvial: "जलोढ़ मिट्टी", sandy: "रेतीली मिट्टी", laterite: "लेटराइट मिट्टी", clay: "चिकनी मिट्टी", loamy: "दुमट मिट्टी", sandyLoam: "रेतीली दुमट" },
        waterSources: { borewell: "बोरवेल", canal: "नहर सिंचाई", rain: "केवल वर्षा आधारित", river: "नदी/धारा", drip: "ड्रिप सिंचाई", sprinkler: "स्प्रिंकलर", tank: "टैंक/तालाब" },
        seasonsList: { kharif: "खरीफ (जून-अक्टूबर)", rabi: "रबी (नवंबर-मार्च)", zaid: "जायद/गर्मी (मार्च-जून)", year: "साल भर" },
        errorMessages: { location: "स्थान आवश्यक है", landSize: "एक वैध भूमि आकार दर्ज करें", budget: "एक वैध बजट दर्ज करें", soil: "अपनी मिट्टी का प्रकार चुनें", water: "पानी का स्रोत चुनें", season: "रोपण का मौसम चुनें" },
        dashboard: {
            nextSteps: "अगले कदम",
            monitoring: "मौसम की निगरानी",
            monitoringDesc: "मौसम के पूर्वानुमान और वर्षा की भविष्यवाणियों को ट्रैक करें। फसल लगाने का समय महत्वपूर्ण है। कृषि मौसम अलर्ट की सदस्यता लें।",
            disclaimerTitle: "अस्वीकरण",
            disclaimerDesc: "ये अनुशंसाएं वास्तविक समय के मौसम, ऐतिहासिक कृषि डेटा और AI तर्क को जोड़ती हैं। वास्तविक परिणाम स्थानीय जलवायु, मिट्टी की गुणवत्ता, कीट प्रबंधन और बाजार की कीमतों के आधार पर भिन्न हो सकते हैं।",
            footerText: "AI और ऐतिहासिक कृषि डेटा द्वारा संचालित · AgriSense इंटेलिजेंस प्लेटफॉर्म",
            actions: [
                { title: 'मिट्टी परीक्षण', desc: 'NPK स्तर और pH संतुलन के लिए मिट्टी का परीक्षण करवाएं।', steps: ['स्थानीय कृषि विभाग से संपर्क करें', 'तैयारी करें', '7-10 दिनों तक प्रतीक्षा करें'] },
                { title: 'बीज खरीद', desc: 'अधिकृत डीलरों से प्रमाणित बीज प्राप्त करें।', steps: ['बीज प्रमाणन सत्यापित करें', 'अंकुरण दर की जांच करें', 'आकस्मिकता के लिए 10% अतिरिक्त खरीदें'] },
                { title: 'जल प्रबंधन', desc: 'दैनिक पानी की आवश्यकताओं के आधार पर सिंचाई की योजना बनाएं।', steps: ['ड्रिप सिंचाई स्थापित करें', 'जल स्तर की जांच करें', 'मानसून/शुष्क मौसम की योजना बनाएं'] },
                { title: 'बजट योजना', desc: 'बीज, उर्वरक और श्रम के लिए धन आवंटित करें।', steps: ['आपात स्थितियों के लिए 20% सुरक्षित रखें', 'कृषि ऋणों का पता लगाएं', 'फसल बीमा पर विचार करें'] }
            ]
        }
    },
    mr: {
        title: "AgriSense AI",
        getStarted: "सुरू करा",
        chat: "चॅट",
        analysis: "विश्लेषण",
        newChat: "नवीन चॅट",
        thinking: "विचार करत आहे...",
        howCanIHelp: "मी आज तुम्हाला कशी मदत करू शकतो?",
        chatDesc: "पिके, शेती, माती, कीड, सिंचन, बाजारभाव किंवा सरकारी योजनांबद्दल मला काहीही विचारा.",
        footerWarning: "AgriSense AI चुका करू शकते. महत्त्वाचे शेतीविषयक निर्णय स्थानिक तज्ञांकडून तपासून घ्या.",

        // Landing Page
        heroTitle: "स्मार्ट पीक शिफारस",
        heroSubtitle: "माती, हवामान आणि उपग्रह डेटावर आधारित AI-सक्षम पीक सूचना मिळवा.",
        startAnalyzing: "तुमच्या शेताचे विश्लेषण सुरू करा",
        poweredBy: "RAG + LLM तंत्रज्ञानाद्वारे समर्थित",
        features: {
            dataIntegration: { title: "डेटा एकत्रीकरण", desc: "अचूक शिफारसींसाठी माती, हवामान आणि उपग्रह डेटा एकत्र करते" },
            ragLlm: { title: "AI सक्षम", desc: "पुरावा-आधारित सूचना देण्यासाठी वैज्ञानिक संशोधन आणि मार्गदर्शकांचा वापर करते" },
            location: { title: "स्थानिक विश्लेषण", desc: "तुमच्या शेताच्या अचूक स्थानानुसार शिफारसी मिळवा" },
            yield: { title: "उत्पन्नाचा अंदाज", desc: "ऐतिहासिक डेटावर आधारित AI-सक्षम उत्पन्न अंदाज" },
            sustainable: { title: "शाश्वత పదద్ధती", desc: "जागतिक शेती मार्गदर्शक तत्त्वांनुसार व्यवस्थापन पद्धती" },
            soil: { title: "माती विश्लेषण", desc: "मातीचे आरोग्य आणि रचनेचे सखोल विश्लेषण" },
            weather: { title: "हवामान जागरूक", desc: "रिअल-टाइम आणि ऐतिहासिक हवामान नमुना विश्लेषण" },
            roi: { title: "ROI अंदाज", desc: "वित्तीय परतावा आणि गुंतवणूक कार्यक्षमतेचा अंदाज लावा" }
        },
        dataSources: {
            soil: "माती विश्लेषण",
            weather: "हवामान डेटा",
            topography: "भूरूपशास्त्र",
            remote: "रिमोट सेन्सिंग"
        },
        howItWorks: {
            title: "हे कसे कार्य करते",
            step1: { title: "स्थान नोंदवा", desc: "तुमच्या शेताचे स्थान किंवा तपशील द्या" },
            step2: { title: "AI विश्लेषण", desc: "प्रणाली विविध डेटा आणि संशोधनाचे विश्लेषण करते" },
            step3: { title: "शिफारसी मिळवा", desc: "स्कोरसह पुराव्यावर आधारित सूचना मिळवा" }
        },
        cta: {
            title: "तुमची पीक निवड सुधारण्यासाठी तयार आहात?",
            desc: "डेटा-आधारित निर्णय घेणाऱ्या हजारो शेतकऱ्यांशी जोडा",
            button: "तुमचे विनामूल्य विश्लेषण सुरू करा"
        },

        // Analysis Form
        farmDetails: "शेताचा तपशील",
        location: "स्थान",
        landSize: "जमिनीचा आकार (एकर)",
        budget: "बजेट (₹)",
        soilType: "मातीचा प्रकार",
        waterSource: "पाण्याचा स्रोत",
        season: "हंगाम",
        prevCrop: "मागील पीक",
        generate: "AI शिफारसी मिळवा",
        analyzing: "हवामान, माती आणि ऐतिहासिक डेटाचे विश्लेषण करत आहे...",
        results: "प्रमुख शिफारस केलेली पिके",

        // Results & Charts
        why: "हे पीक का?",
        yield: "उत्पन्न",
        roi: "परतावा",
        investment: "गुंतवणूक",
        profit: "नफा",
        requirements: "आवश्यकता",
        water: "पाणी",
        nitrogen: "नत्र",
        phosphorus: "स्फुरद",
        potassium: "पालाश",
        fertilizers: "खत मिश्रण",
        alternatives: "संभाव्य पर्याय",
        expertTip: "तज्ज्ञ सल्ला",
        askAi: "AI ला विचारा",

        // Charts
        comparativeAnalytics: "तुलनात्मक विश्लेषण",
        profitPotential: "नफ्याची क्षमता",
        roiComparison: "परताव्याची तुलना",
        npkRequirements: "NPK आवश्यकता",
        waterReq: "पाण्याची आवश्यकता",
        deepDive: "सखोल विश्लेषण",
        resourceProfile: "संसाधन प्रोफाइल",
        nutrientWaterRadar: "पोषक तत्व आणि पाणी आवश्यकता रडार",
        financialReport: "वित्तीय अहवाल",
        marketReturns: "अंदाजे बाजार परतावा आणि संसाधन वाटप",

        // Placeholders & Selects
        selectSoil: "मातीचा प्रकार निवडा...",
        selectWater: "पाण्याचा स्रोत निवडा...",
        selectSeason: "हंगाम निवडा...",
        locationPlaceholder: "उदा. कोल्हापूर, महाराष्ट्र",
        prevCropPlaceholder: "उदा. भात, गहू",
        alternativeDesc: "समान वाढ प्रोफाइल असलेली पिके",
        expertTipDesc: "जर प्राथमिक बियाणे उपलब्ध नसतील किंवा बाजारभाव प्रतिकूलपणे बदलले असतील तर हे पर्याय लवचिक आहेत.",
        financialDisclaimer: "हे अंदाज ऐतिहासिक उत्पन्न नमुने आणि वर्तमान कमोडिटी निर्देशांकातून तयार केले आहेत. वास्तविक परिणाम हवामानावर अवलंबून असतात.",
        dataReference: "डेटा संदर्भ",
        dataReferenceDesc: "हवामान बुद्धिमत्ता, AI तर्क आणि ऐतिहासिक पीक कामगिरी रेकॉर्डद्वारे समर्थित.",
        marginAnalysis: "मार्जिन विश्लेषण",
        crop: "पीक",
        year: "वर्ष",
        area: "क्षेत्र (हेक्टर)",
        production: "उत्पादन",
        rainfall: "पाऊस",
        soils: { black: "काळी माती (रेगूर)", red: "लाल माती", alluvial: "गाळाची माती", sandy: "रेताड माती", laterite: "लॅटरॅइट माती", clay: "चिकण माती", loamy: "लोमी माती", sandyLoam: "रेताड लोमी" },
        waterSources: { borewell: "बोअरवेल", canal: "कालवा", rain: "केवळ पावसावर आधारित", river: "नदी/ओढा", drip: "ठिबक सिंचन", sprinkler: "तुषार सिंचन", tank: "तलाव" },
        seasonsList: { kharif: "खरीप (जून-ऑक्टोबर)", rabi: "रब्बी (नोव्हेंबर-मार्च)", zaid: "उन्हाळी (मार्च-जून)", year: "वर्षभर" },
        errorMessages: { location: "स्थान आवश्यक आहे", landSize: "योग्य जमिनीचा आकार प्रविष्ट करा", budget: "योग्य बजेट प्रविष्ट करा", soil: "मातीचा प्रकार निवडा", water: "पाण्याचा स्रोत निवडा", season: "हंगाम निवडा" },
        dashboard: {
            nextSteps: "पुढील पावले",
            monitoring: "हवामान निरीक्षण",
            monitoringDesc: "हवामान अंदाज आणि पावसाच्या अंदाजाचा मागोवा घ्या. पेरणीची वेळ अत्यंत महत्त्वाची आहे. हवामान सूचनांचे सदस्य बना.",
            disclaimerTitle: "अस्वीकरण",
            disclaimerDesc: "या शिफारसी रिअल-टाइम हवामान आणि AI तर्क एकत्रित करतात. प्रत्यक्ष परिणाम स्थानिक हवामान आणि मातीवर अवलंबून असतात.",
            footerText: "AI आणि ऐतिहासिक कृषि डेटाद्वारे समर्थित · AgriSense इंटेलिजेंस प्लॅटफॉर्म",
            actions: [
                { title: 'माती परीक्षण', desc: 'NPK आणि pH साठी मातीची तपासणी करा.', steps: ['कृषी विभागाशी संपर्क साधा', 'नमुने गोळा करा', '७-१० दिवस प्रतीक्षा करा'] },
                { title: 'बियाणे खरेदी', desc: 'प्रमाणित बियाणे मिळवा.', steps: ['प्रमाणपत्राची पडताळणी करा', 'उगवण क्षमतेची तपासणी करा', '१०% जादा खरेदी करा'] },
                { title: 'पाणी नियोजन', desc: 'पाण्याच्या आवश्यकतेनुसार सिंचन करा.', steps: ['ठिबक सिंचन बसवा', 'जल पातळी तपासा', 'पावसाळ्याचे नियोजन करा'] },
                { title: 'आर्थिक नियोजन', desc: 'बियाणे आणि खतांसाठी तरतूद करा.', steps: ['२०% राखीव ठेवा', 'कृषी कर्जे पहा', 'पीक विमा उतरवा'] }
            ]
        }
    },
    te: {
        title: "AgriSense AI",
        getStarted: "ప్రారంభించండి",
        chat: "చాట్",
        analysis: "విశ్లేషణ",
        newChat: "కొత్త చాట్",
        thinking: "ఆలోచిస్తోంది...",
        howCanIHelp: "నేను ఈరోజు మీకు ఎలా సహాయపడగలను?",
        chatDesc: "పంటలు, వ్యవసాయం, నేల, తెగుళ్లు, నీటిపారుదల, మార్కెట్ ధరలు లేదా ప్రభుత్వ పథకాల గురించి నన్ను ఏదైనా అడగండి.",
        footerWarning: "AgriSense AI తప్పులు చేయవచ్చు. ముఖ్యమైన వ్యవసాయ నిర్ణయాలను స్థానిక నిపుణులతో ధృవీకరించుకోండి.",

        // Landing Page
        heroTitle: "స్మార్ట్ పంట సిఫార్సులు",
        heroSubtitle: "నేల, వాతావరణం మరియు శాటిలైట్ డేటా ఆధారంగా AI-ఆధారిత పంట సూచనలను పొందండి.",
        startAnalyzing: "మీ పొలం విశ్లేషణను ప్రారంభించండి",
        poweredBy: "RAG + LLM టెక్నాలజీతో పనిచేస్తుంది",
        features: {
            dataIntegration: { title: "డేటా ఇంటిగ్రేషన్", desc: "ఖచ్చితమైన సిఫార్సుల కోసం నేల, వాతావరణం మరియు శాటిలైట్ డేటాను మిళితం చేస్తుంది" },
            ragLlm: { title: "AI పవర్డ్", desc: "శాస్త్రీయ పరిశోధన మరియు మార్గదర్శకాలను ఉపయోగించి సూచనలను అందిస్తుంది" },
            location: { title: "స్థానికీకరించిన విశ్లేషణ", desc: "మీ పొలం యొక్క ఖచ్చితమైన ప్రాంతం ఆధారంగా సిఫార్సులను పొందండి" },
            yield: { title: "దిగుబడి అంచనాలు", desc: "చారిత్రక డేటా ఆధారంగా AI-ఆధారిత దిగుబడి అంచనాలు" },
            sustainable: { title: "స్థిరమైన పద్ధతులు", desc: "ప్రపంచ వ్యవసాయ మార్గదర్శకాలకు అనుగుణంగా నిర్వహణ పద్ధతులు" },
            soil: { title: "నేల విశ్లేషణ", desc: "నేల ఆరోగ్యం మరియు కూర్పుపై లోతైన విశ్లేషణ" },
            weather: { title: "వాతావరణ స్పృహ", desc: "రియల్ టైమ్ మరియు చారిత్రక వాతావరణ సరళి విశ్లేషణ" },
            roi: { title: "ROI అంచనా", desc: "ఆర్థిక రాబడి మరియు పెట్టుబడి సామర్థ్యాన్ని అంచనా వేయండి" }
        },
        dataSources: {
            soil: "నేల విశ్లేషణ",
            weather: "వాతావరణ డేటా",
            topography: "టోపోగ్రఫీ",
            remote: "రిమోట్ సెన్సింగ్"
        },
        howItWorks: {
            title: "ఇది ఎలా పనిచేస్తుంది",
            step1: { title: "ప్రాంతాన్ని నమోదు చేయండి", desc: "మీ పొలం స్థానం లేదా వివరాలను అందించండి" },
            step2: { title: "AI విశ్లేషణ", desc: "సిస్టమ్ డేటా మరియు పరిశోధనను విశ్లేషిస్తుంది" },
            step3: { title: "సిఫార్సులను పొందండి", desc: "స్కోర్‌లతో కూడిన సూచనలను పొందండి" }
        },
        cta: {
            title: "మీ పంట ఎంపికను మెరుగుపరచుకోవడానికి సిద్ధంగా ఉన్నారా?",
            desc: "డేటా ఆధారిత నిర్ణయాలు తీసుకుంటున్న వేలాది మంది రైతులతో చేరండి",
            button: "మీ ఉచిత విశ్లేషణను ప్రారంభించండి"
        },

        // Analysis Form
        farmDetails: "పొలం వివరాలు",
        location: "ప్రాంతం",
        landSize: "పొలం విస్తీర్ణం (ఎకరాలు)",
        budget: "బడ్జెట్ (₹)",
        soilType: "నేల రకం",
        waterSource: "నీటి వనరు",
        season: "సీజన్",
        prevCrop: "మునుపటి పంట",
        generate: "AI సిఫార్సులను పొందండి",
        analyzing: "వాతావరణం, నేల మరియు చారిత్రక డేటాను విశ్లేషిస్తోంది...",
        results: "సిఫార్సు చేయబడిన పంటలు",

        // Results & Charts
        why: "ఈ పంట ఎందుకు?",
        yield: "దిగుబడి",
        roi: "ROI",
        investment: "పెట్టుబడి",
        profit: "లాభం",
        requirements: "అవసరాలు",
        water: "నీరు",
        nitrogen: "నైట్రోజన్",
        phosphorus: "ఫాస్పరస్",
        potassium: "పొటాషియం",
        fertilizers: "ఎరువుల మిశ్రమం",
        alternatives: "ప్రత్యామ్నాయ పంటలు",
        expertTip: "నిపుణుల సలహా",
        askAi: "AIని అడగండి",

        // Charts
        comparativeAnalytics: "తులనాత్మక విశ్లేషణ",
        profitPotential: "లాభాల అవకాశం",
        roiComparison: "ROI పోలిక",
        npkRequirements: "NPK అవసరాలు",
        waterReq: "నీటి అవసరాలు",
        deepDive: "లోతైన విశ్లేషణ",
        resourceProfile: "వనరుల ప్రొఫైల్",
        nutrientWaterRadar: "పోషకాలు మరియు నీటి అవసరాల రాడార్",
        financialReport: "ఆర్థిక నివేదిక",
        marketReturns: "అంచనా వేసిన మార్కెట్ రాబడి మరియు వనరుల కేటాయింపు",

        // Placeholders & Selects
        selectSoil: "నేల రకాన్ని ఎంచుకోండి...",
        selectWater: "నీటి వనరును ఎంచుకోండి...",
        selectSeason: "సీజన్‌ను ఎంచుకోండి...",
        locationPlaceholder: "ఉదా: శివమొగ్గ, కర్ణాటక",
        prevCropPlaceholder: "ఉదా: వరి, గోధుమ",
        alternativeDesc: "సమానమైన వృద్ధి ప్రొఫైల్‌లను పంచుకునే పంటలు",
        expertTipDesc: "ప్రాథమిక విత్తనాలు అందుబాటులో లేకపోయినా లేదా మార్కెట్ ధరలు ప్రతికూలంగా మారినా ఈ ప్రత్యామ్నాయాలు ఉపయోగపడతాయి.",
        financialDisclaimer: "ఈ అంచనాలు చారిత్రక దిగుబడి నమూనాలు మరియు ప్రస్తుత వస్తువుల సూచీల నుండి సంశ్లేషణ చేయబడ్డాయి. వాస్తవ ఫలితాలు వాతావరణంపై ఆధారపడి ఉంటాయి.",
        dataReference: "డేటా రిఫరెన్స్",
        dataReferenceDesc: "వాతావరణ మేధస్సు, AI తర్కం మరియు చారిత్రక పంట పనితీరు రికార్డుల ద్వారా ఆధారితం.",
        marginAnalysis: "మార్జిన్ విశ్లేషణ",
        crop: "పంట",
        year: "సంవత్సరం",
        area: "విస్తీర్ణం (హెక్టార్లు)",
        production: "ఉత్పత్తి",
        rainfall: "వర్షపాతం",
        soils: { black: "నల్ల రేగడి నేల", red: "ఎర్ర నేల", alluvial: "ఒండ్రు నేల", sandy: "ఇసుక నేల", laterite: "లాటరైట్ నేల", clay: "జిగురు నేల", loamy: "లోమి నేల", sandyLoam: "ఇసుక లోమి" },
        waterSources: { borewell: "బోరుబావి", canal: "కాలువ నీటిపారుదల", rain: "వర్షాధారం మాత్రమే", river: "నది/వాగు", drip: "బిందు సేద్యం", sprinkler: "స్ప్రింక్లర్", tank: "చెరువు/కుంట" },
        seasonsList: { kharif: "ఖరీఫ్ (జూన్-అక్టోబర్)", rabi: "రబీ (నవంబర్-మార్చి)", zaid: "జైద్/వేసవి (మార్చి-జూన్)", year: "ఏడాది పొడవునా" },
        errorMessages: { location: "ప్రాంతం అవసరం", landSize: "సరైన పొలం విస్తీర్ణం నమోదు చేయండి", budget: "సరైన బడ్జెట్ నమోదు చేయండి", soil: "నేల రకాన్ని ఎంచుకోండి", water: "నీటి వనరును ఎంచుకోండి", season: "సీజన్‌ను ఎంచుకోండి" },
        dashboard: {
            nextSteps: "తదుపరి దశలు",
            monitoring: "వాతావరణ పర్యవేక్షణ",
            monitoringDesc: "వాతావరణ ముందస్తు అంచనాలను ట్రాక్ చేయండి. విత్తడం సమయం చాలా ముఖ్యం.",
            disclaimerTitle: "నిరాకరణ",
            disclaimerDesc: "ఈ సిఫార్సులు నిజ-సమయ వాతావరణం మరియు AI విశ్లేషణను కలుపుతాయి. అసలు ఫలితాలు మారవచ్చు.",
            footerText: "AI మరియు చారిత్రక వ్యవసాయ డేటా ద్వారా ఆధారితం · AgriSense ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్",
            actions: [
                { title: 'నేల పరీక్ష', desc: 'NPK స్థాయిల కోసం నేల పరీక్ష చేయించుకోండి.', steps: ['స్థానిక వ్యవసాయ శాఖను సంప్రదించండి', 'నమూనాలు సేకరించండి', '7-10 రోజులు వేచి ఉండండి'] },
                { title: 'విత్తనాల సేకరణ', desc: 'అధికృత డీలర్ల నుండి విత్తనాలు తీసుకోండి.', steps: ['ధృవీకరణను తనిఖీ చేయండి', 'మొలకల సామర్థ్యం చూడండి', '10% అదనంగా కొనండి'] },
                { title: 'నీటి నిర్వహణ', desc: 'నీటి అవసరాల ఆధారంగా ప్రణాళిక వేయండి.', steps: ['బిందు సేద్యం ఏర్పాటు చేసుకోండి', 'నీటి నిల్వ చూడండి', 'వర్షాకాలం కోసం సిద్ధమవ్వండి'] },
                { title: 'బడ్జెట్ ప్రణాళిక', desc: 'విత్తనాలు, ఎరువుల కోసం నిధులు కేటాయించండి.', steps: ['20% అత్యవసర నిధి ఉంచండి', 'వ్యవసాయ రుణాలు చూడండి', 'పంట బీమా తీసుకోండి'] }
            ]
        }
    },
    bn: {
        title: "AgriSense AI",
        getStarted: "শুরু করুন",
        chat: "চ্যাট",
        analysis: "বিশ্লেষণ",
        newChat: "নতুন চ্যাট",
        thinking: "চিন্তা করছে...",
        howCanIHelp: "আমি আজ আপনাকে কীভাবে সাহায্য করতে পারি?",
        chatDesc: "ফসল, চাষাবাদ, মাটি, পোকা, সেচ, বাজারদর বা সরকারী প্রকল্প সম্পর্কে আমাকে যেকোনো কিছু জিজ্ঞাসা করুন।",
        footerWarning: "AgriSense AI ভুল করতে পারে। গুরুত্বপূর্ণ চাষের সিদ্ধান্ত স্থানীয় বিশেষজ্ঞদের সাথে যাচাই করুন।",

        // Landing Page
        heroTitle: "স্মার্ট ফসল সুপারিশ",
        heroSubtitle: "মাটি, আবহাওয়া এবং উপগ্রহ ডেটার উপর ভিত্তি করে AI-চালিত ফসলের পরামর্শ পান।",
        startAnalyzing: "আপনার খামারের বিশ্লেষণ শুরু করুন",
        poweredBy: "RAG + LLM প্রযুক্তি দ্বারা চালিত",
        features: {
            dataIntegration: { title: "ডেটা ইন্টিগ্রেশন", desc: "সঠিক সুপারিশের জন্য মাটি, আবহাওয়া এবং উপগ্রহ ডেটা একত্রিত করে" },
            ragLlm: { title: "AI চালিত", desc: "তথ্য-ভিত্তিক পরামর্শ দেওয়ার জন্য বৈজ্ঞানিক গবেষণা এবং নির্দেশিকা ব্যবহার করে" },
            location: { title: "স্থানীয় বিশ্লেষণ", desc: "আপনার খামারের সঠিক অবস্থানের ভিত্তিতে সুপারিশ পান" },
            yield: { title: "ফলন পূর্বাভাস", desc: "ঐতিহাসিক ডেটার ভিত্তিতে AI-চালিত ফলন পূর্বাভাস" },
            sustainable: { title: "টেকসই অনুশীলন", desc: "বিশ্বব্যাপী চাষের নির্দেশিকা অনুযায়ী ব্যবস্থাপনা অনুশীলন" },
            soil: { title: "মাটি বিশ্লেষণ", desc: "মাটির স্বাস্থ্য এবং গঠন সম্পর্কে বিস্তারিত বিশ্লেষণ" },
            weather: { title: "আবহাওয়া সচেতন", desc: "রিয়েল-টাইম এবং ঐতিহাসিক আবহাওয়ার ধরণ বিশ্লেষণ" },
            roi: { title: "ROI পূর্বাভাস", desc: "আর্থিক রিটার্ন এবং বিনিয়োগ দক্ষতার পূর্বাভাস দিন" }
        },
        dataSources: {
            soil: "মাটি বিশ্লেষণ",
            weather: "আবহাওয়া ডেটা",
            topography: "ভূসংস্থান",
            remote: "রিমোট সেন্সিং"
        },
        howItWorks: {
            title: "এটি যেভাবে কাজ করে",
            step1: { title: "স্থান লিখুন", desc: "আপনার খামারের অবস্থান বা বিবরণ দিন" },
            step2: { title: "AI বিশ্লেষণ", desc: "সিস্টেম বিভিন্ন ডেটা এবং গবেষণা বিশ্লেষণ করে" },
            step3: { title: "সুপারিশ পান", desc: "স্কোর সহ তথ্য-ভিত্তিক পরামর্শ পান" }
        },
        cta: {
            title: "আপনার ফসল নির্বাচন উন্নত করতে প্রস্তুত?",
            desc: "ডেটা-চালিত সিদ্ধান্ত নেওয়া হাজার হাজার কৃষকের সাথে যোগ দিন",
            button: "আপনার বিনামূল্যে বিশ্লেষণ শুরু করুন"
        },

        // Analysis Form
        farmDetails: "খামারের বিবরণ",
        location: "স্থান",
        landSize: "জমির আকার (একর)",
        budget: "বাজেট (₹)",
        soilType: "মাটির ধরন",
        waterSource: "জলের উৎস",
        season: "ঋতু",
        prevCrop: "পূর্ববর্তী ফসল",
        generate: "AI সুপারিশ পান",
        analyzing: "আবহাওয়া, মাটি এবং ঐতিহাসিক ডেটা বিশ্লেষণ করা হচ্ছে...",
        results: "সেরা সুপারিশকৃত ফসল",

        // Results & Charts
        why: "এই ফসল কেন?",
        yield: "ফলন",
        roi: "লাভের হার",
        investment: "বিনিয়োগ",
        profit: "মুনাফা",
        requirements: "প্রয়োজনীয়তা",
        water: "জল",
        nitrogen: "নাইট্রোজেন",
        phosphorus: "ফসফরাস",
        potassium: "পটাশিয়াম",
        fertilizers: "সার মিশ্রণ",
        alternatives: "সম্ভাব্য বিকল্প",
        expertTip: "বিশেষজ্ঞের পরামর্শ",
        askAi: "AI কে জিজ্ঞাসা করুন",

        // Charts
        comparativeAnalytics: "তুলনামূলক বিশ্লেষণ",
        profitPotential: "মুনাফার সম্ভাবনা",
        roiComparison: "লভ্যাংশ তুলনা",
        npkRequirements: "NPK প্রয়োজনীয়তা",
        waterReq: "জলের প্রয়োজনীয়তা",
        deepDive: "বিস্তারিত বিশ্লেষণ",
        resourceProfile: "সম্পদ প্রোফাইল",
        nutrientWaterRadar: "পুষ্টি এবং জল প্রয়োজন রাডার",
        financialReport: "আর্থিক প্রতিবেদন",
        marketReturns: "আনুমানিক বাজার রিটার্ন এবং সম্পদ বরাদ্দ",

        // Placeholders & Selects
        selectSoil: "মাটির ধরন নির্বাচন করুন...",
        selectWater: "জলের উৎস নির্বাচন করুন...",
        selectSeason: "ঋতু নির্বাচন করুন...",
        locationPlaceholder: "যেমন: বীরভূম, পশ্চিমবঙ্গ",
        prevCropPlaceholder: "যেমন: ধান, গম",
        alternativeDesc: "অনুরূপ বৃদ্ধি সম্পন্ন ফসল",
        expertTipDesc: "প্রাথমিক বীজ উপলব্ধ না থাকলে বা বাজার দর প্রতিকূল হলে এই বিকল্পগুলি অত্যন্ত কার্যকর।",
        financialDisclaimer: "এই অনুমানগুলি ঐতিহাসিক ফলন এবং বর্তমান বাজার সূচকের উপর ভিত্তি করে তৈরি করা হয়েছে। প্রকৃত ফলাফল স্থানীয় আবহাওয়ার উপর নির্ভর করে।",
        dataReference: "ডেটা রেফারেন্স",
        dataReferenceDesc: "আবহাওয়া তথ্য, AI যুক্তি এবং ঐতিহাসিক ফসলের রেকর্ডের সমন্বয়ে তৈরি।",
        marginAnalysis: "মার্জিন বিশ্লেষণ",
        crop: "ফসল",
        year: "বছর",
        area: "এলাকা (হেক্টর)",
        production: "উৎপাদন",
        rainfall: "বৃষ্টিপাত",
        soils: { black: "কালো মাটি", red: "লাল মাটি", alluvial: "পলি মাটি", sandy: "বেলে মাটি", laterite: "ল্যাটেরাইট মাটি", clay: "এঁটেল মাটি", loamy: "দোআঁশ মাটি", sandyLoam: "বেলে দোআঁশ" },
        waterSources: { borewell: "বোরওয়েল", canal: "খাল সেচ", rain: "শুধুমাত্র বৃষ্টি নির্ভর", river: "নদী/নালা", drip: "ড্রিপ সেচ", sprinkler: "স্প্রিঙ্কলার", tank: "পুকুর" },
        seasonsList: { kharif: "খরিফ (জুন-অক্টোবর)", rabi: "রবি (নভেম্বর-মার্চ)", zaid: "জায়েদ/গ্রীষ্ম (মার্চ-জুন)", year: "সারা বছর" },
        errorMessages: { location: "স্থান প্রয়োজন", landSize: "সঠিক জমির আকার লিখুন", budget: "সঠিক বাজেট লিখুন", soil: "মাটির ধরন নির্বাচন করুন", water: "জলের উৎস নির্বাচন করুন", season: "ঋতু নির্বাচন করুন" },
        dashboard: {
            nextSteps: "পরবর্তী পদক্ষেপ",
            monitoring: "আবহাওয়া পর্যবেক্ষণ",
            monitoringDesc: "আবহাওয়ার পূর্বাভাস ট্র্যাক করুন। রোপণের সময় অত্যন্ত গুরুত্বপূর্ণ।",
            disclaimerTitle: "দাবিত্যাগ",
            disclaimerDesc: "এই সুপারিশগুলি রিয়েল-টাইম আবহাওয়া এবং AI যুক্তিকে একত্রিত করে। প্রকৃত ফলাফল ভিন্ন হতে পারে।",
            footerText: "AI এবং ঐতিহাসিক কৃষি তথ্য দ্বারা চালিত · AgriSense ইন্টেলিজেন্স প্ল্যাটফর্ম",
            actions: [
                { title: 'মাটি পরীক্ষা', desc: 'NPK স্তরের জন্য মাটি পরীক্ষা করান।', steps: ['স্থানীয় কৃষি দপ্তরে যোগাযোগ করুন', 'নমুনা সংগ্রহ করুন', '৭-১০ দিন অপেক্ষা করুন'] },
                { title: 'বীজ সংগ্রহ', desc: 'অনুমোদিত ডিলারদের কাছ থেকে বীজ সংগ্রহ করুন।', steps: ['সার্টিফিকেশন যাচাই করুন', 'অঙ্কুরোদগম পরীক্ষা করুন', '১০% অতিরিক্ত কিনুন'] },
                { title: 'জল ব্যবস্থাপনা', desc: 'জলের প্রয়োজনের ভিত্তিতে সেচ পরিকল্পনা করুন।', steps: ['ড্রিপ সেচ স্থাপন করুন', 'জলের স্তর পরীক্ষা করুন', 'বর্ষার পরিকল্পনা করুন'] },
                { title: 'বাজেট পরিকল্পনা', desc: 'বীজ, সার এবং শ্রমের জন্য বরাদ্দ করুন।', steps: ['২০% আপদকালীন রাখুন', 'কৃষি ঋণ দেখুন', 'বীমা বিবেচনা করুন'] }
            ]
        }
    },
    ta: {
        title: "AgriSense AI",
        getStarted: "தொடங்கவும்",
        chat: "அரட்டை",
        analysis: "பகுப்பாய்வு",
        newChat: "புதிய அரட்டை",
        thinking: "சிந்திக்கிறது...",
        howCanIHelp: "நான் இன்று உங்களுக்கு எப்படி உதவ முடியும்?",
        chatDesc: "பயிர்கள், விவசாயம், மண், பூச்சிகள், நீர்ப்பாசனம், சந்தை விலைகள் அல்லது அரசு திட்டங்கள் பற்றி என்னிடம் எதையும் கேளுங்கள்.",
        footerWarning: "AgriSense AI தவறுகளைச் செய்யக்கூடும். முக்கியமான விவசாய முடிவுகளை உள்ளூர் நிபுணர்களுடன் சரிபார்க்கவும்.",

        // Landing Page
        heroTitle: "ஸ்மார்ட் பயிர் பரிந்துரைகள்",
        heroSubtitle: "மண், வானிலை மற்றும் செயற்கைக்கோள் தரவுகளின் அடிப்படையில் AI-இயங்கும் பயிர் ஆலோசனைகளைப் பெறுங்கள்.",
        startAnalyzing: "உங்கள் பண்ணையை பகுப்பாய்வு செய்யத் தொடங்குங்கள்",
        poweredBy: "RAG + LLM தொழில்நுட்பத்தால் இயக்கப்படுகிறது",
        features: {
            dataIntegration: { title: "தரவு ஒருங்கிணைப்பு", desc: "துல்லியமான பரிந்துரைகளுக்கு மண், வானிலை மற்றும் செயற்கைக்கோள் தரவை இணைக்கிறது" },
            ragLlm: { title: "AI ஆற்றல்", desc: "அறிவியல் ஆராய்ச்சி மற்றும் வழிகாட்டிகளைப் பயன்படுத்தி ஆலோசனைகளை வழங்குகிறது" },
            location: { title: "உள்ளூர்மயமாக்கப்பட்ட பகுப்பாய்வு", desc: "உங்கள் பண்ணையின் சரியான இருப்பிடத்தின் அடிப்படையில் பரிந்துரைகளைப் பெறுங்கள்" },
            yield: { title: "விளைச்சல் கணிப்புகள்", desc: "வரலாற்று தரவுகளின் அடிப்படையில் AI-இயங்கும் விளைச்சல் கணிப்புகள்" },
            sustainable: { title: "நிலையான நடைமுறைகள்", desc: "உலகளாவிய விவசாய வழிகாட்டுதல்களின்படி மேலாண்மை நடைமுறைகள்" },
            soil: { title: "மண் பகுப்பாய்வு", desc: "மண் ஆரோக்கியம் மற்றும் கலவை பற்றிய ஆழமான பகுப்பாய்வு" },
            weather: { title: "வானிலை விழிப்புணர்வு", desc: "நிகழ்நேர மற்றும் வரலாற்று வானிலை முறை பகுப்பாய்வு" },
            roi: { title: "ROI கணிப்பு", desc: "நிதி வருவாய் மற்றும் முதலீட்டு திறனைக் கணித்தல்" }
        },
        dataSources: {
            soil: "மண் பகுப்பாய்வு",
            weather: "வானிலை தரவு",
            topography: "நிலப்பரப்பு",
            remote: "தொலை உணர்வு"
        },
        howItWorks: {
            title: "இது எப்படி வேலை செய்கிறது",
            step1: { title: "இருப்பிடத்தை உள்ளிடவும்", desc: "உங்கள் பண்ணை இருப்பிடம் அல்லது விவரங்களை வழங்கவும்" },
            step2: { title: "AI பகுப்பாய்வு", desc: "கணினி பல்வேறு தரவு மற்றும் ஆராய்ச்சிகளை பகுப்பாய்வு செய்கிறது" },
            step3: { title: "பரிந்துரைகளைப் பெறுங்கள்", desc: "மதிப்பெண்களுடன் கூடிய ஆலோசனைகளைப் பெறுங்கள்" }
        },
        cta: {
            title: "உங்கள் பயிர் தேர்வை மேம்படுத்த தயாரா?",
            desc: "தரவு அடிப்படையிலான முடிவுகளை எடுக்கும் ஆயிரக்கணக்கான விவசாயிகளுடன் இணையுங்கள்",
            button: "உங்கள் இலவச பகுப்பாய்வைத் தொடங்குங்கள்"
        },

        // Analysis Form
        farmDetails: "பண்ணை விவரங்கள்",
        location: "இருப்பிடம்",
        landSize: "நிலத்தின் அளவு (ஏக்கர்)",
        budget: "பட்ஜெட் (₹)",
        soilType: "மண் வகை",
        waterSource: "நீர் ஆதாரம்",
        season: "பருவம்",
        prevCrop: "முந்தைய பயிர்",
        generate: "AI பரிந்துரைகளை உருவாக்கு",
        analyzing: "வானிலை, மண் மற்றும் வரலாற்று தரவுகளை பகுப்பாய்வு செய்கிறது...",
        results: "சிறந்த பரிந்துரைக்கப்பட்ட பயிர்கள்",

        // Results & Charts
        why: "ஏன் இந்தப் பயிர்?",
        yield: "விளைச்சல்",
        roi: "முதலீட்டின் லாபம்",
        investment: "முதலீடு",
        profit: "லாபம்",
        requirements: "தேவைகள்",
        water: "தண்ணீர்",
        nitrogen: "நைட்ரஜன்",
        phosphorus: "பாஸ்பரஸ்",
        potassium: "பொட்டாசியம்",
        fertilizers: "உரக் கலவை",
        alternatives: "மாற்று பயிர்கள்",
        expertTip: "நிபுணர் குறிப்பு",
        askAi: "AI-யிடம் கேளுங்கள்",

        // Charts
        comparativeAnalytics: "ஒப்பீட்டு பகுப்பாய்வு",
        profitPotential: "லாப வாய்ப்பு",
        roiComparison: "முதலீட்டு லாப ஒப்பீடு",
        npkRequirements: "NPK தேவைகள்",
        waterReq: "நீர் தேவைகள்",
        deepDive: "விரிவான பகுப்பாய்வு",
        resourceProfile: "வள விவரக்குறிப்பு",
        nutrientWaterRadar: "ஊட்டச்சத்து மற்றும் நீர் தேவை ரேடார்",
        financialReport: "நிதி அறிக்கை",
        marketReturns: "மதிப்பிடப்பட்ட சந்தை வருவாய் மற்றும் வள ஒதுக்கீடு",

        // Placeholders & Selects
        selectSoil: "மண் வகையைத் தேர்ந்தெடுக்கவும்...",
        selectWater: "நீர் ஆதாரத்தைத் தேர்ந்தெடுக்கவும்...",
        selectSeason: "பருவத்தைத் தேர்ந்தெடுக்கவும்...",
        locationPlaceholder: "உதாரணம்: மதுரை, தமிழ்நாடு",
        prevCropPlaceholder: "உதாரணம்: நெல், கோதுமை",
        alternativeDesc: "ஒரே மாதிரியான வளர்ச்சி சுயவிவரங்களைக் கொண்ட பயிர்கள்",
        expertTipDesc: "முதன்மையான விதைகள் கிடைக்கவில்லை என்றாலோ அல்லது சந்தை விலைகள் மாறினாலோ இந்த மாற்றுகள் சிறந்த தீர்வாகும்.",
        financialDisclaimer: "இந்த கணிப்புகள் வரலாற்று விளைச்சல் வடிவங்கள் மற்றும் தற்போதைய சந்தை குறியீடுகளிலிருந்து தொகுக்கப்பட்டுள்ளன. உண்மையான முடிவுகள் வானிலையைப் பொறுத்தது.",
        dataReference: "தரவு குறிப்பு",
        dataReferenceDesc: "வானிலை நுண்ணறிவு, AI பகுத்தறிவு மற்றும் வரலாற்று பயிர் செயல்திறன் பதிவுகளால் இயக்கப்படுகிறது.",
        marginAnalysis: "லாப வரம்பு பகுப்பாய்வு",
        crop: "பயிர்",
        year: "ஆண்டு",
        area: "பரப்பளவு (ஹெக்டேர்)",
        production: "உற்பத்தி",
        rainfall: "மழைப்பொழிவு",
        soils: { black: "கரிசல் மண்", red: "செம்மண்", alluvial: "வண்டல் மண்", sandy: "மணல் மண்", laterite: "சரளை மண்", clay: "களிமண்", loamy: "வண்டல் மண்", sandyLoam: "மணல் வண்டல்" },
        waterSources: { borewell: "ஆழ்துளை கிணறு", canal: "கால்வாய் பாசனம்", rain: "மழை பெய்யும் நிலம்", river: "ஆறு/ஓடை", drip: "சொட்டு நீர் பாசனம்", sprinkler: "தெளிப்பான்", tank: "குளம்/ஏரி" },
        seasonsList: { kharif: "காரிஃப் (சூன்-அக்டோபர்)", rabi: "ரபி (நவம்பர்-மார்ச்)", zaid: "சையத்/கோடை (மார்ச்-சூன்)", year: "ஆண்டு முழுவதும்" },
        errorMessages: { location: "இருப்பிடம் தேவை", landSize: "சரியான நில அளவை உள்ளிடவும்", budget: "சரியான பட்ஜெட்டை உள்ளிடவும்", soil: "மண் வகையைத் தேர்ந்தெடுக்கவும்", water: "நீர் ஆதாரத்தைத் தேர்ந்தெடுக்கவும்", season: "பருவத்தைத் தேர்ந்தெடுக்கவும்" },
        dashboard: {
            nextSteps: "அடுத்த படிகள்",
            monitoring: "வானிலை கண்காணிப்பு",
            monitoringDesc: "வானிலை முன்னறிவிப்புகளைக் கண்காணிக்கவும். நடவு நேரம் மிகவும் முக்கியமானது.",
            disclaimerTitle: "நிபந்தனைகள்",
            disclaimerDesc: "இந்த பரிந்துரைகள் நிகழ்நேர வானிலை மற்றும் AI பகுத்தறிவை இணைக்கின்றன. முடிவுகள் மாறுபடலாம்.",
            footerText: "AI மற்றும் வரலாற்று விவசாயத் தரவுகளால் இயக்கப்படுகிறது · AgriSense புலனாய்வுத் தளம்",
            actions: [
                { title: 'மண் பரிசோதனை', desc: 'மண்ணின் தரத்தை ஆராயுங்கள்.', steps: ['வேளாண் துறையை அணுகவும்', 'மாதிரிகளை சேகரிக்கவும்', '7-10 நாட்கள் காத்திருக்கவும்'] },
                { title: 'விதை கொள்முதல்', desc: 'அங்கீகரிக்கப்பட்ட விற்பனையாளர்களிடம் வாங்கவும்.', steps: ['சான்றிதழை சரிபார்க்கவும்', 'முளைப்புத் திறனைப் பார்க்கவும்', '10% கூடுதலாக வாங்கவும்'] },
                { title: 'நீர் மேலாண்மை', desc: 'நீர் தேவையின் அடிப்படையில் திட்டமிடவும்.', steps: ['சொட்டு நீர் பாசனம் அமைக்கவும்', 'நீர் மட்டத்தை சரிபார்க்கவும்', 'பருவமழைக்கு திட்டமிடவும்'] },
                { title: 'பட்ஜெட் திட்டமிடல்', desc: 'விதை, உரங்களுக்கு நிதியை ஒதுக்கவும்.', steps: ['20% இருப்பு வைக்கவும்', 'விவசாயக் கடன்களைப் பார்க்கவும்', 'காப்பீடு செய்யவும்'] }
            ]
        }
    },
    gu: {
        title: "AgriSense AI",
        getStarted: "શરૂ કરો",
        chat: "ચેટ",
        analysis: "વિશ્લેષણ",
        newChat: "નવી ચેટ",
        thinking: "વિચારી રહ્યું છે...",
        howCanIHelp: "હું આજે તમને કેવી રીતે મદદ કરી શકું?",
        chatDesc: "પાક, ખેતી, જમીન, જંતુઓ, સિંચાઈ, બજારના ભાવ અથવા સરકારી યોજનાઓ વિશે મને ગમે તે પૂછો.",
        footerWarning: "AgriSense AI ભૂલો કરી શકે છે. મહત્વપૂર્ણ ખેતીના નિર્ણયો સ્થાનિક નિષ્ણાતો સાથે ચકાસો.",

        // Landing Page
        heroTitle: "સ્માર્ટ પાક ભલામણો",
        heroSubtitle: "જમીન, હવામાન અને સેટેલાઇટ ડેટાના આધારે AI-સંચાલિત પાક સૂચનો મેળવો.",
        startAnalyzing: "તમારા ખેતરનું વિશ્લેષણ શરૂ કરો",
        poweredBy: "RAG + LLM ટેકનોલોજી દ્વારા સંચાલિત",
        features: {
            dataIntegration: { title: "ડેટા એકીકરણ", desc: "ચોક્કસ ભલામણો માટે જમીન, હવામાન અને સેટેલાઇટ ડેટાને જોડે છે" },
            ragLlm: { title: "AI સંચાલિત", desc: "સાક્ષ્ય-આધારિત સૂચનો આપવા માટે વૈજ્ઞાનિક સંશોધન અને માર્ગદર્શિકાઓનો ઉપયોગ કરે છે" },
            location: { title: "સ્થાનિક વિશ્લેષણ", desc: "તમારા ખેતરના ચોક્કસ સ્થાનના આધારે ભલામણો મેળવો" },
            yield: { title: "ઉત્પાદન અનુમાન", desc: "ઐતિહાસિક ડેટાના આધારે AI-સંચાલિત ઉત્પાદન આગાહી" },
            sustainable: { title: "ટકાઉ પદ્ધતિઓ", desc: "વૈશ્વિક ખેતી માર્ગદર્શિકા મુજબ વ્યવસ્થાપન પદ્ધતિઓ" },
            soil: { title: "જમીન વિશ્લેષણ", desc: "જમીનના સ્વાસ્થ્ય અને બંધારણનું ઊંડું વિશ્લેષણ" },
            weather: { title: "હવામાન જાગૃત", desc: "રીઅલ-ટાઇમ અને ઐતિહાસિક હવામાન પેટર્ન વિશ્લેષણ" },
            roi: { title: "ROI અનુમાન", desc: "નાણાકીય વળતર અને રોકાણ કાર્યક્ષમતાનું અનુમાન કરો" }
        },
        dataSources: {
            soil: "જમીન વિશ્લેષણ",
            weather: "હવામાન ડેટા",
            topography: "સ્થલાકૃતિ",
            remote: "રિમોટ સેન્સિંગ"
        },
        howItWorks: {
            title: "તે કેવી રીતે કાર્ય કરે છે",
            step1: { title: "સ્થાન દાખલ કરો", desc: "તમારા ખેતરનું સ્થાન અથવા વિગતો આપો" },
            step2: { title: "AI વિશ્લેષણ", desc: "સિસ્ટમ વિવિધ ડેટા અને સંશોધનનું વિશ્લેષણ કરે છે" },
            step3: { title: "ભલામણો મેળવો", desc: "સ્કોર્સ સાથે પુરાવા-આધારિત સૂચનો મેળવો" }
        },
        cta: {
            title: "તમારા પાકની પસંદગી સુધારવા માટે તૈયાર છો?",
            desc: "ડેટા-આધારિત નિર્ણયો લેતા હજારો ખેડૂતો સાથે જોડાઓ",
            button: "તમારું મફત વિશ્લેષણ શરૂ કરો"
        },

        // Analysis Form
        farmDetails: "ખેતરની વિગત",
        location: "સ્થાન",
        landSize: "જમીનનું માપ (એકર)",
        budget: "બજેટ (₹)",
        soilType: "જમીનનો પ્રકાર",
        waterSource: "પાણીનો સ્ત્રોત",
        season: "સીઝન",
        prevCrop: "અગાઉનો પાક",
        generate: "AI ભલામણો મેળવો",
        analyzing: "હવામાન, જમીન અને ઐતિહાસિક ડેટાનું વિશ્લેષણ કરી રહ્યું છે...",
        results: "ટોચના ભલામણ કરેલ પાક",

        // Results & Charts
        why: "આ પાક શા માટે?",
        yield: "ઉત્પાદન",
        roi: "વળતર",
        investment: "રોકાણ",
        profit: "નફો",
        requirements: "જરૂરિયાતો",
        water: "પાણી",
        nitrogen: "નાઇટ્રોજન",
        phosphorus: "ફોસ્ફરસ",
        potassium: "પોટેશિયમ",
        fertilizers: "ખાતર મિશ્રણ",
        alternatives: "સંભવિત વિકલ્પો",
        expertTip: "નિષ્ણાત ટિપ",
        askAi: "AI ને પૂછો",

        // Charts
        comparativeAnalytics: "તુલનાત્મક વિશ્લેષણ",
        profitPotential: "નફાની ક્ષમતા",
        roiComparison: "વળતરની તુલના",
        npkRequirements: "NPK જરૂરિયાતો",
        waterReq: "પાણીની જરૂરિયાતો",
        deepDive: "ઊંડાણપૂર્વક વિશ્લેષણ",
        resourceProfile: "સંસાધન પ્રોફાઇલ",
        nutrientWaterRadar: "પોષક તત્વો અને પાણીની જરૂરિયાત રડાર",
        financialReport: "નાણાકીય અહેવાલ",
        marketReturns: "અંદાજિત માર્કેટ રિટર્ન અને સંસાધન ફાળવણી",

        // Placeholders & Selects
        selectSoil: "જમીનનો પ્રકાર પસંદ કરો...",
        selectWater: "પાણીનો સ્ત્રોત પસંદ કરો...",
        selectSeason: "સીઝન પસંદ કરો...",
        locationPlaceholder: "દા.ત. આણંદ, ગુજરાત",
        prevCropPlaceholder: "દા.ત. ડાંગર, ઘઉં",
        alternativeDesc: "સમાન વૃદ્ધિ પ્રોફાઇલ ધરાવતા પાક",
        expertTipDesc: "જો પ્રાથમિક બિયારણ ઉપલબ્ધ ન હોય અથવા બજારના ભાવમાં પ્રતિકૂળ ફેરફાર થાય તો આ વિકલ્પો ઉપયોગી છે.",
        financialDisclaimer: "આ અંદાજો ઐતિહાસિક ઉત્પાદન પેટર્ન અને વર્તમાન કોમોડિટી ઇન્ડેક્સમાંથી તૈયાર કરવામાં આવ્યા છે. વાસ્તવિક પરિણામો હવામાન પર આધારિત છે.",
        dataReference: "ડેટા સંદર્ભ",
        dataReferenceDesc: "હવામાન બુદ્ધિ, AI તર્ક અને ઐતિહાસિક પાક પ્રદર્શન રેકોર્ડ દ્વારા સંચાલિત.",
        marginAnalysis: "માર્જિન વિશ્લેષણ",
        crop: "પાક",
        year: "વર્ષ",
        area: "વિસ્તાર (હેક્ટર)",
        production: "ઉત્પાદન",
        rainfall: "વરસાદ",
        soils: { black: "કાળી જમીન", red: "લાલ જમીન", alluvial: "કાંપની જમીન", sandy: "રેતાળ જમીન", laterite: "લેટેરાઈટ જમીન", clay: "ચીકણી જમીન", loamy: "ગોરાડુ જમીન", sandyLoam: "રેતાળ ગોરાડુ" },
        waterSources: { borewell: "બોરવેલ", canal: "નહેર સિંચાઈ", rain: "માત્ર વરસાદ આધારિત", river: "નદી/ઝરણું", drip: "ટપક સિંચાઈ", sprinkler: "ફુવારા પદ્ધતિ", tank: "તળાવ" },
        seasonsList: { kharif: "ખરીફ (જૂન-ઓક્ટોબર)", rabi: "રવી (નવેમ્બર-માર્ચ)", zaid: "જાયદ/ઉનાળુ (માર્ચ-જૂન)", year: "આખું વર્ષ" },
        errorMessages: { location: "સ્થાન જરૂરી છે", landSize: "યોગ્ય જમીન માપ દાખલ કરો", budget: "યોગ્ય બજેટ દાખલ કરો", soil: "જમીનનો પ્રકાર પસંદ કરો", water: "પાણીનો સ્ત્રોત પસંદ કરો", season: "સીઝન પસંદ કરો" },
        dashboard: {
            nextSteps: "આગામી પગલાં",
            monitoring: "હવામાન નિરીક્ષણ",
            monitoringDesc: "હવામાન આગાહી ટ્રૅક કરો. વાવેતરનો સમય મહત્વપૂર્ણ છે.",
            disclaimerTitle: "ડિસક્લેમર",
            disclaimerDesc: "આ ભલામણો હવામાન અને AI તર્કને જોડે છે. વાસ્તવિક પરિણામો અલગ હોઈ શકે છે.",
            footerText: "AI અને ઐતિહાસિક કૃષિ ડેટા દ્વારા સંચાલિત · AgriSense ઇન્ટેલિજન્સ પ્લેટફોર્મ",
            actions: [
                { title: 'જમીન પરીક્ષણ', desc: 'જમીનનું પરીક્ષણ કરાવો.', steps: ['કૃષિ વિભાગનો સંપર્ક કરો', 'નમૂના લો', '૭-૧૦ દિવસ રાહ જુઓ'] },
                { title: 'બિયારણ ખરીદી', desc: 'પ્રમાણિત બિયારણ મેળવો.', steps: ['પ્રમાણપત્ર ચકાસો', 'ઉગાવાની ક્ષમતા જુઓ', '૧૦% વધારાનું ખરીદો'] },
                { title: 'જળ વ્યવસ્થાપન', desc: 'જરૂરિયાત મુજબ આયોજન કરો.', steps: ['ટપક સિંચાઈ લગાવો', 'જળ સ્તર તપાસો', 'ચોમાસાનું આયોજન કરો'] },
                { title: 'બજેટ આયોજન', desc: 'ખર્ચનું આયોજન કરો.', steps: ['૨૦% અનામત રાખો', 'કૃષિ લોન તપાસો', 'પાક વીમો લો'] }
            ]
        }
    },
    kn: {
        title: "AgriSense AI",
        getStarted: "ಪ್ರಾರಂಭಿಸಿ",
        chat: "ಚಾಟ್",
        analysis: "ವಿಶ್ಲೇಷಣೆ",
        newChat: "ಹೊಸ ಚಾಟ್",
        thinking: "ಯೋಚಿಸುತ್ತಿದೆ...",
        howCanIHelp: "ನಾನು ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
        chatDesc: "ಬೆಳೆಗಳು, ಕೃಷಿ, ಮಣ್ಣು, ಕೀಟಗಳು, ನೀರಾವರಿ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ನನಗೆ ಯಾವುದನ್ನಾದರೂ ಕೇಳಿ.",
        footerWarning: "AgriSense AI ತಪ್ಪುಗಳನ್ನು ಮಾಡಬಹುದು. ಪ್ರಮುಖ ಕೃಷಿ ನಿರ್ಧಾರಗಳನ್ನು ಸ್ಥಳೀಯ ತಜ್ಞರೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.",

        // Landing Page
        heroTitle: "ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಶಿಫಾರಸುಗಳು",
        heroSubtitle: "ಮಣ್ಣು, ಹವಾಮಾನ ಮತ್ತು ಉಪಗ್ರಹ ಡೇಟಾ ಆಧಾರಿತ AI ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
        startAnalyzing: "ನಿಮ್ಮ ಜಮೀನಿನ ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ",
        poweredBy: "RAG + LLM ತಂತ್ರಜ್ಞಾನದಿಂದ ನಡೆಸಲ್ಪಡುತ್ತದೆ",
        features: {
            dataIntegration: { title: "ಡೇಟಾ ಏಕೀಕರಣ", desc: "ನಿಖರವಾದ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ಮಣ್ಣು, ಹವಾಮಾನ ಮತ್ತು ಉಪಗ್ರಹ ಡೇಟಾವನ್ನು ಸಂಯೋಜಿಸುತ್ತದೆ" },
            ragLlm: { title: "AI ಚಾಲಿತ", desc: "ಸಲಹೆಗಳನ್ನು ನೀಡಲು ವೈಜ್ಞಾನಿಕ ಸಂಶೋಧನೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ಬಳಸುತ್ತದೆ" },
            location: { title: "ಸ್ಥಳೀಯ ವಿಶ್ಲೇಷಣೆ", desc: "ನಿಮ್ಮ ಜಮೀನಿನ ನಿಖರವಾದ ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ" },
            yield: { title: "ಇಳುವರಿ ಮುನ್ಸೂಚನೆ", desc: "ಹಳೆಯ ಡೇಟಾ ಆಧಾರಿತ AI ಇಳುವರಿ ಮುನ್ಸೂಚನೆಗಳು" },
            sustainable: { title: "ಸುಸ್ಥಿರ ಪದ್ಧತಿಗಳು", desc: "ಜಾಗತಿಕ ಕೃಷಿ ಮಾರ್ಗಸೂಚಿಗಳ ಪ್ರಕಾರ ನಿರ್ವಹಣಾ ಪದ್ಧತಿಗಳು" },
            soil: { title: "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ", desc: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಸಂಯೋಜನೆಯ ಬಗ್ಗೆ ಆಳವಾದ ವಿಶ್ಲೇಷಣೆ" },
            weather: { title: "ಹವಾಮಾನ ಅರಿವು", desc: "ನೈಜ-ಸಮಯ ಮತ್ತು ಐತಿಹಾಸಿಕ ಹವಾಮಾನ ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ" },
            roi: { title: "ROI ಮುನ್ಸೂಚನೆ", desc: "ಹಣಕಾಸಿನ ಆದಾಯ ಮತ್ತು ಹೂಡಿಕೆಯ ದಕ್ಷತೆಯನ್ನು ಊಹಿಸಿ" }
        },
        dataSources: {
            soil: "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ",
            weather: "ಹವಾಮಾನ ಡೇಟಾ",
            topography: "ಭೂರೂಪಶಾಸ್ತ್ರ",
            remote: "ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್"
        },
        howItWorks: {
            title: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
            step1: { title: "ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ", desc: "ನಿಮ್ಮ ಜಮೀನಿನ ಸ್ಥಳ ಅಥವಾ ವಿವರಗಳನ್ನು ನೀಡಿ" },
            step2: { title: "AI ವಿಶ್ಲೇಷಣೆ", desc: "ವ್ಯವಸ್ಥೆಯು ವಿವಿಧ ಡೇಟಾ ಮತ್ತು ಸಂಶೋಧನೆಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ" },
            step3: { title: "ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ", desc: "ಸ್ಕೋರ್‌ಗಳೊಂದಿಗೆ ಆಧಾರಿತ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ" }
        },
        cta: {
            title: "ನಿಮ್ಮ ಬೆಳೆ ಆಯ್ಕೆಯನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
            desc: "ಡೇಟಾ ಆಧಾರಿತ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುವ ಸಾವಿರಾರು ರೈತರನ್ನು ಸೇರಿ",
            button: "ನಿಮ್ಮ ಉಚಿತ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ"
        },

        // Analysis Form
        farmDetails: "ಜಮೀನಿನ ವಿವರಗಳು",
        location: "ಸ್ಥಳ",
        landSize: "ಜಮೀನಿನ ಗಾತ್ರ (ಎಕರೆ)",
        budget: "ಬಜೆಟ್ (₹)",
        soilType: "ಮಣ್ಣಿನ ವಿಧ",
        waterSource: "ನೀರಿನ ಮೂಲ",
        season: "ಋತು",
        prevCrop: "ಹಿಂದಿನ ಬೆಳೆ",
        generate: "AI ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ",
        analyzing: "ಹವಾಮಾನ, ಮಣ್ಣು ಮತ್ತು ಹಳೆಯ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        results: "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು",

        // Results & Charts
        why: "ಈ ಬೆಳೆ ಏಕೆ?",
        yield: "ಇಳುವರಿ",
        roi: "ಲಾಭದ ಪ್ರಮಾಣ",
        investment: "ಹೂಡಿಕೆ",
        profit: "ಲಾಭ",
        requirements: "ಅಗತ್ಯತೆಗಳು",
        water: "ನೀರು",
        nitrogen: "ಸಾರಜನಕ",
        phosphorus: "ರಂಜಕ",
        potassium: "ಪೊಟ್ಯಾಸಿಯಮ್",
        fertilizers: "ಗೊಬ್ಬರದ ಮಿಶ್ರಣ",
        alternatives: "ಪರ್ಯಾಯ ಬೆಳೆಗಳು",
        expertTip: "ತಜ್ಞರ ಸಲಹೆ",
        askAi: "AI ಗೆ ಕೇಳಿ",

        // Charts
        comparativeAnalytics: "ತೌಲನಿಕ ವಿಶ್ಲೇಷಣೆ",
        profitPotential: "ಲಾಭದ ಸಾಮರ್ಥ್ಯ",
        roiComparison: "ROI ಹೋಲಿಕೆ",
        npkRequirements: "NPK ಅಗತ್ಯತೆಗಳು",
        waterReq: "ನೀರಿನ ಅಗತ್ಯತೆಗಳು",
        deepDive: "ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ",
        resourceProfile: "ಸಂಪನ್ಮೂಲ ವಿವರ",
        nutrientWaterRadar: "ಪೋಷಕಾಂಶ ಮತ್ತು ನೀರಿನ ಅಗತ್ಯತೆ ರಾಡಾರ್",
        financialReport: "ಹಣಕಾಸು ವರದಿ",
        marketReturns: "ಅಂದಾಜು ಮಾರುಕಟ್ಟೆ ಆದಾಯ ಮತ್ತು ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ",

        // Placeholders & Selects
        selectSoil: "ಮಣ್ಣಿನ ವಿಧ ಆಯ್ಕೆಮಾಡಿ...",
        selectWater: "ನೀರಿನ ಮೂಲ ಆಯ್ಕೆಮಾಡಿ...",
        selectSeason: "ಋತು ಆಯ್ಕೆಮಾಡಿ...",
        locationPlaceholder: "ಉದಾ: ಶಿವಮೊಗ್ಗ, ಕರ್ನಾಟಕ",
        prevCropPlaceholder: "ಉದಾ: ಭತ್ತ, ಗೋಧಿ",
        alternativeDesc: "ಸಮಾನ ಬೆಳವಣಿಗೆಯ ಪ್ರೊಫೈಲ್ ಹೊಂದಿರುವ ಬೆಳೆಗಳು",
        expertTipDesc: "ಪ್ರಾಥಮಿಕ ಬೀಜಗಳು ಲಭ್ಯವಿಲ್ಲದಿದ್ದರೆ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಬದಲಾದರೆ ಈ ಪರ್ಯಾಯಗಳು ಉಪಯುಕ್ತವಾಗಿವೆ.",
        financialDisclaimer: "ಈ ಅಂದಾಜುಗಳು ಹಳೆಯ ಇಳುವರಿ ಮಾದರಿಗಳು ಮತ್ತು ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಸೂಚ್ಯಂಕಗಳಿಂದ ಪಡೆದವುಗಳಾಗಿವೆ. ವಾಸ್ತವ ಫಲಿತಾಂಶಗಳು ಹವಾಮಾನದ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿವೆ.",
        dataReference: "ಡೇಟಾ ಲೇಖನ",
        dataReferenceDesc: "ಹವಾಮಾನ ಬುದ್ಧಿವಂತಿಕೆ, AI ತರ್ಕ ಮತ್ತು ಹಳೆಯ ಬೆಳೆ ಕಾರ್ಯಕ್ಷಮತೆಯ ದಾಖಲೆಗಳಿಂದ ನಡೆಸಲ್ಪಡುತ್ತದೆ.",
        marginAnalysis: "ಲಾಭಾಂಶ ವಿಶ್ಲೇಷಣೆ",
        crop: "ಬೆಳೆ",
        year: "ವರ್ಷ",
        area: "ಪ್ರದೇಶ (ಹೆಕ್ಟೇರ್)",
        production: "ಉತ್ಪಾದನೆ",
        rainfall: "ಮಳೆ",
        soils: { black: "ಕಪ್ಪು ಮಣ್ಣು", red: "ಕೆಂಪು ಮಣ್ಣು", alluvial: "ಎರಡು ಮಣ್ಣು", sandy: "ಮರಳು ಮಣ್ಣು", laterite: "ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು", clay: "ಜಿಗುಟು ಮಣ್ಣು", loamy: "ಲೋಮಿ ಮಣ್ಣು", sandyLoam: "ಮರಳು ಲೋಮಿ" },
        waterSources: { borewell: "ಕೊಳವೆ ಬಾವಿ", canal: "ಕಾಲುವೆ ನೀರಾವರಿ", rain: "ಮಳೆ ಆಧಾರಿತ ಮಾತ್ರ", river: "ನದಿ/ಹಳ್ಳ", drip: "ಹನಿ ನೀರಾವರಿ", sprinkler: "ತುಂತುರು ನೀರಾವರಿ", tank: "ಕೆರೆ/ಕುಂಟೆ" },
        seasonsList: { kharif: "ಖಾರೀಫ್ (ಜೂನ್-ಅಕ್ಟೋಬರ್)", rabi: "ರಬಿ (ನವೆમ્ਬਰ-ಮಾರ್ಚ್)", zaid: "ಜೈದ್/ಬೇಸಿಗೆ (ಮಾರ್ಚ್-ಜೂನ್)", year: "ವರ್ಷವಿಡೀ" },
        errorMessages: { location: "ಸ್ಥಳ ಅಗತ್ಯವಿದೆ", landSize: "ಸರಿಯಾದ ಜಮೀನಿನ ಗಾತ್ರ ನಮೂದಿಸಿ", budget: "ಸರಿಯಾದ ಬಜೆಟ್ ನಮೂದಿಸಿ", soil: "ಮಣ್ಣಿನ ವಿಧ ಆಯ್ಕೆಮಾಡಿ", water: "ನೀರಿನ ಮೂಲ ಆಯ್ಕೆಮಾಡಿ", season: "ಋತು ಆಯ್ಕೆಮಾಡಿ" },
        dashboard: {
            nextSteps: "ಮುಂದಿನ ಹಂತಗಳು",
            monitoring: "ಹವಾಮಾನ ಮೇಲ್విಚಾರಣೆ",
            monitoringDesc: "ಹವಾಮಾನ ಮುన్ಸೂಚನೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಬಿತ್ತನೆ ಸಮಯ ಬಹಳ ಮುಖ್ಯ.",
            disclaimerTitle: "ಹಕ್ಕುತ್ಯಾಗ",
            disclaimerDesc: "ಈ ಶಿಫਾਰಸುಗಳು ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ಮತ್ತು AI ತರ್ಕವನ್ನು ಸಂಯೋಜಿಸುತ್ತವೆ.",
            footerText: "AI ಮತ್ತು ಐತಿಹಾಸಿಕ ಕೃಷಿ ಡೇಟಾದಿಂದ ನಡೆಸಲ್ಪಡುತ್ತದೆ · AgriSense ಇಂಟೆಲಿಜೆನ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
            actions: [
                { title: 'ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ', desc: 'ಮಣ್ಣಿನ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಿಸಿ.', steps: ['ಕೃಷಿ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ', 'ಮಾದರಿಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ', '7-10 ದಿನ ಕಾಯಿರಿ'] },
                { title: 'ಬೀಜ ಖರೀದಿ', desc: 'ಅಧಿಕೃತ ವಿತರಕರಿಂದ ಬೀಜ ಪಡೆಯಿರಿ.', steps: ['ದೃಢీಕರಣ ಪರೀಕ್ಷಿಸಿ', 'ಮೊಳಕೆ ಪ್ರಮಾಣ ನೋಡಿ', '10% ಹೆಚ್ಚುವರಿ ಖರೀದಿಸಿ'] },
                { title: 'ನೀರಿನ ನಿರ್ವಹಣೆ', desc: 'ನೀರಿನ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಯೋಜಿಸಿ.', steps: ['ಹನಿ ನೀರಾವರಿ ಅಳವಡಿಸಿ', 'ನೀರಿನ ಮಟ್ಟ ನೋಡಿ', 'ಮಳೆಗಾಲಕ್ಕೆ ಯೋಜಿಸಿ'] },
                { title: 'ಬಜೆಟ್ ಯೋಜನೆ', desc: 'ಹಣಕาสಿನ ವ್ಯವಸ್ಥೆ ಮಾಡಿ.', steps: ['20% ಮೀಸಲಿಡಿ', 'ಕೃಷಿ ಸಾಲ ನೋಡಿ', 'ಬೆಳೆ ವಿಮೆ ಮಾಡಿ'] }
            ]
        }
    },
    pa: {
        title: "AgriSense AI",
        getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
        chat: "ਚੈਟ",
        analysis: "ਵਿਸ਼ਲੇਸ਼ਣ",
        newChat: "ਨਵੀਂ ਚੈਟ",
        thinking: "ਸੋਚ ਰਿਹਾ ਹੈ...",
        howCanIHelp: "ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
        chatDesc: "ਫਸਲਾਂ, ਖੇਤੀਬਾੜੀ, ਮਿੱਟੀ, ਕੀੜੇ, ਸਿੰਚਾਈ, ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ ਜਾਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
        footerWarning: "AgriSense AI ਗਲਤੀਆਂ ਕਰ ਸਕਦਾ ਹੈ। ਮਹੱਤਵਪੂਰਨ ਖੇਤੀਬਾੜੀ ਫੈਸਲਿਆਂ ਦੀ ਸਥਾਨਕ ਮਾਹਿਰਾਂ ਤੋਂ ਪੁਸ਼ਟੀ ਕਰੋ।",

        // Landing Page
        heroTitle: "ਸਮਾਰਟ ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ",
        heroSubtitle: "ਮਿੱਟੀ, ਮੌਸਮ ਅਤੇ ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਦੇ ਅਧਾਰ ਤੇ AI-ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।",
        startAnalyzing: "ਆਪਣੇ ਖੇਤ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਸ਼ੁਰੂ ਕਰੋ",
        poweredBy: "RAG + LLM ਤਕਨਾਲੋਜੀ ਦੁਆਰਾ ਸੰਚਾਲਿਤ",
        features: {
            dataIntegration: { title: "ਡੇਟਾ ਏਕੀਕਰਣ", desc: "ਸਹੀ ਸਿਫਾਰਸ਼ਾਂ ਲਈ ਮਿੱਟੀ, ਮੌਸਮ ਅਤੇ ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਨੂੰ ਜੋੜਦਾ ਹੈ" },
            ragLlm: { title: "AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ", desc: "ਸਬੂਤ-ਅਧਾਰਤ ਸੁਝਾਅ ਦੇਣ ਲਈ ਵਿਗਿਆਨਕ ਖੋਜ ਅਤੇ ਮਾਰਗਦਰਸ਼ਕਾਂ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ" },
            location: { title: "ਸਥਾਨਕ ਵਿਸ਼ਲੇਸ਼ਣ", desc: "ਆਪਣੇ ਖੇਤ ਦੇ ਸਹੀ ਸਥਾਨ ਦੇ ਅਧਾਰ ਤੇ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ" },
            yield: { title: "ਝਾੜ ਦੀ ਭਵਿੱખਬਾਣੀ", desc: "ਇਤਿਹਾਸਕ ਡੇਟਾ ਦੇ ਅਧਾਰ ਤੇ AI-ਝਾੜ ਦੀ ਭਵਿੱખਬਾਣੀ" },
            sustainable: { title: "ਟਿਕਾਊ ਅਭਿਆਸ", desc: "ਵਿਸ਼ਵਵਿਆਪੀ ਖੇਤੀਬਾੜੀ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ ਅਨੁਸਾਰ ਪ੍ਰਬੰਧਨ ਅਭਿਆਸ" },
            soil: { title: "ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ", desc: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਅਤੇ ਬਣਤਰ ਦਾ ਡੂੰਘਾ ਵਿਸ਼ਲੇਸ਼ਣ" },
            weather: { title: "ਮੌਸਮ ਜਾਗਰੂਕ", desc: "ਰੀਅਲ-ਟਾਈਮ ਅਤੇ ਇਤਿਹਾਸਕ ਮੌਸਮ ਦੇ ਪੈਟਰਨ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ" },
            roi: { title: "ROI ਭਵਿੱખਬਾਣੀ", desc: "ਵਿੱਤੀ ਰਿਟਰਨ ਅਤੇ ਨਿਵੇਸ਼ ਕੁਸ਼ਲਤਾ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕਰੋ" }
        },
        dataSources: {
            soil: "ਮਿੱਟੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ",
            weather: "ਮੌਸਮ ਦਾ ਡੇਟਾ",
            topography: "ਭੂ-ਵਿਗਿਆਨ",
            remote: "ਰਿਮੋਟ ਸੈਂਸਿੰਗ"
        },
        howItWorks: {
            title: "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
            step1: { title: "ਸਥਾਨ ਦਰਜ ਕਰੋ", desc: "ਆਪਣੇ ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ ਜਾਂ ਸਥਾਨ ਦਾ ਵੇਰਵਾ ਦਿਓ" },
            step2: { title: "AI ਵਿਸ਼ਲੇਸ਼ਣ", desc: "ਸਿਸਟਮ ਵੱਖ-ਵੱਖ ਡੇਟਾ ਅਤੇ ਖੋਜ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ" },
            step3: { title: "ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ", desc: "ਸਕੋਰਾਂ ਦੇ ਨਾਲ ਸਬੂਤ-ਅਧਾਰਤ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰੋ" }
        },
        cta: {
            title: "ਆਪਣੀ ਫਸਲ ਦੀ ਚੋਣ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ ਤਿਆਰ ਹੋ?",
            desc: "ਡੇਟਾ-ਅਧਾਰਤ ਫੈਸਲੇ ਲੈਣ ਵਾਲੇ ਹਜ਼ਾਰਾਂ ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ",
            button: "ਆਪਣਾ ਮੁਫਤ ਵਿਸ਼ਲੇਸ਼ਣ ਸ਼ੁਰੂ ਕਰੋ"
        },

        // Analysis Form
        farmDetails: "ਖੇਤ ਦਾ ਵੇਰਵਾ",
        location: "ਸਥਾਨ",
        landSize: "ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ (ਏਕੜ)",
        budget: "ਬਜਟ (₹)",
        soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
        waterSource: "ਪਾਣੀ ਦਾ ਸਰੋਤ",
        season: "ਸੀਜ਼ਨ",
        prevCrop: "ਪਿਛਲੀ ਫਸਲ",
        generate: "AI ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ",
        analyzing: "ਮੌਸਮ, ਮਿੱਟੀ ਅਤੇ ਇਤਿਹਾਸਕ ਡੇਟਾ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
        results: "ਚੋਟੀ ਦੀਆਂ ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਫਸਲਾਂ",

        // Results & Charts
        why: "ਇਹ ਫਸਲ ਕਿਉਂ?",
        yield: "ਝਾੜ",
        roi: "ਮੁਨਾਫਾ ਦਰ",
        investment: "ਨਿਵੇਸ਼",
        profit: "ਮੁਨਾਫਾ",
        requirements: "ਜ਼ਰੂਰਤਾਂ",
        water: "ਪਾਣੀ",
        nitrogen: "ਨਾਈਟ੍ਰੋਜਨ",
        phosphorus: "ਫਾਸਫੋਰਸ",
        potassium: "ਪੋਟਾਸ਼ੀਅਮ",
        fertilizers: "ਖਾਦ ਦਾ ਮਿਸ਼ਰਣ",
        alternatives: "ਸੰਭਵ ਵਿਕਲਪ",
        expertTip: "ਮਾਹਿਰ ਦੀ ਸਲਾਹ",
        askAi: "AI ਨੂੰ ਪੁੱਛੋ",

        // Charts
        comparativeAnalytics: "ਤੁਲਨਾਤਮਕ ਵਿਸ਼ਲੇਸ਼ਣ",
        profitPotential: "ਮੁਨਾਫੇ ਦੀ ਸੰਭਾਵਨਾ",
        roiComparison: "ROI ਤੁਲਨਾ",
        npkRequirements: "NPK ਜ਼ਰੂਰਤਾਂ",
        waterReq: "ਪਾਣੀ ਦੀਆਂ ਜ਼ਰੂਰਤਾਂ",
        deepDive: "ਡੂੰਘਾਈ ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ",
        resourceProfile: "ਸਰੋਤ ਪ੍ਰੋਫਾਈਲ",
        nutrientWaterRadar: "ਪੌਸ਼ਟਿਕ ਤੱਤ ਅਤੇ ਪਾਣੀ ਦੀ ਜ਼ਰੂਰਤ ਰਡਾਰ",
        financialReport: "ਵਿੱਤੀ ਰਿਪੋਰਟ",
        marketReturns: "ਅਨੁਮਾਨਿਤ ਮਾਰਕੀਟ ਰਿਟਰਨ ਅਤੇ ਸਰੋਤ ਵੰਡ",

        // Placeholders & Selects
        selectSoil: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਚੁਣੋ...",
        selectWater: "ਪਾਣੀ ਦਾ ਸਰੋਤ ਚੁਣੋ...",
        selectSeason: "ਸੀਜ਼ਨ ਚੁਣੋ...",
        locationPlaceholder: "ਜਿਵੇਂ: ਅੰਮ੍ਰਿਤਸਰ, ਪੰਜਾਬ",
        prevCropPlaceholder: "ਜਿਵੇਂ: ਝੋਨਾ, ਕਣਕ",
        alternativeDesc: "ਸਮਾਨ ਵਿਕਾਸ ਪ੍ਰੋਫਾਈਲ ਵਾਲੀਆਂ ਫਸਲਾਂ",
        expertTipDesc: "ਜੇਕਰ ਮੁੱਖ ਬੀਜ ਉਪਲਬਧ ਨਹੀਂ ਹਨ ਜਾਂ ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ ਉਲਟ ਬਦਲਦੀਆਂ ਹਨ, ਤਾਂ ਇਹ ਵਿਕਲਪ ਲਚਕਦਾਰ ਹੁੰਦੇ ਹਨ।",
        financialDisclaimer: "ਇਹ ਅਨੁਮਾਨ ਇਤਿਹਾਸਕ ਝਾੜ ਦੇ ਪੈਟਰਨ ਅਤੇ ਮੌਜੂਦਾ ਕਮੋਡਿਟੀ ਇੰਡੈਕਸ ਤੋਂ ਤਿਆਰ ਕੀਤੇ ਗਏ ਹਨ। ਅਸਲ ਨਤੀਜੇ ਸਥਾਨਕ ਜਲਵਾਯੂ ਪਰਿਵਰਤਨ 'ਤੇ ਨਿਰਭਰ ਕਰਦੇ ਹਨ।",
        dataReference: "ਡਾਟਾ ਹਵਾਲਾ",
        dataReferenceDesc: "ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ, AI ਤਰਕ ਅਤੇ ਇਤਿਹਾਸਕ ਫਸਲ ਪ੍ਰਦਰਸ਼ਨ ਰਿਕਾਰਡ ਦੁਆਰਾ ਸੰਚਾਲਿਤ।",
        marginAnalysis: "ਮਾਰਜਿਨ ਵਿਸ਼ਲੇਸ਼ਣ",
        crop: "ਫਸਲ",
        year: "ਸਾਲ",
        area: "ਖੇਤਰ (ਹੈਕਟੇਅਰ)",
        production: "ਉਤਪਾਦਨ",
        rainfall: "ਵਰਖਾ",
        soils: { black: "ਕਾਲੀ ਮਿੱਟੀ (ਰੇਗੁਰ)", red: "ਲਾਲ ਮਿੱਟੀ", alluvial: "ਜਲੋੜ ਮਿੱਟੀ", sandy: "ਰੇਤਲੀ ਮਿੱਟੀ", laterite: "ਲੈਟਰਾਈਟ ਮਿੱਟੀ", clay: "ਚੀਕਣੀ ਮਿੱਟੀ", loamy: "ਦੁਮਟ ਮਿੱਟੀ", sandyLoam: "ਰੇਤਲੀ ਦੁਮਟ" },
        waterSources: { borewell: "ਬੋਰਵੈੱਲ", canal: "ਨਹਿਰੀ ਸਿੰਚਾਈ", rain: "ਸਿਰਫ਼ ਵਰਖਾ 'ਤੇ ਅਧਾਰਤ", river: "ਨਦੀ/ਨਾਲਾ", drip: "ਡ੍ਰਿਪ ਸਿੰਚਾਈ", sprinkler: "ਸਪ੍ਰਿੰਕਲਰ", tank: "ਟੈਂਕ/ਤਾਲਾਬ" },
        seasonsList: { kharif: "ਖਰੀਫ (ਜੂਨ-ਅਕਤੂਬਰ)", rabi: "ਰਬੀ (ਨਵੰਬਰ-ਮਾਰਚ)", zaid: "ਜਾਇਦ/ਗਰਮੀ (ਮਾਰਚ-ਜੂਨ)", year: "ਸਾਰਾ ਸਾਲ" },
        errorMessages: { location: "ਸਥਾਨ ਲੋੜੀਂਦਾ ਹੈ", landSize: "ਇੱਕ ਵੈਧ ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ ਦਰਜ ਕਰੋ", budget: "ਇੱਕ ਵੈਧ ਬਜਟ ਦਰਜ ਕਰੋ", soil: "ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਚੁਣੋ", water: "ਪਾਣੀ ਦਾ ਸਰੋਤ ਚੁਣੋ", season: "ਬਿਜਾਈ ਦਾ ਸੀਜ਼ਨ ਚੁਣੋ" },
        dashboard: {
            nextSteps: "ਅਗਲੇ ਕਦਮ",
            monitoring: "ਮੌਸਮ ਦੀ ਨਿਗਰਾਨੀ",
            monitoringDesc: "ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ ਟ੍ਰੈਕ ਕਰੋ। ਬਿਜਾਈ ਦਾ ਸਮਾਂ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
            disclaimerTitle: "ਬੇਦਾਅਵਾ",
            disclaimerDesc: "ਇਹ ਸਿਫਾਰਸ਼ਾਂ ਮੌਸਮ ਅਤੇ AI ਤਰਕ ਨੂੰ ਜੋੜਦੀਆਂ ਹਨ। ਅਸਲ ਨਤੀਜੇ ਬਦਲ ਸਕਦੇ ਹਨ।",
            footerText: "AI ਅਤੇ ਇਤਿਹਾਸਕ ਖੇਤੀਬਾੜੀ ਡੇਟਾ ਦੁਆਰਾ ਸੰਚਾਲਿਤ · AgriSense ਇੰਟੈਲੀਜੈਂਸ ਪਲੇਟਫਾਰਮ",
            actions: [
                { title: 'ਮਿੱਟੀ ਦੀ ਜਾਂਚ', desc: 'ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਦੀ ਜਾਂਚ ਕਰਵਾਓ।', steps: ['ਖੇਤੀਬਾੜੀ ਵਿਭਾਗ ਨਾਲ ਸੰਪਰਕ ਕਰੋ', 'ਨਮੂਨੇ ਲਓ', '7-10 ਦਿਨ ਉਡੀਕ ਕਰੋ'] },
                { title: 'ਬੀਜਾਂ ਦੀ ਖਰੀਦ', desc: 'ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਪ੍ਰਾਪਤ ਕਰੋ।', steps: ['ਸਰਟੀਫਿਕੇਸ਼ਨ ਚੈੱਕ ਕਰੋ', 'ਉਗਣ ਦੀ ਦਰ ਦੇਖੋ', '10% ਵਾਧੂ ਖਰੀਦੋ'] },
                { title: 'ਪਾਣੀ ਦਾ ਪ੍ਰਬੰਧਨ', desc: 'ਪਾਣੀ ਦੀ ਲੋੜ ਅਨੁਸਾਰ ਯੋਜਨਾ ਬਣਾਓ।', steps: ['ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਲਗਾਓ', 'ਪਾਣੀ ਦਾ ਪੱਧਰ ਦੇਖੋ', 'ਮੌਨਸੂਨ ਲਈ ਤਿਆਰੀ ਕਰੋ'] },
                { title: 'ਬਜਟ ਯੋਜਨਾਬੰਦੀ', desc: 'ਫੰਡਾਂ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ।', steps: ['20% ਬਫਰ ਰੱਖੋ', 'ਖੇਤੀਬਾੜੀ ਕਰਜ਼ੇ ਦੇਖੋ', 'ਫਸਲ ਬੀਮਾ ਕਰਵਾਓ'] }
            ]
        }
    }
};
