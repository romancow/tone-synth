<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VPianoKeyboard from '@/components/vue-piano-keyboard.vue'
import * as Tone from 'tone' 

@Component({
	components: { VPianoKeyboard },
})
export default class App extends Vue {

	powered = false
	playing: string | null = null
	synth: Tone.Synth | null = null

	get oscillatorType() {
		return this.synth?.oscillator.type || 'sine'
	}

	set oscillatorType(type: string) {
		if (this.synth != null)
			this.synth.oscillator.type = type as any
	}

	get powerState() {
		return this.powered ? "on" : "off"
	}

	play(note: string) {
		if (this.playing)
			this.synth?.setNote(note)
		else
			this.synth?.triggerAttack(note, Tone.now())
		this.playing = note
	}

	stop(note: string) {
		if (this.playing === note) {
			this.synth?.triggerRelease(Tone.now())
			this.playing = null
		}
	}

	power() {
		if (this.synth == null) {
			const type = this.oscillatorType as any
			this.synth = new Tone.Synth({ oscillator: { type }}).toDestination()
		}
		this.synth.volume.value = this.powered ? -Infinity : 0
		this.powered = !this.powered
	}

}
</script>


<template  lang="pug">

	div#app
		.settings
			.power
				div.power-light(:class='`power-light-${powerState}`')
				label power
				button(@click='power', v-text='powerState')
			.spacer
			.oscillator-select
				label(for='oscillator-type') waveform
				select(name='oscillator-type', v-model='oscillatorType')
					option(value='sine') sine
					option(value='square') square
					option(value='sawtooth') saw
			.spacer
		v-piano-keyboard#my-piano(@pressed='play', @depressed='stop')

</template>


<style lang="sass" scoped>

	#app
		font-family: Avenir, Helvetica, Arial, sans-serif
		-webkit-font-smoothing: antialiased
		-moz-osx-font-smoothing: grayscale
		text-align: center
		color: #2c3e50
		margin: 30px 20px 10px 20px
		user-select: none

		.settings
			display: flex
			margin: 15px 3px

			.spacer
				flex: 1

		.power-light
			display: inline-block
			background-color: dimgray
			width: 5px
			height: 5px
			border: 1px solid gray
			border-radius: 50%
			margin-right: 5px

			&.power-light-on
				background-color: red
				box-shadow:  0px 0px 2px red

		.oscillator-select, .power
			label
				margin-right: 5px

		#my-piano
			height: 300px

</style>
