namespace Touch {
	export function getOverTarget({ pageX, pageY }: Touch) {
		return document.elementFromPoint(pageX, pageY) as EventTarget
	}

	export namespace Event {
		function initFrom(event: TouchEvent) {
			return Object.assign({}, event, {
				changedTouches: Array.from(event.changedTouches),
				targetTouches: Array.from(event.targetTouches),
				touches: Array.from(event.touches),
				bubbles: true
			}) as TouchEventInit
		}

		function dispatch(type: string, eventInit: TouchEventInit, targets: (EventTarget | null)[]) {
			const dispatchEvent = new TouchEvent(type, eventInit)
			targets.forEach(target => target?.dispatchEvent(dispatchEvent))
		}

		export function getContext(event: TouchEvent) {
			const eventInit = initFrom(event)
			return {
				touches: eventInit.changedTouches ?? [],
				touchleave: dispatch.bind(event, 'touchleave', eventInit),
				touchover: dispatch.bind(event, 'touchover', eventInit)
			}
		}
	}
}

export default class TouchOverDispatcher {

	private current: Record<number, EventTarget> = {}

	move(event: TouchEvent) {
		const { touches, touchleave, touchover } = Touch.Event.getContext(event)
		const current = touches.map(touch => this.fetch(touch))
		const hovers = touches.map(touch => this.update(touch))
		const leaveTargets = current.filter(target => !hovers?.includes(target))
		const overTargets = hovers.filter(hover => !current?.includes(hover))
		touchleave(leaveTargets)
		touchover(overTargets)
	}

	end(event: TouchEvent) {
		const { touches, touchleave } = Touch.Event.getContext(event)
		const targets = touches.map(touch => this.remove(touch))
		touchleave(targets)
	}

	protected fetch({ identifier, target }: Touch) {
		return this.current[identifier] ??= target
	}

	protected update(touch: Touch) {
		const { identifier } = touch
		return this.current[identifier] = Touch.getOverTarget(touch)
	}

	protected remove(touch: Touch) {
		const { identifier } = touch
		const target = Touch.getOverTarget(touch)
		delete this.current[identifier]
		return (target === touch.target) ? null : target
	}

}