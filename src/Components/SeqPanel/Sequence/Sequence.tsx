import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import styles from "./Sequence.module.css";

import CustomTable from "../../CustomTable/CustomTable";

import { servoData } from "../../../store/Reducers/controlsReducer";
import { deleteSequence } from "../../../store/Actions";
import { StoreState } from "../../../store/Reducers";
import { userReducerState } from "../../../store/Reducers/userReducer";
import {SocketService} from "../../../Utils/SocketService";

const tableStyles = (theme: any) => ({
  table: {
    width: 600,
    borderRadius: 3,
    margin: "0 auto",
  },
});

interface SequenceProps {
  user: userReducerState;
  seqName: string;
  data: servoData[];
  socketService: SocketService;
  deleteSequence(title: string, userEmail: string): Promise<void>;
}

class Sequence extends React.Component<SequenceProps> {
  state = {
    showMore: false,
  };

  deleteSequenceHandler = () => {
    this.props.deleteSequence(this.props.seqName, this.props.user.userEmail);
  };

  playSequence = () => {
    this.props.socketService.excecuteSequence(this.props.data);
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

const mapStateToProps = (state: StoreState) => {
  return {
    user: state.user,
  };
};

export default withStyles(tableStyles)(
  connect(mapStateToProps, { deleteSequence })(Sequence)
);
