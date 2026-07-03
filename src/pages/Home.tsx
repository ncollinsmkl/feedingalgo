/**
 * Home — the SPA's single long-scrolling page.
 * Composes all sections in their Figma order.
 */
import Header from "../components/Header";
import Hero from "../components/Hero";
/** import KeyBenefits from "../components/KeyBenefits"; */
import MeetAlgo from "../components/MeetAlgo";
import MakingStrongData from "../components/MakingStrongData";
import AlgoAudit from "../components/AlgoAudit";
import LeadGen from "../components/LeadGen";
import Footer from "../components/Footer";
import ConsentBanner from "../components/ConsentBanner";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <MeetAlgo />
      <MakingStrongData />
      {/*
        Algo Audit — live variant is "matrix" (Option A).
        The "stepper" (Option B) and "accordion" (Option C) layouts are
        still implemented inside AlgoAudit.tsx and can be tried out at
        /mocks/audit at any time. To switch the live layout, just change
        the variant prop below to "stepper" or "accordion".
      */}
      <AlgoAudit variant="matrix" />
      <LeadGen />
      <Footer />
      <ConsentBanner />
    </>
  );
}
