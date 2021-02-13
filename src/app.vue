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

const getKeyCount = () => (window.innerWidth < 720) ? 12 : 24

@Component({
	components: { VPianoKeyboard, VLed, VKnob }
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
			this.synth?.dispose()
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
		this.synth = new instrument(opts).toDestination()
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
