import React from "react";
import { connect } from "react-redux";
import { StoreState } from "../../../store/Reducers";
import { seqState } from "../../../store/Reducers/sequenceReducer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import styles from "./SequenceCreator.module.css";
// import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
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
    const currentSeq = this.props.seq.creationSeq.map((el, index) => {
      return (
        <TableRow key={index + 1}>
          <TableCell component="th" scope="row">
            {index + 1}
          </TableCell>
          <TableCell style={{ minWidth: 50, maxWidth: 50 }} align="center">
            {el.name}
          </TableCell>
          <TableCell align="center">{el.speed}</TableCell>
          <TableCell align="center">{el.pos}</TableCell>
        </TableRow>
      );
    });
    return (
      <div className={styles.Creator}>
        <div>
          {/* <label htmlFor="seqName">Enter Sequence Name</label> */}
          <input
            onChange={(e) => this.seqNameEnterHandler(e)}
            type="text"
            name="seqName"
            value={this.state.seqTitle}
            id="seqName"
            placeholder="Sequence name"
          />
        </div>

        <Table
          //   className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          {/* <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "10%" }} />
          </colgroup> */}
          <TableHead>
            <TableRow>
              <TableCell>No.:</TableCell>
              <TableCell align="center">name</TableCell>
              <TableCell align="center">speed</TableCell>
              <TableCell align="center">position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{currentSeq}</TableBody>
        </Table>
        <Button
          onClick={() => this.saveNewSequenceHandler()}
          variant="contained"
          color="primary"
          size="small"
          // className={classes.button}
          // startIcon={<SaveIcon />}
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
