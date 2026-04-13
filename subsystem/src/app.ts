import { GodotEventBus } from "./EventBus";

const onMessage = (message: unknown) => {
  const messageObj = message as { content: string };
  console.log(messageObj.content);
};

export const startApp = async () => {
  const bus = new GodotEventBus();
  document.addEventListener("keydown", (event) => {
	bus.sendEventToGodot("input", event.key)
  });
  bus.onEventFromGodot("Message", onMessage);
};
