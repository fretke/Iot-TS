import React from "react";
import { connect } from "react-redux";
import { StoreState } from "../../../store/Reducers";
import { seqState } from "../../../store/Reducers/sequenceReducer";

import CustomTable from "../../CustomTable/CustomTable";

import styles from "./SequenceCreator.module.css";

import Button from "@material-ui/core/Button";
import { saveNewSequence } from "../../../store/Actions";
import { servoData } from "../../../store/Reducers/controlsReducer";
import { userReducerState } from "../../../store/Reducers/userReducer";

interface SequenceCreatorState {
  seqTitle: string;
}

interface SequenceCreatorProps {
  seq: seqState;
  user: userReducerState;
  saveNewSequence(
    title: string,
    moves: servoData[],
    userEmail: string
  ): Promise<void>;
}

class SequenceCreator extends React.Component<SequenceCreatorProps> {
  state: SequenceCreatorState = {
    seqTitle: "",
  };

  seqNameEnterHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ seqTitle: event.target.value });
  };

  saveNewSequenceHandler = () => {
    this.props.saveNewSequence(
      this.state.seqTitle,
      this.props.seq.creationSeq,
      this.props.user.userEmail
    );
  };

  render() {
    return (
      <div className={styles.Creator}>
        <div>
          <input
            onChange={(e) => this.seqNameEnterHandler(e)}
            type="text"
            name="seqName"
            value={this.state.seqTitle}
            id="seqName"
            placeholder="Sequence name"
          />
        </div>
        <CustomTable tableData={this.props.seq.creationSeq} />
        <Button
          onClick={() => this.saveNewSequenceHandler()}
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

const mapStateToProps = (state: StoreState) => {
  return {
    seq: state.allSeq,
    user: state.user,
  };
};

export default connect(mapStateToProps, { saveNewSequence })(SequenceCreator);
