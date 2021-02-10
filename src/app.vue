<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import instruments, { Instrument } from '@/instruments'
import * as Tone from 'tone'
import * as _Array from '@/utilities/array'
import Note from '@/utilities/note'

import VPianoKeyboard from '@/components/v-piano-keyboard.vue'
import VLed from '@/components/vue-led.vue'
import VKnob from '@/components/vue-knob.vue'

@Component({
	components: { VPianoKeyboard, VLed, VKnob }
})
export default class App extends Vue {

	playing: Note[] = []
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
		return this.synth?.get()?.oscillator?.type || ""
	}

	set oscillator(osc: string) {
		if (this.synth != null)
			this.synth.set({ oscillator: { type: osc as any }})
	}

	get hasOscillator() {
		return !!this.oscillator
	}

	get powerState() {
		return this.power ? "on" : "off"
	}

	get isPolyphonic() {
		return this.instrument.isPoly ?? false
	}

	get isPlaying() {
		return !!this.playing.length
	}

	get detune() {
		return this.synth?.detune.value ?? 0
	}

	set detune(detune: number) {
		const { synth } = this
		if (synth != null)
			synth.detune.value = detune
	}

	// play(note: string) {
	// 	const { playingSingle: playing, isPolyphonic, synth } = this
	// 	const canSetNote = !!synth?.setNote
	// 	if (canSetNote && playing && !isPolyphonic)
	// 		synth?.setNote(note)
	// 	else
	// 		synth?.triggerAttack(note, Tone.now())
	// 	this.playingSingle = note
	// }

	// stop(note: string) {
	// 	const {isPolyphonic, playingSingle: playing , synth } = this
	// 	if (isPolyphonic)
	// 		synth?.triggerRelease(note)
	// 	else (playing === note)
	// 		synth?.triggerRelease(Tone.now())
	// 	if (playing === note)
	// 		this.playingSingle = null
	// }

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

	@Watch('playing')
	updatePlayingNotes(now: Note[], prev: Note[]) {
		// const play = now.filter(note => !prev.includes(note))
		// const stop = prev.filter(note => !now.includes(note))
		const nowNote = _Array.last(now)
		const prevNote = _Array.last(prev)
		const canSetNote = !!this.synth?.setNote
		if (nowNote !== prevNote) {
			if (nowNote && prevNote && canSetNote)
				this.synth?.setNote(nowNote)
			else if (nowNote)
				this.synth?.triggerAttack(nowNote, Tone.now())
			else
				this.synth?.triggerRelease(Tone.now())
		}
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
		v-piano-keyboard#my-piano(v-model='playing')

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
