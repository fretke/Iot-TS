import React from "react";
import LogIn from "./Components/LogIn/LogIn";
import ControlPanel from "./Containers/ControlPanel/ControlPanel";
import Spinner from "./Components/Spinner/Spinner";
import Cookies from "universal-cookie";
import {UserService} from "./services/UserService";
import {SERVER} from "./Settings/settings";
import {RestApi} from "./services/RestApi";
import Modal from "./Components/Modal/Modal";
import {SequenceType, ServoData} from "./services/ControlsService";

interface Props {
}

interface State {
  isAuth: boolean;
  servos: ServoData[];
  error: string | null;
}

export interface IoT {
  ledIsOn: boolean,
  seq: SequenceType[]
  servos: ServoData[]
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
      error: null
    }

    this.client = new UserService(new RestApi(SERVER));
  }


  componentDidMount() {
    this.client
        .addObserver("onLoggedIn", this, this.onLoggedIn.bind(this))
        .addObserver("onError", this, (message: string) => this.setState({error: message}));
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

  private onModalClose(): void {
    this.setState({error: null})
  }

  render() {
    const { isAuth, error } = this.state;
    if (cookie.get("user") && !isAuth) return <Spinner />;
    return isAuth ? (
      this.controls && <ControlPanel
          controls={this.controls}
          client={this.client}/>
    ) : (
      <React.Fragment>
        <LogIn client={this.client}/>
        {error && (
          <Modal
            click={() => this.onModalClose()}
            title={error}
          />
        )}
      </React.Fragment>
    );
  }
}

export default App;

