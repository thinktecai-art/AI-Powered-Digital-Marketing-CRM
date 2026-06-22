import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization helper for Google Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Simulated High-Converting Seed Funnels based on selected niches
const mockFunnelsList: Record<string, any> = {
  fashion: {
    niche: "Fashion",
    product: "Eco-Luxe Capsule Wardrobe Collection",
    avatar: "Busy urban professional women who value comfort and sustainable aesthetics",
    painPoint: "Spent hours choosing outfits every morning, feeling guilty about fast-fashion waste",
    desiredOutcome: "Instantly create elegant, timeless looks in under 2 minutes with zero eco-guilt",
    awareness: {
      ads: [
        {
          platform: "Instagram Video",
          headline: "Dressed in Under 60 Seconds",
          primaryText: "Struggling with what to wear every morning? 🙋‍♀️ Our Eco-Luxe Capsule Wardrobe gives you 15 elegant styles out of just 5 timeless organic pieces. Transition flawlessly from busy mornings to late dinners.",
          cta: "Shop the Capsule Collection"
        },
        {
          platform: "Facebook Carousel",
          headline: "Zero Choice Fatigue. Maximum Style.",
          primaryText: "Meet the ethical closet tailored for busy professions. Crafted with premium bamboo silk and organic wool, designed to fit you at every stage. Solve morning wardrobe dread forever.",
          cta: "Get the Style Guide"
        }
      ],
      hooks: [
        "Why 90% of your closet is sitting untouched (and how to fix it today)",
        "The 2-minute morning outfit secret busy executives swear by",
        "How to build an elegant look with only 5 sustainable pieces"
      ]
    },
    leadCapture: {
      leadMagnetTitle: "The Sustainable Style Blueprint",
      leadMagnetDescription: "Our free master guide detailing the exact combinations to turn 5 core garments into 15 gorgeous multi-event styles.",
      landingPageHook: "Slash Your Morning Routine by 80% While Standing out in Sustainable Luxury.",
      landingPageSections: [
        {
          title: "The Problem With Fast Fashion",
          content: "You buy more, but wear less. Overwhelmed closets lead to daily styling fatigue and wasteful purchasing. There's a better way to look exquisite."
        },
        {
          title: "How Capsule Wardrobe Saves Time & Money",
          content: "By investing in versatile, organic textiles made with bespoke tailored designs, you create an effortless uniform that highlights your best self."
        }
      ]
    },
    nurture: {
      emails: [
        {
          subject: "Welcome to Elegance: Your 15-in-5 Roadmap inside!",
          preview: "Here is your blueprint to sustainable, streamlined luxury style.",
          body: "Hello and welcome! We created Eco-Luxe to solve the daily morning puzzle. Inside your download, you will find direct combinations of silhouettes to transition comfortably from boardroom meetings to social cocktails. To your simple morning style, The Style Team."
        },
        {
          subject: "Science of Capsule Styling (How this saves 12 hours a month)",
          preview: "Why having fewer, better choices fuels natural elegance.",
          body: "Hi! Did you know that the average woman spends 15 minutes a day deciding what to wear? That's over a whole day per year. Eco-Luxe pieces are color-harmonized so any bottom perfectly pairs with any top automatically, reducing decisions to zero."
        },
        {
          subject: "Your Exclusive $50 Invitation",
          preview: "An invitation to build your first sustainable set.",
          body: "Hello! We are ready to make your mornings majestic. Utilize coupon luxurycode50 to grab $50 off your starter capsule this week. Enjoy complimentary bespoke sizing with our style advisors!"
        }
      ]
    },
    conversion: {
      salesPageAngle: "Ultimate confidence, professional design, organic certifications.",
      headline: "The Eco-Luxe Starter Collection: Own Your Mornings.",
      bigPromise: "A beautiful, premium, bespoke-fit organic closet delivered directly to your door to remove morning styling friction forever.",
      cta: "Unlock My Eco-Luxe Set",
      urgencyAngles: [
        "Bespoke style counseling is included with the first 50 memberships this month only.",
        "Limited bamboo silk batch currently in custom tailoring.",
        "Exclusive pricing expiring once current collection slot fills."
      ]
    },
    retargeting: {
      ads: [
        {
          platform: "Instagram Stories",
          headline: "Still Deciding?",
          primaryText: "See why 4,000+ busy executives transformed their style. Give your mornings a clean slate risk-free with our 30-day wear & love promise.",
          cta: "Complete Custom Tailoring"
        }
      ]
    },
    upsell: {
      offers: [
        {
          title: "The Luxury Silk Accessory Upgrade",
          description: "Stunning hand-woven mulberry silk scarves and wrap-belts that add 8 new casual and formal variations.",
          pricePositioning: "Add for just $89 (Regularly $175)"
        }
      ],
      winBackEmails: [
        {
          subject: "Is your wardrobe still cluttering your mind?",
          body: "We noticed you left your capsule tailored selection. We've unlocked an additional style consultation completely free. Click here to check out with your custom size."
        }
      ]
    },
    retention: {
      ideas: [
        {
          type: "loyalty",
          description: "The Eco-Luxe Circular Closets Program: Trade in previous season pieces for 35% store credit, encouraging active lifetime recycling and premium product updates."
        }
      ]
    }
  },
  beauty: {
    niche: "Beauty",
    product: "The Radiance Reset Botanical Routine",
    avatar: "Working mothers dealing with dull complexion and hormonal stress skin breakouts",
    painPoint: "Frustrated by complex 10-step chemical routines that cause redness and dry patches",
    desiredOutcome: "A simple 3-minute organic botanical routine that restores a glowing, calm face",
    awareness: {
      ads: [
        {
          platform: "Facebook Video",
          headline: "3 Steps. 3 Minutes. Safe Radiant Results.",
          primaryText: "Tired of harsh chemicals claiming to rejuvenate your skin but leaving it red and stripped? 🌿 The Radiance Reset is formulated with organic cold-pressed sea buckthorn and calendula. Guaranteed glowing skin in 14 days or your money back.",
          cta: "See Before & After"
        }
      ],
      hooks: [
        "The morning skincare mistake causing premature aging (it's not what you think)",
        "Why your 10-step chemical skin treatment is actually destroying your natural moisture barrier"
      ]
    },
    leadCapture: {
      leadMagnetTitle: "The Glowing Skin Diet & Botanical Blueprint",
      leadMagnetDescription: "Download the complete clean botanical guide detailing 7 essential superfoods and 3 nightly skin massage rituals for youthful moisture.",
      landingPageHook: "Restore Your Natural Youthful Radiance Without the Burn of Skin-Damaging Chemicals.",
      landingPageSections: [
        {
          title: "Phyto-Active Plant Science",
          content: "Discover how cold-extracted active botanicals heal skin flare-ups and naturally lock in deep hydration."
        }
      ]
    },
    nurture: {
      emails: [
        {
          subject: "Your guide to botanical radiance is inside! 🌿",
          preview: "Instantly unlock your skin massage checklist.",
          body: "A warm hello! Here is your organic skin companion. Step one is stopping heavy chemical layers. Try cold rinsing in the morning followed by your buckthorn serum. Read on for our step-by-step hydration blueprint."
        }
      ]
    },
    conversion: {
      salesPageAngle: "Dermatologist-formulated botanical extract with active guarantees.",
      headline: "The Radiance Reset Set: Unveil Living Botanic Radiance.",
      bigPromise: "Ditch the expensive, chemical-heavy counter creams for one premium clinical-grade organic collection.",
      cta: "Grab My Reset Set Today",
      urgencyAngles: [
        "Current botanical harvest is small batch only of cold-extracted oils.",
        "Over 85% of monthly stock already dispatched."
      ]
    },
    retargeting: {
      ads: [
        {
          platform: "Meta Custom Audience",
          headline: "14 Days To Radically Glowing Skin",
          primaryText: "Still staring at that dull skin? Join 15,000+ mothers who recovered confident radiance with our active guarantee. Try it risk-free today.",
          cta: "Get My Glow Back"
        }
      ]
    },
    upsell: {
      offers: [
        {
          title: "Hydrosol Rose Jade Roller Kit",
          description: "Premium cooling jade roller + double-distilled organic rose water mist to maximize nutrient absorption by 300%.",
          pricePositioning: "Exclusive add-on: $29 (Usually $65)"
        }
      ],
      winBackEmails: [
        {
          subject: "A botanical gift for you inside",
          body: "We miss having you on the botanical path. Here is a free botanic lip hydrator with your next purchase."
        }
      ]
    },
    retention: {
      ideas: [
        {
          type: "program",
          description: "Monthly Radiance Club: Receive fresh small-batch extracts monthly at 25% discount, plus organic skin consultations and access to beauty coaching."
        }
      ]
    }
  },
  fitness: {
    niche: "Fitness",
    product: "The Met-Con Core 20-Min Workout Blueprint",
    avatar: "Busy dads and corporate desk-bound professionals over forty years old",
    painPoint: "No time for 2-hour gym sessions, feeling sluggish, and suffering from back pain",
    desiredOutcome: "Achieve functional athletic stamina and burn belly fat with 20-minute bodyweight routines",
    awareness: {
      ads: [
        {
          platform: "YouTube Short / FB Video",
          headline: "Dads: Stop Doing Hours of Cardio",
          primaryText: "You don't need exhausting hours in a public gym to stay athletic and burn belly fat. ⏱️ Met-Con Core uses high-potency functional metabolic intervals in only 20 minutes from your home. Rebuild strong joints and energy.",
          cta: "Watch Free Workout Routine"
        }
      ],
      hooks: [
        "Why joint-crushing distance running isn't the key to lean athletic longevity after age forty",
        "The metabolic trigger that torches belly fat up to 36 hours after workout"
      ]
    },
    leadCapture: {
      leadMagnetTitle: "The Metabolic 20 Blueprint",
      leadMagnetDescription: "The exact 3 bodyweight movements that trigger sustained fat oxidation and relieve lower back tightness.",
      landingPageHook: "Build Functional Athletic Power in 20 Minutes Without Gym Memberships.",
      landingPageSections: [
        {
          title: "The Joint Safe Athletic Secret",
          content: "Traditional weightlifting can stress aging tendons. Our mobility-supported metabolic intervals build muscle protectively."
        }
      ]
    },
    nurture: {
      emails: [
        {
          subject: "The Metabolic Trigger Guide (Step-by-Step)",
          preview: "How to trigger maximum metabolic afterburn tonight.",
          body: "Hey Coach! Welcome. Here is the Met-Con blueprint. Perform 4 rounds: 45s on, 15s absolute transition. Ensure feet are flat and posture is high. In 20 minutes, you will sweat, burn fat, and build core stabilizers."
        }
      ]
    },
    conversion: {
      salesPageAngle: "Physiotherapy supported athletic longevity with nutrition matrix.",
      headline: "The Complete Met-Con Core Home Training Program.",
      bigPromise: "A physical coaching app with daily 20-minute tailored video routines + functional diet protocols.",
      cta: "Gain Athletic Stamina Now",
      urgencyAngles: [
        "50 coaching registrations left for the physical assessment program.",
        "Summer athletic core cohort begins in under 48 hours."
      ]
    },
    retargeting: {
      ads: [
        {
          platform: "Facebook Retargeting",
          headline: "Zero Excuses. Infinite Energy.",
          primaryText: "No equipment? No worries. Spend 20 minutes a day to feel twenty years younger. Join our supportive dad group with custom trainer access.",
          cta: "Claim My Coaching Seat"
        }
      ]
    },
    upsell: {
      offers: [
        {
          title: "The Functional Joint Health Stack",
          description: "Premium collagen peptides + mobility elastic bands with tailored video rehab guides for knees and back.",
          pricePositioning: "Secure today for $59 (Save 50%)"
        }
      ],
      winBackEmails: [
        {
          subject: "Ready to restart? Fresh 5-Day Core Reset Free",
          body: "We want to pull you back into action. Here is our 5-day joint-friendly metabolic jumpstart, completely free of charge."
        }
      ]
    },
    retention: {
      ideas: [
        {
          type: "program",
          description: "Weekly Athletic Mastermind Calls: Interactive virtual physical therapy check-ins, form checks, and progress milestone rewards."
        }
      ]
    }
  },
  "real estate": {
    niche: "Real estate",
    product: "The Off-Market Strategic Sourcing Funnel",
    avatar: "First-time home purchasers who are frustrated by overpriced bid wars",
    painPoint: "Losing hope after getting outbid on Zillow 10 times in a hyper-competitive market",
    desiredOutcome: "Secure a beautiful off-market property directly without bidding wars and save $30k+",
    awareness: {
      ads: [
        {
          platform: "Facebook Lead Ad",
          headline: "Stop Bidding Wars. Shop Off-Market.",
          primaryText: "Tired of finding your dream home on Zillow only to lose it in a stressful bidding war? 🏡 Our proprietary Off-Market Strategic Sourcing unearths gorgeous hidden properties in your neighborhood BEFORE they list.",
          cta: "Get the Free Local Catalog"
        }
      ],
      hooks: [
        "The secret off-market channel real estate investors use to purchase premium homes cheaper",
        "How first-time home buyers are bypassing bid wars entirely in this local market"
      ]
    },
    leadCapture: {
      leadMagnetTitle: "The Off-Market Local Sourcing Report",
      leadMagnetDescription: "Access a certified catalog of local family properties under evaluation, complete with neighborhood grading and pricing analysis.",
      landingPageHook: "Unearth Hidden Dream Properties Before They Ever Hit Redfin or Zillow.",
      landingPageSections: [
        {
          title: "Why Public Portals are Broken",
          content: "By the time a home is posted online, thousands of rival buyers are alerted. Off-market access lets you negotiate individually."
        }
      ]
    },
    nurture: {
      emails: [
        {
          subject: "Your Sourcing Blueprint is attached! 🏠",
          preview: "Access the hidden real estate listings catalog inside.",
          body: "Hi from Agent Team! Your blueprint details how properties are mapped before public listing. Look closely at the upcoming inventory for high-performance zones. We'd love to chat details when you're ready."
        }
      ]
    },
    conversion: {
      salesPageAngle: "Exclusive sourcing concierge with mortgage facilitation.",
      headline: "The Premium Buyer Sourcing Matchmaker Service.",
      bigPromise: "We scout, match, and secure your specific ideal off-market home inside your target zip code, guaranteed.",
      cta: "Schedule Sourcing Consultation",
      urgencyAngles: [
        "Currently onboarding only 10 selective buyers for active matching this month.",
        "Summer off-market catalog is closing preview access soon."
      ]
    },
    retargeting: {
      ads: [
        {
          platform: "Meta Custom List",
          headline: "The Next 5 Beautiful Properties are Live",
          primaryText: "Don't settle for overpriced hand-me-downs. Let us source your dream off-market home custom. Grab a free match session today.",
          cta: "Book Sourcing Session"
        }
      ]
    },
    upsell: {
      offers: [
        {
          title: "Bespoke Renovation Estimator Concierge",
          description: "Full architect assessment and direct pre-negotiated contractor labor bids for repairs to save you thousands on escrow renovations.",
          pricePositioning: "Free Add-on for Sourcing VIP Members"
        }
      ],
      winBackEmails: [
        {
          subject: "Still searching local listings?",
          body: "A gorgeous modern craftsman home just entered our off-market system in your area. Let's do an exclusive walk-through before the owner lists publicly."
        }
      ]
    },
    retention: {
      ideas: [
        {
          type: "loyalty",
          description: "The Sourced Homeowners Circle: Free annual property value updates, mortgage refinance alerts, and rewards for buyer referrals."
        }
      ]
    }
  }
};

