namespace Touch {
	export function getOverTarget({ pageX, pageY }: Touch) {
		return document.elementFromPoint(pageX, pageY) as EventTarget
	}

	export namespace Event {
		function initFrom(event: TouchEvent) {
			return Object.assign({}, event, {
				changedTouches: Array.from(event.changedTouches),
				targetTouches: Array.from(event.targetTouches),
				touches: Array.from(event.touches)
			}) as TouchEventInit
		}

		export function getContext(event: TouchEvent) {
			const eventInit = initFrom(event)
			return {
				touches: eventInit.changedTouches ?? [],
				dispatch(type: string, targets: EventTarget[]) {
					const dispatchEvent = new TouchEvent(type, eventInit)
					targets.forEach(target => target?.dispatchEvent(dispatchEvent))
				}
			}
		}
	}
}

export default class TouchOverDispatcher {

	private current: Record<number, EventTarget> = {}

	move(event: TouchEvent) {
		const { touches, dispatch } = Touch.Event.getContext(event)
		const current = touches.map(touch => this.fetch(touch))
		const hovers = touches.map(touch => this.update(touch))
		const touchleave = current.filter(target => !hovers?.includes(target))
		const touchover = hovers.filter(hover => !current?.includes(hover))
		dispatch('touchleave', touchleave)
		dispatch('touchover', touchover)
	}

	end(event: TouchEvent) {
		const { touches, dispatch } = Touch.Event.getContext(event)
		const targets = touches.map(touch => this.update(touch, true))
		dispatch('touchend', targets)
	}

	protected fetch({ identifier, target }: Touch) {
		return this.current[identifier] ??= target
	}

	protected update(touch: Touch, isEnd = false) {
		const [{ current }, { identifier }] = [this, touch]
		const target = current[identifier] = Touch.getOverTarget(touch)
		if (isEnd) delete current[identifier]
		return target
	}

}