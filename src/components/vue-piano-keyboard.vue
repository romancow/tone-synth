<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class VuePianoKeyboard extends Vue {

	get keys() {
		return [
			"C4", "C#4", "D4", "D#4", "E4", "", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "",
			"C5", "C#5", "D5", "D#5", "E5", "", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", "",
			"C6", "C#6"
		]
	}

	get whiteKeyCount() {
		return this.keys
			.filter(key => key &&!this.isBlackKey(key))
			.length
	}

	get whiteKeyWidth() {
		const { whiteKeyCount } = this
		return Math.floor(10000 / whiteKeyCount) / 100
	}

	get blackKeyWidth() {
		const { whiteKeyWidth } = this
		return whiteKeyWidth / 2
	}

	isBlackKey(note: string) {
		return note.charAt(1) === "#"
	}

	getKeyColorClass(note: string) {
		const color = note ? this.isBlackKey(note) ? 'black' : 'white' : 'hidden'
		return `v-piano-keyboard-key-${color}`
	}

	getKeyStyle(note: string) {
		const { whiteKeyWidth, blackKeyWidth } = this
		const isBlack = this.isBlackKey(note)
		const width = (!note || isBlack) ? blackKeyWidth : whiteKeyWidth
		return { 
			width: `calc(${width}% + 1px)`,
			marginLeft: `calc(-${ (blackKeyWidth / 2) }% - 1px)`,
		}
	}

}
</script>


<template lang="pug">

	.v-piano-keyboard
		.v-piano-keyboard-key(
			v-for='key in keys',
			:class='getKeyColorClass(key)',
			:style='getKeyStyle(key)'
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

		.v-piano-keyboard-key:first-child
			margin-left: 0 !important

		.v-piano-keyboard-key-white
			height: 100%
			background-color: white
			z-index: 1
			border: 1px solid dimgray

		.v-piano-keyboard-key-black
			height: 60%
			background-color: black
			z-index: 2

		.v-piano-keyboard-key-hidden
			height: 0
			z-index: 0
			border: none
			visibility: hidden

</style>