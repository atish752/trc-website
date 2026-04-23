// TRC Website Content Store
// All editable content is here. admin.html writes to localStorage under 'trc_content'
// index.html reads from this on load.

window.TRC_DEFAULTS = {
  // HERO
  hero_label:     "INDIA'S GROWTH-FOCUSED WEB STUDIO",
  hero_headline:  "We Build Websites That Build",
  hero_accent:    "Businesses.",
  hero_sub:       "From your first call to your launch day — we handle everything. Clean design, fast performance, and websites that actually get you clients.",
  hero_btn1:      "SEE OUR WORK",
  hero_btn2:      "BOOK A FREE CALL",

  // STATS
  stat1_num: "47", stat1_label: "Projects Delivered",
  stat2_num: "98", stat2_label: "Happy Clients",
  stat3_num: "100",stat3_label: "On-Time Delivery",
  stat4_num: "4",  stat4_label: "Avg. Response (hrs)",
  stat_note: "India's fastest-growing web studio for small businesses.",

  // ABOUT
  about_label:    "ABOUT TRC",
  about_headline: "We're not a big agency. That's the point.",
  about_body:     "TRC — The Right Click — is a small, focused web studio built for Indian businesses who want results, not a sales pitch. We work directly with you. No layers, no handoffs, no excuses.",
  about_f1_title: "India-Based", about_f1_body: "We understand the local market, languages, and what Indian customers trust.",
  about_f2_title: "Direct Access", about_f2_body: "You talk to the developer. No account managers playing telephone.",
  about_f3_title: "Results First", about_f3_body: "Every decision we make is about getting you more clients, not more awards.",
  about_f4_title: "Fully Transparent", about_f4_body: "Fixed quotes. Clear timelines. No hidden costs, ever.",

  // SERVICES
  srv_label:    "WHAT WE BUILD",
  srv_headline: "Services Built for Results, Not Awards.",
  srv1_title: "Business Websites",   srv1_tag: "Most Popular",
  srv1_body:  "Professional multi-page websites for businesses, clinics, agencies, and service providers. Custom design, fast loading, and built to show up on Google. We design it around your clients — not around a template.",
  srv2_title: "E-Commerce Stores",   srv2_tag: "Sell Online",
  srv2_body:  "Online stores built to sell. Product management, payment integration, WhatsApp ordering, and a checkout flow your customers won't abandon mid-way.",
  srv3_title: "Landing Pages",       srv3_tag: "Ads & Campaigns",
  srv3_body:  "Single-purpose pages designed with one goal: turning visitors into leads. Built for Google Ads, cold outreach, and direct traffic. Speed and conversion baked in.",
  srv4_title: "Web Applications",    srv4_tag: "Custom Software",
  srv4_body:  "Custom software for your business — booking systems, dashboards, portals, and admin tools. Built for reliability and scale.",
  srv_bar:    "Starting at ₹9,999  •  Delivered in 7–21 days  •  Free domain + hosting for 1 year",

  // PROCESS
  proc_label:    "THE PROCESS",
  proc_headline: "Simple. Transparent. No Surprises.",
  proc_sub:      "Here's exactly how we go from your first call to your live website.",
  proc1_title: "Discovery Call",      proc1_body: "You tell us about your business, your goals, and who you want to attract. We listen. We ask the right questions. No tech jargon — just a clear conversation. Takes 20–30 minutes.", proc1_badge: "📞 20-30 min call",
  proc2_title: "Proposal & Quote",    proc2_body: "Within 24 hours, you receive a detailed proposal: what we'll build, how long it'll take, and exactly what it'll cost. No hidden charges.",                                    proc2_badge: "📋 Delivered in 24hrs",
  proc3_title: "Design & Build",      proc3_body: "We design, you approve. Then we develop. You can see live progress at every stage. We don't disappear for weeks — we check in regularly.",                                   proc3_badge: "⚡ 7–21 days average",
  proc4_title: "Review & Refine",     proc4_body: "You review everything and give feedback. We make revisions until you're completely satisfied. We include 2 rounds of revisions in every package.",                          proc4_badge: "✏️ Up to 2 revisions",
  proc5_title: "Go Live",             proc5_body: "Your website launches. We handle domain connection, hosting setup, and testing. After launch, we're still here — 30-day support included free.",                          proc5_badge: "🚀 30-day free support",

  // CONTACT
  contact_phone: "+91-XXXXXXXXXX",
  contact_email: "hello@therightclick.in",
  contact_wa:    "910000000000",

  // FOOTER
  footer_tagline: "We build websites that build businesses.",

  // NAV
  nav_cta: "START A PROJECT",
};

// Get merged content (localStorage overrides defaults)
window.TRC = function() {
  const saved = JSON.parse(localStorage.getItem('trc_content') || '{}');
  return Object.assign({}, window.TRC_DEFAULTS, saved);
};
