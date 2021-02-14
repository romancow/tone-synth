<script lang="ts">
/// <reference types="@types/webmidi" />
import { Vue, Component, Watch, Emit, Prop } from 'vue-property-decorator'
import Note from '@/utilities/note'

const MIDDLE_C_MIDI_VALUE = 60

enum MidiCommand {
	NoteOff = 128,
	NoteOn = 144
}

@Component
export default class MidiSelect extends Vue {

	@Prop({ default: false})
	disabled!: boolean

	inputMap: WebMidi.MIDIInputMap = new Map<string, WebMidi.MIDIInput>()
	selectedInputIndex: string = ""

	get supportsMidi() {
		return !!navigator.requestMIDIAccess
	}

	get inputs() {
		return Array.from(this.inputMap)
	}

	get selectedInput() {
		const { selectedInputIndex: index, inputMap } = this
		return index && inputMap.get(index) || null
	}

	get hasSelected() {
		return !!this.selectedInputIndex
	}

	async created() {
		if (!this.supportsMidi) return
		const access = await navigator.requestMIDIAccess()
		// const stateChanged = () => {
		// 	this.inputMap = access.inputs
		// 	if (this.hasSelected && !this.inputMap.has(this.selectedInputIndex))
		// 		this.selectedInputIndex = ""
		// }
		// access.addEventListener('statechange', stateChanged)
		// stateChanged()
		access.addEventListener('statechange', () => this.onMidiStateChanged(access))
		this.onMidiStateChanged(access)
	}

	@Watch('selectedInput')
	selectedInputChanged(newInput: WebMidi.MIDIInput | null, oldInput: WebMidi.MIDIInput | null) {
		oldInput?.removeEventListener('midimessage', this.onMidiMessage as EventListener)
		newInput?.addEventListener("midimessage", this.onMidiMessage)
	}

	onMidiStateChanged(access: WebMidi.MIDIAccess) {
		this.inputMap = access.inputs
		if (this.hasSelected && !this.inputMap.has(this.selectedInputIndex))
			this.selectedInputIndex = ""
	}

	onMidiMessage(event: WebMidi.MIDIMessageEvent) {
		const [command, value, velocity] = event.data
		const note = Note.transpose("C4", value - MIDDLE_C_MIDI_VALUE)
		if (command === MidiCommand.NoteOff)
			this.noteoff(note)
		else if (command === MidiCommand.NoteOn) {
			if (velocity)
				this.noteon(note)
			else
				this.noteoff(note)
		}
	}

	@Emit()
	noteon(note: Note) {}

	@Emit()
	noteoff(note: Note) {}
}
</script>


<template lang="pug">

	select.midi-select(
		:disabled='disabled',
		:class='{"midi-supported": supportsMidi}',
		v-model.number='selectedInputIndex',
		@change='$emit("change", $event)'
	)
		option(value='') none
		option(
			v-for='[key, input] in inputs',
			:key='key',
			:value='key',
			v-text='input.name'
		)

</template>


<style lang="sass" scoped>
	
	.midi-select
		min-width: 72px

</style>