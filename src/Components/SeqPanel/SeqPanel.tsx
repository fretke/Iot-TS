import React from "react";
import { connect } from "react-redux";
import { StoreState } from "../../store/Reducers";
import { seqState } from "../../store/Reducers/sequenceReducer";
import Sequence from "./Sequence/Sequence";
import SequenceCreator from "./SequenceCreator/SequenceCreator";
import styles from "./SeqPanel.module.css";

import {
  addNewSequenceToggle,
  AddNewSequenceToggleAction,
} from "../../store/Actions/seqActions";

import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

interface SeqPanelProps {
  seq: seqState;
  addNewSequenceToggle(): AddNewSequenceToggleAction;
}

class SeqPanel extends React.Component<SeqPanelProps> {
  state = {
    addSeq: false,
  };

  //   addNewSequenceClickHandler = () => {};
  render() {
    const allSequences = this.props.seq.seq.map((item, index) => {
      return <Sequence key={index} seqName={item.seqName} data={item.moves} />;
    });
    return (
      <div className={styles.Panel}>
        {allSequences}
        <IconButton
          className={styles.PanelButton}
          onClick={() => this.props.addNewSequenceToggle()}
          aria-label="add"
          color="primary"
        >
          <AddIcon />
        </IconButton>
        {this.props.seq.seqCreationModeOn && <SequenceCreator />}
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    seq: state.allSeq,
  };
};

export default connect(mapStateToProps, { addNewSequenceToggle })(SeqPanel);
