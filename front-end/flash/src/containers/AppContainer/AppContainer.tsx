import React, { Component, ReactNode } from "react";
import { ScreenCloud } from "../../ScreenCloudReactApp";
import alert_icon from "../../img/bullhorn_black.svg";

interface Props {
  sc?: ScreenCloud;
}
const data = {
  level: "WARNING",
  message: "Fire Drill 10 Minutes",
  duration: 10000
};


export class AppContainer extends Component<Props> {
  componentDidMount() {
    this.countingflashEnd();
  }

  countingflashEnd = () => {
    setTimeout(() => {
      // this.props.sc.emitFinished({});
      console.log(">>> enddd!");
    }, data.duration);
  };

  render(): ReactNode {
    return (
      <div className="app-container">
        <div
          className={`message-container background ${data.level.toLocaleLowerCase()}`}
        >
          <div className="message">
            {data.message}
          </div>
        </div>
      </div>
    );
  }
}
