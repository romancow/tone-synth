<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import instruments, { Instrument } from '@/instruments'
import VPianoKeyboard from '@/components/vue-piano-keyboard.vue'
import VLed from '@/components/vue-led.vue'
import VKnob from '@/components/vue-knob.vue'
import * as Tone from 'tone'

@Component({
	components: { VPianoKeyboard, VLed, VKnob }
})
export default class App extends Vue {

	// powered = false
	playing: string | null = null
	instruments = instruments
	instrument: Instrument = instruments[0]
	synth: Tone.Synth | null = null

	get power() {
		return (this.synth != null)
	}

	set power(power: boolean) {
		if (power) this.setSynth()
		else this.synth = null
	}

	get oscillators() {
		return this.instrument?.oscillators ?? []
	}

	get oscillator() {
		return this.synth?.oscillator?.type || ""
	}

	set oscillator(osc: string) {
		if (this.synth != null)
			this.synth.oscillator.type = osc as any
	}

	get hasOscillator() {
		return !!this.oscillator
	}

	get powerState() {
		return this.power ? "on" : "off"
	}

	get isPolyphonic()

	get detune() {
		return this.synth?.detune.value ?? 0
	}

	set detune(detune: number) {
		const { synth } = this
		if (synth != null)
			synth.detune.value = detune
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

	togglePower() {
		this.power = !this.power
	}

	blurMe(event: Event) {
		const elem = event.target as HTMLElement
		elem?.blur?.()
	}

	@Watch('instrument')
	setSynth({ oscillators = [], instrument}: Instrument = this.instrument) {
		const type: any = oscillators[0]
		const opts = type ? { oscillator: { type }} : undefined
		this.synth = new instrument(opts).toDestination()
	}

}
</script>


<template  lang="pug">

	div#app
		.settings
			.power.setting
				v-led(v-model='power')
				label power
				button(@click='togglePower', v-text='powerState')
			.spacer
			.instrument.setting(:class='{ disabled: !power }')
				label(for='instrument-select') instrument
				select(
					name='instrument-select',
					:disabled='!power',
					v-model='instrument',
					@change='blurMe'
				)
					option(
						v-for='instrument in instruments',
						:value='instrument',
						v-text='instrument.name'
					)
			.spacer
			.oscillator.setting(:class='{ disabled: !hasOscillator }')
				label(for='oscillator-select') oscillator
				select(
					name='oscillator-select',
					:disabled='!hasOscillator',
					v-model='oscillator',
					@change='blurMe'
				)
					option(
						v-for='osc in oscillators',
						:value='osc',
						v-text='osc'
					)
			//- .spacer
			//- .detune.setting
			//- 	label detune ({{ detune }})
			//- 	v-knob(v-model='detune', :max='100', :min='-100', :step='10')
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

		.power .v-led
			margin-top: 5px
			margin-right: 5px

		.setting
			display: flex
			align-items: center
			margin: 0 5px

			label
				margin-right: 5px

			&.disabled label
				color: lightgray

			&.oscillator select
				min-width: 92px

			.v-knob
				vertical-align: bottom

		#my-piano
			height: 300px

</style>
