import React from "react";
import "./ContextMenu.style.scss"

interface Props {
    items: ContextItems[],
    onClose: () => void,
    xPos: number,
    yPos: number
}

export interface ContextItems {
    title: string,
    action: () => void,
    visible: boolean
}

export class ContextMenu extends React.Component<Props, any> {

    private triggerAction(action: () => void): void {
        action();
        this.props.onClose();
    }

    private renderContextItems(): React.ReactNode {
        return this.props.items.map((item, i) => (
            <div key={i} className={"item"} onClick={() => this.triggerAction(item.action)}>
                {item.title}
            </div>
        ))
    }

    public render(): React.ReactNode {
        const {xPos, yPos, onClose} = this.props;
        return (
            <>
                <div className={"context-wrap"} onClick={() => onClose()}>

                </div>
                <div style={{top: yPos + "px", left: xPos + "px"}} className={"context-menu"}>
                    {this.renderContextItems()}
                </div>
            </>

        )
    }
}
