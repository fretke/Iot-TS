import React from "react";

import IconButton from "@material-ui/core/IconButton";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import styles from "./Sequence.module.css";

import CustomTable from "../../CustomTable/CustomTable";

import { servoData } from "../../../store/Reducers/controlsReducer";
import ControlsService from "../../../services/ControlsService";


interface SequenceProps {
  seqName: string;
  data: servoData[];
  controlsManager: ControlsService;
}

class Sequence extends React.Component<SequenceProps> {
  state = {
    showMore: false,
  };

  private deleteSequenceHandler ():void {
      // todo controlManager deleteSeqMethod
    // this.props.deleteSequence(this.props.seqName, this.props.user.userEmail);
  };

  private playSequence (): void {
      this.props.controlsManager.playSequence(this.props.data);
    // this.props.socketService.executeSequence(this.props.data);
  };

  render() {
    return (
      <div className={styles.MainTable}>
        <h3 onClick={() => this.setState({ showMore: !this.state.showMore })}>
          {this.props.seqName}
        </h3>
        <IconButton
          onClick={() => this.playSequence()}
          aria-label="add"
          color="primary"
        >
          <PlayCircleOutlineIcon />
        </IconButton>
        <IconButton
          onClick={() => this.deleteSequenceHandler()}
          aria-label="add"
          color="secondary"
        >
          <DeleteForeverIcon />
        </IconButton>
        {this.state.showMore && <CustomTable tableData={this.props.data} />}
      </div>
    );
  }
}

export default Sequence;
