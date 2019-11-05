import React, { Component, ReactNode } from "react";
import { ScreenCloud } from "../../ScreenCloudReactApp";
import alert_icon from "../../img/bullhorn_black.svg";

interface Props {
  sc?: ScreenCloud;
}
interface State {
  isAnimateFinished: boolean
}
const data = {
  level: "WARNING",
  message: "Fire Drill 10 Minutes",
  duration: 10000
};

interface CommandResult {
  level: string
  duration: number
  message: string
}


export class AppContainer extends Component<Props, State> {
  constructor(props: Props){
    super(props)
    this.state = {
      isAnimateFinished: false
    }
  }
  componentDidMount() {
    this.setDisplayNone()
    this.countingflashEnd();
  }

  countingflashEnd = () => {
    setTimeout(() => {
      // this.props.sc.emitFinished({});
      console.log(">>> enddd!");
    }, data.duration);
  };

  setDisplayNone = () => {
    setTimeout(() => {
      this.setState({ isAnimateFinished: true })
    }, 4000);
  }

  render(): ReactNode {
    return (
      <div className="app-container">
        <div
          className={`message-container background ${data.level.toLocaleLowerCase()}`}
        >
          <div className={`animated icon-animation-1 ${this.state.isAnimateFinished ? 'hidden' : ''}`}>
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
