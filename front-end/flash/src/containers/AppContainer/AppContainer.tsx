import React, { Component, ReactNode } from "react";
import { ScreenCloud } from "../../ScreenCloudReactApp";

interface Props {
  sc?: ScreenCloud;
}

export class AppContainer extends Component<Props> {
  render(): ReactNode {
    return (
      <div className="app-container">
        <h2>Flash</h2>
        <p>Please modify `AppContainer.tsx` to begin.</p>
      </div>
    );
  }
}
