import React from "react";
import Switch from "@material-ui/core/Switch";

import "./DeviceToggler.scss"
import ControlsService, {_Switch} from "../../services/ControlsService";

interface Props {
  controlsManager: ControlsService,
  device: _Switch
}

interface State {
  isOn: boolean
}

export class DeviceToggler extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isOn: props.device.state
    }
  }

  public componentDidMount(): void {
    this.props.controlsManager.addObserver("onDeviceToggle", this, () => {
      this.setState({isOn: !this.state.isOn})
    })
  }

  public async onToggle(): Promise<void> {
    await this.props.controlsManager.toggleDevice(this.props.device.name, !this.state.isOn);
    this.setState({isOn: !this.state.isOn});
  }

  render() {
    const {isOn} = this.state;
    const {name} = this.props.device;
    return (
      <div className={"switch"}>
          <h3>{name}</h3>
          <Switch
            checked={isOn}
            onChange={() => this.onToggle()}
          />
      </div>
    );
  }
}

