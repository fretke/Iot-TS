import React from "react";
import ReactDOM from "react-dom";
import "./Notification.style.scss"
import {Message, NotificationService} from "../../services/NotificationService";

interface Props {

}

interface State {
    notifications: Message[]
}

export class Notification extends React.Component<Props, State> {

    private readonly root: HTMLElement;

    public constructor(props: Props) {
        super(props);
        this.root = document.getElementById("notification-root") as HTMLElement;
        this.state = {
            notifications: []
        }
    }

    public componentDidMount() {
        NotificationService.getInstance().addObserver("notificationUpdate", this, this.onNotificationUpdate);
    }

    private onNotificationUpdate(notifications: Message[]): void {
        this.setState({notifications: [...notifications]});
    }

    private renderNotification(): React.ReactNode {
        const {notifications} = this.state;
        const lastEl = notifications.length - 1;
        return (<div className={"Notification"}>
            {notifications.map((msg, i) => <div key={i + 1} className={`${msg.type} ${(i === lastEl ? "animate" : "")}`}>{ i === lastEl ? "" : msg.content}</div>)}
        </div>);
    };

    public render(): React.ReactNode {

        const root = document.getElementById("notification-root");

        return root && ReactDOM.createPortal(this.renderNotification(), this.root);
    }
}
