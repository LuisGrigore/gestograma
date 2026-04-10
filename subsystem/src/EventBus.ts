export type GenericEvent = {
  type: string
  payload?: unknown
}

type EventHandler = (payload?: unknown) => void

export class GodotEventBus {
  private eventHandlers: Record<string, EventHandler[]> = {}

  constructor() {
    (window as any).sendEventToJS = (eventJson: string) => {
      let event: GenericEvent
      try {
        event = JSON.parse(eventJson)
      } catch (err) {
        console.error("Error parsing event from Godot:", err, eventJson)
        return
      }

      this._handleEventFromGodot(event)
    }
  }

  sendEventToGodot(eventType: string, payload?: unknown): void {
    const send = (window as any).sendEventToGodot
    if (typeof send !== "function") {
      console.warn("sendEventToGodot not availible.")
      return
    }

    send(JSON.stringify({ type: eventType, payload }))
  }

  onEventFromGodot(eventType: string, handler: EventHandler): void {
    const handlers = this.eventHandlers[eventType] ?? []
    handlers.push(handler)
    this.eventHandlers[eventType] = handlers
  }

  private _handleEventFromGodot(event: GenericEvent): void {
    const handlers = this.eventHandlers[event.type]
    if (!handlers) return

    handlers.forEach((h) => h(event.payload))
  }
}
