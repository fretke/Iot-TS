import React from "react";
import {MediaService} from "../../Utils/MediaService";
import "./Media.style.scss"

interface Props {

}

interface State {

}

export class Media extends React.Component<Props, State> {

    private readonly imgRef: React.RefObject<HTMLImageElement>

    constructor(props: Props) {
        super(props);
        this.imgRef = React.createRef();
    }

    public componentDidMount(): void {
        const media = MediaService.instance;
        media.addObserver("incomingFrame", this, this.onMediaUpdate.bind(this));
        const pic = media.lastPicture;
        if (pic) {
            this.onMediaUpdate(pic);
        }
    }

    public componentWillUnmount(): void {
        MediaService.instance.removeObserver(this);
    }

    public onMediaUpdate(url: string): void {
        if(this.imgRef.current) this.imgRef.current.src = url;
    }

    public render(): React.ReactNode {
        return (
            <div className={"media"}>
                <img alt={"pic"} ref={this.imgRef} src={""}/>
            </div>
        )
    }
}
