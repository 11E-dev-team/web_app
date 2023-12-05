import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import { Canvas } from './Canvas';
import { CanvasId } from '@/shared/types';

// Types of events from websocket
enum ConferenceEventType_ {
  Welcome = "welcome",
  Broadcast = "broadcast",
}

const ConferenceEventType = Object.freeze(ConferenceEventType_);

abstract class ConferenceEvent {
  data: any;
  conferenceId: string;
  constructor(data: any, conferenceId: string) {
    this.data = data;
    this.conferenceId = conferenceId;
  };

  abstract handle(): void;
}

class ConferenceWelcomingEvent extends ConferenceEvent {
  constructor(data: any, conferenceId: string) {
    super(data, conferenceId);
  };

  handle(): void {
    const userStore = useUserStore();
    const { idInConference } = storeToRefs(userStore);

    idInConference.value.push({
      conferenceId: this.conferenceId,
      id: this.data.id,
      role: this.data.role,
    });
  };
};

class ConferenceBroadcastingEvent extends ConferenceEvent {
  private _update: (id: CanvasId, data: string) => void;

  constructor(data: any, conferenceId: string, update: (id: CanvasId, data: string) => void) {
    super(data, conferenceId);

    this._update = update;
  };

  handle(): void {
    const { target, drawing } = this.data;
    this._update(target, JSON.stringify(drawing));
    console.log(`Got broadcast to ${target}`);
  };
}

class IncorrectConferenceEventTypeError extends Error {
  constructor(message: string) {
    super(message);
  };
};

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
  data: any,
}

class ConferenceSubscribers {
  private _subscribers: Map<CanvasId, Subscriber> = new Map();

  private _controller: Controller;

  constructor (controller: Controller) {
    this._controller = controller;
  };

  public notify(id: CanvasId, data: string): void {
    if (!this._subscribers.has(id)) {
      this.notifyController({
        type: ClientConferenceEventTypes.CreateCanvas,
        data: {id: id},
      })
    };
    this._subscribers.get(id)?.update(data);
  };

  private notifyController(data: IClientConferenceEvent): void {
    this._controller.update(data);
  };

  public subscribe(canvas: Subscriber): void {
    this._subscribers.set(canvas.id, canvas);
  };
};

export default class Conference {
  private static _WEBSOCKET_URL = "ws://0.0.0.0:8179/ws/conference/";

  private _webSocket: WebSocket | null = null;

  private _subscribers: ConferenceSubscribers = new ConferenceSubscribers(this);

  private _controller: Controller;

  constructor(controller: Controller, conferenceId: string) {
    this.join(conferenceId);

    this._controller = controller;
  };

  private join(conferenceId: string): void {
    this._webSocket = new WebSocket(Conference._WEBSOCKET_URL + conferenceId);
    this._webSocket.onopen = () => {
      console.log("Connected");
    }
    this._webSocket.onmessage = (event: MessageEvent) => {
      this.handleMessage(event, conferenceId);
    };
  };

  public send(data: any): void {
    console.log("Sending", JSON.stringify(data), this._webSocket);
    this._webSocket?.send(JSON.stringify(data));
  };

  public leave(): void {
    this._webSocket?.close();
  };

  public subscribe(target: Subscriber): void {
    this._subscribers.subscribe(target);
  };

  public update(data: any): void {
    this._controller.update(data);
  };

  private notifyController(data: IClientConferenceEvent): void {
    this._controller.update(data);
  };

  private handleMessage(event: MessageEvent, conferenceId: string): void {
    const { type, ...data } = JSON.parse(event.data);
    // TODO: move somewhere from utils
    this.getConferenceEvent(conferenceId, type, data).handle();
  };

  private getConferenceEvent(conferenceId: string, type: ConferenceEventType_, data: any): ConferenceEvent {
    switch (type) {
      case ConferenceEventType.Welcome:
        console.log("Got a user id");
        return new ConferenceWelcomingEvent(data, conferenceId);
      case ConferenceEventType.Broadcast:
        console.log("Got a broadcast");
        return new ConferenceBroadcastingEvent(data, conferenceId, this._subscribers.notify.bind(this._subscribers));
      default:
        throw new IncorrectConferenceEventTypeError(`Unknown conference event type: ${type}`);
    };
  }
};
