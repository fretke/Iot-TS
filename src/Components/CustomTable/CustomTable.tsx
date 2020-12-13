import React from "react";
import styles from "./CustomTable.module.css";
import {ServoData} from "../../services/ControlsService";

interface CustomTableProps {
  tableData: ServoData[];
}

const CustomTable = (props: CustomTableProps) => {
  const data = props.tableData.map((servoData, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{servoData.name}</td>
        <td>{servoData.speed}</td>
        <td>{servoData.pos}</td>
      </tr>
    );
  });

  return (
    <div className={styles.Scroll}>
      <table className={styles.CustomTable}>
        <thead>
          <tr>
            <th>No.:</th>
            <th>Name</th>
            <th>Speed</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>{data}</tbody>
      </table>
    </div>
  );
};

export default CustomTable;
