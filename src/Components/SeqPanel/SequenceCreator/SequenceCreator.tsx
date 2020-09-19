import React from "react";
import { connect } from "react-redux";
import { StoreState } from "../../../store/Reducers";
import { seqState } from "../../../store/Reducers/sequenceReducer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import { saveNewSequence, SaveNewSequenceAction } from "../../../store/Actions";
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
          <TableCell align="right">{el.name}</TableCell>
          <TableCell align="right">{el.speed}</TableCell>
          <TableCell align="right">{el.pos}</TableCell>
        </TableRow>
      );
    });
    return (
      <div>
        <div>
          <label htmlFor="seqName">Enter Sequence Name</label>
          <input
            onChange={(e) => this.seqNameEnterHandler(e)}
            type="text"
            name="seqName"
            value={this.state.seqTitle}
            id="seqName"
          />
        </div>
        <Table
          //   className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Movement number</TableCell>
              <TableCell align="right">Motor name</TableCell>
              <TableCell align="right">Motor speed</TableCell>
              <TableCell align="right">Motor position</TableCell>
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
          startIcon={<SaveIcon />}
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
