import React, { Component, ReactNode } from "react";
import { ScreenCloud } from "../../ScreenCloudReactApp";
import alert_icon from "../../img/bullhorn_black.svg";

interface Props {
  sc?: ScreenCloud;
}
const data = {
  level: "EMERGENCY",
  message: "NEW PROMOTION IS COMING",
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

  renderMessage = () => {
    return (
      <div className={`message-container ${data.level.toLocaleLowerCase()}`}>
        <div className="message">{data.message}</div>
      </div>
    );
  };

  render(): ReactNode {
    return (
      <div className="app-container">
        <div
          className={`message-container background ${data.level.toLocaleLowerCase()}`}
        >
          <div className="animated icon-animation-1">
            <div className="animated icon-animation-2">
              <div className="animated icon-animation-3">
                <img src={alert_icon} alt="" />
              </div>
            </div>
          </div>

          <div className="message animated message-animation">
            {data.message}
          </div>
        </div>
      </div>
    );
  }
}