// General fallback strategy for any other niches (Insurance, E-commerce, SaaS, Coaching, Local services)
function getGenericFallbackFunnel(niche: string, product: string, avatar: string, painPoint: string, desiredOutcome: string): any {
  const n = niche || "SaaS / B2B";
  const p = product || "Pro-Flow Business Accelerator Engine";
  const av = avatar || "High-growth agency owners and tech founders";
  const pp = painPoint || "Losing hours manually updating spreadsheets and dropping valuable warm leads";
  const doUtc = desiredOutcome || "Automate 90% of lead nurtures and boost sales conversion rates by two-fold";

  return {
    niche: n,
    product: p,
    avatar: av,
    painPoint: pp,
    desiredOutcome: doUtc,
    awareness: {
      ads: [
        {
          platform: "Facebook / LinkedIn Premium Video",
          headline: `Struggling with ${pp}? Solve it today!`,
          primaryText: `Attention ${av}! If you are feeling overwhelmed by ${pp}, you're not alone. Our revolutionary ${p} is customized for ${n} businesses to achieve ${doUtc} easily. Click the button to learn how.`,
          cta: "Get Instant Access"
        }
      ],
      hooks: [
        `The secret methodology that solved ${pp} for top industry leaders in ${n}`,
        `Why traditional workflows are failing to unlock ${doUtc}`
      ]
    },
    leadCapture: {
      leadMagnetTitle: `The Ultimate ${n} Strategy Guide & Blueprint`,
      leadMagnetDescription: `A high-converting step by step roadmap written meticulously to assist ${av} to tackle ${pp} in days.`,
      landingPageHook: `Achieve ${doUtc} Easily Without Ever Dealing with ${pp} Again.`,
      landingPageSections: [
        {
          title: "Unlock Scalable High Performance",
          content: `Our innovative ${p} integrates best practices for ${n} directly, eliminating the friction of manual spreadsheet logs.`
        }
      ]
    },
    nurture: {
      emails: [
        {
          subject: `Your Strategy Guide to ${doUtc} is inside!`,
          preview: `Open to instantly solve ${pp} with our proven system.`,
          body: `Hi there! We are thrilled to welcome you. Ready to transform your results? We created ${p} precisely because we noticed so many ${av} failing to scale beyond hurdles due to ${pp}. Let's change that starting now.`
        },
        {
          subject: "How top industry professionals scale their workflows",
          preview: "The exact math of workflow automation.",
          body: `Hey! By automating key checkpoints, top producers enjoy ${doUtc} without burning out. Here is the direct breakdown of how our current customers achieved these metrics.`
        }
      ]
    },
    conversion: {
      salesPageAngle: "High productivity, expert support, complete satisfaction guarantee.",
      headline: `The Ultimate Solution: Reclaim Your Focus with ${p}.`,
      bigPromise: `A complete, state-of-the-art solution built natively to transition you to ${doUtc} seamlessly.`,
      cta: "Activate My Account Now",
      urgencyAngles: [
        "Exclusive early adopter discount available this week.",
        "Support slots for custom onboarding coaching are filling up rapidly."
      ]
    },
    retargeting: {
      ads: [
        {
          platform: "Google Display / Retargeting",
          headline: `Still dealing with ${pp}?`,
          primaryText: `It's time to take action. Reclaim your time and lock in ${doUtc} with our industry-leading 30-day trial.`,
          cta: "Claim My Free Trial"
        }
      ]
    },
    upsell: {
      offers: [
        {
          title: "The VIP Custom Tailoring Addon",
          description: `Our engineering team handles your complete system migration, setup and team training sessions.`,
          pricePositioning: "Secure today for a special price of $299 (Save $600)"
        }
      ],
      winBackEmails: [
        {
          subject: "We miss you -- Let's complete your setup",
          body: "We noticed you left your custom funnel partially configured. We've added a custom extended consultation call to help you settle in safely."
        }
      ]
    },
    retention: {
      ideas: [
        {
          type: "loyalty",
          description: `The VIP Ambassador Program: Earn passive recurring 20% lifetime referrals and complimentary system health checks annually.`
        }
      ]
    }
  };
}

// ENDPOINT: 1. Generate Full Funnel
// POST /api/ai/generate-funnel
app.post("/api/ai/generate-funnel", async (req: express.Request, res: express.Response) => {
  const { niche, product, avatar, painPoint, desiredOutcome, mainChannel, pricePoint } = req.body;

  if (!niche || !product || !avatar || !painPoint || !desiredOutcome) {
    return res.status(400).json({ error: "Missing required funnel build inputs." });
  }

  const normalizedNiche = niche.toLowerCase().trim();

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are an AI Funnel Architect that builds complete digital marketing funnels for specific business niches.
Your output MUST be a valid, cohesive, structured JSON object exactly matching the following schema. Never write conversational intros, explanations, or backticks outside of the raw JSON content block.

Supported niches:
- Fashion
- Beauty
- Fitness
- Real estate
- Insurance
- E-commerce
- SaaS
- Coaching
- Local services

JSON Target Structure:
{
  "niche": "string",
  "product": "string",
  "avatar": "string",
  "painPoint": "string",
  "desiredOutcome": "string",
  "awareness": {
    "ads": [
      { "platform": "string", "headline": "string", "primaryText": "string", "cta": "string" }
    ],
    "hooks": ["string", "string", "string"]
  },
  "leadCapture": {
    "leadMagnetTitle": "string",
    "leadMagnetDescription": "string",
    "landingPageHook": "string",
    "landingPageSections": [
      { "title": "string", "content": "string" }
    ]
  },
  "nurture": {
    "emails": [
      { "subject": "string", "preview": "string", "body": "string" }
    ]
  },
  "conversion": {
    "salesPageAngle": "string",
    "headline": "string",
    "bigPromise": "string",
    "cta": "string",
    "urgencyAngles": ["string", "string", "string"]
  },
  "retargeting": {
    "ads": [
      { "platform": "string", "headline": "string", "primaryText": "string", "cta": "string" }
    ]
  },
  "upsell": {
    "offers": [
      { "title": "string", "description": "string", "pricePositioning": "string" }
    ],
    "winBackEmails": [
      { "subject": "string", "body": "string" }
    ]
  },
  "retention": {
    "ideas": [
      { "type": "string", "description": "string" }
    ]
  }
}

Always adapt tone and marketing angles specifically to the requested ${niche} niche. Be persuasive, creative, and conversion-focused!`;

    const userPrompt = `Generate a complete high-converting digital marketing funnel in JSON for the following configuration:
- Niche: ${niche}
- Product/Offer Name: ${product}
- Target Avatar: ${avatar}
- Core Pain Point: ${painPoint}
- Desired Customer Outcome: ${desiredOutcome}
- Primary Channel: ${mainChannel || "Meta / Instagram"}
- Price Position: ${pricePoint || "Premium Offer"}

Provide high quality copy specifically matching this setup. Make sure the JSON is well-formatted.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 1.0,
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedJson = JSON.parse(textResponse);
    return res.json({ isSimulated: false, data: parsedJson });

  } catch (error: any) {
    console.warn("AI Generation Endpoint encountered an issue. Using simulated seed model.", error.message);
    
    // Serve our high quality preset funnels for immediate responsiveness if API key is missing or invalid
    let resultData = mockFunnelsList[normalizedNiche];
    if (!resultData) {
      resultData = getGenericFallbackFunnel(niche, product, avatar, painPoint, desiredOutcome);
    } else {
      // Partially update seed data with customizable user inputs so it feels highly personalized
      resultData = {
        ...resultData,
        product,
        avatar,
        painPoint,
        desiredOutcome
      };
    }

    return res.json({
      isSimulated: true,
      info: "Simulated high-converting neural fallback mode active due to offline configuration. Gemini API fully accessible once GEMINI_API_KEY is supplied.",
      data: resultData
    });
  }
});

// ENDPOINT: 2. Optimize Single Asset with AI
// POST /api/ai/optimize-asset
app.post("/api/ai/optimize-asset", async (req: express.Request, res: express.Response) => {
  const { niche, stageType, assetType, currentContent, goal } = req.body;

  if (!stageType || !assetType || !currentContent) {
    return res.status(400).json({ error: "Missing parameters for optimization." });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a Conversion Copywriting Optimizer specializing in digital advertising metrics and high click-through-rates.
You will receive current content and a optimization goal.
You MUST analyze the input and output exactly a valid JSON block containing "improvedContent" and "testingIdeas" (an array with 3 distinct conversion hypotheses). Do not output other text.

JSON Target Structure:
{
  "improvedContent": "string",
  "testingIdeas": ["string", "string", "string"]
}`;

    const userPrompt = `Optimize the following asset:
- Niche: ${niche || "SaaS"}
- Funnel Stage: ${stageType}
- Asset Type: ${assetType}
- Optimization Target / Goal: ${goal || "Increase conversions"}

Current Content:
"""
${currentContent}
"""

Provide a significantly more compelling version with high structural rhythm and emotional resonance.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.9,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ isSimulated: false, data: parsed });

  } catch (error: any) {
    console.warn("AI Optimization experienced fallback mode:", error.message);
    // Provide general robust copy editing fallback
    const improvedContent = `✨ OPTIMIZED VERSION ✨\n\n${currentContent}\n\n💡 Conversion Booster Hook Applied:\n- Re-styled with dynamic emotional hook tailored to achieve "${goal || "maximum response rates"}"!\n- Clear, authoritative call-to-action placed inside visual focus margins.`;
    return res.json({
      isSimulated: true,
      data: {
        improvedContent,
        testingIdeas: [
          `Format as a direct, high-contrast client story structure to bypass ad blockades`,
          `Run head-to-head A/B tests with custom bold emojis placed in the first introductory line`,
          `Decrease paragraph size to maximize mobile reader viewport retention by 35%`
        ]
      }
    });
  }
});

