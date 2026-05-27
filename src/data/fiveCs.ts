/**
 * Copy + solution lists for each of the 5 Cs.
 * Used by MakingStrongData cards and the Tell-me-more modals.
 *
 * ════════════════════════════════════════════════════════════════════
 * 👉 EDIT THE "TELL ME MORE" MODAL TEXT HERE
 * ════════════════════════════════════════════════════════════════════
 * Each entry in FIVE_CS controls one of the five cards AND its modal:
 *   • `title`      — the big heading on the card and at the top of the
 *                    modal (e.g. "Consent"). Also drives the CTA label
 *                    ("Talk to us about Consent").
 *   • `blurb`      — the short paragraph shown on the card itself.
 *   • `modalBody`  — the longer description shown inside the "Tell me
 *                    more" pop-up modal.
 *   • `solutions`  — bullet list of solutions shown in the modal.
 * Leave `cereal` and `accentVar` alone unless you want to swap colours
 * or imagery for a C.
 * ════════════════════════════════════════════════════════════════════
 */
export type CKey = "consent" | "collect" | "curate" | "combine" | "connect";

/** A single service shown in the modal's solutions list. */
export interface CSolution {
  /** Product / service name (e.g. "Advanced Consent Mode"). */
  name: string;
  /** One-line description in the website's playful tone. */
  description: string;
  /** Optional nested items (e.g. CAPI → Facebook, TikTok, Amazon). */
  subItems?: { name: string; description: string }[];
}

export interface CDef {
  key: CKey;
  title: string;
  /** Short tagline shown on the card. */
  blurb: string;
  /** Long description shown in the modal. */
  modalBody: string;
  /** Solutions list shown in the modal — name + description. */
  solutions: CSolution[];
  /** Cereal-C image asset path. */
  cereal: string;
  /** Accent color CSS var name. */
  accentVar: string;
}

