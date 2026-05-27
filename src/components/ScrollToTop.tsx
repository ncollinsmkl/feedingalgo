/**
 * ScrollToTop — resets the scroll position whenever the route changes.
 *
 * React Router doesn't reset scroll on navigation by default, so e.g.
 * clicking the "Privacy Policy" footer link from far down the home page
 * would land the user mid-way through /privacy. Mounting this component
 * once inside <BrowserRouter> fixes that for every route.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // `instant` so the user doesn't see a smooth-scroll animation
    // between two unrelated pages (would feel like the page is "falling
    // upwards" when it loads).
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
