<script lang="ts">
import { Vue, Component, VModel, Prop } from 'vue-property-decorator'
import Note from '@/utilities/note'
import TouchOverDispatcher from '@/utilities/touch-over-dispatcher'
import * as _Array from '@/utilities/array'

@Component
export default class VPianoKeyboard extends Vue {

	@VModel({ default: () => [] })
	model!: Note[]

	@Prop({ default: 'C3'})
	first!: Note

	@Prop({ default: 24 })
	count!: number

	@Prop({ default: false })
	disabled!: boolean

	touchOvers!: TouchOverDispatcher

	get notes() {
		const { first, count } = this
		return  Note.getRange(first, count).flatMap(note =>
			(note.startsWith('E') || note.startsWith('B')) ? [note, null] : note
		)
	}

	get whiteKeyCount() {
		return this.notes
			.filter(note => (Note.Type.get(note) === Note.Type.White))
			.length
	}

	get whiteKeyWidth() {
		const { whiteKeyCount } = this
		return Math.floor(10000 / whiteKeyCount) / 100
	}

	get blackKeyWidth() {
		const { whiteKeyWidth } = this
		return whiteKeyWidth * 0.65
	}

	get eventModel() {
		return [...this.model]
	}

	getKeyClass(note: Note) {
		const pressed = this.model.includes(note)
		const type = Note.Type.get(note)
		return [
			`v-piano-keyboard-key-${type}`,
			pressed && "v-piano-keyboard-key-pressed"
		].filter(cls => !!cls)
	}

	getKeyStyle(note: Note) {
		const { whiteKeyWidth, blackKeyWidth } = this
		const isWhite = (Note.Type.get(note) === Note.Type.White)
		const width = isWhite ? whiteKeyWidth : blackKeyWidth
		return { 
			width: `calc(${width}% + 1px)`,
			marginLeft: `calc(-${ (blackKeyWidth / 2) }% - 1px)`,
		}
	}

	getKeySlotProps(note: Note) {
		return {
			note,
			isBlack: Note.Type.get(note) === Note.Type.Black,
			pressed: this.model.includes(note)
		}
	}

	notedown(note: Note) {
		const { eventModel, disabled } = this
		if(!disabled && _Array.last(eventModel) != note) {
			this.$emit('notedown', note)
			this.model = _Array.append(_Array.remove(eventModel, note), note)
		}
	}

	noteup(note: Note) {
		const { eventModel , disabled} = this
		if (!disabled && eventModel.includes(note)) {
			this.$emit('noteup', note)
			this.model = _Array.remove(this.eventModel, note)
		}
	}

	created() {
		this.touchOvers = new TouchOverDispatcher()
	}
}
</script>


<template lang="pug">

	.v-piano-keyboard(
		:class='{ "v-piano-keyboard-disabled": disabled }',
		@touchmove='touchOvers.move($event)',
		@touchend='touchOvers.end($event)'
	)
		.v-piano-keyboard-key(
			v-for='note in notes',
			:key='note',
			:data-note='note',
			:class='getKeyClass(note)',
			:style='getKeyStyle(note)'
			@mousedown.left='notedown(note)',
			@mouseup.left='noteup(note)',
			@mouseover='$event.buttons & 1 && notedown(note)',
			@mouseleave='$event.buttons & 1 && noteup(note)',
			@touchstart.prevent='notedown(note)',
			@touchend.prevent='noteup(note)',
			@touchcancel='noteup(note)',
			@touchover.stop='notedown(note)',
			@touchleave.stop='noteup(note)'
		)
			slot(name='key', v-bind='getKeySlotProps(note)')

</template>


<style lang="sass" scoped>

	.v-piano-keyboard
		box-sizing: border-box
		display: flex
		position: relative
		justify-content: start
		overflow: hidden
		user-select: none			

		.v-piano-keyboard-key
			box-sizing: border-box
			position: relative
			display: flex
			align-items: flex-end
			justify-content: center
			cursor: pointer
			margin-top: 2px
			padding: 15px
			font-size: larger

		.v-piano-keyboard-key:first-child
			margin-left: 2px !important

		.v-piano-keyboard-key-white
			height: 98%
			background: linear-gradient(rgb(238, 238, 238) 0%, rgb(255, 255, 255) 100%)
			z-index: 1
			border-radius: 0 0 5px 5px
			box-shadow: inset 0 0 0 hsla(0,0%,100%,.8), inset -2px -5px 3px #ccc, 0 0 3px rgba(0,0,0,.5)
			color: black

			&.v-piano-keyboard-key-pressed
				background: rgb(30, 183, 235)
				box-shadow:  2px 0 3px rgba(0, 0, 0, 0.2) inset, -5px -1px 20px rgba(0, 0, 0, 0.2) inset, 0 0 3px rgba(0, 0, 0, 0.5)
				color: white


		.v-piano-keyboard-key-black
			height: 65%
			background: linear-gradient(45deg, rgb(85, 85, 85), rgb(34, 34, 34))
			z-index: 2
			border-radius: 0 0 3px 3px
			box-shadow: inset -1px -1px 2px hsla(0,0%,100%,.2), inset 0 -5px 2px rgba(0,0,0,.5), 0 2px 4px rgba(0,0,0,.5)
			color: white
			
			&.v-piano-keyboard-key-pressed
				background: rgb(249, 187, 45)
				box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset, 0 -1px 2px rgba(0, 0, 0, 0.2) inset, 0 1px 2px rgba(0, 0, 0, 0.2)
				color: black

		.v-piano-keyboard-key-placeholder
			height: 0
			z-index: 0
			border: none
			visibility: hidden

			&:last-child
				display: none

		&.v-piano-keyboard-disabled
			opacity: 0.5

			.v-piano-keyboard-key-pressed
				filter: grayscale(90%)

</style>