export const FIVE_CS: CDef[] = [
  {
    key: "consent",
    title: "Consent",
    blurb:
      "We harvest only with full permission. No rubbish additives or artificial filler, just pure, legal, healthy data.",
    modalBody:
      "Consent is about establishing the legal and ethical right to use the data you collect. It's the foundation everything else is built on — without it, the rest of the recipe falls apart.",
    solutions: [
      {
        name: "Advanced Consent Mode",
        description:
          "Google's smart consent signalling — when a user opts out we respect it, but Algo's bowl still gets topped up with modelled data so measurement and bidding don't go hungry. Compliance without the empty calories.",
      },
      {
        name: "CMP Support (Consent Management Platform)",
        description:
          "The branded pop-up that greets every visitor with a polite \"cookies?\" — set up properly so preferences are captured, respected, and signalled to every downstream tool. The welcoming host who checks dietary requirements before serving anything.",
      },
    ],
    cereal: "/assets/Image_Cereal_Red_C.png",
    accentVar: "--c-red",
  },
  {
    key: "collect",
    title: "Collect",
    blurb:
      "We pluck the ripest signals from every channel, skipping the “filler” to ensure your data set is nutrient-dense and relevant.",
    modalBody:
      "Collect is about pulling in the relevant and useful data points — and only those. Better signals in means better decisions out.",
    solutions: [
      {
        name: "Tagging audits",
        description:
          "A thorough kitchen inspection of every tag firing across your site. We sniff out duplicates, broken pixels and stale events so Algo isn't munching on yesterday's leftovers.",
      },
      {
        name: "Enhanced Conversions",
        description:
          "Hashed first-party customer data passed alongside each conversion, so Google can match more sales back to the click that started them — even after cookies have crumbled. Heartier ingredients, fewer missed meals.",
      },
      {
        name: "Google Tag Gateway",
        description:
          "Your tagging traffic routed through your own domain first, so ad-blockers and browser restrictions stop intercepting the delivery. Algo's groceries arrive on the doorstep instead of being lost in transit.",
      },
      {
        name: "Server-side Google Tag Manager",
        description:
          "Tag execution moved off the browser and onto a server you control. Faster pages, cleaner data, and total say over what gets shared with whom — the kitchen finally has a head chef.",
      },
      {
        name: "CAPI (Conversions API)",
        description:
          "A server-to-server pipeline that sends conversion data straight from your back end to ad platforms — no browser required. The chef-to-platform delivery van that doesn't depend on cookie crumbs surviving the trip.",
        subItems: [
          {
            name: "Facebook (Meta CAPI)",
            description:
              "Conversions delivered direct to Meta — Facebook, Instagram and Messenger — so attribution survives iOS restrictions and ad-blockers.",
          },
          {
            name: "TikTok (Events API)",
            description:
              "Server-side events fired straight at TikTok's API for cleaner conversion tracking and stronger optimisation signals.",
          },
          {
            name: "Amazon (Conversions API)",
            description:
              "Purchase signals piped to Amazon Ads so campaigns optimise against actual sales, not just clicks.",
          },
        ],
      },
      {
        name: "MMPs (Mobile Measurement Partners)",
        description:
          "Independent referees like AppsFlyer, Adjust or Branch that attribute app installs and in-app events across every paid channel. The neutral judge so no platform claims credit for the same meal twice.",
      },
    ],
    cereal: "/assets/Image_Cereal_Orange_C.png",
    accentVar: "--c-orange",
  },
  {
    key: "curate",
    title: "Curate",
    blurb:
      "We clean, sort, and label every byte. It's “pre-organised” so your Algo spends less time chewing and more time doing.",
    modalBody:
      "Curate focuses on organising and labelling the data for cross-channel use. A well-curated dataset is consistent, discoverable, and ready to act on.",
    solutions: [
      {
        name: "Taxonomy",
        description:
          "A single naming convention spanning every campaign, channel, audience and event. Once everything's labelled the same way, Algo can find any ingredient in seconds without rummaging through the pantry.",
      },
      {
        name: "Data Matching",
        description:
          "Joining records from different systems — CRM, web, offline — onto a single customer record using emails, phone numbers, hashed identifiers or anything they share. Putting all the ingredients in the same labelled jar.",
      },
    ],
    cereal: "/assets/Image_Cereal_Blue_C.png",
    accentVar: "--c-blue",
  },
  {
    key: "combine",
    title: "Combine",
    blurb:
      "We mix diverse sources into one holistic recipe, providing a 360-degree view for a complete, well-rounded nutritional profile.",
    modalBody:
      "Combine is about merging data sources to build a 360-degree view of the customer — so your decisions are based on the whole picture, not a single channel.",
    solutions: [
      {
        name: "BigQuery",
        description:
          "Google's cloud data warehouse where every marketing source, CRM record and offline conversion sits side by side. One worktop, all the ingredients, ready to be mixed into insight.",
      },
      {
        name: "General cloud data warehouses",
        description:
          "Snowflake, Redshift, Databricks — the alternative pantries to BigQuery. We'll plug into whichever your team already uses so all your marketing data sits next to the rest of the business.",
      },
      {
        name: "Reporting solutions",
        description:
          "Looker Studio, Power BI, Tableau — the serving plates that turn warehoused data into dashboards stakeholders can actually read over their morning coffee.",
      },
    ],
    cereal: "/assets/Image_Cereal_Green_C.png",
    accentVar: "--c-green",
  },
  {
    key: "connect",
    title: "Connect",
    blurb:
      "We use the best tech to turn ingredients into action, ensuring your data is ready to activate and fuel results across every channel.",
    modalBody:
      "Connect is about activating the data to speak to a brand's audience — turning insight into impact across every channel.",
    solutions: [
      {
        name: "Google Analytics excellence",
        description:
          "A properly configured GA4 — clean events, meaningful audiences, calibrated conversions — feeding consistent signals into every platform you activate. The well-set table that turns ingredients into a meal.",
      },
      {
        name: "Audience Management Platforms",
        description:
          "Tools like Lytics, BlueKai or Salesforce CDP that build, store and sync audience segments out to every paid platform. The kitchen pass that gets the right meal to the right table.",
      },
      {
        name: "Adobe Analytics / Adobe CJA",
        description:
          "The Adobe side of the analytics aisle — Customer Journey Analytics built specifically for joined-up reporting across web, app and offline. A complementary cookbook to GA4 when your stack already lives in Adobe.",
      },
      {
        name: "Offline data",
        description:
          "In-store purchases, call-centre conversions and CRM lifecycle events fed back up to ad platforms so optimisation learns from what really happened — not just what happened in a browser tab. Receipts from every till added back to the recipe.",
      },
    ],
    cereal: "/assets/Image_Cereal_Purple_C.png",
    accentVar: "--c-purple",
  },
];
