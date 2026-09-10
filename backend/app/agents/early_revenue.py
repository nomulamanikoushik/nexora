from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class EarlyRevenueAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="early_revenue", role="First Customers & Early Revenue Engine Specialist", step_order=11)

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        profile = context.get("profile", {})
        capital = float(profile.get("capital", 300000))
        currency = profile.get("currency", "INR")
        location = profile.get("location", "Hyderabad")
        biz_name = profile.get("business_name", "Venture")
        start_mode = profile.get("business_start_mode", "Home-Based")
        sector = profile.get("sector", "food-beverage")
        usp = profile.get("primary_usp") or "Artisanal, fresh, handcrafted quality with clean ingredients"

        # Unit metrics customized for sector & start mode
        if sector == "food-beverage":
            avg_order_value = 450.0
            cogs_per_unit = 160.0
            launch_promo_price = 350.0
            target_first_month_units = 180
            channel_1 = "Residential Society & Apartment WhatsApp Groups"
            channel_2 = "Gym, Yoga Studio & Tech Park Snack Pop-Ups"
            sample_item = "Bite-Sized Healthy Snack Sampler (3 Flavors)"
        elif sector == "software-saas":
            avg_order_value = 2500.0
            cogs_per_unit = 350.0
            launch_promo_price = 1499.0
            target_first_month_units = 25
            channel_1 = "LinkedIn Direct Founder Outreach & Agency Communities"
            channel_2 = "Product Hunt, IndieHackers & Twitter/X Build-in-Public"
            sample_item = "Free 14-Day Pilot with 1-on-1 Concierge Onboarding"
        else:
            avg_order_value = 850.0
            cogs_per_unit = 320.0
            launch_promo_price = 699.0
            target_first_month_units = 70
            channel_1 = "Hyperlocal Instagram / Facebook Interest Groups"
            channel_2 = "Local Pop-Up & Flea Market Demonstrations"
            sample_item = "Curated Introductory Experience Box"

        first_10_playbook = {
            "title": "First 10 Customers in 7 Days (Zero Ad Spend)",
            "objective": "Acquire 10 verified paying customers within 7 days using high-trust direct networks.",
            "tactics": [
                {
                    "step": 1,
                    "tactic": "Warm Inner Circle Beta Drop",
                    "action": "Select 25 friends, colleagues, and family members. Deliver the prototype product/sampler with a personal handwritten founder note asking for candid, brutal feedback.",
                    "target_conversion": "8 out of 25 order the full paid bundle immediately."
                },
                {
                    "step": 2,
                    "tactic": f"Hyperlocal Community Outreach ({channel_1})",
                    "action": "Post an engaging founder introduction story in local neighborhood groups: 'Hi neighbors, I live in " + location.split(',')[0] + " and started " + biz_name + " because I couldn't find healthy, guilt-free snacks for my family. Sharing 20 free tasting pouches today!'",
                    "target_conversion": "Yields 15 tasting requests and converts 5 paid orders on Day 3."
                },
                {
                    "step": 3,
                    "tactic": "WhatsApp Broadcast & Personal Voice Notes",
                    "action": "Send customized 30-second personal voice notes explaining the launch mission rather than generic text spam.",
                    "target_conversion": "Generates high emotional connection and 4-6 orders."
                }
            ],
            "script_template": (
                f"“Hey [Name]! As you know, I've been working on {biz_name} to solve the lack of honest, healthy snacks. "
                f"We just prepared our very first batch fresh this morning! I'd love to drop off a tasting box at your doorstep. "
                f"All I ask is your honest feedback and 1 review. If you love it, our launch box is only {currency} {launch_promo_price:,.0f} this week!”"
            )
        }

        next_50_sprint = {
            "title": "Next 50 Customers Sprint (Days 8 to 30)",
            "objective": "Scale from 10 to 50+ customers via organic referral loops and strategic micro-partnerships.",
            "tactics": [
                {
                    "channel": "Partner Cross-Sampling",
                    "description": f"Place sample baskets at 3 nearby high-traffic partner spots ({channel_2}) with a scan-to-order QR code offering a free surprise snack pouch with their first order.",
                    "expected_customers": 20
                },
                {
                    "channel": "Refer-a-Neighbor Snack Kit",
                    "description": "Every paying customer receives two mini-gift pouches labeled: 'Give this to someone whose health you care about.' Includes a unique WhatsApp order code.",
                    "expected_customers": 18
                },
                {
                    "channel": "Google Business Profile & Local Discovery",
                    "description": "Collect 20 five-star reviews from early customers on Google Maps with appetizing photos to rank top-3 for local keyword searches.",
                    "expected_customers": 15
                }
            ]
        }

        action_plan_30_days = [
            {
                "week": "Week 1 (Days 1 - 7)",
                "theme": "The Foundation & Warm Launch",
                "milestone": "10 Paying Customers Acquired",
                "checklist": [
                    "Finalize packaging, hygiene seals, and batch labeling",
                    "Distribute 25 beta tasting pouches to warm network",
                    "Capture 10 video/photo testimonials and reviews",
                    "Secure first 10 paying customer orders via WhatsApp UPI / Cash"
                ]
            },
            {
                "week": "Week 2 (Days 8 - 14)",
                "theme": "Community Activation & Partner Tastings",
                "milestone": "25 Total Customers Reached",
                "checklist": [
                    "Introduce the 'Founder Launch Bundle' at introductory price",
                    "Partner with 2 local fitness studios / boutique cafes for sampling counters",
                    "Host a weekend tasting pop-up table in apartment clubhouse or office lobby",
                    "Establish a dedicated VIP WhatsApp broadcast community for weekly fresh menus"
                ]
            },
            {
                "week": "Week 3 (Days 15 - 21)",
                "theme": "Referral Engine & Micro-Influencer Gifting",
                "milestone": "40 Total Customers Reached",
                "checklist": [
                    "Send personalized snack care packages to 8 local micro-influencers (<15k followers)",
                    "Launch the 'Give ₹50, Get ₹50' neighbor referral card inside every delivery box",
                    "Audit repeat order rate from Week 1 buyers and request reorders with bonus sample",
                    "Optimize delivery logistics / courier turnaround under 24 hours"
                ]
            },
            {
                "week": "Week 4 (Days 22 - 30)",
                "theme": "Repeat Cadence & Milestone Review",
                "milestone": "50+ Customers & Month 1 Break-Even Progress",
                "checklist": [
                    "Introduce weekly/monthly auto-replenishment subscription boxes",
                    "Reach out to 3 local corporate HR / admin teams for pantry snack trials",
                    "Calculate first-month unit margins, repeat rates, and customer feedback",
                    "Celebrate 50 customer milestone with exclusive 'Founding Member' perk cards"
                ]
            }
        ]

        launch_offer = {
            "offer_name": f"{biz_name} Founding Member Launch Box",
            "normal_value": f"{currency} {avg_order_value * 1.3:,.0f}",
            "launch_price": f"{currency} {launch_promo_price:,.0f}",
            "discount_percentage": "25% Off + Free Mystery Snack Pouch",
            "unit_cogs": f"{currency} {cogs_per_unit:,.0f}",
            "unit_gross_margin": f"{currency} {launch_promo_price - cogs_per_unit:,.0f} ({round(((launch_promo_price - cogs_per_unit) / launch_promo_price) * 100, 1)}%)",
            "break_even_volume": f"{round((capital * 0.08) / max(1, (launch_promo_price - cogs_per_unit)))} units/month to cover operational baseline"
        }

        funnel_metrics = {
            "projected_leads": 350,
            "samples_distributed": 120,
            "first_purchases_month_1": target_first_month_units,
            "conversion_rate_sample_to_paid": "42%",
            "target_early_cac": f"{currency} 45",
            "estimated_month_1_revenue": f"{currency} {target_first_month_units * launch_promo_price:,.0f}",
            "estimated_month_1_gross_profit": f"{currency} {target_first_month_units * (launch_promo_price - cogs_per_unit):,.0f}"
        }

        summary = (
            f"Formulated the Early Revenue Acceleration Playbook for {biz_name}. "
            f"Focuses on zero-ad-spend direct customer acquisition, achieving the first 10 customers in 7 days "
            f"and 50+ customers in 30 days. Unit gross margin is preserved at "
            f"{round(((launch_promo_price - cogs_per_unit) / launch_promo_price) * 100, 1)}% with an early CAC below {currency} 45."
        )

        explainability = {
            "why_this_recommendation": f"Early-stage {start_mode} ventures succeed by validating product-market fit through high-touch sampling and community word-of-mouth before committing capital to paid ads.",
            "key_assumptions": [
                "Founder actively participates in initial tasting outreach and direct customer conversations",
                "Product taste, freshness, and packaging hygiene meet premium standards from Day 1"
            ],
            "main_risks": [
                "Slow referral velocity if initial taste or packaging fails to delight",
                "Delivery friction if local dispatch radius is not strictly managed in week 1"
            ],
            "confidence_level": "High",
            "data_sources": ["D2C Micro-Brand Zero-to-One Studies", "MSME Early Customer Acquisition Benchmarks"]
        }

        return {
            "agent_name": self.name,
            "status": "completed",
            "summary": summary,
            "findings": [
                {"strategy": "First 10 Customers", "detail": "Direct warm network sampling converts at 30-40% when paired with personal founder voice notes."},
                {"strategy": "Apartment / Community WhatsApp Engine", "detail": "Localized community groups provide 0-CAC viral propagation within 3km radius."},
                {"strategy": "Launch Offer Margin", "detail": f"Launch bundle delivers healthy {launch_offer['unit_gross_margin']} contribution margin per box."}
            ],
            "assumptions": explainability["key_assumptions"],
            "risks": [{"risk": r, "severity": "Medium", "mitigation": "Keep dispatch radius within 5km in Month 1"} for r in explainability["main_risks"]],
            "confidence": "High",
            "sources": explainability["data_sources"],
            "explainability": explainability,
            "data": {
                "first_10_playbook": first_10_playbook,
                "next_50_sprint": next_50_sprint,
                "action_plan_30_days": action_plan_30_days,
                "launch_offer": launch_offer,
                "funnel_metrics": funnel_metrics
            }
        }
