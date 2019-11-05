import React, { Component, useContext, ReactNode } from "react";
import { IBridge, IBridgeMessage, IMessage } from "@screencloud/app-core";
import { IAppConfig, MixedPlayer } from "@screencloud/signage-sdk";
import { config as developmentConfig } from "./config.development";
import { config as stagingConfig } from "./config.staging";
import {
  Initialize,
  Start
} from "@screencloud/signage-sdk/build/app/AppPlayerMessages";

// NB - Will split this file out into multiple pieces when we solve code sharing properly.

export interface Theme {
  primaryColor: { [key: string]: string };
  textOnPrimary: { [key: string]: string };
  textOnSecondary: { [key: string]: string };
  secondaryColor: { [key: string]: string };
  headingFont?: Font;
  bodyFont?: Font;
  id: string;
  name: string;
}

interface Font {
  family: string;
  url: string;
}

interface OldTheme {
  colorBgPrimary: string;
  colorTextBody: string;
  colorTextHeading: string;
  colorTextLink: string;
  fontBody: string;
  fontHeading: string;
  fontUrlBody: string;
  fontUrlHeading: string;
  id: string;
  name: string;
}

export interface ScreenCloud {
  appStarted: boolean;
  context: { theme: Theme };
  appId: string;
  config: { [prop: string]: any };
  emitFinished: Function;
  emitPreloaded: Function;
  emitConfigUpdateAvailable: Function;
  onRequestConfigUpdate: Function;
  UNSAFE_onStart: Function;
}

declare global {
  interface Window {
    Cypress?: {};
    __initAppWithConfig?: (configData: IAppConfig) => void;
    __startApp?: () => void;
  }
}

const initialSc = {
  appStarted: false,
  context: {
    theme: {
      primaryColor: {},
      textOnPrimary: {},
      textOnSecondary: {},
      secondaryColor: {},
      id: "",
      name: ""
    }
  },
  appId: "",
  config: {},
  emitFinished: () => {},
  emitPreloaded: () => {},
  emitConfigUpdateAvailable: () => {},
  onRequestConfigUpdate: () => {},
  UNSAFE_onStart: () => {}
};

export const ScreenCloudContext = React.createContext<ScreenCloud>(initialSc);

export const makeOldThemeFromNew = (newTheme: Theme): OldTheme => ({
  colorBgPrimary: newTheme.primaryColor["500"],
  colorTextBody: newTheme.textOnPrimary["500"],
  colorTextHeading: newTheme.textOnPrimary["500"],
  colorTextLink: newTheme.secondaryColor["500"],
  fontBody: (newTheme.bodyFont && newTheme.bodyFont.family) || "Default",
  fontHeading:
    (newTheme.headingFont && newTheme.headingFont.family) || "Default",
  fontUrlBody: (newTheme.bodyFont && newTheme.bodyFont.url) || "",
  fontUrlHeading: (newTheme.headingFont && newTheme.headingFont.url) || "",
  id: newTheme.id,
  name: newTheme.name
});

class LocalBridge implements IBridge {
  isConnected = true;
  isConnecting = false;

  connect(): Promise<void> {
    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  send(bridgeMessage: IBridgeMessage): void {
    console.log(`Local Bridge - Send`, bridgeMessage);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(message: IMessage): Promise<any> {
    console.log(`Local Bridge - Request`, message);
    return Promise.resolve();
  }
}

// Are we running inside a Player?
// If so, the app will have been loaded inside an iFrame.
const isRunningInPlayer = (): boolean => {
  const top = window.opener || window.parent || window.top;
  return top !== window.self && !window.Cypress;
};

// Are we running inside the mocked player specifically?
// i.e. not the Next Player
const isRunningInMockedPlayer = (): boolean => {
  return (
    isRunningInPlayer() && window.location.search.includes("mode=mocked-player")
  );
};

// Are we running inside the mocked player specifically?
// i.e. not the Next Player AND a user has clicked the "Preview" button
const isRunningInMockedPlayerPreview = (): boolean => {
  return (
    isRunningInPlayer() &&
    window.location.search.includes("mode=preview-mocked-player")
  );
};

// Are we running inside the Next player?
// i.e. not the mocked Player
const isRunningInNextPlayer = (): boolean => {
  return isRunningInPlayer() && !isRunningInMockedPlayer();
};

// Is the app running locally in dev mode?
const isLocalDevMode = (): boolean => {
  return process.env.NODE_ENV === "development";
};

// Is the app running inside an E2E test?
// (i.e. production build, but not in a player)
const isE2ETest = (): boolean => {
  return !!window.Cypress;
};

// Convenience hook for function components.
export const useScreenCloud = (): ScreenCloud => {
  const screenCloudContext = useContext(ScreenCloudContext);

  if (screenCloudContext.appId === "") {
    throw Error("ScreenCloudContext is not initialized");
  }
  return screenCloudContext;
};

// Convenience hook for function components.
export const useTheme = (): Theme => {
  const screenCloudContext = useContext(ScreenCloudContext);

  if (screenCloudContext.appId === "") {
    throw Error("ScreenCloudContext is not initialized");
  }
  return screenCloudContext.context.theme;
};

interface Props {
  children: (sc: ScreenCloud) => JSX.Element;
  defaultTheme?: Theme;
}

interface State {
  isInitialized: boolean;
  sc: ScreenCloud;
  player: MixedPlayer;
  initializePayload?: object;
}

class ScreenCloudReactApp extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // If not running inside a player, we need to mimic the bridge to a player.
    const player = isRunningInPlayer()
      ? new MixedPlayer()
      : new MixedPlayer(undefined, new LocalBridge());

    this.state = {
      isInitialized: false,
      player,
      sc: initialSc
    };
  }

