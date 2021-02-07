const DEGREES_PER_RADIAN = 180 / Math.PI

export function isNumber(something: any): something is number {
	return (typeof something === 'number')
}

export function clamp(num: number, min: number, max: number) {
	return Range.clamp(num, { from: min, to: max })
}

export function quantize(num: number, step: number, from: number = 0) {
	if (step === 0) return num
	const rem = (num - from) % step
	const quantized = round(num - rem)
	const rndUp = rem >= (step / 2)
	return rndUp ? quantized + step : quantized
}

export function round(num: number, precision = 0) {
	let multiplier = Math.pow(10, Math.abs(precision))
	if (precision < 0) multiplier = 1 / multiplier
	return Math.round(num * multiplier) / multiplier
}

export namespace Degrees {

	export function fromRadians(radians: number) {
		return radians * DEGREES_PER_RADIAN
	}
	
	export function minPositive(degrees: number) {
		return ((degrees % 360) + 360) % 360
	}

}

export type Range = { from: number, to: number }

export namespace Range {

	export function create(from: number, to: number) {
		return { from, to }
	}

	export function clamp(num: number, { from, to }: Range) {
		return Math.max(Math.min(num, to), from)
	}

	export function span({ from, to }: Range) {
		return to - from
	}

	export function map(num: number, from: Range, to: Range) {
		return num * span(to) / span(from)
	}
}
