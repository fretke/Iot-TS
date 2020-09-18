import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { servoData } from "../../../store/Reducers/controlsReducer";

const tableStyles = (theme: any) => ({
  table: {
    width: 400,
    borderRadius: 3,
    margin: "auto",
    // textAlign: "center"
  },
});

interface SequenceProps {
  seqName: string;
  data: servoData[];
}

class Sequence extends React.Component<SequenceProps> {
  state = {
    showMore: false,
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
      <div>
        <h3 onClick={() => this.setState({ showMore: !this.state.showMore })}>
          {this.props.seqName}
        </h3>
        {this.state.showMore && (
          <Table
            className={classes.table}
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

export default withStyles(tableStyles)(Sequence);
