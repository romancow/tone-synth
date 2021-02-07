<script lang="ts">
import { Vue, Component, Prop, VModel } from 'vue-property-decorator'
import { isString } from '@/utilities/string'
import { quantize, Degrees, Range } from '@/utilities/number'

const KNOB_PADDING = 30
const KNOB_RANGE = Range.create(-180 + KNOB_PADDING, 180 - KNOB_PADDING)

@Component
export default class VKnob extends Vue {

	@VModel({ default: 1 })
	model!: number

	@Prop({ default: 25})
	size!: string | number

	@Prop({ default: 10})
	max!: number

	@Prop({ default: 1})
	min!: number

	@Prop({ default: null })
	step!: number | null

	get rotation() {
		const { model, min: from, max: to } = this
		return Range.map(model, { from, to }, KNOB_RANGE)
	}

	get style() {
		const { size, rotation } = this
		const sz = isString(size) ? size : `${size}px`
		return {
			width: sz,
			height: sz,
			transform: `rotate(${rotation}deg)`
		}
	}

	getCenter() {
		const { x, y, width, height } = this.$el.getBoundingClientRect()
		return {
			x: x + width / 2,
			y: y + height/ 2
		}
	}

	mouseTurning(event: MouseEvent) {
		window.addEventListener('mousemove', this.turn)
		window.addEventListener('mouseup', () => {
			window.removeEventListener('mousemove', this.turn)
		})
	}

	touchTurning(event: TouchEvent) {
		const id = event.changedTouches[0].identifier
		const turnFn = (event: TouchEvent) => {
			const touch = Array.from(event.changedTouches)
				.find(e => e.identifier === id)
			if (touch != null) this.turn(touch)
		}
		window.addEventListener('touchmove', turnFn)
		window.addEventListener('touchend', () => {
			window.removeEventListener('touchmove', turnFn)
		})
	}

	turn({ clientX, clientY }: { clientX: number, clientY: number }) {
		const { x: originX, y: originY } = this.getCenter()
		const { min: from, max: to, step } = this
		const x = clientX - originX
		const y = originY - clientY
		let value = Degrees.fromRadians(Math.atan2(x, y))
		value = Range.clamp(value, KNOB_RANGE)
		value = Range.map(value, KNOB_RANGE, { from, to })
		this.model = quantize(value, step ?? 0, from)
	}

}
</script>


<template lang="pug">

	.v-knob(
		:style='style',
		@mousedown.left='mouseTurning',
		@touchstart.prevent='touchTurning'
	)
		.v-knob-tick

</template>


<style lang="sass" scoped>

	.v-knob
		display: inline-block
		border: solid 1px black
		border-radius: 50%
		transition: transform 0.1s ease-out
		box-shadow: 0 0 3px gray
		background: radial-gradient(circle closest-side, rgb(238, 238, 238) , rgb(255, 255, 255))

		.v-knob-tick
			background-color: black
			height: 40%
			width: 1px
			margin: auto

</style>
