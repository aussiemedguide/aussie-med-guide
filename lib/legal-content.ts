export type LegalDocKey = "privacy" | "terms" | "disclaimer" | "payments";

export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalDoc = {
  key: LegalDocKey;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  lastUpdated: string;
  summaryPoints: string[];
  sections: LegalSection[];
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    key: "privacy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    shortTitle: "Privacy",
    description:
      "How Aussie Med Guide collects, uses, stores, and protects your information.",
    lastUpdated: "14 March 2026",
    summaryPoints: [
      "We collect the data needed to run your account, personalise tools, and improve the platform.",
      "We use providers like Stripe, Supabase, Vercel, Tidio, and AI services to operate parts of the platform.",
      "We do not sell your personal information or share it with universities or admissions centres.",
      "You can request access, correction, deletion, and export of your data.",
    ],
    sections: [
      {
        title: "1. Who we are",
        body: [
          'Aussie Med Guide ("Platform", "we", "us", or "our") is an independent educational platform designed to help students research, plan, and prepare for Australian medical school applications.',
          "If the Platform is later operated by a company entity, references to Aussie Med Guide include that operating entity.",
        ],
      },
      {
        title: "2. Information we collect",
        body: [
          "We may collect account information such as your name, email address, login credentials, and subscription status.",
          "We may collect profile and planning data such as your year level, state, student category, target universities, preferred pathway, academic estimates, UCAT practice results, interview practice data, scenario inputs, study tracking, scholarship tracking, accommodation preferences, budgeting inputs, and notes you save inside the platform.",
          "We may collect support and technical data such as live chat messages, feature usage, device and browser information, pages visited, cookies, session information, and anonymised analytics.",
        ],
      },
      {
        title: "3. How we use your information",
        body: [
          "We use personal information to provide the platform, personalise tool outputs, save your progress, process subscriptions, respond to support requests, improve features, maintain platform security, and communicate important account or service updates.",
          "We may also use de-identified or aggregated usage data to understand how users interact with the platform and to improve performance, design, and usability.",
        ],
      },
      {
        title: "4. Third-party services and disclosures",
        body: [
          "We use trusted third-party providers to operate the platform, including payment processors, cloud hosting and database providers, analytics tools, customer support tools, and AI service providers.",
          "These may include Stripe for payments, Supabase for authentication and database services, Vercel for hosting and deployment, Tidio for support chat, and AI providers for selected feedback features.",
          "We do not sell your personal information. We do not share your data with universities, UCAT ANZ, TACs, or admissions centres unless you separately choose to do so yourself.",
        ],
      },
      {
        title: "5. Overseas disclosure and processing",
        body: [
          "Some service providers we use may store or process data outside Australia. Where this occurs, we take reasonable steps to use providers with appropriate privacy and security safeguards.",
        ],
      },
      {
        title: "6. Data storage and security",
        body: [
          "We take reasonable steps to protect personal information from misuse, interference, loss, unauthorised access, modification, or disclosure.",
          "Security measures may include encrypted transmission, access controls, secure authentication, database security rules, provider-level infrastructure protections, and internal restrictions on access where relevant.",
        ],
      },
      {
        title: "7. Data retention",
        body: [
          "We keep personal information only for as long as reasonably necessary to provide the platform, comply with legal obligations, resolve disputes, enforce our terms, and prevent fraud or abuse.",
          "When you request deletion of your account, we will remove or de-identify personal information from active systems within a reasonable period, unless we are required to keep certain information for legal, accounting, security, or dispute-resolution purposes.",
        ],
      },
      {
        title: "8. Your choices and rights",
        body: [
          "You may request access to the personal information we hold about you, request correction of inaccurate information, request deletion of your account, and request export of data where reasonably available.",
          "You may also unsubscribe from marketing communications at any time using the unsubscribe option in those messages.",
        ],
      },
      {
        title: "9. Cookies and tracking",
        body: [
          "We use cookies and similar technologies for authentication, preferences, security, performance, and analytics. Disabling cookies may affect parts of the platform, especially login-related functionality.",
        ],
      },
      {
        title: "10. Under 18 users",
        body: [
          "Many users of the platform are school students. If you are under 18, you confirm that you have permission from a parent or guardian to use the platform and provide information through it.",
          "We do not knowingly collect personal information from children under 13.",
        ],
      },
      {
        title: "11. AI features",
        body: [
          "Some features use AI services to process the text you submit and return educational feedback. AI outputs are illustrative only and do not constitute professional advice.",
          "Unless explicitly stated otherwise, we do not use your submitted responses to train public AI models.",
        ],
      },
      {
        title: "12. Complaints",
        body: [
          "If you have a privacy concern or complaint, contact us first so we can try to resolve it. Please include enough detail for us to investigate the issue properly.",
        ],
      },
      {
        title: "13. Changes to this policy",
        body: [
          "We may update this Privacy Policy from time to time. If we make material changes, we may notify users through the platform or by email. Continued use of the platform after changes take effect means you accept the updated policy.",
        ],
      },
      {
        title: "14. Contact",
        body: ["Privacy and data requests: support@aussiemedguide.com"],
      },
    ],
  },
  {
    key: "terms",
    slug: "terms-of-use",
    title: "Terms of Use",
    shortTitle: "Terms",
    description:
      "The rules for using Aussie Med Guide and the limits of what the platform does.",
    lastUpdated: "14 March 2026",
    summaryPoints: [
      "Aussie Med Guide is an independent educational platform, not an admissions authority.",
      "Tool outputs are illustrative and not guarantees, predictions, or professional advice.",
      "Users must verify admissions information with official university and TAC sources.",
      "We can suspend accounts for misuse, fraud, scraping, or credential sharing.",
    ],
    sections: [
      {
        title: "1. Acceptance",
        body: [
          "By accessing or using Aussie Med Guide, you agree to these Terms of Use. If you do not agree, do not use the platform.",
        ],
      },
      {
        title: "2. What the platform is",
        body: [
          "Aussie Med Guide is an independent educational planning and research platform. It is not affiliated with, endorsed by, or officially connected to any university, UCAT ANZ, TAC, regulator, or government body.",
          "The platform is designed to help students research options, organise information, and practise strategy. It is not an official admissions service, registered educational consultancy, or guarantee of any application outcome.",
        ],
      },
      {
        title: "3. Feature coverage",
        body: [
          "These Terms apply to all pages, tools, calculators, directories, trackers, dashboards, AI features, guides, and legal or pricing pages made available through the platform.",
        ],
      },
      {
        title: "4. User responsibilities",
        body: [
          "You agree to provide accurate information where requested, keep your login details secure, verify admissions requirements with official sources, and use the platform lawfully and in good faith.",
          "You must not scrape, reverse-engineer, disrupt, hack, probe, overload, or misuse the platform or any related systems. You must not share paid account access with others.",
        ],
      },
      {
        title: "5. No guarantees",
        body: [
          "All outputs, insights, scores, rankings, readiness indicators, scenario results, and recommendations are illustrative educational tools only. They are not predictions, guarantees, or professional admissions advice.",
          "We do not guarantee any interview invitation, offer, score, ranking, scholarship outcome, pathway result, or university suitability outcome.",
        ],
      },
      {
        title: "6. Information accuracy",
        body: [
          "We aim to keep information accurate and up to date, but admissions criteria, cut-offs, policies, pathways, scholarships, fees, accommodation details, and timelines can change at any time.",
          "You are responsible for checking official university, TAC, and provider sources before relying on any information.",
        ],
      },
      {
        title: "7. AI-generated content",
        body: [
          "Some features use AI-generated feedback. AI outputs may be incomplete, imperfect, inconsistent, or unsuitable for your situation. They are provided for educational assistance only and are not a substitute for professional coaching, academic advice, or official information.",
        ],
      },
      {
        title: "8. Platform availability",
        body: [
          "We do not guarantee uninterrupted, error-free, or continuous availability of the platform. Access may be affected by maintenance, updates, outages, internet issues, provider downtime, security incidents, or factors beyond our control.",
        ],
      },
      {
        title: "9. Data loss",
        body: [
          "We take reasonable steps to protect stored information, but we do not guarantee that data will never be lost, corrupted, delayed, or unavailable. You are responsible for keeping copies of important material you do not want to lose.",
        ],
      },
      {
        title: "10. Intellectual property",
        body: [
          "The platform, including its text, branding, graphics, interface design, code, structure, datasets, models, and content, is owned by us or licensed to us unless stated otherwise.",
          "You must not copy, republish, sell, scrape, reproduce, or commercially exploit the platform or its content without written permission.",
        ],
      },
      {
        title: "11. Consumer law notice",
        body: [
          "Nothing in these Terms excludes, restricts, or modifies any rights or remedies you may have under the Australian Consumer Law or other applicable law that cannot legally be excluded.",
          "Where our liability cannot be excluded, it is limited to the maximum extent permitted by law.",
        ],
      },
      {
        title: "12. Limitation of liability",
        body: [
          "To the maximum extent permitted by law, we are not liable for losses arising from your use of, or reliance on, the platform, including missed deadlines, university decisions, lost opportunities, inaccurate data inputs, emotional distress, or third-party service failures.",
        ],
      },
      {
        title: "13. Payments",
        body: [
          "Paid subscriptions are governed by our Payments & Subscription Terms, which form part of these Terms.",
        ],
      },
      {
        title: "14. Suspension or termination",
        body: [
          "We may suspend, restrict, or terminate access where we reasonably believe there has been fraud, misuse, abuse, a payment issue, account sharing, unlawful conduct, or a breach of these Terms.",
        ],
      },
      {
        title: "15. Under 18 users",
        body: [
          "If you are under 18, you confirm that you have permission from a parent or guardian to use the platform and agree to these Terms.",
        ],
      },
      {
        title: "16. Changes to these Terms",
        body: [
          "We may update these Terms from time to time. If changes are material, we may notify users through the platform or by email. Continued use after the updated Terms take effect means you accept them.",
        ],
      },
      {
        title: "17. Governing law",
        body: ["These Terms are governed by the laws of Victoria, Australia."],
      },
      {
        title: "18. Contact",
        body: ["Questions about these Terms: support@aussiemedguide.com"],
      },
    ],
  },
  {
    key: "disclaimer",
    slug: "educational-disclaimer",
    title: "Educational Disclaimer",
    shortTitle: "Disclaimer",
    description:
      "Important limits on predictions, strategy tools, and informational content.",
    lastUpdated: "14 March 2026",
    summaryPoints: [
      "This platform helps with research and planning. It does not decide or predict admissions outcomes.",
      "Interview, ATAR, UCAT, and offer tools are educational approximations only.",
      "Official admissions processes change every year and may include factors we cannot model.",
      "Always verify with universities, TACs, and official sources before making decisions.",
    ],
    sections: [
      {
        title: "1. Core warning",
        body: [
          "All outputs, insights, scores, rankings, estimates, likelihood bands, and recommendations generated by Aussie Med Guide are illustrative educational tools only. They must not be interpreted as predictions, guarantees, or professional admissions advice.",
        ],
      },
      {
        title: "2. Purpose of the platform",
        body: [
          "The platform is designed to help students research Australian medical school pathways, understand entry systems, track preparation, organise information, and practise strategy.",
          "It is not an admissions authority, not a registered consultancy, and not a substitute for official or professional advice.",
        ],
      },
      {
        title: "3. Tool limitations",
        body: [
          "Interview predictors, offer probability bands, scenario explorers, readiness indicators, subject planning tools, UCAT trackers, scholarship trackers, accommodation comparisons, and AI interview tools are all limited by the information available, the assumptions built into the platform, and the fact that admissions processes change.",
          "These tools cannot account for every factor that affects admissions, including changing cohort strength, quotas, human interview scoring, policy changes, weighting changes, document assessment, portfolio review, and year-to-year variation.",
        ],
      },
      {
        title: "4. Why certainty is impossible",
        body: [
          "University admissions are affected by variables we cannot fully model, including applicant cohort strength, interview panel judgement, changing cut-offs, rural and equity sub-quotas, university-specific methods, official moderation systems, and changing government or institutional policies.",
        ],
      },
      {
        title: "5. Accuracy and updates",
        body: [
          "We make reasonable efforts to keep the platform current, but some information may become outdated, incomplete, delayed, or inaccurate. Official sources should always be checked before action is taken.",
        ],
      },
      {
        title: "6. Not professional advice",
        body: [
          "The platform does not provide legal advice, financial advice, educational consultancy, mental health support, visa advice, or guaranteed admissions advice.",
        ],
      },
      {
        title: "7. User responsibility",
        body: [
          "You remain solely responsible for your decisions, application strategy, preferences, timelines, submissions, scholarship applications, and verification of requirements.",
        ],
      },
      {
        title: "8. No affiliation",
        body: [
          "Aussie Med Guide is not affiliated with, endorsed by, or officially connected to any university, TAC, UCAT ANZ, AHPRA, AMC, regulator, or government body.",
        ],
      },
      {
        title: "9. Liability notice",
        body: [
          "To the maximum extent permitted by law, we are not responsible for decisions, losses, delays, missed deadlines, emotional impact, or outcomes resulting from use of the platform or reliance on its content.",
        ],
      },
      {
        title: "10. Changes",
        body: [
          "We may update this disclaimer as the platform evolves. Continued use after changes take effect means you accept the updated version.",
        ],
      },
    ],
  },
  {
    key: "payments",
    slug: "payments-subscription-terms",
    title: "Payments & Subscription Terms",
    shortTitle: "Payments",
    description:
      "Billing rules, renewals, cancellations, upgrades, and refund handling.",
    lastUpdated: "14 March 2026",
    summaryPoints: [
      "Paid plans renew automatically until cancelled.",
      "You can cancel anytime and keep access until the end of your billing period.",
      "Change-of-mind refunds are generally not provided, but Australian Consumer Law rights still apply.",
      "Billing is handled securely by Stripe.",
    ],
    sections: [
      {
        title: "1. Plans",
        body: [
          "Aussie Med Guide may offer a free plan and one or more paid subscription plans, including monthly and annual options. Current pricing and feature availability are shown on the Pricing page.",
        ],
      },
      {
        title: "2. Billing and payment authorisation",
        body: [
          "By starting a paid subscription, you authorise Stripe or our payment processor to charge your chosen payment method immediately and on a recurring basis until you cancel.",
          "All prices are shown in Australian dollars unless stated otherwise. GST treatment will be shown where applicable.",
        ],
      },
      {
        title: "3. Auto-renewal",
        body: [
          "Paid subscriptions renew automatically at the end of each billing cycle unless cancelled before renewal.",
        ],
      },
      {
        title: "4. Cancellation",
        body: [
          "You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current paid billing period unless we state otherwise.",
          "If you cancel, you will usually retain access to paid features until the end of the billing cycle already paid for.",
        ],
      },
      {
        title: "5. Refunds and consumer rights",
        body: [
          "Change-of-mind refunds and refunds for unused time are generally not provided.",
          "However, nothing in these terms excludes or limits any rights you may have under the Australian Consumer Law. If the service fails to meet consumer guarantees, you may be entitled to a remedy, which can include a refund, repair, replacement, or other appropriate outcome depending on the issue.",
        ],
      },
      {
        title: "6. Failed payments",
        body: [
          "If a recurring payment fails, we may retry the charge and may ask you to update your payment method. If payment remains unsuccessful, paid access may be suspended or downgraded.",
        ],
      },
      {
        title: "7. Upgrades and downgrades",
        body: [
          "If you change plans, the new billing treatment will be explained at checkout or in your billing settings. We may apply immediate upgrades, end-of-cycle downgrades, prorated adjustments, or credits depending on the subscription setup.",
        ],
      },
      {
        title: "8. Price changes",
        body: [
          "We may change subscription pricing from time to time. If we do, we will give reasonable notice before the new price applies to your next renewal.",
        ],
      },
      {
        title: "9. Chargebacks and payment disputes",
        body: [
          "If you believe there has been a billing error, contact us first so we can investigate. Initiating a chargeback without contacting us may result in temporary account suspension while the matter is reviewed.",
        ],
      },
      {
        title: "10. Account misuse",
        body: [
          "Paid access may be restricted or terminated where we reasonably suspect fraud, payment abuse, chargeback abuse, or account sharing in breach of our Terms of Use.",
        ],
      },
      {
        title: "11. Contact",
        body: ["Billing and subscription questions: support@aussiemedguide.com"],
      },
    ],
  },
];