// ENDPOINT: 3. AI Marketing & E-Commerce Copywriter
// POST /api/ai/copywriter
app.post("/api/ai/copywriter", async (req: express.Request, res: express.Response) => {
  const { toolType, inputs } = req.body;

  if (!toolType || !inputs) {
    return res.status(400).json({ error: "Missing toolType or inputs schema." });
  }

  const {
    product_name = "Core Product",
    category = "General Niche",
    avatar = "Target Audience Profile",
    pain_point = "Struggling with current inefficient work processes",
    desired_outcome = "Gain speed, efficiency, and high ROI automatically",
    tone = "conversion-focused and professional",
    custom_offer = "Special introductory launch discount",
    platform_focus = "TikTok, Instagram, and LinkedIn",
    store_type = "E-Commerce Direct to Consumer",
    regions = "North America & Europe",
    shipping_time = "3-5 business days",
    return_window = "30-day hassle-free returns",
    metrics = null
  } = inputs;

  try {
    const ai = getGeminiClient();
    let systemInstruction = "";
    let userPrompt = "";

    switch (toolType) {
      case "seo":
        systemInstruction = `You are an SEO content strategist. Generate:
- 3 high-intent blog post ideas
- 1 detailed outline for a pillar article (H1, H2s, Key bullets)
- 1 SEO-optimized landing page outline.

Each blog idea must:
- Target a clear high-intent keyword phrase.
- Lead naturally into the product, '${product_name}', as a solution.

You MUST respond strictly in valid, parseable JSON conforming to this schema. No markdown formatting, conversational intros, or code block markers.

JSON Schema:
{
  "blogPosts": [
    { "keyword": "string", "title": "string", "outline": ["string", "string", "string"], "cta": "string" }
  ],
  "pillarOutline": {
    "title": "string",
    "h1": "string",
    "h2s": [
      { "heading": "string", "bullets": ["string", "string"] }
    ],
    "landingPageOutline": {
      "h1": "string",
      "h2s": ["string"],
      "benefits": ["string"],
      "cta": "string"
    }
  }
}`;
        userPrompt = `Generate a complete SEO and Pillar outline for:
Product: ${product_name}
Category: ${category}
Audience: ${avatar}
Main pain point: ${pain_point}
Desired outcome: ${desired_outcome}
Brand Tone: ${tone}`;
        break;

      case "social":
        systemInstruction = `You are a social media channels strategist. Generate:
- 2 TikTok / IG Reels scripts (incorporating Hook, Body, and strong CTA).
- 1 Instagram carousel script (slide-by-slide titles, visual descriptions, and exact caption copy for 5 slides).
- 1 Community engagement post (interactive poll or question).
- 2 LinkedIn post angles specifically adapted for B2B.

You MUST respond strictly in valid, parseable JSON conforming to this schema. No extra words or backticks outside the JSON.

JSON Schema:
{
  "reels": [
    { "hook": "string", "body": "string", "cta": "string", "visualCue": "string" }
  ],
  "instagramCarousel": {
    "slides": [
      { "slideNumber": number, "title": "string", "visualCue": "string", "caption": "string" }
    ]
  },
  "linkedinPosts": [
    { "angle": "string", "headline": "string", "bodyText": "string" }
  ],
  "communityPost": {
    "postType": "string",
    "questionText": "string",
    "suggestedOptions": ["string"]
  }
}`;
        userPrompt = `Generate viral social content for:
Product: ${product_name}
Platform Focus: ${platform_focus}
Audience: ${avatar}
Primary Benefit/Pain: ${pain_point} to ${desired_outcome}
Brand Tone: ${tone}`;
        break;

      case "email":
        systemInstruction = `You are an email copywriter specializing in high-ticket click campaigns. Generate a 3-email sequence:
- Email 1: Welcome / Extreme Value
- Email 2: Social Proof / Case Study
- Email 3: Special Offer / Urgency

For each email, provide: Subject line, Preview Text, Body copy, and CTA.
You MUST respond strictly in valid, parseable JSON conforming to this schema.

JSON Schema:
{
  "sequence": [
    {
      "emailNumber": number,
      "stage": "string",
      "subject": "string",
      "preview": "string",
      "body": "string",
      "cta": "string"
    }
  ]
}`;
        userPrompt = `Generate a 3-email high-converting campaign sequence for:
Product: ${product_name}
Audience: ${avatar}
Pain Point: ${pain_point}
Desired Outcome: ${desired_outcome}
Launch Offer details: ${custom_offer}
Brand Tone: ${tone}`;
        break;

      case "ads":
        systemInstruction = `You are a high-performance ad copywriter. Generate:
- 3 Meta (Facebook/Instagram) ad variants, each containing primary text, headline, secondary description, and CTA.
- 2 Google Search ad groups, each containing 3 high-converting Headlines and 2 descriptions.

You MUST respond strictly in valid, parseable JSON conforming to this schema.

JSON Schema:
{
  "metaAds": [
    { "variantName": "string", "primaryText": "string", "headline": "string", "description": "string", "cta": "string" }
  ],
  "googleSearchAds": [
    {
      "groupName": "string",
      "headlines": ["string", "string", "string"],
      "descriptions": ["string", "string"]
    }
  ]
}`;
        userPrompt = `Generate high-converting paid search and social ad copy for:
Product: ${product_name}
Audience: ${avatar}
Pain Point: ${pain_point}
Desired Outcome: ${desired_outcome}
Brand Tone: ${tone}`;
        break;

      case "pdp":
        systemInstruction = `You are an e-commerce conversion copywriter. Generate a comprehensive product details page (PDP):
- Short Description (40-60 words max, punchy for grid view).
- Long Description (Story-driven brand narrative + solution positioning).
- Key Benefits (Bullet list of 4-5 major wins).
- Technical Details / Specs (Custom list of dimensions, materials, or features).
- Size / Fit guidance or operational pre-requisites.
- "Who this is for" and "Who this is NOT for".
- 3 FAQ items custom tailored to this product.

You MUST respond strictly in valid, parseable JSON conforming to this schema.

JSON Schema:
{
  "productTitle": "string",
  "shortDescription": "string",
  "longDescription": "string",
  "keyBenefits": ["string"],
  "technicalSpecs": ["string"],
  "sizeFitGuidance": "string",
  "whoIsFor": ["string"],
  "whoIsNotFor": ["string"],
  "productFAQs": [
    { "question": "string", "answer": "string" }
  ]
}`;
        userPrompt = `Generate a full e-commerce PDP copywriting mock-up for:
Product Name: ${product_name}
Category: ${category}
Audience: ${avatar}
Main Pain Point: ${pain_point}
Desired Outcome: ${desired_outcome}
Brand Tone: ${tone}`;
        break;

      case "visual":
        systemInstruction = `You are a visual commerce director. Generate high-production scripting materials:
- A detailed Shot List of 5 studio photo/video assets for this product (setting, type, lighting, purpose).
- 1 complete dynamic Unboxing Video script (scenes detailing visual action and spoken audio cue scripts).
- 1 360-degree interactive view storyboard detailing 3 crucial visual angles.

You MUST respond strictly in valid, parseable JSON conforming to this schema.

JSON Schema:
{
  "shotList": [
    { "shotNumber": number, "type": "string", "setting": "string", "purpose": "string" }
  ],
  "unboxingScript": {
    "narratorPersona": "string",
    "scenes": [
      { "sceneNumber": number, "visuals": "string", "audio": "string" }
    ]
  },
  "storyboard360": [
    { "frameNumber": number, "viewAngle": "string", "focusDetails": "string" }
  ]
}`;
        userPrompt = `Generate visual commerce scripts for:
Product: ${product_name}
Audience: ${avatar}
Tone: ${tone}`;
        break;

      case "social_proof":
        systemInstruction = `You are a social proof and customer trust specialist. Generate:
- 3 realistic customer reviews spanning different customer personas, detailing prior frustration and subsequent happiness.
- 1 authoritative, long-form website testimonial box.
- 2 specific User Generated Content (UGC) prompts to ask customers to share reviews on social media.

You MUST respond strictly in valid, parseable JSON conforming to this schema.

JSON Schema:
{
  "reviews": [
    { "customerName": "string", "avatarPersona": "string", "ratings": number, "reviewBody": "string", "beforeSituation": "string", "afterSituation": "string" }
  ],
  "testimonialBlock": {
    "quote": "string",
    "author": "string",
    "credentials": "string",
    "tagline": "string"
  },
  "ugcPrompts": [
    { "title": "string", "description": "string", "viralIncentive": "string" }
  ]
}`;
        userPrompt = `Generate comprehensive customer credentials and social proof indicators for:
Product: ${product_name}
Audience: ${avatar}
Main Benefit: ${desired_outcome}
Primary Frustration: ${pain_point}`;
        break;

      case "support":
        systemInstruction = `You are a professional Customer Experience (CX) strategist. Generate:
- 5 comprehensive customer FAQs and answers.
- 1 user-friendly, clean Shipping Policy based on inputs.
- 1 user-friendly, clean Returns and Refund policy.
- A secure checkout reassurance trust badge line (1-2 sentences).
- 2 support email templates:
  - "Where is my order?"
  - "How do I return or exchange?"

You MUST respond strictly in valid, parseable JSON conforming to this schema.

JSON Schema:
{
  "faqs": [
    { "question": "string", "answer": "string" }
  ],
  "shippingPolicy": "string",
  "returnsPolicy": "string",
  "trustCopy": "string",
  "supportTemplates": {
    "whereIsMyOrder": "string",
    "returnsAndExchanges": "string"
  }
}`;
        userPrompt = `Generate support text for:
Product: ${product_name}
Store Type: ${store_type}
Regions Served: ${regions}
Average Shipping Time: ${shipping_time}
Return Window Size: ${return_window}`;
        break;

      case "analytics_story":
        systemInstruction = `You are an elite marketing performance analyst within a growth CRM. Take the user's raw traffic, conversion rates, click rates, open rates, CTRs, and CPAs, and generate:
- A brief narrative "Data Story" with three components: What is working, what represents an underperforming bottleneck, and where the funnel is leaking.
- 3 A/B testing ideas (1 for Paid Ads, 1 for Emails, 1 for the Product Page).
- 2 physical storefront layout optimizations.
- 2 audience / messaging refinements.

You MUST respond strictly in valid, parseable JSON conforming to this schema.

JSON Schema:
{
  "dataStory": {
    "whatsWorking": "string",
    "underperforming": "string",
    "leakPoints": "string"
  },
  "experiments": {
    "adsTest": "string",
    "emailsTest": "string",
    "pdpTest": "string"
  },
  "strategicInsights": {
    "storefrontOptimizations": ["string", "string"],
    "messagingRefinements": ["string", "string"]
  }
}`;
        const inputMetricsStr = metrics ? JSON.stringify(metrics) : JSON.stringify({
          trafficByChannel: { social: 5000, organicSearch: 2000, direct: 800 },
          conversionRates: { leadOptIn: 0.12, purchaseConv: 0.015 },
          emailMetrics: { openRate: 0.22, clickThroughRate: 0.038 },
          paidAdsMetrics: { clickThroughRate: 0.018, cpa: 45.00 }
        });
        userPrompt = `Construct a complete performance insights report based on these metrics:
Metrics: ${inputMetricsStr}
Product: ${product_name}
Audience: ${avatar}`;
        break;

      case "orchestrator":
        systemInstruction = `You are a senior campaign planner. Create a strategic plan to launch a marketing campaign:
You MUST output a structured JSON plan breaking the workspace workflow into sequential phases:
1. Research & Strategy
2. Content Generation
3. E-commerce Optimization
4. Measurement & Scaling

You MUST respond strictly in valid, parseable JSON conforming to this schema.

JSON Schema:
{
  "plan": [
    {
      "step": number,
      "phase": "string",
      "tool": "string",
      "prompt": "string"
    }
  ]
}`;
        userPrompt = `Plan a digital launch campaign for:
Product: ${product_name}
Category: ${category}
Audience: ${avatar}
Primary Tone: ${tone}`;
        break;

      case "communication":
        systemInstruction = `You are an elite communication copywriter and conversation architect. Generate complete communication AI templates:
- 1 Voice call outbound script with intro, core pitch, handled objections, and a soft CTA.
- 1 Live Chat widget conversational qualifying flow with welcome message, three qualifying questions, and a fallback response.
- 1 SMS template and 1 Social media DM template for custom follow-ups.
- 1 Missed-call text-back SMS auto-response.
- 1 Webinar dynamic registration page structure with title, bullet points, and follow-up webinar email template.

You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.

JSON Schema:
{
  "voiceScript": {
    "intro": "string",
    "pitch": "string",
    "objections": ["string"],
    "cta": "string"
  },
  "chatFlow": {
    "welcomeMessage": "string",
    "qualifyingQuestions": ["string"],
    "fallbackMessage": "string"
  },
  "smsDM": {
    "smsPromo": "string",
    "smsReminder": "string",
    "dmTemplate": "string"
  },
  "missedCallTextBack": {
    "smsText": "string",
    "followupDelay": "string"
  },
  "webinarFunnel": {
    "registrationHeadline": "string",
    "agendaPoints": ["string"],
    "postWebinarEmail": "string"
  }
}`;
        userPrompt = `Create an advanced multi-channel AI communication pack for:
Product: ${product_name}
Category: ${category}
Audience: ${avatar}
Pain Point: ${pain_point}
Desired Outcome: ${desired_outcome}
Brand Tone: ${tone}
Option/Offer Name: ${custom_offer}`;
        break;

      case "webinar_funnel":
        systemInstruction = `You are an elite high-ticket webinar funnel architect and conversion copywriter.
Generate a complete, fully detailed webinar marketing funnel modeled strictly around psychological urgency and high-ticket sales mechanisms.

Your response MUST be strictly valid, parseable JSON conforming to this schema:
{
  "registrationPage": {
    "headline": "string (Compelling benefit-driven headline for the webinar registration page)",
    "subhead": "string (Intriguing outline of the secret or core breakthrough)",
    "bulletPoints": ["string (3-4 highly specific bullet points outlining what attendees will learn)"],
    "ctaText": "string (Action-oriented CTA button text, e.g. 'Secure Private Broadcast Access Now')"
  },
  "confirmationEmail": {
    "subject": "string (Exciting subject confirming registration)",
    "body": "string (Friendly confirmation body with details, workbook mention, and adding to calendar advice)"
  },
  "reminderEmail1Hour": {
    "subject": "string (Urgent subject pointing out 1-hour count)",
    "body": "string (Brief body building curiosity and providing access link)"
  },
  "reminderEmail10Min": {
    "subject": "string (In-the-moment subject with starting notification)",
    "body": "string (High-priority call to action to join immediately)"
  },
  "scriptOutline": {
    "hook": "string (0-5 minute hook/intro script setting expectations)",
    "contentSections": ["string (3 key valuable shifts or training sections explained concisely)"],
    "pitchTransition": "string (Smooth logical shift from free training into presentation of the offer/solution)",
    "offerPitch": "string (Comprehensive overview of the offer, pricing model, bonuses, and limited slots)"
  },
  "postWebinarPitchEmail": {
    "subject": "string (Post-training follow-up pitch subject)",
    "body": "string (Email text summarizing the training value, introducing the main offer limit, and linking directly)"
  },
  "replayPage": {
    "headline": "string (Replay page title with urgency)",
    "summary": "string (Brief video recap copy summarizing why this training is expiring soon)",
    "coreCallToAction": "string (CTA linking to the premium checkout / application form)"
  }
}`;
        userPrompt = `Generate a high-converting, premium webinar funnel copy deck for:
Webinar Topic/Product: ${product_name}
Niche Category: ${category}
Target Audience / Avatar: ${avatar}
Core Offer / Incentive: ${custom_offer}
Primary Pain Point: ${pain_point}
Desired Outcome: ${desired_outcome}
Desired Tone: ${tone}

Ensure the output contains fully articulated paragraphs, realistic variables, and pristine copywriting structure.`;
        break;

      case "sales_enablement":
        systemInstruction = `You are a sales enablement copywriter. Generate practical B2B and high-ticket sales assets:
- 1 outbound Prospecting Outreach email focusing on value proposition and clear booking CTA.
- 1 physical/digital QR code engagement sequence page headers, offer, and user activation instructions.
- 1 follow-up sequence for physical/digital business cards (e.g. business card scanner scanner capture) that links to a scheduling widget.

You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.

JSON Schema:
{
  "prospectingOutreach": {
    "subject": "string",
    "intro": "string",
    "valueProposition": "string",
    "cta": "string"
  },
  "qrCodeFlow": {
    "welcomeHeader": "string",
    "incentiveOffer": "string",
    "redemptionInstructions": "string"
  },
  "bizCardFollowUp": {
    "subject": "string",
    "body": "string",
    "calendarCta": "string"
  }
}`;
        userPrompt = `Generate dedicated high-performance sales enablement templates for:
Product: ${product_name}
Audience: ${avatar}
Value: ${desired_outcome}
Offer: ${custom_offer}`;
        break;

      case "reputation_cx":
        systemInstruction = `You are a reputation manager and CX content architect. Generate templates to increase user trust and review retention:
- 1 Review Request outreach email containing a high-converting explanation and simple incentive.
- 1 Template replying to positive feedback (4-5 stars), and 1 reply template responding carefully to any negative reviews (1-2 stars) to turn around client frustrations.
- 1 dynamic Document/Contract Signing instructional text sequence with step-by-step guidance for clients.

You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.

JSON Schema:
{
  "reviewRequest": {
    "subject": "string",
    "body": "string",
    "incentive": "string"
  },
  "reputationReplies": {
    "positiveReviewReply": "string",
    "negativeReviewReply": "string"
  },
  "documentSigning": {
    "instructions": "string",
    "stepByStep": ["string"],
    "contractCta": "string"
  }
}`;
        userPrompt = `Generate a customer trust, reputation response, and document signing guide for:
Product Name: ${product_name}
Target Audience: ${avatar}
Expected Benefit: ${desired_outcome}
Pain Point to resolve: ${pain_point}`;
        break;

      case "operations":
        systemInstruction = `You are an operations-focused CRM automated messaging strategist. Generate system templates that trigger actions:
- 1 Booking & Appointment confirmation flow layout with reschedule terms.
- 2 Calendar reminder templates (a 24-hour warning SMS and a final 1-hour nudge SMS).
- 3 Pipeline Stage transition SMS/email template triggers (Lead-to-Qualified, Qualified-to-Proposal, Proposal-to-Closed-Won).

You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.

JSON Schema:
{
  "bookingFlow": {
    "confirmationMessage": "string",
    "reschedulePolicy": "string"
  },
  "calendarReminders": {
    "twentyFourHourSms": "string",
    "oneHourSms": "string"
  },
  "pipelineStageMessaging": {
    "leadToQualified": "string",
    "qualifiedToProposal": "string",
    "proposalToClosed": "string"
  }
}`;
        userPrompt = `Generate the dynamic operational setup texts for:
Product Name: ${product_name}
Target Audience: ${avatar}
Preferred Offer: ${custom_offer}`;
        break;

      case "voice_script":
        systemInstruction = `You are a conversation architect for high-converting outbound/inbound Voice AI sales agents.
Generate a structured, natural-sounding, and conversion-focused Voice AI simulation script.

Your response MUST be strictly valid, parseable JSON conforming to this schema:
{
  "greeting": "string",
  "qualification": ["string"],
  "valuePitch": "string",
  "objections": [
    { "objection": "string", "handler": "string" }
  ],
  "cta": "string",
  "fallback": "string"
}`;
        userPrompt = `Generate a Voice AI call script for:
Business Name: ${product_name}
Target Offer: ${custom_offer}
Target Audience / Avatar: ${avatar}
Goal / Primary Objective: ${desired_outcome}

The script should include:
- A warm personal greeting
- 2-3 natural qualification questions
- A concise, high-impact value pitch
- 2 common hypothetical objections handled professionally
- A clear Call to Action (CTA) matching the goal
- And an empathetic fallback option if the user is hesitant or unsure.`;
        break;

      case "quiz_survey":
        systemInstruction = `You are a conversation, landing page conversion, and lead qualification architect.
Generate a structured, interactive, and highly optimized diagnostics quiz / lead-qualification survey tailored specifically to convert visitors into booked sales leads for the given business.

Your response MUST be strictly valid, parseable JSON conforming to this schema:
{
  "title": "string (The title of the Quiz/Survey, e.g., 'B2B Sales Growth Diagnostic')",
  "description": "string (A compelling subtitle/description promoting the value exchange or complimentary audit)",
  "questions": [
    {
      "id": "string (unique identifier like q1, q2, etc)",
      "question": "string (The questionnaire text)",
      "type": "multiple-choice | short-text | scale",
      "options": ["string (3-5 options; only required if type is multiple-choice or scale)"],
      "scoring": [
        { "option": "string", "score": 5 }
      ],
      "segmentationTag": "string (a tag assigned to leads answering this way, e.g. 'high-intent-mid-market', 'low-budget-freelancer')"
    }
  ],
  "results": [
    {
      "range": "string (scoring range, e.g. '0-15' or '16-30')",
      "segment": "string (The segment name, e.g., 'Early Stage Struggling' or 'Hyper-growth Enterprise')",
      "heading": "string (Header for the outcome section)",
      "summary": "string (Personalized diagnostic result write-up explaining their status based on score)"
    }
  ],
  "recommendedAction": "string (The primary CTA recommendation for the prospect)"
}`;
        userPrompt = `Generate a high-converting lead qualification quiz/survey for:
Purpose/Product: ${product_name}
Target Audience / Avatar: ${avatar}
Target Offer: ${custom_offer}
Desired Outcome: ${desired_outcome}

The quiz/survey should:
- Have between 5 to 10 highly strategic qualification questions (asking about pain points, volume, timing, budget).
- Mix types: include multiple-choice, short-text (input fields), and scale options (e.g., rating from 1 to 5 or 1 to 10).
- Assign scoring logic to multiple-choice/scale answers to map to different final segments.
- Set descriptive lead segmentation tags.
- Offer custom-styled mock results mapped to ranges (e.g. low score, medium score, high score) with personalized breakdowns.`;
        break;

      case "conversational_chat":
        systemInstruction = `You are an elite conversational AI prompt engineer and conversation designer.
Generate a complete, high-converting, and dynamic Conversational AI Chat Flow script conforming to the user's business objective.

The conversation MUST follow a strict professional structure:
1. Greeting: A highly stylized, personalized initial bot welcome message.
2. 3 qualification questions: Exactly 3 strategic qualification questions to evaluate the user's intent. Each question must include distinct multiple-choice options and personalized branching follow-up responses based on what option is selected.
3. Offer Presentation: A highly persuasive offer presentation summarizing the core value and addressing the target user profile.
4. Booking CTA: An urgent call-to-action directing them to reserve a slot.
5. Human Handoff Message: An empathetic backup handoff message used when requested or when encountering any unhandled fallback scenarios.

You MUST respond strictly in valid, parseable JSON conforming to this schema. No markdown formatting, conversational intros, or code block markers.

JSON Schema:
{
  "greeting": "string (Compelling initial welcome/greeting hook)",
  "questions": [
    {
      "id": "string (unique ID like q1, q2, q3)",
      "question": "string (The qualification question text)",
      "options": ["string (Option A text)", "string (Option B text)", "string (Option C text)"],
      "branchingResponses": {
        "A": "string (Response if Option A is selected)",
        "B": "string (Response if Option B is selected)",
        "C": "string (Response if Option C is selected)"
      }
    }
  ],
  "offerPresentation": {
    "headline": "string (Compelling offer presentation headline)",
    "bullets": ["string (Value bullet 1)", "string (Value bullet 2)", "string (Value bullet 3)"],
    "ctaText": "string (The core call to action text, e.g., 'Claim Your Audit Slot Now')"
  },
  "bookingCta": "string (Direct scheduling invite instruction)",
  "handoffMessage": "string (Warm and natural human agent backup handoff statement)"
}`;
        userPrompt = `Generate a Conversational AI Chat Flow script for:
Business / Product: ${product_name}
Goal / Objective: ${desired_outcome || 'qualify and book high-intent partners'}
Niche Category: ${category}
Target Audience Profile: ${avatar}
Core Offer / Incentive: ${custom_offer}
Primary Pain Point to Bypass: ${pain_point}

Ensure the branching responses feel deeply authentic, conversational, and tailored to the choice.`;
        break;

      case "call_tracking": {
        const callType = inputs.call_type || "missed";
        const business = inputs.business || product_name;
        const offer = inputs.offer || custom_offer;

        systemInstruction = `You are an elite customer retention specialist and direct-response sequence copywriter.
Generate call tracking follow-up messages for active pipeline integrations.
The customer has a ${callType} call status.

You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.

JSON Schema:
{
  "smsFollowUp": "string (Short, punchy, conversion-focused SMS follow-up with friendly tone, mentioning the ${callType} call from ${business} and the special offer: ${offer})",
  "emailFollowUp": {
    "subject": "string (Subject line for the follow-up email)",
    "body": "string (The formatted email body incorporating ${business} and promoting the offer: ${offer} for a ${callType} call context, include placeholders like [First Name] and [Meeting Link])"
  },
  "voicemailScript": "string (Natural script for a warm voice voicemail message or callback template relating to the ${callType} call from ${business} and the offer: ${offer})"
}`;
        userPrompt = `Generate follow-up messages for a ${callType} call setup.
Business Name: ${business}
Representative Offer: ${offer}

The SMS follow-up should prompt immediate response over text.
The Email follow-up should be professional yet warm, detailing the benefit of the offer.
The Voicemail script should sound organic, dynamic, and easy to speak naturally.`;
        break;
      }

      case "inbound_responder": {
        const platform = inputs.platform || "Instagram";
        const goal = inputs.goal || desired_outcome || "schedule qualified appointments";
        const business = inputs.business || product_name;
        const offer = inputs.offer || custom_offer;
        const bookingLink = inputs.booking_link || "https://calendly.com/your-business/slot";

        systemInstruction = `You are an elite conversational direct-response automation specialist.
Generate an automated inbound messaging responder campaign tailored specifically for the ${platform} platform.
The primary marketing campaign goal is: ${goal}.

You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.

JSON Schema:
{
  "instantReply": "string (The immediate automated auto-reply triggered when a customer DMs or texts. Must be friendly, capture attention, mention they are talking to ${business}, and acknowledge the channel context for ${platform})",
  "qualificationQuestion": "string (A natural dynamic conversational question that helps pre-qualify the lead based on their bottleneck or intent related to ${goal})",
  "offerCta": "string (A punchy conversational pitch describing the special incentive offer: ${offer})",
  "bookingLinkMessage": "string (A warm call-to-action message containing the scheduling resource link: ${bookingLink})"
}`;
        userPrompt = `Generate inbound automated responder sequences for ${platform}.
Business/Brand Name: ${business}
Campaign Objective/Goal: ${goal}
Incentive Offer: ${offer}
Link to Schedule: ${bookingLink}

Make sure the copy is custom-designed for ${platform} user behavior (e.g. use fitting emojis, text lengths, hashtags or DM-style brevity where appropriate). Ensure high response probability.`;
        break;
      }

      case "social_calendar": {
        const business = inputs.business || product_name;
        const audience = inputs.avatar || avatar;
        const platforms = inputs.platform_focus || "TikTok, Instagram, LinkedIn";
        systemInstruction = `You are a social media copywriter and branding manager. Generate a high-performance 7-day social media content calendar (return a list of exactly 7 days of highly detailed templates to ensure depth, quality, and complete compliance within token constraints):
        
        You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.
        
        JSON Schema:
        {
          "calendar": [
            {
              "day": number,
              "platform": "string",
              "postIdea": "string",
              "caption": "string",
              "cta": "string",
              "hashtags": ["string"]
            }
          ]
        }`;
        userPrompt = `Generate a robust 7-day social media content calendar for:
        Business/Product: ${business}
        Audience Avatar: ${audience}
        Target Platforms: ${platforms}
        Brand Tone: ${tone}`;
        break;
      }

      case "outreach_scripts": {
        const audience = inputs.avatar || avatar;
        const offer = inputs.custom_offer || custom_offer;
        const channel = inputs.channel || "email";
        systemInstruction = `You are an elite B2B prospecting outreach manager. Generate hyper-personalized outreach scripts for ${channel}:
        - 3 highly creative outreach variations.
        - 1 follow-up message.
        - 1 high-friction bump message (gentle re-engagement nudge).
        
        You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.
        
        JSON Schema:
        {
          "variations": [
            { "title": "string (e.g., "Variation 1: Direct Value")", "subject": "string", "body": "string" }
          ],
          "followup": { "subject": "string", "body": "string" },
          "bump": { "subject": "string", "body": "string" }
        }`;
        userPrompt = `Generate premium outbound outreach templates for:
        Preferred Channel: ${channel}
        Target Avatar: ${audience}
        Incentive Offer: ${offer}
        Brand Tone: ${tone}`;
        break;
      }

      case "nurture_sequence": {
        const business = inputs.business || product_name;
        const offer = inputs.custom_offer || custom_offer;
        const audience = inputs.avatar || avatar;
        systemInstruction = `You are a CRM lifecycle retention architect. Generate a highly persuasive 5-message automated nurture sequence of 3 rich emails and 2 punchy SMS messages:
        
        You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.
        
        JSON Schema:
        {
          "emails": [
            { "step": "string (e.g., "Email 1: The Authority Hook")", "subject": "string", "body": "string" }
          ],
          "smsMessages": [
            { "step": "string (e.g., "SMS 4: Fast Deadline Nudge")", "body": "string" }
          ]
        }`;
        userPrompt = `Generate 5 high-converting nurture sequences for:
        Business Name: ${business}
        Target Avatar: ${audience}
        Preferred Offer: ${offer}`;
        break;
      }

      case "onboarding_content": {
        const business = inputs.business || product_name;
        const userType = inputs.user_type || "client";
        systemInstruction = `You are a customer success and mobile UX copywriter. Generate professional onboarding content for our white-labeled mobile app targeted at ${userType} users:
        - 1 warm, welcoming personalized in-app card message.
        - 1 clean feature overview summary.
        - 1 Actionable first steps onboarding checklist (4-5 steps).
        - 1 Call to Action to complete device setup.
        
        You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.
        
        JSON Schema:
        {
          "welcomeMessage": "string",
          "featureOverview": [
            { "title": "string", "desc": "string" }
          ],
          "checklist": ["string"],
          "cta": "string"
        }`;
        userPrompt = `Generate application setup onboarding content for:
        Business Partner: ${business}
        End-user Profile: ${userType}
        Desired Outcome: ${desired_outcome}`;
        break;
      }

      case "community_execution": {
        const audience = inputs.community_type || avatar || "Sovereign consultants";
        const goal = inputs.goal || desired_outcome || "achieve sustainable growth and retainers";
        systemInstruction = `You are a high-ticket community strategist and peer engagement architect. Generate an elite community-driven execution framework to drive activation and user retention:
        - 1 list of weekly challenges (3 items).
        - 1 accountability loops action plan.
        - 2 highly engaging peer-to-peer prompt ideas.
        - 1 monthly execution sprint schedule.
        - 1 robust, clean success tracking system proposal.
        
        You MUST respond strictly in valid, parseable JSON conforming to this schema. Do not output markdown around the JSON, only the raw parseable JSON object.
        
        JSON Schema:
        {
          "weeklyChallenges": ["string"],
          "accountabilityLoops": "string",
          "peerPrompts": ["string"],
          "monthlySprintPlan": "string",
          "successTrackingSystem": "string"
        }`;
        userPrompt = `Generate our custom community execution layout for:
        Community Type: ${audience}
        Target Goal: ${goal}`;
        break;
      }

      default:
        return res.status(400).json({ error: "Unsupported toolType requested." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.85,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No text content returned from Gemini API.");
    }

    const parsedJson = JSON.parse(outputText);
    return res.json({ isSimulated: false, data: parsedJson });

  } catch (error: any) {
    console.warn(`Copywriter system warning for toolType [${toolType}]: ${error.message}. Serving optimized static fallback.`);

    // HIGH QUALITY CUSTOM METRICS AND FALLBACK SEED CONTEXT
    let mockData: any = {};

    if (toolType === "seo") {
      mockData = {
        "blogPosts": [
          {
            "keyword": `${category.toLowerCase()} guide`,
            "title": `The Absolute Guide to ${category}: How to Achieve ${desired_outcome} Comfortably`,
            "outline": [
              "Understanding the biggest secret of professional workflows",
              `Addressing ${pain_point} without burning out`,
              `Step-by-step tutorial using ${product_name} safely`,
              "Crucial mistakes to avoid when scaling your conversion frameworks"
            ],
            "cta": `Request custom setup guidelines for ${product_name} from our optimization coaches.`
          },
          {
            "keyword": `why does ${pain_point.toLowerCase()} happen`,
            "title": `Struggling with ${pain_point}? Here is the Scientific Blueprint to Resolve It`,
            "outline": [
              "Finding the root cause of systemic fatigue",
              "How top-tier industry players bypass manual spreadsheet errors",
              `The metabolic workflow formula to trigger ${desired_outcome}`
            ],
            "cta": `Download our free conversion handbook built around ${product_name}.`
          },
          {
            "keyword": `best way to get ${desired_outcome.toLowerCase()}`,
            "title": `3 Automated Protocols to Lock in ${desired_outcome} Guaranteed`,
            "outline": [
              "The cost of choice fatigue and delayed outreach",
              "Fusing natural copywriting styles with structured lead scoring",
              "A review of high-performance analytics strategies for modern teams"
            ],
            "cta": `Request a guided off-market strategic sourcing tutorial.`
          }
        ],
        "pillarOutline": {
          "title": `The Unified Roadmap to Effortless ${desired_outcome}`,
          "h1": `The Ultimate Pillar Handbook: Transition Your Workflow from ${pain_point} to ${desired_outcome}`,
          "h2s": [
            {
              "heading": "The Real Problem with Manual Systems",
              "bullets": [
                `Why 90% of team outreach is stuck in slow pipelines`,
                "Analyzing the compound interest of pipeline friction"
              ]
            },
            {
              "heading": "Implementing a High-Converting Strategy",
              "bullets": [
                `Aligning team avatars with their most fundamental core pain: ${pain_point}`,
                "Crafting high-contrast landing pages with clear, bulleted benefits"
              ]
            }
          ],
          "landingPageOutline": {
            "h1": `Slash Your Overhead and Achieve ${desired_outcome} in Under 14 Days!`,
            "h2s": [
              "Why Traditional CRMs Waste Precious Sourcing Hours",
              `Unlock Cohesive Campaigns Built Tailored to Your Specific Demographics`
            ],
            "benefits": [
              `Eliminate ${pain_point} starting on day one`,
              `Connect directly with your primary avatar list: ${avatar}`,
              `Enjoy bespoke sizing, active guidance, and real-time support`
            ],
            "cta": `Claim Your Starter Optimization Seat For ${product_name} Today!`
          }
        }
      };
    } else if (toolType === "social") {
      mockData = {
        "reels": [
          {
            "hook": `Stop letting ${pain_point.toLowerCase()} hold you back! 🛑`,
            "body": `If you're an ambitious ${avatar}, you deal with this daily. The secret isn't working extra hours. It is automating lead capture with premium active extracts. Here is how we do it!`,
            "cta": `Tap the link in our bio to grab the dynamic starter set of ${product_name}.`,
            "visualCue": "Splitscreen of a user feeling stressed by files, transitioning to them holding a gorgeous glowing serum bottle."
          },
          {
            "hook": `This 3-minute morning secret saves busy executives 12 hours a week... ⏳`,
            "body": `Choice fatigue is real. Our elite customers pair organic materials with metabolic interval rules so everything flows perfectly. Watch our demonstration.`,
            "cta": `Send us a direct message with 'DREAM' for custom sizing assistance.`,
            "visualCue": "Fast visual transition montage showing product details in crisp studio lighting."
          }
        ],
        "instagramCarousel": {
          "slides": [
            { "slideNumber": 1, "title": "Bypass morning choice anxiety forever", "visualCue": "Elegant typography over neutral aesthetic marble background.", "caption": "Let's be honest, having to choose out of 100 messy things slows you down." },
            { "slideNumber": 2, "title": `Understand your real bottleneck: ${pain_point}`, "visualCue": "A high-contrast graphic with a bottleneck icon.", "caption": "Most systems lose valuable prospects simply because of manual delays." },
            { "slideNumber": 3, "title": `The modern solution is ${product_name}`, "visualCue": "A sleek studio shot showcasing the primary benefits.", "caption": "Guaranteed results inside 14 days with zero complicated training." },
            { "slideNumber": 4, "title": `Achieving sustainable ${desired_outcome}`, "visualCue": "A beautiful photo highlighting satisfied customers.", "caption": "Enjoy tailored support, clean certifications, and ultimate confidence." },
            { "slideNumber": 5, "title": "Secure your exclusive kit", "visualCue": "A high-contrast card showing custom launch coupon.", "caption": "Click the bio link to secure $50 off your starter capsule this week only!" }
          ]
        },
        "linkedinPosts": [
          {
            "angle": "Professional Workflow Efficiency Metrics",
            "headline": `Why Busy ${avatar} struggle with ${pain_point}`,
            "bodyText": `Manual lead management scales linearly—until it breaks. If you want to elevate your team to ${desired_outcome}, you must integrate automated pipelines. Discover how we helped agencies transition in under a week.`
          }
        ],
        "communityPost": {
          "postType": "Interactive Audience Poll",
          "questionText": `What is currently the single biggest hurdle preventing you from scaling your workflow?`,
          "suggestedOptions": [
            `Constant choice fatigue & manual entry`,
            `Losing track of warm leads / drops`,
            `Overwhelming high-intensity tasks`,
            `Finding high-intent off-market channels`
          ]
        }
      };
    } else if (toolType === "email") {
      mockData = {
        "sequence": [
          {
            "emailNumber": 1,
            "stage": "Welcome & Extreme Value",
            "subject": `Welcome to Elegance! Here is your ${product_name} Blueprint inside 🎁`,
            "preview": `How busy professionals bypass ${pain_point} to secure ${desired_outcome}.`,
            "body": `Hi there,\n\nWe designed ${product_name} specifically because we could no longer stand seeing talented people suffer from ${pain_point}.\n\nAs a busy ${avatar}, your time is priceless. Over the coming days, we are going to outline the exact three movements to restore functional balance and reclaim your daily stamina.\n\nEnjoy our master styling blueprints and feel free to reach out with your specs.\n\nWarm regards,\nThe Creative Sourcing Team`,
            "cta": `Explore the Starter Catalog`
          },
          {
            "emailNumber": 2,
            "stage": "Social Proof & Education",
            "subject": "Case Study: How 4,000+ customers solved styling dread forever",
            "preview": "Real numbers from busy mothers and executives.",
            "body": `Hi there,\n\nDid you know that ninety percent of a traditional closet or inbox remains completely unused?\n\nThat isn't just wasteful—it is stressful. Meet Sarah, a skeptical customer who spend years with ${pain_point}.\n\nWithin her first 14 days of adopting our automated lifestyle system, she successfully slashed outfit decisions by eighty percent and restored her youthful natural radiance.\n\nOur botanical and metabolic frameworks have been approved by leading wellness experts worldwide. Read how it works.`,
            "cta": "Read Customer Stories"
          },
          {
            "emailNumber": 3,
            "stage": "Special Offer & Limited Batch Urgency",
            "subject": `Exclusive VIP Offer: Save $50 on your custom starter set! 🕒`,
            "preview": "Our small-batch organic harvest is booking up rapidly.",
            "body": `Hello,\n\nMorning styling friction or spreadsheet manual clutter is optional. It is time to step into premium confidence.\n\nWe have unlocked code "luxurycode50" for you to receive a $50 discount on your custom starter suite. Since we craft each set using bespoke materials and tailored sizing, slots are strictly limited.\n\nSecure your style advisor session today before this slot expires!\n\nAll our best,\nThe Team`,
            "cta": `Secure My Starter Set & Save $50`
          }
        ]
      };
    } else if (toolType === "ads") {
      mockData = {
        "metaAds": [
          {
            "variantName": "Emotional Problem-Solution Hook",
            "primaryText": `Struggling with ${pain_point}? You're not alone. Our organic, metabolic ${product_name} is custom-formulated for busy ${avatar} to achieve ${desired_outcome} with zero anxiety. Join 15,000+ happy members today!`,
            "headline": "Less Decision Fatigue, More Living.",
            "description": "Premium tailor-made organic sets delivered directly to your doorstep.",
            "cta": "Shop Now"
          },
          {
            "variantName": "Direct Functional Offer Variant",
            "primaryText": `Meet the ethical starter suite designed to eliminate ${pain_point} forever. Designed to help busy ${avatar} thrive with our certified 3-step active routine. Try it risk-free with our 30-day wear-and-love guarantee!`,
            "headline": `Achieve ${desired_outcome} in 3 Minutes`,
            "description": "Unlock $50 OFF custom collections with coupon luxurycode50.",
            "cta": "Get Guide"
          }
        ],
        "googleSearchAds": [
          {
            "groupName": "High Intent Solutions Group",
            "headlines": [
              `Best way to solve ${category}`,
              `Efficient ${product_name} Set`,
              "Zero Choice Clutter System"
            ],
            "descriptions": [
              `Durable physical sets built natively for busy ${avatar} to achieve outstanding active results.`,
              `Guaranteed 14-day transition or your money back. Skip public bidding stress entirely.`
            ]
          }
        ]
      };
    } else if (toolType === "pdp") {
      mockData = {
        "productTitle": `${product_name} Custom Restoration Suite`,
        "shortDescription": `The premier premium collection designed explicitly for busy ${avatar} to eliminate ${pain_point} and lock in pristine, life-long ${desired_outcome} in under 3 minutes a day.`,
        "longDescription": `You are overworked, and traditional systems have failed you. Complex chemical skin layers or 2-hour gym routines are no longer sustainable. That is why we designed ${product_name}.\n\nBy uniting phyto-active organic botanicals with joint-safe metabolic guidelines, we have built a beautiful, durable uniform. It cuts morning anxiety, restores glowing confidence, and lets you prioritize sustainable aesthetics without sacrificing premium results.`,
        "keyBenefits": [
          `Eliminates constant ${pain_point} immediately upon initial setup`,
          `Saves average users up to 12 precious hours every single month`,
          "Designed with certified eco-luxe materials built for durability",
          "Guaranteed glowing physical transition within 14 days"
        ],
        "technicalSpecs": [
          `Materials: 100% Certified Organic Phyto-Active Sea Buckthorn & Bamboo Silk`,
          "Dimensions: Standard Travel-Ready Sleek Geometric Tubes",
          "Sizing: Fully adjustable custom parameters with style advisor support"
        ],
        "sizeFitGuidance": "Standard size recommendations: We include complimentary styling calls with each custom order. Our team will reach out after checkout to verify perfect fitting.",
        "whoIsFor": [
          `Busy ${avatar} looking for simple premium shortcuts`,
          "Skeptical individuals frustrated by low-quality fast alternatives"
        ],
        "whoIsNotFor": [
          "Organizations hunting for ultra-cheap, mass-produced plastic variants",
          "Anyone who loves complex, high-maintenance 12-step chemical regimes"
        ],
        "productFAQs": [
          {
            "question": `Why is ${product_name} different from cheaper market alternatives?`,
            "answer": "We avoid mass-production synthetics. Each batch is sustainably cold-pressed and hand-tailored to order."
          },
          {
            "question": "What is your satisfaction guarantee policy?",
            "answer": "We proudly support a 14-day glowing skin validation and 30-day wear-and-love risk-free trial."
          }
        ]
      };
    } else if (toolType === "visual") {
      mockData = {
        "shotList": [
          { "shotNumber": 1, "type": "Hero Studio Macro", "setting": "White marble counter under clean glowing amber lights", "purpose": "Highlight premium geometric bottle styling and botanical texture" },
          { "shotNumber": 2, "type": "Lifestyle Usage Cut", "setting": "Warm morning wardrobe area with soft organic fabrics", "purpose": `Demonstrate capsule wardrobe styles in under sixty seconds` }
        ],
        "unboxingScript": {
          "narratorPersona": "Elegant, authentic, supportive wellness host",
          "scenes": [
            { "sceneNumber": 1, "visuals": "Sleek forest green minimal card stock package slides open to reveal custom size guidelines card.", "audio": "Welcome to your new morning routine. You can instantly feel the premium weight of the custom linen lining..." }
          ]
        },
        "storyboard360": [
          { "frameNumber": 1, "viewAngle": "Front close-up focus", "focusDetails": "Eco-luxe certified seal and physical dynamic typography layout highlights" }
        ]
      };
    } else if (toolType === "social_proof") {
      mockData = {
        "reviews": [
          {
            "customerName": "Elena Rostova",
            "avatarPersona": "Skeptical busy mom",
            "ratings": 5,
            "reviewBody": `I had spent hundreds on premium cosmetics and complex trainers, but my morning routine was still a complete mess. Within my first week of using ${product_name}, my schedule is streamlined and my skin is gorgeous!`,
            "beforeSituation": pain_point,
            "afterSituation": desired_outcome
          },
          {
            "customerName": "David Chen, PE",
            "avatarPersona": "Busy executive",
            "ratings": 5,
            "reviewBody": `This replaced my exhausting gym searches completely. 20 minutes from home and I have regained the lean athletic energy I had in my twenties. Lower back stiffness is gone!`,
            "beforeSituation": "Sinking lots of money into public gyms and feeling constant stiff joints",
            "afterSituation": "Sustained joint stability and effortless bodyweight interval conditioning"
          }
        ],
        "testimonialBlock": {
          "quote": `Using ${product_name} has completely eliminated my choice fatigue. We managed to scale our warm leads conversion while our team regained hours of focused, creative tranquility. This is the gold standard of SaaS customer lifecycle support.`,
          "author": "Marcus Sterling, CEO",
          "credentials": "Fast-Growth Marketing Lead",
          "tagline": "Unparalleled Professional Growth Transformation"
        },
        "ugcPrompts": [
          {
            "title": "The 'Dressed in Under 60 seconds' Challenge",
            "description": "Prompt users to film a quick TikTok showcasing their messy closet, followed by a snap-cut wearing our 5-piece capsule looks.",
            "viralIncentive": "Free premium silk matching scarf accessory ($175 value) for the top 5 most viewed videos."
          }
        ]
      };
    } else if (toolType === "support") {
      mockData = {
        "faqs": [
          { "question": "When can I expect my shipment to arrive?", "answer": `We ship daily. Your custom box will arrive in exactly ${shipping_time} in standard regional zones.` },
          { "question": "How long is the active trial period?", "answer": `We support a robust ${return_window} return policy on custom sizing.` }
        ],
        "shippingPolicy": `We proudly offer express tracked courier premium shipping to ${regions}. Average shipping time is ${shipping_time} from our custom organic labs.`,
        "returnsPolicy": `If you are not 100% satisfied with your results or custom sizing, contact our styling advisors inside ${return_window} for a friendly full refund.`,
        "trustCopy": "🔒 Encrypted SSL connection. Certified direct checkout via Stripe Payment Protocols. We protect your personal data.",
        "supportTemplates": {
          "whereIsMyOrder": `Subject: Order Status Query - [ORDER_NUMBER]\n\nHello Sourcing Team,\n\nI am checking the tracking status for my custom ${product_name} set shipped to ${regions}. Please confirm deployment.\n\nWarmly,\n[Client Name]`,
          "returnsAndExchanges": `Subject: Return Request - [ORDER_NUMBER]\n\nHello CX Stylist,\n\nI would like to initiate a return under my ${return_window} wear-and-love guarantee of my custom size. Please advise returns warehouse code.\n\nThank you,\n[Client Name]`
        }
      };
    } else if (toolType === "analytics_story") {
      mockData = {
        "dataStory": {
          "whatsWorking": `Our primary paid social traffic from focus groups is converting leads at an impressive twelve percent, proving deep resonance with target ${avatar} profiles.`,
          "underperforming": "Email open rates are sitting at a low twenty-two percent, causing down-funnel nurture bottlenecks and raising overall customer CPA.",
          "leakPoints": `Product details page is leaking traffic, converting visitors at only one-and-a-half percent. Visitors are suffering from checkout choice fatigue.`
        },
        "experiments": {
          "adsTest": `A/B test: Headline focusing on ${pain_point.toLowerCase()} versus another focused on the speed of securing ${desired_outcome.toLowerCase()}.`,
          "emailsTest": "A/B test: Subject lines using high-contrast bold emojis and personalization tags, versus short clinical question-based structures.",
          "pdpTest": `A/B test: Interactive product details page featuring customer video unboxing vs custom bullet list of specs.`
        },
        "strategicInsights": {
          "storefrontOptimizations": [
            "Embed dynamic Stripe secure checkout badges directly in line under the primary checkout call-to-action button.",
            "Condense spacing margins and reduce vertical padding on mobile viewport to prevent early reader bounce."
          ],
          "messagingRefinements": [
            `Shift narrative focus toward organic certifications to satisfy picky, skeptical ${avatar} mindsets.`,
            `Include direct testimonials highlighting Sarah's 14-day botanical glowing transformation clearly.`
          ]
        }
      };
    } else if (toolType === "orchestrator") {
      mockData = {
        "plan": [
          { "step": 1, "phase": "Research & Strategy", "tool": "LLM Copywriter", "prompt": `Formulate 3 distinct client personas for ${product_name} inside category ${category}, highlighting their most specific anxieties.` },
          { "step": 2, "phase": "Content Generation", "tool": "SEO Brief", "prompt": `Provide 3 comprehensive high-intent blog post titles and outline structures targeting the primary keyword: ${category.toLowerCase()} guide.` },
          { "step": 3, "phase": "E-Commerce Optimization", "tool": "Visual Concepts & PDP Builder", "prompt": `Draft a full Product Details Page long storytelling narrative, highlighting eco-luxe Bamboo Silk and clinical sea buckthorn certifications.` },
          { "step": 4, "phase": "Measurement & Scaling", "tool": "Campaign Enforcer & Analyst", "prompt": `Prepare 3 specific A/B tests to optimize low email open rates and reduce paid ads overall customer acquisition cost.` }
        ]
      };
    } else if (toolType === "communication") {
      mockData = {
        "voiceScript": {
          "intro": `Hi [Contact Name], this is Alex with the ${product_name} team. I noticed you recently explored our conversion and engagement resources.`,
          "pitch": `We specialize in helping ${avatar} overcome ${pain_point}. Our automated system is custom-built to deliver reliable, stress-free ${desired_outcome} in less than 14 days, without requiring complex setup.`,
          "objections": [
            "Obj: 'I don't have enough time for setup.' Ans: Our onboarding is fully handled in under 5 minutes by our technical support agents.",
            "Obj: 'Is this secure and proven?' Ans: Yes, we are backed by Stripe secure payment protocols and have over 15,000 satisfied members."
          ],
          "cta": "Would you be open to a brief 10-minute demo this Thursday at 2 PM to explore a tailored playbook?"
        },
        "chatFlow": {
          "welcomeMessage": `👋 Welcome! Looking to replace ${pain_point.toLowerCase()} with a sleek, automated solution? I can help you find the perfect fit!`,
          "qualifyingQuestions": [
            "Are you primarily looking to save hours of manual work, or scale your conversion metrics?",
            "What is your target timeline to see results (1 week, 2 weeks, or a month)?",
            `What is the best email to send your customized ${product_name} roadmap blueprint to?`
          ],
          "fallbackMessage": "Got it! Realizing your goals is our priority. Let me connect you directly to our live growth coach now."
        },
        "smsDM": {
          "smsPromo": `🔥 Quick message from ${product_name}! Use coupon "luxurycode50" in the next 24 hours to secure $50 off your customized starter set. Redeem here: [LINK]`,
          "smsReminder": `Hey [Name]! Just a gentle reminder that your personalized styling session begins in 15 minutes. See you here: [LINK]`,
          "dmTemplate": `Hey [Username]! Appreciate you checking out our latest post on ${desired_outcome}. We crafted a direct guide specifically for ${avatar} to bypass ${pain_point.toLowerCase()}. Let me know if you want me to drop the free access link in your inbox! 📩`
        },
        "missedCallTextBack": {
          "smsText": `Hi! Sorry we missed your call. We're currently helping another partner achieve ${desired_outcome}. Is there something specific about ${product_name} we can answer via text? 💬`,
          "followupDelay": "Instant (triggered 45 seconds after missed inbound call)"
        },
        "webinarFunnel": {
          "registrationHeadline": `Bypass ${pain_point} and Unlock Masterful CRM Conversion Speed`,
          "agendaPoints": [
            `Why traditional slow pipelines leak over fifty percent of warm leads`,
            `The 3-step active routine Sarah used to reclaim 12 hours every single month`,
            "Live demonstration of our automated client scoring and Stripe integration"
          ],
          "postWebinarEmail": `Subject: The replay inside: How ${avatar} streamline outreach\n\nHi [Name],\n\nThank you for joining our live masterclass! As promised, here is the replay link along with your $50 launcher coupon.\n\nDon't let manual choice fatigue slow down your group. Let's make this year your most automated and conversion-driven yet!\n\nWarmly,\n[Sender Name]`
        }
      };
    } else if (toolType === "webinar_funnel") {
      mockData = {
        "registrationPage": {
          "headline": `How ${avatar} Can Bypass ${pain_point || 'High CPA'} and Scale to ${desired_outcome || 'Consistent Growth'}`,
          "subhead": `A specialized masterclass to automate your scaling workflow and deploy high-converting brand audits in under 15 minutes.`,
          "bulletPoints": [
            `The EXACT 3-step automation blueprint Sarah used to replace manual qualification with AI-powered diagnostics.`,
            `How to bulletproof your CRM routing to target qualified high-budget partnerships while reclaiming 12+ executive hours each week.`,
            `The critical pricing mistake that leaks over fifty percent of warm traffic before they convert into booked sales calls.`
          ],
          "ctaText": "Secure Private Broadcast Access Now"
        },
        "confirmationEmail": {
          "subject": "🎉 You're Confirmed: Your Custom Optimization Masterclass Details Inside",
          "body": `Hi [Name],\n\nYou have successfully locked in your private broadcast access to the webinar!\n\nHere are the critical details you need to save:\n- Topic: How to Bypass ${pain_point} & Scale to ${desired_outcome}\n- Private Broadcast Link: [ACCESS_LINK]\n\n👉 ACTION ITEM: Download your complimentary masterclass workbook [WORKBOOK_LINK] so you can follow along with the real-time AI builder exercises. We recommend adding this session to your calendar right now to protect your seat.`
        },
        "reminderEmail1Hour": {
          "subject": "⏳ 1 HOUR to Broadcast: Unlock the Custom Scaling Playbook",
          "body": `Hi [Name],\n\nWe are starting the private stream in exactly 60 minutes.\n\nGrab a coffee, download the workbook, and prepare your questions for the live interactive Q&A session at the end. We only have 500 lines available on our live server, so make sure to dial in 10 minutes early to secure your slot.\n\nJoin the live broadcast line here: [ACCESS_LINK]`
        },
        "reminderEmail10Min": {
          "subject": "🚨 WE ARE GOING LIVE: Join the Scaling Masterclass Now!",
          "body": `Hey [Name],\n\nThe webinar room is open and our presentation has just started!\n\nWe are sharing the exact workflow to automate your CRM leads and secure high-value partnerships using the newly launched Sovereign Agency copy models.\n\nClick here to claim your virtual seat instantly: [ACCESS_LINK]`
        },
        "scriptOutline": {
          "hook": "Welcome everybody! If you are a high-ticket specialist or operator trying to serve your target avatar but constantly losing warm traffic to competitive choice-fatigue with high CPA, you are in the exact right place. Over the next 45 minutes, we are lifting the veil on how to easily deploy interactive diagnostics systems that pre-qualify leads on auto-pilot.",
          "contentSections": [
            "SECTION 1: Bypassing manual intake bottlenecks - Why requiring lengthy text fields and phone screens kills 50%+ of potential high-value clients.",
            "SECTION 2: The Scoring Logic Framework - How custom scoring ranges (Low, Medium, High) can tag, categorize, and personalize outcome pages automatically.",
            "SECTION 3: Integration and Booking - Live walkthrough of syncing submissions into your active CRM pipeline and offering immediate VIP alignment slots."
          ],
          "pitchTransition": "Now, you can take what you've learned today and attempt to manually write your own code or integrate disjointed third-party forms. Or, you can choose to skip the line entirely. We have created a fully automated suite specifically tailored for your goals.",
          "offerPitch": `Introducing our exclusive: ${custom_offer || 'The 15-Minute Pipeline Optimization Blueprint'}. For a limited time, you get completely custom-built qualification modules, elite copywriting access keys, and direct system setup with our head architects. We are offering this premium setup with zero complex onboarding overhead, but we only have 7 implementation slots available for this cohort due to high support quality.`
        },
        "postWebinarPitchEmail": {
          "subject": "🚀 Your complimentary blueprint is expiring (7 slots remaining)",
          "body": `Hi [Name],\n\nThank you for attending our live masterclass! We had an incredible turnout and the response to our automated conversion modules has been overwhelming.\n\nAs promised, we want to help you secure ${desired_outcome} without any setup headache.\n\nFor the next 48 hours only, you can unlock full access to the ${custom_offer || 'Pipeline Optimization Blueprint'}.\n\n👉 Secure your VIP alignment slot before all slots are claimed: [BOOK_LINK]\n\nWarmly,\n[Sender Name]`
        },
        "replayPage": {
          "headline": "🔴 Broadcast Replay: Bypass High CPA & Scale Your Pipeline On Autopilot",
          "summary": "Watch this exclusive, high-value training detailing the precise steps to deploy interactive diagnostics that score lead intent. This video replay and associated bonuses will expire in exactly 48 hours.",
          "coreCallToAction": "Claim Your Complimentary Pipeline Optimization Blueprint Here"
        }
      };
    } else if (toolType === "sales_enablement") {
      mockData = {
        "prospectingOutreach": {
          "subject": `Quick ideas to streamline ${category} outreach`,
          "intro": `Hi [First Name],\n\nI've been reviewing how fast-growing agencies in the ${category} space coordinate their customer lists, and noticed a common trend.`,
          "valueProposition": `Most teams are losing up to half of their potential conversions due to ${pain_point}. With ${product_name}, we help teams like yours secure sustainable ${desired_outcome} without complex software integration.`,
          "cta": "Would you be against a short chat next Tuesday to see if we can unlock a similar 14-day growth transition for your team?"
        },
        "qrCodeFlow": {
          "welcomeHeader": `Scan Successful! Welcome to ${product_name} Portal`,
          "incentiveOffer": `Claim $50 Off Your Inaugural Starter Capsule Kit`,
          "redemptionInstructions": "Enter your professional email below to claim your exclusive offline-to-online connector coupon. Code will be instantly applied at Stripe checkout."
        },
        "bizCardFollowUp": {
          "subject": `Great connecting at the summit! Let's sync up`,
          "body": `Hi [First Name],\n\nIt was excellent meeting you and learning of your current focus on serving ${avatar}.\n\nSince we discussed how to streamline client onboarding and avoid ${pain_point}, I wanted to share this direct link to our optimization scheduler.`,
          "calendarCta": "Book 15 Minutes on my Live Calendar here: [LINK]"
        }
      };
    } else if (toolType === "reputation_cx") {
      mockData = {
        "reviewRequest": {
          "subject": `How was your experience with ${product_name}? 🌟`,
          "body": `Hi [Name],\n\nCustomer satisfaction is our ultimate passion. We designed this suite to eliminate ${pain_point}, and we would love to hear if it helped you feel more confident.\n\nCould you spare 60 seconds to share your support journey?`,
          "incentive": "As a thank you, we will immediately send you a free premium botanical silk travel bag ($45 value) once your feedback is posted."
        },
        "reputationReplies": {
          "positiveReviewReply": `Thank you so much, [Name]! We are thrilled to hear that ${product_name} helped you overcome decision anxiety and achieve sustainable results. Our styling specialists appreciate your continuous support!`,
          "negativeReviewReply": "Hi [Name], we are deeply sorry that your experience did not meet expectations. We take custom sizing and software reliability seriously. Please contact our VIP care team directly at support@workspace.com so we can make this right immediately."
        },
        "documentSigning": {
          "instructions": "Please review and complete your service agreement securely below to lock in your custom delivery timeline:",
          "stepByStep": [
            `Verify your custom sizing and selected package quantities in Section 1.`,
            "Review our 30-day wear-and-love return guarantee in Section 4.",
            "Apply your secure digital signature in the green designated box."
          ],
          "contractCta": "Sign Document Securely via DocuSign"
        }
      };
    } else if (toolType === "operations") {
      mockData = {
        "bookingFlow": {
          "confirmationMessage": `✅ Booking Confirmed! Your personalized ${product_name} Setup Session is locked in for [Date] at [Time].`,
          "reschedulePolicy": "Rescheduling is free if requested at least 24 hours prior to your slot. Contact your dedicated success stylist at help@workspace.com."
        },
        "calendarReminders": {
          "twentyFourHourSms": `Reminder: Your ${product_name} consultation is in 24 hours on [Date] at [Time]. We will explore custom solutions to achieve ${desired_outcome}!`,
          "oneHourSms": `Starting soon! Your styling call begins in 1 hour. Grab a coffee and join here: [LINK]`
        },
        "pipelineStageMessaging": {
          "leadToQualified": `Hi [Name]! Great news: your lead profile is now Qualified. We have assigned a senior consultant to prepare your customized ${category} proposal.`,
          "qualifiedToProposal": `Your personalized ${product_name} integration proposal is ready! Review the bespoke pricing details and deliverables here: [LINK]`,
          "proposalToClosed": `🎉 Welcome aboard! Your agreement has been finalized. We are preparing to dispatch your custom package to ${regions}. Onboarding begins today!`
        }
      };
    } else if (toolType === "voice_script") {
      mockData = {
        "greeting": `Hi [Contact Name], this is Alex calling from the ${product_name} team. I noticed you recently checked out our resources for ${desired_outcome} and wanted to reach out. Do you have about 2 minutes?`,
        "qualification": [
          "Are you currently handling your operations manually, or are you looking to automate systems this quarter?",
          "What is the biggest barrier keeping you from scaling (e.g. lead follow-up speed, admin overhead, or lack of staff)?"
        ],
        "valuePitch": `I completely understand. That's exactly why we built our customized ${custom_offer}. It helps ${avatar} bypass ${pain_point} and scale outreach securely in under 14 days, with zero complex technical setups.`,
        "objections": [
          { "objection": "I don't have time to set this up right now.", "handler": "Our dedicated CRM deployment specialists handle 95% of the setup for you. We only need 5 minutes of your input." },
          { "objection": "Is this secure with existing lead bases?", "handler": "Absolutely. We are SOC2 and Stripe Secure certified, maintaining full encryption audits across all active pipelines." }
        ],
        "cta": `If you're open to it, I can secure a free 15-minute diagnostic session for you this week to design your custom roadmap. Would tomorrow afternoon work?`,
        "fallback": "No worries at all! Let me send you our 10-minute automated workbook to your email so you can check it out on your own page. What's the best email to drop that off?"
      };
    } else if (toolType === "quiz_survey") {
      mockData = {
        "title": `Accelerated Performance & Scaling Qualification Diagnostic`,
        "description": `Discover if you qualify for our exclusive complimentary 1-on-1 strategy audit. Takes 90 seconds.`,
        "questions": [
          {
            "id": "q1",
            "question": `Which best describes your current operations level for ${product_name}?`,
            "type": "multiple-choice",
            "options": [
              "Hobbyist / Pre-Revenue Solo Operator",
              "Established business with regular customer flow",
              "Rapidly scaling high-volume enterprise agency"
            ],
            "scoring": [
              { "option": "Hobbyist / Pre-Revenue Solo Operator", "score": 2 },
              { "option": "Established business with regular customer flow", "score": 6 },
              { "option": "Rapidly scaling high-volume enterprise agency", "score": 10 }
            ],
            "segmentationTag": "hobbyist-pre-rev"
          },
          {
            "id": "q2",
            "question": `What is your biggest roadblock in targeting ${desired_outcome || 'growth'}?`,
            "type": "multiple-choice",
            "options": [
              "Failing to attract high-intent leads consistently",
              "Time-consuming manual setup or staff overload",
              "Low conversion rates on sales calls / checkouts"
            ],
            "scoring": [
              { "option": "Failing to attract high-intent leads consistently", "score": 5 },
              { "option": "Time-consuming manual setup or staff overload", "score": 8 },
              { "option": "Low conversion rates on sales calls / checkouts", "score": 7 }
            ],
            "segmentationTag": "roadblock-acquisition"
          },
          {
            "id": "q3",
            "question": "What is your target monthly budget allocation for operations and growth?",
            "type": "multiple-choice",
            "options": [
              "Under $1,000 / month",
              "$1,000 to $5,000 / month",
              "Over $5,000 / month"
            ],
            "scoring": [
              { "option": "Under $1,000 / month", "score": 3 },
              { "option": "$1,000 to $5,000 / month", "score": 7 },
              { "option": "Over $5,000 / month", "score": 10 }
            ],
            "segmentationTag": "budget-qualified"
          },
          {
            "id": "q4",
            "question": "How quickly are you looking to launch this?",
            "type": "multiple-choice",
            "options": [
              "Immediately (Within the next 7 days)",
              "This quarter (Next 30-90 days)",
              "Just gathering data/research right now"
            ],
            "scoring": [
              { "option": "Immediately (Within the next 7 days)", "score": 10 },
              { "option": "This quarter (Next 30-90 days)", "score": 5 },
              { "option": "Just gathering data/research right now", "score": 1 }
            ],
            "segmentationTag": "timeline-critical"
          },
          {
            "id": "q5",
            "question": "Rate your current digital conversion speed state (1 = low, 10 = master):",
            "type": "scale",
            "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            "scoring": [
              { "option": "1", "score": 1 },
              { "option": "2", "score": 2 },
              { "option": "3", "score": 3 },
              { "option": "4", "score": 4 },
              { "option": "5", "score": 5 },
              { "option": "6", "score": 6 },
              { "option": "7", "score": 7 },
              { "option": "8", "score": 8 },
              { "option": "9", "score": 9 },
              { "option": "10", "score": 10 }
            ],
            "segmentationTag": "conversion-rating"
          },
          {
            "id": "q6",
            "question": `Please describe how you currently address your primary ${avatar || 'customer'} audience:`,
            "type": "short-text",
            "options": [],
            "scoring": [],
            "segmentationTag": "audience-insight"
          }
        ],
        "results": [
          {
            "range": "0-15",
            "segment": "Early Stage Explorer",
            "heading": "⚠️ Foundations Audit & Resource Blueprint Plan",
            "summary": "You are currently laying the groundwork. You require standard structured templates, automated guides, and a streamlined blueprint model to stabilize consistent leads before investing heavily in custom systems."
          },
          {
            "range": "16-30",
            "segment": "Accelerating Operator",
            "heading": "🚀 Systems Expansion & Dedicated Scaling Model",
            "summary": "Your business is ready for immediate automation. By implementing standard automated funnels and optimized sales assets, you can scale operations efficiently while removing yourself from the tedious manual workflow."
          },
          {
            "range": "31-50",
            "segment": "High-Volume Enterprise Leader",
            "heading": "🏆 Customized Elite Optimization Framework",
            "summary": "You are a top-tier candidate. Your volume justifies a highly customized strategic deployment to maximize high-ticket conversions and close deals on autopilot. Let's fast-track you onto a dedicated roadmap audit."
          }
        ],
        "recommendedAction": `Based on your diagnostic profile, you are highly eligible for the "${custom_offer}". Claim your complimentary 15-minute alignment audit now!`
      };
    } else if (toolType === "conversational_chat") {
      mockData = {
        "greeting": `👋 Hi! Welcome to ${product_name} Chat Assistant. Looking to bypass ${pain_point || 'manual workflows'} and start securing consistent ${desired_outcome || 'growth'} on autopilot? We have designed a quick, 60-second interactive custom alignment flow for you. Let's get started!`,
        "questions": [
          {
            "id": "q1",
            "question": `To better qualify our approach, what is your primary bottleneck or pain point in serving ${avatar || 'your clients'} currently?`,
            "options": [
              `Losing too much warm traffic (${pain_point || 'High CPA'})`,
              "Manual lead routing & booking bottlenecks",
              "Unstable pipeline with inconsistent sales volume"
            ],
            "branchingResponses": {
              "A": `Understood. Losing warm traffic to ${pain_point || 'choice-fatigue'} is a major leak. We specialize in deploying interactive pre-qualification diagnostics to hold attention.`,
              "B": "Yes, manual scheduling gaps waste hours. Direct, streamlined CRM automation handles routing instantly.",
              "C": "Consistency is key. Establishing highly optimized automated nurturing sequences stabilizes booking velocity."
            }
          },
          {
            "id": "q2",
            "question": "What is your target digital scaling goal or desired weekly volume?",
            "options": [
              "1 to 5 new high-ticket partners weekly",
              "5 to 10 qualified bookings weekly",
              "Over 10+ scalable conversions weekly"
            ],
            "branchingResponses": {
              "A": "Excellent. 1 to 5 premium partners weekly provides solid, high-margin foundation before heavy scaling.",
              "B": "5 to 10 setups weekly is the perfect sweet spot for automated pipeline architectures.",
              "C": "Over 10 weekly requires robust, multi-stage qualifying models with strict logic rules."
            }
          },
          {
            "id": "q3",
            "question": "How quickly are you prepared to deploy these optimization modules?",
            "options": [
              "Immediately (Within the next 7 days)",
              "This month (Next 14-30 days)",
              "Just researching and mapping strategies right now"
            ],
            "branchingResponses": {
              "A": "Fantastic! Fast execution maximizes competitive advantage in volatile markets.",
              "B": "Perfect. A 14-to-30 day window gives us ample time to align branding, copy, and webhook integrations.",
              "C": "Researching is smart. Let's send a 1-page tactical playbook directly to your inbox post-assessment."
            }
          }
        ],
        "offerPresentation": {
          "headline": `⭐️ Exclusive Access: Unlock the ${custom_offer || 'Pipeline Blueprint Session'}`,
          "bullets": [
            `Instantly deploy custom qualification modules styled perfectly to match your active brand guidelines.`,
            `Eliminate ${pain_point || 'friction points'} using elite conversion-focused copywriting blueprints.`,
            `Synchronize captured lead profiles with automatic routing rules inside your main CRM workspace.`
          ],
          "ctaText": "Book My Complimentary 15-Minute Alignment Session"
        },
        "bookingCta": `Click the live scheduler below to secure your complimentary alignment session. Let's bypass ${pain_point || 'bottlenecks'} and scale to ${desired_outcome || 'success'}!`,
        "handoffMessage": "Standard voice and chatbot fallback initiated. If you prefer to talk with a live human operator, please type 'Agent' or click the connection line above to patch in our VIP success desk immediately!"
      };
    } else if (toolType === "call_tracking") {
      const callType = inputs.call_type || "missed";
      const business = inputs.business || product_name;
      const offer = inputs.offer || custom_offer;

      if (callType === "missed") {
        mockData = {
          "smsFollowUp": `Hi! Sorry we missed you just now on our call. This is Alex from ${business}. I wanted to touch base regarding your eligible access to the ${offer}. Do you have 2 minutes to reply via text? 📲`,
          "emailFollowUp": {
            "subject": `Sorry we missed you! Quick check-in regarding ${offer} 📞`,
            "body": `Hi [First Name],\n\nI tried calling you just now from ${business}, but wasn't able to reach you. No worries at all – I know how busy schedules can be!\n\nI was calling to connect about your customized roadmap and see how we can help you activate our exclusive offer: "${offer}".\n\nIf you still want to run through the strategy, feel free to book a direct 15-minute slot on my calendar here:\n[Meeting Link]\n\nAlternatively, just reply to this email or drop me a text message at this number and we can schedule a quick chat.\n\nTalk soon,\n\nAlex\n${business} Team`
          },
          "voicemailScript": `Hi [First Name]! This is Alex calling from ${business}. Sorry I missed you – I was reaching out because you qualify for our exclusive offer: "${offer}". I'd love to connect and hand this over. No need to call me back immediately, I will send you a quick text with my schedule link, or you can buzz me back at this number. Hope you have a wonderful rest of your day!`
        };
      } else {
        mockData = {
          "smsFollowUp": `Thanks for chatting with us just now! This is Alex from ${business}. As promised, here is the direct link to claim your ${offer}: [Meeting Link] 🚀 Let's get started!`,
          "emailFollowUp": {
            "subject": `Great connecting with you! Here is your next step for ${offer} ⚡️`,
            "body": `Hi [First Name],\n\nIt was great speaking with you on our call just now! I really appreciate you taking the time to share your goals and bottlenecks with the team at ${business}.\n\nAs we discussed, I wanted to follow up and send over the details for your custom offer: "${offer}". Our client onboarding specialists are standing by to help you deploy these systems quickly.\n\nTo lock in your session and confirm the deliverables, please use this link to complete your reservation:\n[Meeting Link]\n\nIf you have any questions or need to make any adjustments before we lock in our schedule, feel free to hit reply or call/text this line directly at any time.\n\nBest regards,\n\nAlex\n${business} Team`
          },
          "voicemailScript": `Hi [First Name]! This is Alex with ${business}. It was fantastic chatting with you on our call yesterday! I'm leaving a quick message as a friendly follow-up to finalize our next session and ensure you can claim your "${offer}". I've sent the details to your email, but feel free to text or call me back on this line if you have any questions. Talk soon!`
        };
      }
    } else if (toolType === "inbound_responder") {
      const platform = inputs.platform || "Instagram";
      const goal = inputs.goal || desired_outcome || "schedule qualified appointments";
      const business = inputs.business || product_name;
      const offer = inputs.offer || custom_offer;
      const bookingLink = inputs.booking_link || "https://calendly.com/your-business/slot";

      mockData = {
        "instantReply": `Hey there! Welcome to ${business} on ${platform}! 👋 Thanks so much for reaching out. We received your message and our automated desk is ready to help you hit your goal of: "${goal}" instantly!`,
        "qualificationQuestion": `Quick question to see if we're a great fit: What is currently the biggest bottleneck holding your business back from scaling right now? 📈`,
        "offerCta": `Got it, that's super common! To help you crush that blocker, we're currently offering our exclusive: "${offer}" 🎁 absolutely free of charge for highly-motivated partners.`,
        "bookingLinkMessage": `Ready to speed up this setup? Tap the link below to select your customized calendar briefing: \n🔗 ${bookingLink}\n\nLet's get aligned!`
      };
    } else if (toolType === "social_calendar") {
      const business = inputs.business || product_name || "Sovereign Growth Inc.";
      const audience = inputs.avatar || avatar || "Independent experts and consultants";
      const platforms = inputs.platform_focus || "TikTok, Instagram, LinkedIn";
      mockData = {
        "calendar": [
          {
            "day": 1,
            "platform": "Instagram",
            "postIdea": "The 'Pricing Trap' Visual Breakdown",
            "caption": `Let's be honest: charging hourly as a busy consultant is a silent tax on your proficiency. 🧠 The faster and better you get, the less you get paid. It's time to shift from selling labor hours to packaging outcomes.`,
            "cta": "Read our free Sovereign packaging recipe guide in our bio!",
            "hashtags": ["ConsultingLife", "PricingMatrix", "AgencyAutomation"]
          },
          {
            "day": 2,
            "platform": "LinkedIn",
            "postIdea": "Case Study: Bypassing Manual Schedulers",
            "caption": `We helped an agency partner save 15+ hours a week of back-and-forth email scheduling simply by adding an interactive pre-qualifying diagnostic to their landing page. Here are the exact 3 steps we used to filter high-ticket leads in real-time.`,
            "cta": "Click through to read the full B2B pipeline breakdown.",
            "hashtags": ["LinkedInOrganic", "CRMWorkflow", "B2BSales"]
          },
          {
            "day": 3,
            "platform": "TikTok / Reels",
            "postIdea": "A Day in the Life of a Stress-Free Operator",
            "caption": `When your lead routing is 100% automated, you don't wake up to empty calendars or cold DM pitching. You wake up to qualified alignment briefings scheduled on autopilot.`,
            "cta": "Tap the link below to deploy this exact funnel model in 14 days.",
            "hashtags": ["BusinessAutomation", "Funnels", "GrowthMarketing"]
          },
          {
            "day": 4,
            "platform": "Instagram",
            "postIdea": "The 3 Questions You MUST Ask on Your Consultation Call",
            "caption": `Don't waste 45 minutes on a phone call only to find out they have no budget or are just 'researching'. Add structural gates to filter out tire-kickers.`,
            "cta": "Save this post for your next sales meeting!",
            "hashtags": ["LeadQualifying", "SovereignAdvisor", "HighTicket"]
          },
          {
            "day": 5,
            "platform": "LinkedIn",
            "postIdea": "Why Traditional Retainers Keep You Stated in Scarcity",
            "caption": `Relying on one or two whale client retainers leaves you highly vulnerable to sudden budget cuts. True peace of mind comes from a predictable, automated stream of inbound opportunities.`,
            "cta": "DM us 'SYSTEM' to get the Sovereign Pricing PDF sent straight to your inbox.",
            "hashtags": ["ConsultantStrategy", "RevenueSecurity", "B2B"]
          },
          {
            "day": 6,
            "platform": "TikTok",
            "postIdea": "Is Choice Fatigue Holding Your Team Back?",
            "caption": `Struggling with complicated 12-step workflows blocks your business momentum. Simplify to a single core landing asset and let active AI agents do the nurturing.`,
            "cta": "Comment 'ACTIVE' for our free workspace blueprint template.",
            "hashtags": ["TeamEfficiency", "SaaSGrowth", "WorkflowOptimized"]
          },
          {
            "day": 7,
            "platform": "LinkedIn",
            "postIdea": "Mindset Shift: Package Outcomes, Not Services",
            "caption": `Your clients don't want to buy your certifications—they want to buy their own dry basement. Focus on delivering measurable desired outcomes.`,
            "cta": "Join our upcoming live organic branding webinar this Thursday.",
            "hashtags": ["ExecutiveMindset", "ScaleFast", "Enterprise"]
          }
        ]
      };
    } else if (toolType === "outreach_scripts") {
      const audience = inputs.avatar || avatar || "B2B leaders";
      const offer = inputs.custom_offer || custom_offer || "Complimentary Systems Audit";
      const channel = inputs.channel || "email";
      mockData = {
        "variations": [
          {
            "title": "Variation 1: Direct Value-Exchange",
            "subject": `Quick ideas to optimize lead acquisition loops for [Company Name] 🧠`,
            "body": `Hi [First Name],\n\nI’m reaching out because I noticed your team has an incredible focus on serving [Target Audience]. However, many firms in your niche fall into the 'Hourly Trap', keeping them stuck in slow manual delivery cycles.\n\nWe put together a custom resource detailing how similar teams are bypassing this bottleneck to unlock automated high-ticket retainers.\n\nI’d love to send over our ${offer} for your team – no strings attached. Would you be open to checking out a quick 1-page PDF overview?`
          },
          {
            "title": "Variation 2: The Core Bottleneck Pattern",
            "subject": `Struggling with consistent booking velocity? Here is the blueprint 📈`,
            "body": `Hi [First Name],\n\nIf you're like most B2B leaders, morning choices are taking forever – especially when trying to maintain an active pipeline while delivering top-tier service.\n\nWe designed a streamlined, pre-qualification chat model that enables consultants to screen leads automatically prior to taking a single phone call.\n\nWe wanted to offer you our: "${offer}" to show you exactly how this would fit into your current systems. Let me know if you would like me to slide the calendar details over.`
          },
          {
            "title": "Variation 3: Peer Case Study Authority",
            "subject": `How we helped B2B brands automate lead scoring loops ⚡️`,
            "body": `Hi [First Name],\n\nJust came across your profile and was highly impressed by your team's custom footprint. \n\nWe recently completed a project helping organic agency partners transition from hourly scopes to a $10k+ elite advisory retainer model by upgrading their conversion-focused marketing copy.\n\nAs part of our weekly community outreach, we'd love to run a ${offer} for your brand. Are you available for a brief sync later this week?`
          }
        ],
        "followup": {
          "subject": "Quick follow-up: Did you receive the systems audit guide?",
          "body": `Hi [First Name],\n\nJust wanted to make sure this didn't get buried in your inbox! I know schedules can get wild.\n\nIf you're still looking to bypass manual delays and double your margin, our ${offer} is open for your team this week.\n\nLet me know if you would like to run through the custom setup guidelines.`
        },
        "bump": {
          "subject": "Lost in the shuffle? ⏳",
          "body": `Hi [First Name],\n\nI'll keep this short: I know you've got a lot on your plate. If now isn't the right time to streamline client pre-qualification, no worries at all!\n\nI'll check back in next quarter. In the meantime, feel free to grab our free Sovereign Packaging documentation at your convenience.\n\nAll the best,\n\n[Your Name]`
        }
      };
    } else if (toolType === "nurture_sequence") {
      const business = inputs.business || product_name || "Sovereign Consulting Group";
      const offer = inputs.custom_offer || custom_offer || "Sovereign Packaging Blueprint";
      const audience = inputs.avatar || avatar || "independent consultants";
      mockData = {
        "emails": [
          {
            "step": "Email 1: The Authority Hook",
            "subject": `Why charging hourly is holding your consulting practice back 🧠`,
            "body": `Hi [First Name],\n\nWelcome inside the ${business} ecosystem! We're excited to have you join our community of elite leaders.\n\nLet's cut straight to the chase: if you are still billing clients hourly, you are financially penalized for being fast and skilled. The faster you solve their problem, the less money you make.\n\nThat's why we built our: "${offer}". It teaches you how to shift from labor pricing to outcome pricing, elevating your retainers immediately.\n\nIn tomorrow's email, we'll look at the exact three-step qualifying framework used by top-tier firms to shield their calendars from tire-kickers.\n\nTalk soon,\n\nThe ${business} Team`
          },
          {
            "step": "Email 2: Case Study and Proof",
            "subject": "How Clara Oswald bypassed morning dressing anxiety and tripled booking velocity ⚡️",
            "body": `Hi [First Name],\n\nYesterday we discussed outcome pricing. Today, let's look at a real-world example.\n\nOur client Clara was struggling with inconsistent lead flow and spent hours in manual outreach back-and-forth email loops. \n\nBy deploying an interactive pre-qualifying diagnostic survey, she automated 100% of her lead scoring and immediately weeded out low-budget researchers. She signed three premium $10k+ retainers in her first 30 days.\n\nYou can access the same structural model inside our ${offer}.\n\nAre you ready to see how this fits your branding?\n\nBest,\n\nThe ${business} Team`
          },
          {
            "step": "Email 3: The Call to Action (Urgency)",
            "subject": "Only 3 free Systems Audit slots remaining for this week ⏰",
            "body": `Hi [First Name],\n\nWe've shared the pricing shift and the qualification blueprint. Now, it's time to execute.\n\nTo help you implement this transition immediately, we're hosting complimentary 1-on-1 strategy briefings this Thursday. Our lead architects will map out your exact value stack and pre-qualification chat flow.\n\nBecause we do these manually, we have only 5 slots available. 3 are already claimed.\n\nClick the link below to select your customized calendar briefing:\n[Booking Link]\n\nLet's get started,\n\nThe ${business} Team`
          }
        ],
        "smsMessages": [
          {
            "step": "SMS 4: Direct Follow-up (Nudge)",
            "body": `Hi [First Name], this is Alex from ${business}. I saw you downloaded our ${offer}! Just wanted to send an automated text to see if you had any questions about the Sovereign packaging formulas. Let me know if you want to grab a quick 10-minute schedule: [Booking Link]`
          },
          {
            "step": "SMS 5: Final Deadline Reminder",
            "body": `⏰ [First Name], heads up! Our complimentary Systems Audit slots for this week close in 3 hours. Let's map your qualification funnel and double your retention. Secure your spot now: [Booking Link] - Alex, ${business}`
          }
        ]
      };
    } else if (toolType === "onboarding_content") {
      const business = inputs.business || product_name || "Sovereign Growth Inc.";
      const userType = inputs.userType || "client";
      mockData = {
        "welcomeMessage": `Welcome aboard the ${business} high-ticket mobile workspace! 📱 We are absolutely thrilled to partner with you to help streamline your delivery pipelines and unlock sustainable client growth. This private secure client portal is your single source of truth.`,
        "featureOverview": [
          {
            "title": "🎯 Pre-Qualified Leads Ledger",
            "desc": "Track your captured prospects, review active AI scores, and monitor automated outbound sequences in real-time."
          },
          {
            "title": "💬 Conversational Chat Tuning",
            "desc": "Customize and deploy interactive qualification chatbots directly to your customer-facing landing pages."
          },
          {
            "title": "📊 Storyteller Analytics Engine",
            "desc": "Access high-fidelity diagnostics reports, review conversion bottlenecks, and receive optimized system guidelines."
          }
        ],
        "checklist": [
          "Complete your user profile, upload your branding logos, and select your target niche.",
          "Integrate your live scheduling calendar link (Calendly, Cal.com, or HubSpot).",
          "Deploy your first pre-qualification chat template to your lead-capture landing page.",
          "Confirm your secure payment routing credentials to accept program enrollment fees."
        ],
        "cta": "Complete App Setup"
      };
    } else if (toolType === "community_execution") {
      const audience = inputs.community_type || avatar || "independent experts";
      const goal = inputs.goal || desired_outcome || "double monthly enrollment volume";
      mockData = {
        "weeklyChallenges": [
          "Week 1 Challenge: The Retainer Audit - Audit your current service catalog and list your top outcome-based pricing packages.",
          "Week 2 Challenge: Flow Deployment - Deploy your customized pre-qualification chatbot survey, capturing at least 5 feedback submissions.",
          "Week 3 Challenge: Direct Outreach Blitz - Reach out to 15 warm prospects using our Variation 1 high-performance B2B templates."
        ],
        "accountabilityLoops": "Every Monday morning, community members post their top 3 high-leverage execution goals inside our private peer channel. On Friday afternoon, we host a live 'Wins and Bottlenecks' sprint review where partners celebrate completed milestones and get active diagnostic feedback from our senior coaching team.",
        "peerPrompts": [
          "📣 Peer Question: What is currently the single biggest bottleneck you are facing when trying to migrate your clients from hourly billings to five-figure outcome-based retainers?",
          "📈 Visual Showcase: Take a screenshot of your active lead qualification chat flow landing page and tag 2 peers to get a high-contrast copywriting critique!"
        ],
        "monthlySprintPlan": `Our upcoming 30-Day 'Sovereign Retainer' Execution Sprint focuses on helping you structuralize, price, and sell high-ticket Retainer Programs. Over the next 4 weeks, you will attend weekly interactive sprints, complete daily execution benchmarks, and participate in peer accountability pods.`,
        "successTrackingSystem": "Integrate your customized leader dashboard inside this secure portal. Monitor total community challenges completed, track peer feedback velocity, and watch your active pipeline deal values grow over time in our high-leverage leaderboards."
      };
    }

    return res.json({
      isSimulated: true,
      info: "Simulated copy engine fallback active. Connect GEMINI_API_KEY to activate generative AI copy dynamically.",
      data: mockData
    });
  }
});

// POST /api/stripe/create-payment-intent
app.post("/api/stripe/create-payment-intent", async (req: express.Request, res: express.Response) => {
  const { amount, currency, productName, leadId, customSecretKey } = req.body;

  const keyToUse = customSecretKey || process.env.STRIPE_SECRET_KEY;

  if (!keyToUse || keyToUse === "MY_STRIPE_SECRET_KEY") {
    return res.status(400).json({ 
      error: "STRIPE_SECRET_KEY_MISSING",
      message: "Stripe Secret Key is missing. Please configure it in your environment variables or paste your custom Secret Key in the connection settings."
    });
  }

  try {
    const { default: Stripe } = await import("stripe");
    const stripeInstance = new Stripe(keyToUse as string, {
      apiVersion: "2023-10-16" as any
    });

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount, // in cents, e.g. $5000 is 500000
      currency: currency || "usd",
      metadata: {
        productName: productName || "Conversion Stage Offer",
        leadId: leadId || "unknown_lead",
        source: "CRM Lead Funnel Applet"
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (err: any) {
    console.error("Stripe payment intent creation error:", err.message);
    res.status(500).json({ error: err.message || "Failed to create payment intent." });
  }
});

// POST /create-checkout-session and /api/create-checkout-session for Stripe Subscription Checkout
const handleCreateCheckoutSession = async (req: express.Request, res: express.Response) => {
  const { planType, userId } = req.body; // planType: 'monthly' or 'yearly'
  
  const keyToUse = process.env.STRIPE_SECRET_KEY;
  if (!keyToUse) {
    return res.status(400).json({ 
      error: "STRIPE_SECRET_KEY_MISSING",
      message: "Stripe Secret Key is missing. Please configure STRIPE_SECRET_KEY in environment variables."
    });
  }

  let priceId = (planType === 'yearly' || planType === 'annual') 
    ? process.env.STRIPE_YEARLY_PRICE_ID 
    : process.env.STRIPE_MONTHLY_PRICE_ID;

  if (priceId) {
    // Sanitize in case priceId has some description appended, e.g. "price_XYZ -$49.99/monthly" or matches "price_[a-zA-Z0-9]+"
    const match = priceId.trim().match(/price_[a-zA-Z0-9]+/);
    if (match) {
      priceId = match[0];
    }
  }

  if (!priceId) {
    return res.status(400).json({
      error: "STRIPE_PRICE_ID_MISSING",
      message: `Stripe Price ID for plan type '${planType}' is missing in the environment. Please configure STRIPE_MONTHLY_PRICE_ID and STRIPE_YEARLY_PRICE_ID.`
    });
  }

  try {
    const { default: Stripe } = await import("stripe");
    const stripeInstance = new Stripe(keyToUse as string, {
      apiVersion: "2023-10-16" as any
    });

    const session = await stripeInstance.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      // Metadata allows you to track which AI Studio user is paying
      metadata: { userId: userId || "anonymous" }, 
      success_url: 'https://ai.studio/apps/b1d51413-2ece-41be-8f7c-562881668305?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://ai.studio/apps/b1d51413-2ece-41be-8f7c-562881668305',
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Session creation error:", error.message);
    res.status(500).json({ error: error.message || "Failed to create Stripe Checkout session." });
  }
};

app.post('/create-checkout-session', express.json(), handleCreateCheckoutSession);
app.post('/api/create-checkout-session', express.json(), handleCreateCheckoutSession);

// Health metrics and API status
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    sentinelStatus: "Secure Shield Active",
    version: "2.4.1"
  });
});

// Production and Development Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(`🚀 CRM Funnel Engine active at http://localhost:${PORT}`);
    console.log(`🔒 Sentinel Security Protocols: Active and Safe`);
    console.log(`====================================================`);
  });
}

startServer();
