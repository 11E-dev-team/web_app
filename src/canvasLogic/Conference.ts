import { storeToRefs } from "pinia";

import { useUserStore } from "@/store";
import { CanvasId } from "@/shared/types";

// Types of events from websocket
enum ConferenceEventType_ {
  Welcome = "welcome",
  Broadcast = "broadcast",
}

const ConferenceEventType = Object.freeze(ConferenceEventType_);

interface IConferenceEvent {
    type: string;
}

abstract class ConferenceEvent {
    protected _data: object;
    protected _conferenceId: string;
    constructor(data: object, conferenceId: string) {
        this._data = data;
        this._conferenceId = conferenceId;
    }

  abstract handle(update?: (type: string, data: IConferenceWelcomingEvent) => void): void;
}

interface IConferenceWelcomingEvent extends IConferenceEvent {
    type: "welcome";
    id: number;
    role: number;
}

function isIConferenceWelcomingEvent(data: object): data is IConferenceWelcomingEvent {
    return (
        typeof (data as IConferenceWelcomingEvent).id === "number"
        && typeof (data as IConferenceWelcomingEvent).role === "number"
    );
}

class ConferenceWelcomingEvent extends ConferenceEvent {
    protected _data: IConferenceWelcomingEvent;
    constructor(data: IConferenceWelcomingEvent, conferenceId: string) {
        super(data, conferenceId);

        this._data = data;
    }

    handle(update: (type: string, data: IConferenceWelcomingEvent) => void): void {
        const userStore = useUserStore();
        const { idInConference } = storeToRefs(userStore);

        const userData: IConferenceWelcomingEvent = {
            id: this._data.id,
            role: this._data.role,
        } as IConferenceWelcomingEvent;

        idInConference.value.push({
            conferenceId: this._conferenceId,
            id: String(this._data.id),
            role: this._data.role,
        });
        update("update_user_data", userData);
    }
}

interface IConferenceBroadcastingEvent {
    type: "broadcast";
    target: CanvasId;
    drawing: string;
}

function isIConferenceBroadcastingEvent(data: object): data is IConferenceBroadcastingEvent {
    return (
        typeof (data as IConferenceBroadcastingEvent).target === "number"
        && typeof (data as IConferenceBroadcastingEvent).drawing === "string"
    );
}

class ConferenceBroadcastingEvent extends ConferenceEvent {
    protected _data: IConferenceBroadcastingEvent;

    private _update: (id: CanvasId, data: string) => void;

    constructor(
        data: IConferenceBroadcastingEvent,
        conferenceId: string,
        update: (id: CanvasId, data: string) => void
    ) {
        super(data, conferenceId);

        this._data = data;
        this._update = update;
    }

    handle(): void {
        const { target, drawing } = this._data;
        this._update(target, drawing);
        console.log(`Got broadcast to ${target}`);
    }
}

class IncorrectConferenceEventTypeError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class IncorrectConferenceEventInterfaceError extends Error {
    constructor(message: string) {
        super(message);
    }
}

type Subscriber = Required<{
  update: (data: string) => void,
  id: CanvasId,
}>

type Controller = Required<{
  update: (data: IClientConferenceEvent) => void,
}>

// Conference events on client
enum ClientConferenceEventTypes_ {
  CreateCanvas = "create_canvas",
}

export const ClientConferenceEventTypes = Object.freeze(ClientConferenceEventTypes_);

export interface IClientConferenceEvent {
  type: ClientConferenceEventTypes_,
  data: object,
}

class ConferenceSubscribers {
    private _subscribers: Map<CanvasId, Subscriber> = new Map();

    private _controller: Controller;

    constructor (controller: Controller) {
        this._controller = controller;
    }

    public notify(id: CanvasId, data: string): void {
        if (!this._subscribers.has(id)) {
            this.notifyController({
                type: ClientConferenceEventTypes.CreateCanvas,
                data: {id: id},
            });
        }
        this._subscribers.get(id)?.update(data);
    }

    private notifyController(data: IClientConferenceEvent): void {
        this._controller.update(data);
    }

    public subscribe(canvas: Subscriber): void {
        this._subscribers.set(canvas.id, canvas);
    }
}

export default class Conference {
    private static _WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

    private _webSocket: WebSocket | null = null;

    private _subscribers: ConferenceSubscribers = new ConferenceSubscribers(this);

    private _controller: Controller;

    private _userData: {id: number, role: number} | null = null;

    constructor(controller: Controller, conferenceId: string) {
        this.join(conferenceId);

        this._controller = controller;
    }

    private join(conferenceId: string): void {
        this._webSocket = new WebSocket(Conference._WEBSOCKET_URL + conferenceId);
        this._webSocket.onopen = () => {
            console.log("Connected");
        };
        this._webSocket.onmessage = (event: MessageEvent) => {
            this.handleMessage(event, conferenceId);
        };
    }

    public send(data: object): void {
        console.log("Sending", JSON.stringify(data), this._webSocket);
        this._webSocket?.send(JSON.stringify(data));
    }

    public leave(): void {
        this._webSocket?.close();
    }

    public subscribe(target: Subscriber): void {
        this._subscribers.subscribe(target);
    }

    public update(data: IClientConferenceEvent): void {
        this._controller.update(data);
    }

    private handleMessage(event: MessageEvent, conferenceId: string): void {
        const { type, ...restData } = JSON.parse(event.data);
        if (isIConferenceWelcomingEvent(restData)) {
            const data: IConferenceWelcomingEvent = {
                // @ts-expect-error: ts(2783)
                type: "welcome",
                ...restData
            };
            this.getConferenceEvent(conferenceId, type, data).handle(this.updateUserData.bind(this));
        } else if (isIConferenceBroadcastingEvent(restData)) {
            const data: IConferenceBroadcastingEvent = {
                // @ts-expect-error: ts(2783)
                type: "broadcast",
                ...restData
            };
            this.getConferenceEvent(conferenceId, type, data).handle();
        } else if (restData) {
            throw new IncorrectConferenceEventInterfaceError(`Incorrect interface for conference event interface for ${restData}`);
        }
    }

    private updateUserData(type: string, userData: IConferenceWelcomingEvent): void {
        if (type !== "update_user_data") return;
        this._userData = {
            id: userData.id,
            role: userData.role,   
        };
    }

    private getConferenceEvent(conferenceId: string, type: ConferenceEventType_, data: IConferenceWelcomingEvent | IConferenceBroadcastingEvent): ConferenceEvent {
        switch (type) {
        case ConferenceEventType.Welcome:
            console.log("Got a user id");
            
            if (data.type === "welcome") return new ConferenceWelcomingEvent(data, conferenceId);
            throw new IncorrectConferenceEventInterfaceError(`Incorrect interface for conference event type ${type}: ${data.type}`);
        case ConferenceEventType.Broadcast:
            console.log("Got a broadcast");
            if (data.type === "broadcast") return new ConferenceBroadcastingEvent(data, conferenceId, this._subscribers.notify.bind(this._subscribers));
            throw new IncorrectConferenceEventInterfaceError(`Incorrect interface for conference event type ${type}: ${data.type}`);
        default:
            throw new IncorrectConferenceEventTypeError(`Unknown conference event type: ${type}`);
        }
    }

    public get userData(): {id: number, role: number} | null {
        return this._userData;
    }
}
