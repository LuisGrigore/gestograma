import { GodotEventBus } from "./EventBus";

const onMessage = (message: unknown) => {
  const messageObj = message as { content: String };
  console.log(messageObj.content);
};

export const startApp = async () => {
  const bus = new GodotEventBus();
  bus.onEventFromGodot("Message", onMessage);
};
