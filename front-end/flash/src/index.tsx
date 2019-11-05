import React from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch"; // required until cypress supports fetch API. https://github.com/cypress-io/cypress/issues/95
import "normalize.css"; // Import before any custom CSS. Smoothes out browser differences.

import { AppContainer } from "./containers/AppContainer/AppContainer";
import ScreenCloudReactApp from "./ScreenCloudReactApp";
import { defaultTheme } from "./defaultTheme";
import * as serviceWorker from "./serviceWorker";
import "./index.css";

ReactDOM.render(
  <ScreenCloudReactApp defaultTheme={defaultTheme}>
    {sc => <AppContainer sc={sc} />}
  </ScreenCloudReactApp>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
