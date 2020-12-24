import React from "react";
import Switch from "@material-ui/core/Switch";

import "./DeviceToggler.scss"
import ControlsService, {Device} from "../../services/ControlsService";

interface Props {
  controlsManager: ControlsService,
  device: Device
}

interface State {
  isOn: boolean;
  showDelete: boolean;
}

export class DeviceToggler extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isOn: props.device.state,
      showDelete: false

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

  private delete(): Promise<void> {
    return this.props.controlsManager.deleteDevice(this.props.device.name);
  }

  render() {
    const {isOn, showDelete} = this.state;
    const {name} = this.props.device;
    return (
      <div
          className={"switch"}
          onMouseLeave={() => this.setState({showDelete: false})}
          onMouseEnter={() => this.setState({showDelete: true})}>
          <h3>{name}</h3>
          <Switch
            checked={isOn}
            onChange={() => this.onToggle()}
          />
        {showDelete && <button onClick = {() => this.delete()}>X</button>}
      </div>
    );
  }
}

