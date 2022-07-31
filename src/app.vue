<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import instruments, { Instrument } from '@/instruments'
import * as Tone from 'tone'
import * as _Array from '@/utilities/array'
import * as _Object from '@/utilities/object'
import Note from '@/utilities/note'
import keyMap from '@/key-map'

import VPianoKeyboard from '@/components/v-piano-keyboard.vue'
import VLed from '@/components/v-led.vue'
import VKnob from '@/components/v-knob.vue'
import MidiSelect from '@/components/midi-select.vue'

const getKeyCount = () => (window.innerWidth < 720) ? 12 : 24

@Component({
	components: { VPianoKeyboard, VLed, VKnob, MidiSelect }
})
export default class App extends Vue {

	playing: Note[] = []
	instruments = instruments
	instrument: Instrument = instruments[0]
	synth: Tone.Synth | null = null
	keyCount = getKeyCount()

	get power() {
		return (this.synth != null)
	}

	set power(power: boolean) {
		if (power) this.setSynth()
		else {
			this.playing = []
			try { this.synth?.dispose() }
			catch (err) { console.error(err) }
			this.synth = null
		} 
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

	get detune() {
		return this.synth?.detune.value ?? 0
	}

	set detune(detune: number) {
		const { synth } = this
		if (synth != null)
			synth.detune.value = detune
	}

	get noteToKeyMap() {
		return _Object.invert(keyMap)
	}

	get supportsMidi() {
		return !!navigator.requestMIDIAccess
	}

	isPlaying(note?: Note) {
		const { playing } = this
		return (note == null) ? !!playing.length : playing.includes(note)
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
		try { this.synth?.dispose() }
		catch (err) { console.error(err) }
		this.synth = new instrument(opts).toDestination()
	}

	noteOn(note: Note) {
		if (!this.isPlaying(note))
			this.playing = [...this.playing, note]
	}

	noteOff(note: Note) {
		if (this.isPlaying(note))
			this.playing = this.playing.filter(n => n !== note)
	}

	@Watch('playing')
	updatePlaying(now: Note[], prev: Note[]) {
		if (!this.power) return
		if (this.instrument.isPoly)
			this.updatePlayingPolyphonic(now, prev)
		else
			this.updatePlayingMonophonic(now, prev)
	}

	updatePlayingMonophonic(now: Note[], prev: Note[]) {
		const { synth } = this
		const nowNote = _Array.last(now)
		const prevNote = _Array.last(prev)
		const canSetNote = !!synth?.setNote
		if (nowNote !== prevNote) {
			if (nowNote && prevNote && canSetNote)
				synth?.setNote(nowNote)
			else if (nowNote && !prev.includes(nowNote))
				synth?.triggerAttack(nowNote)
			else
				synth?.triggerRelease()
		}
	}

	updatePlayingPolyphonic(now: Note[], prev: Note[]) {
		const { synth } = this
		const stop = prev.filter(note => !now.includes(note))
		const play = now.filter(note => !prev.includes(note))
		stop.forEach(note => synth?.triggerRelease(note))
		play.forEach(note => synth?.triggerAttack(note))
	}

	created() {
		window.addEventListener("resize", event => {
			this.keyCount = getKeyCount()
		})

		window.addEventListener("keydown", event => {
			const note = keyMap[event.key]
			if (this.power && (note != null) && !this.isPlaying(note))
				this.playing = [...this.playing, note]
		})

		window.addEventListener("keyup", event => {
			const note = keyMap[event.key]
			if (this.power && (note != null))
				this.playing = this.playing.filter(down => down !== note)
		})
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
			.spacer
			.midi-input.setting(v-if='supportsMidi', :class='{ disabled: !power }')
				label(for='midi-select') midi input
				midi-select(
					name='midi-select',
					:disabled='!power',
					@noteon='noteOn',
					@noteoff='noteOff',
					@change='blurMe'
				)
			//- .spacer
			//- .detune.setting
			//- 	label detune ({{ detune }})
			//- 	v-knob(v-model='detune', :max='100', :min='-100', :step='10')
			a.github(href='https://github.com/romancow/tone-synth', title='View on GitHub')
				svg(style='width:24px;height:24px', viewBox='0 0 24 24')
					path(fill='currentColor', d='M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z')
		v-piano-keyboard#my-piano(v-model='playing', :count='keyCount', :disabled='!power')
			template(v-slot:key='{ note }')
				span(v-text='noteToKeyMap[note]')

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

			.github
				display: inline-flex
				margin-left: 8px

				&:visited
					color: currentColor

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
