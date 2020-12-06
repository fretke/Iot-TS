import React from "react";
import CustomTable from "../../CustomTable/CustomTable";
import styles from "./SequenceCreator.module.css";
import Button from "@material-ui/core/Button";
import ControlsService, {ServoData} from "../../../services/ControlsService";

interface State {
  seqName: string;
  moves: ServoData[]
}

interface Props {
  controlsManager: ControlsService
}

export class SequenceCreator extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      seqName: "",
      moves: []
    }
  }

  public componentDidMount(): void {
    this.props.controlsManager.addObserver("onNewMoveAdded", this, this.onNewMoveAdded);
  }

  private onNewMoveAdded(data: ServoData): void {
    const moves = [...this.state.moves, data];
      this.setState({moves: moves});
  }

  private seqNameEnterHandler (event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ seqName: event.target.value });
  };

  private saveNewSequence(): void {
    const {seqName, moves} = this.state;
    this.props.controlsManager.saveSequence({seqName, moves});
  };

  render() {
    return (
      <div className={styles.Creator}>
        <div>
          <input
            onChange={(e) => this.seqNameEnterHandler(e)}
            type="text"
            name="seqName"
            value={this.state.seqName}
            id="seqName"
            placeholder="Sequence name"
          />
        </div>
        <CustomTable tableData={this.state.moves} />
        <Button
          onClick={() => this.saveNewSequence()}
          variant="contained"
          color="primary"
          size="small"
        >
          Save Sequence
        </Button>
      </div>
    );
  }
}

