import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import { Canvas } from './Canvas';
import { CanvasId } from '@/shared/types';

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
  };
}

class IncorrectConferenceEventTypeError extends Error {
  constructor(message: string) {
    super(message);
  };
};

class ConferenceSubscribers {
  private _subscribers: Map<CanvasId, Canvas> = new Map();

  constructor () {};

  public notify(id: CanvasId, data: string): void {
    this._subscribers.get(id)?.update(data);
  };

  public subscribe(canvas: Canvas): void {
    this._subscribers.set(canvas.id, canvas);
  };
};

export default class Conference {
  private static _WEBSOCKET_URL = "ws://0.0.0.0:8179/ws/conference/";

  private _webSocket: WebSocket | null = null;

  private _subscribers: ConferenceSubscribers = new ConferenceSubscribers();

  constructor(conferenceId: string) {
    this.join(conferenceId);
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
    this._webSocket?.send(JSON.stringify(data));
  };

  public leave(): void {
    this._webSocket?.close();
  };

  public subscribe(target: Canvas): void {
    this._subscribers.subscribe(target);
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
