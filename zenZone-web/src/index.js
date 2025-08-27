import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Home from "./views/Home";
import Meditation from "./views/Meditation";
import Events from "./views/Events";
import NutritionConsultation from "./views/NutritionConsultation";
import BiochemicalBalance from "./views/BiochemicalBalance";
import Books from "./views/Books";
import Podcasts from "./views/Podcasts";
import Websites from "./views/Websites";
import UpcomingEvents from "./views/UpcomingEvents";
import ContactUs from "./views/ContactUs";
import PastMeditations from "./views/PastMeditations";
import FAQs from "./views/FAQs";
import PrivacyPolicy from "./views/PrivacyPolicy";

// ✅ Correct path (index.js and ZenBot.jsx are both in src/)
import ZenBot from "./zenBot.jsx";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ZenBot />
      <div>
        <Switch>
          <Route path="/events" component={Events} />
          <Route path="/books" component={Books} />
          <Route path="/podcasts" component={Podcasts} />
          <Route path="/websites" component={Websites} />
          <Route
            path="/nutrition-consultation"
            component={NutritionConsultation}
          />
          <Route path="/biochemical-balance" component={BiochemicalBalance} />
          <Route path="/meditation" component={Meditation} />
          <Route path="/upcoming-events" component={UpcomingEvents} />
          <Route path="/contact-us" component={ContactUs} />
          <Route path="/past-meditation" component={PastMeditations} />
          <Route path="/faqs" component={FAQs} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />

          {/* Default route last */}
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
