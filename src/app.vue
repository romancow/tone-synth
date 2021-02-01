<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VPianoKeyboard from 'vue-piano-keyboard'
import MyPianoKeyboard from '@/components/vue-piano-keyboard.vue'
import * as Tone from 'tone' 

@Component({
	components: { VPianoKeyboard, MyPianoKeyboard },
})
export default class App extends Vue {

	synth = new Tone.Synth({ oscillator: { type: 'sine' }}).toDestination();

	get oscillatorType() {
		return this.synth.oscillator.type
	}

	set oscillatorType(type: string) {
		this.synth.oscillator.type = type as any
	}

	play(note: string) {
		this.synth.triggerAttack(note)
	}

	stop(note: string) {
		this.synth.triggerRelease()
	}

}
</script>


<template  lang="pug">

	div#app
		.oscillator-select
			label(for='oscillator-type') waveform
			select(name='oscillator-type', v-model='oscillatorType')
				option(value='sine') sine
				option(value='square') square
				option(value='sawtooth') saw
		my-piano-keyboard#my-piano(@pressed='play', @depressed='stop')
		//- v-piano-keyboard#piano(show-keys)

</template>


<style lang="sass" scoped>

	#app
		font-family: Avenir, Helvetica, Arial, sans-serif
		-webkit-font-smoothing: antialiased
		-moz-osx-font-smoothing: grayscale
		text-align: center
		color: #2c3e50
		margin-top: 60px

		.oscillator-select label
			margin-right: 5px

		#my-piano
			height: 300px
			margin: 20px

</style>
