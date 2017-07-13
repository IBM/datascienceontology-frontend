import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Router from "react-router-dom";

import { HomePage } from "./pages/home";
import { SearchPage } from "./pages/search";


const App = () =>
 <Router.HashRouter>
  <div className="main">
    <Router.Route exact path="/" component={HomePage} />
    <Router.Route path="/search/:query" component={SearchPage} />
  </div>
 </Router.HashRouter>;

ReactDOM.render(
  <App/>,
  document.getElementById("react-container")
);
