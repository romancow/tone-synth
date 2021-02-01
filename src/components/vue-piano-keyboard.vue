<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'

type Octave = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type Note = `${'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#'}${Octave}`
type PianoKey = {
	readonly note: Note | null
	readonly type: PianoKey.Type
	readonly shortcut?: string
	pressed: boolean
}

namespace PianoKey {
	export enum Type {
		White = 'white',
		Black = 'black',
		Placeholder = 'placeholder'
	}

	export namespace Type {
		export function get(note: Note | null) {
			return note ? (note.charAt(1) === "#") ?
				Type.Black : Type.White : Type.Placeholder
		}
	}

	export function create(note: Note | null, shortcut?: string) {
		return {
			note, shortcut,
			type: Type.get(note),
			pressed: false
		}
	}
}

const notes = [
	["C3", "q"],
	["C#3", "2"],
	["D3", "w"],
	["D#3", "3"],
	["E3", "e"],
	[null],
	["F3", "r"],
	["F#3", "5"],
	["G3", "t"],
	["G#3", "6"],
	["A3", "y"],
	["A#3", "7"],
	["B3", "u"],
	[null],
	["C4", "v"],
	["C#4", "g"],
	["D4", "b"],
	["D#4", "h"],
	["E4", "n"],
	[null],
	["F4", "m"],
	["F#4", "k"],
	["G4", ","],
	["G#4", "l"],
	["A4", "."],
	["A#4", ";"],
	["B4", "/"]
] as [Note, string][]

@Component
export default class VuePianoKeyboard extends Vue {

	keys = notes.map(args => PianoKey.create(...args))

	get whiteKeyCount() {
		return this.keys
			.filter(key => (key.type === PianoKey.Type.White))
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

	getKeyClass(key: PianoKey) {
		const classes = [`v-piano-keyboard-key-${key.type}`]
		if (key.pressed)
			classes.push("v-piano-keyboard-key-pressed")
		return classes
	}

	getKeyStyle(key: PianoKey) {
		const { whiteKeyWidth, blackKeyWidth } = this
		const isWhite= key.type === PianoKey.Type.White
		const width = isWhite ? whiteKeyWidth : blackKeyWidth
		return { 
			width: `calc(${width}% + 1px)`,
			marginLeft: `calc(-${ (blackKeyWidth / 2) }% - 1px)`,
		}
	}

	down(key: PianoKey) {
		if (!key.pressed) {
			key.pressed = true
			this.pressed(key.note!)
		}
	}

	up(key: PianoKey) {
		if (key.pressed) {
			key.pressed = false
			this.depressed(key.note!)
		}
	}

	@Emit()
	pressed(note:Note) {}

	@Emit()
	depressed(note:Note) {}

	created() {
		const keyMap = this.keys.reduce((map, key) => {
			if (key.shortcut != null)
				map[key.shortcut] = key
			return map
		}, {} as Record<string, PianoKey>)
		
		window.addEventListener("keydown", (event) => {
			const key = keyMap[event.key]
			if (key != null)
				this.down(key)
		})

		window.addEventListener("keyup", (event) => {
			const key = keyMap[event.key]
			if (key != null)
				this.up(key)
		})
	}

}
</script>


<template lang="pug">

	.v-piano-keyboard
		.v-piano-keyboard-key(
			v-for='key in keys',
			:class='getKeyClass(key)',
			:style='getKeyStyle(key)',
			:data-note='key.note',
			@mousedown='down(key)',
			@mouseup='up(key)'
		)

</template>


<style lang="sass" scoped>

	.v-piano-keyboard
		box-sizing: border-box
		display: flex
		position: relative
		justify-content: start
		overflow: hidden

		.v-piano-keyboard-key
			box-sizing: border-box
			position: relative
			cursor: pointer
			margin-top: 2px

		.v-piano-keyboard-key:first-child
			margin-left: 2px !important

		.v-piano-keyboard-key-white
			height: 98%
			background: linear-gradient(rgb(238, 238, 238) 0%, rgb(255, 255, 255) 100%)
			z-index: 1
			border-radius: 0 0 5px 5px
			box-shadow: inset 0 0 0 hsla(0,0%,100%,.8), inset -2px -5px 3px #ccc, 0 0 3px rgba(0,0,0,.5)

			&.v-piano-keyboard-key-pressed
				background: rgb(30, 183, 235)
				box-shadow:  2px 0 3px rgba(0, 0, 0, 0.2) inset, -5px -1px 20px rgba(0, 0, 0, 0.2) inset, 0 0 3px rgba(0, 0, 0, 0.5) 


		.v-piano-keyboard-key-black
			height: 65%
			background: linear-gradient(45deg, rgb(85, 85, 85), rgb(34, 34, 34))
			z-index: 2
			border-radius: 0 0 3px 3px
			box-shadow: inset -1px -1px 2px hsla(0,0%,100%,.2), inset 0 -5px 2px rgba(0,0,0,.5), 0 2px 4px rgba(0,0,0,.5)
			
			&.v-piano-keyboard-key-pressed
				background: rgb(249, 187, 45)
				box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset, 0 -1px 2px rgba(0, 0, 0, 0.2) inset, 0 1px 2px rgba(0, 0, 0, 0.2)

		.v-piano-keyboard-key-placeholder
			height: 0
			z-index: 0
			border: none
			visibility: hidden

</style>