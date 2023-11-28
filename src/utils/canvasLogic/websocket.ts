import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
const userStore = useUserStore();
const { mainSocket, idInConference } = storeToRefs(userStore);


function handleMessage(event: MessageEvent, conferenceId: string): void {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case "welcome":
      console.log("Got a user id");
      idInConference.value.push({
        conferenceId: conferenceId,
        id: data.id,
        role: data.role,
      });
      break;
    case "broadcast":
      console.log("Got a broadcast");
      // TODO: broadcast a canvas
      break;
  }
}

export function setWebSocket(conferenceId: string): void {
  mainSocket.value = new WebSocket(`ws://0.0.0.0:8179/ws/conference/${conferenceId}`);
  mainSocket.value.onopen = function (event: Event) {
    console.log("Connected");
  }
  mainSocket.value.onmessage = function (event: MessageEvent) {
    handleMessage(event, conferenceId);
  };
}
