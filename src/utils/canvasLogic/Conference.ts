import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';

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

class WelcomeConferenceEvent extends ConferenceEvent {
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

class BroadcastConferenceEvent extends ConferenceEvent {
  constructor(data: any, conferenceId: string) {
    super(data, conferenceId);
  };

  handle(): void {
    // TODO: broadcast a canvas
  };
}

class IncorrectConferenceEventTypeError extends Error {
  constructor(message: string) {
    super(message);
  };
};

export class Conference {
  private static WEBSOCKET_URL = "ws://0.0.0.0:8179/ws/conference/http://localhost:8080/#/conference/0e7e35cd-ea2e-41c3-98be-d378032cfd17";

  private webSocket: WebSocket | null = null;

  constructor(conferenceId: string) {
    this.join(conferenceId);
  };

  private join(conferenceId: string): void {
    this.webSocket = new WebSocket(Conference.WEBSOCKET_URL + conferenceId);
    this.webSocket.onopen = () => {
      console.log("Connected");
    }
    this.webSocket.onmessage = (event: MessageEvent) => {
      this.handleMessage(event, conferenceId);
    };
  };

  public leave(): void {
    this.webSocket?.close();
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
        return new WelcomeConferenceEvent(data, conferenceId);
      case ConferenceEventType.Broadcast:
        console.log("Got a broadcast");
        return new BroadcastConferenceEvent(data, conferenceId);
      default:
        throw new IncorrectConferenceEventTypeError(`Unknown conference event type: ${type}`);
    };
  }
};
