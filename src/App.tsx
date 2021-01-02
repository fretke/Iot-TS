import React from "react";
import LogIn from "./Components/LogIn/LogIn";
import {ControlPanel} from "./Containers/ControlPanel/ControlPanel";
import Spinner from "./Components/Spinner/Spinner";
import Cookies from "universal-cookie";
import {UserService} from "./services/UserService";
import {SERVER} from "./Settings/settings";
import {RestApi} from "./services/RestApi";
import {SequenceType, ServoData, _Switch, CompleteServoData} from "./services/ControlsService";
import {Notification} from "./Components/Common/Notification";
import {NotificationService} from "./services/NotificationService";

interface Props {
}

interface State {
  isAuth: boolean;
  servos: ServoData[];
}

export interface IoT {
  ledIsOn: boolean,
  seq: SequenceType[]
  servos: CompleteServoData[],
  switches: _Switch[]
}

const cookie = new Cookies();

class App extends React.Component<Props, State> {

  private readonly client: UserService;
  private controls?: IoT;

  public constructor(props: Props) {
    super(props);

    this.state = {
      isAuth: false,
      servos: [],
    }

    this.client = new UserService(new RestApi(SERVER));
  }


  componentDidMount() {
    this.client
        .addObserver("onLoggedIn", this, this.onLoggedIn.bind(this))
        .addObserver("onError", this, (message: string) => NotificationService.error(message));
    if (cookie.get("user")) {
      this.client.logIn(cookie.get("user"));
    }
  }

  private onLoggedIn(data: IoT): void {
    this.controls = data;
    this.setState({
      isAuth: true
    })
  }

  componentWillUnmount() {
    this.client.removeObserver(this);
  }

  public render(): React.ReactNode {
    const { isAuth } = this.state;
    if (cookie.get("user") && !isAuth) return <Spinner/>;
    return (
        <>
          <Notification />
          {isAuth ? (
              this.controls && <ControlPanel
                  controls={this.controls}
                  client={this.client}/>
          ) : <LogIn client={this.client}/>}
        </>
    )
  }
}

export default App;

