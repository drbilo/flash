import React, { Component, ReactNode } from "react";
import { ScreenCloud } from "../../ScreenCloudReactApp";
import alert_icon from "../../img/bullhorn_black.svg"

interface Props {
  sc?: ScreenCloud;
}

export class AppContainer extends Component<Props> {


  render(): ReactNode {
    return (
      <div className="app-container">
        <div className="background">
            <div className="animated icon-animation-1">
                <div className="animated icon-animation-2">
                    <div className="animated icon-animation-3">
                        <img src={alert_icon} alt="" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}
