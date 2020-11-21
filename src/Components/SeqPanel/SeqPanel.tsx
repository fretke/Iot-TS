import React from "react";
import {connect} from "react-redux";
import {StoreState} from "../../store/Reducers";
import {seqState} from "../../store/Reducers/sequenceReducer";
import Sequence from "./Sequence/Sequence";
import SequenceCreator from "./SequenceCreator/SequenceCreator";
import styles from "./SeqPanel.module.css";

import {
    addNewSequenceToggle,
    AddNewSequenceToggleAction,
} from "../../store/Actions/seqActions";

import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import BackspaceIcon from "@material-ui/icons/Backspace";
import {SocketService} from "../../Utils/SocketService";
import ControlsService from "../../services/ControlsService";

interface SeqPanelProps {
    seq: seqState;
    socketService: SocketService
    controlsManager: ControlsService

    addNewSequenceToggle(): AddNewSequenceToggleAction;
}

class SeqPanel extends React.Component<SeqPanelProps> {
    state = {
        addSeq: false,
    };

    private addNewSequence(): void {
        this.props.controlsManager.dispatchEvent("onSequenceCreation");
    }

    render() {
        const allSequences = this.props.seq.seq.map((item, index) => {
            return <Sequence socketService={this.props.socketService} key={index} seqName={item.seqName}
                             data={item.moves}/>;
        });
        let panelStyle = null;
        let divStyle = null;
        let buttonStyle = null;
        if (this.props.seq.seqCreationModeOn) {
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
                        {this.props.seq.seqCreationModeOn ? "Go Back" : "Add New"}
                    </button>

                    {this.props.seq.seqCreationModeOn && <SequenceCreator/>}
                </div>

                {allSequences}
            </div>
        );
    }
}

const mapStateToProps = (state: StoreState) => {
    return {
        seq: state.allSeq,
    };
};

export default connect(mapStateToProps, {addNewSequenceToggle})(SeqPanel);
