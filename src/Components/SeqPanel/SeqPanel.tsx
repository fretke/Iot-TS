import React from "react";
import SequenceCreator from "./SequenceCreator/SequenceCreator";
import styles from "./SeqPanel.module.css";
import ControlsService from "../../services/ControlsService";
import {SequenceType} from "../../App";
import Sequence from "./Sequence/Sequence";

interface SeqPanelProps {
    seq: SequenceType[];
    controlsManager: ControlsService
}

class SeqPanel extends React.Component<SeqPanelProps> {
    state = {
        addSeq: false,
    };

    private addNewSequence(): void {
        this.props.controlsManager.dispatchEvent("onSequenceCreation");
    }

    render() {
        const {addSeq} = this.state
        const allSequences = this.props.seq.map((item, index) => {
            return <Sequence
                controlsManager={this.props.controlsManager}
                key={index}
                seqName={item.seqName}
                data={item.moves}/>;
        });
        let panelStyle = null;
        let divStyle = null;
        let buttonStyle = null;
        if (addSeq) {
            panelStyle = styles.Panel;
            divStyle = styles.CreatorFixed;
            buttonStyle = styles.ButtonFixed;
        } else {
            panelStyle = styles.PanelNormal;
            divStyle = styles.Creator;
            buttonStyle = styles.Button;
        }
        return (
            <div className={panelStyle}>
                <div className={divStyle}>
                    <button
                        className={buttonStyle}
                        onClick={() => this.addNewSequence()}
                    >
                        {addSeq ? "Go Back" : "Add New"}
                    </button>

                    {addSeq && <SequenceCreator/>}
                </div>

                {allSequences}
            </div>
        );
    }
}

export default SeqPanel;