  componentDidMount(): void {
    this.initPlayerHandlers();
  }

  initPlayerHandlers = () => {
    const { player } = this.state;

    /**
     * Initialize the app with stub config data (for development + test)
     */
    const __initAppWithConfig = (config: object): void => {
      const initializeMessage = {
        type: "initialize",
        payload: {
          appId: "local-app-id",
          appInstanceId: "local-app-instance-id",
          authority: "local-authority",
          context: {},
          orgId: "local-org",
          teamId: "local-team",
          state: {},
          config
        }
      };

      // @ts-ignore: TODO - Can SDK mark this method public instead of protected?
      player.receive(initializeMessage);
    };

    /**
     * Initialize the app with stub config data (for development + test)
     */
    const __startApp = (): void => {
      const startMessage: Start.Message = {
        type: "start"
      };

      // @ts-ignore: TODO - Can SDK mark this method public instead of protected?
      player.receive(startMessage);
    };

    player.onInitialize((initializePayload: Initialize.Payload) => {
      console.log("Initialized with payload", initializePayload);

      this.setState(
        {
          initializePayload,
          isInitialized: true,
          sc: this.makeScContext(initializePayload)
        },
        () => {
          player.emitInitialized();
        }
      );
    });

    player.onStart(() => {
      console.log("App started");
      player.emitStarted();
      this.setState({
        sc: { ...this.state.sc, appStarted: true }
      });
    });

    player.onFinish(() => {
      console.log("App finished");
      player.emitFinished();
    });

    // TODO - Modify development.js without impacting Git
    player
      .connect()
      .then(() => {
        // Local dev = Dev config or data from e2e test.
        // Production = No stub data in real player. Staging config or e2e test data otherwise.
        if (!isE2ETest() && !isRunningInMockedPlayerPreview()) {
          if (isLocalDevMode()) {
            __initAppWithConfig(developmentConfig);
            __startApp();
          } else if (!isRunningInNextPlayer()) {
            __initAppWithConfig(stagingConfig);
            __startApp();
          }
        }
      })
      .catch(e => {
        console.log("Connect failed", e);
      });

    // Expose publicly for tests to call at runtime.
    window.__initAppWithConfig = __initAppWithConfig;
    window.__startApp = __startApp;
  };

  /**
   * Make the ScreenCloud object to be given to the main app code.
   * Combines Init payload with handlers the app may use.
   */
  makeScContext = (payload: Initialize.Payload): ScreenCloud => {
    const { player } = this.state;

    return {
      ...payload,
      appStarted: false,
      context: {
        ...payload.context,
        theme: payload.context.theme || this.props.defaultTheme
      },
      // Player Methods
      emitFinished: player.emitFinished.bind(player),
      emitPreloaded: player.emitPreloaded.bind(player),
      UNSAFE_onStart: player.onStart.bind(player),
      // Editor Methods
      emitConfigUpdateAvailable: player.emitConfigUpdateAvailable.bind(player),
      onRequestConfigUpdate: player.onRequestConfigUpdate.bind(player)
    };
  };

  render(): ReactNode {
    const { isInitialized, sc } = this.state;

    if (!isInitialized || !sc) {
      return (
        <div
          style={{
            display: "none"
          }}
        >
          The app has not received an Initialize message.
        </div>
      );
    }

    return (
      <ScreenCloudContext.Provider value={sc}>
        {this.props.children(sc)}
      </ScreenCloudContext.Provider>
    );
  }
}

export default ScreenCloudReactApp;
