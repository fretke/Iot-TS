import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import IconButton from "@material-ui/core/IconButton";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import styles from "./Sequence.module.css";

import { servoData } from "../../../store/Reducers/controlsReducer";
import { deleteSequence } from "../../../store/Actions";
import { StoreState } from "../../../store/Reducers";
import { userReducerState } from "../../../store/Reducers/userReducer";

import { SocketContext } from "../../../Context/SocketContext";

const tableStyles = (theme: any) => ({
  table: {
    width: 600,
    borderRadius: 3,
    margin: "0 auto",
    // textAlign: "center"
  },
});

interface SequenceProps {
  user: userReducerState;
  seqName: string;
  data: servoData[];
  deleteSequence(title: string, userEmail: string): Promise<void>;
}

class Sequence extends React.Component<SequenceProps> {
  state = {
    showMore: false,
  };

  static contextType = SocketContext;

  deleteSequenceHandler = () => {
    this.props.deleteSequence(this.props.seqName, this.props.user.userEmail);
  };

  playSequence = () => {
    this.context.excecuteSequence(this.props.data);
  };

  render() {
    const { classes } = this.props as any;
    const tableData = this.props.data.map((seq, index) => {
      return (
        <TableRow key={index + 1}>
          <TableCell component="th" scope="row">
            {index + 1}
          </TableCell>
          <TableCell align="right">{seq.name}</TableCell>
          <TableCell align="right">{seq.speed}</TableCell>
          <TableCell align="right">{seq.pos}</TableCell>
        </TableRow>
      );
    });

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
        {this.state.showMore && (
          <Table
            // className={classes.table}
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
            <TableBody>{tableData}</TableBody>
          </Table>
        )}
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
