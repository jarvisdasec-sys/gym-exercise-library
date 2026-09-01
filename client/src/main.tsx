import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

if (analyticsEndpoint && analyticsWebsiteId) {
	const analytics = document.createElement("script");
	analytics.defer = true;
	analytics.src = `${analyticsEndpoint.replace(/\/$/, "")}/umami`;
	analytics.dataset.websiteId = analyticsWebsiteId;
	document.head.append(analytics);
}

createRoot(document.getElementById("root")!).render(<App />);
