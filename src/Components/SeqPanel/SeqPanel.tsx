import React from "react";
import {SequenceCreator} from "./SequenceCreator/SequenceCreator";
import ControlsService, {SequenceType} from "../../services/ControlsService";
import {ContextItems, ContextMenu} from "../ContextMenu/ContextMenu";

interface Props {
    seq: SequenceType[];
    controlsManager: ControlsService
}

interface State {
    addSeq: boolean,
    selectedSequence?: SequenceType,
    xPos: number,
    yPos: number
}

class SeqPanel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            addSeq: false,
            xPos: 0,
            yPos: 0
        }
    }

    private addNewSequence(): void {
        this.props.controlsManager.dispatchEvent("onSequenceCreation");
        this.setState({addSeq: !this.state.addSeq});
    }

    private deleteSequence(): void {
        const {controlsManager} = this.props;
        const {selectedSequence} = this.state;
        if (selectedSequence) {
            controlsManager.deleteSequence(selectedSequence.seqName).catch(() => {

            });
        }
    };

    private playSequence(): void {
        const {selectedSequence} = this.state;
        if (selectedSequence) {
            this.props.controlsManager.playSequence(selectedSequence.moves);
        }
    };


    private showContextMenu(e: React.MouseEvent, selectedSequence: SequenceType): void {

        const {clientX, clientY} = e;

        this.setState({
            xPos: clientX,
            yPos: clientY,
            selectedSequence
        });
    }

    private renderSequences(): React.ReactNode {
        return this.props.seq.map((item, index) => {
            return (
                <tr key={index} onClick={(e) => this.showContextMenu(e, item)}>
                    <td>{item.seqName}</td>
                    <td>{item.moves.length}</td>
                </tr>
            )
        });
    }

    private onContextClose(): void {
        this.setState({selectedSequence: undefined})
    }

    render() {
        const {addSeq, selectedSequence, xPos, yPos} = this.state;
        const {controlsManager} = this.props;

        const items: ContextItems[] = [
            {
                title: "Play",
                action: () => this.playSequence(),
                visible: true
            },
            {
                title: "Delete",
                action: () => this.deleteSequence(),
                visible: true
            }
        ]

        return (
            <div className={"sequence-panel"}>

                {selectedSequence &&
                <ContextMenu onClose={this.onContextClose.bind(this)} items={items} xPos={xPos} yPos={yPos}/>}

                <table>
                    <thead>
                    <tr>
                        <td>name</td>
                        <td>Number Of Moves</td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderSequences()}
                    </tbody>
                </table>
                {addSeq && <SequenceCreator controlsManager={controlsManager} />}
                <button
                    className={"button"}
                    onClick={() => this.addNewSequence()}
                >
                    {addSeq ? "Go Back" : "Add New"}
                </button>

            </div>
        );
    }
}

export default SeqPanel;
