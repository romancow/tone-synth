<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VPianoKeyboard from 'vue-piano-keyboard'
import MyPianoKeyboard from '@/components/vue-piano-keyboard.vue'
import * as Tone from 'tone' 

@Component({
	components: { VPianoKeyboard, MyPianoKeyboard },
})
export default class App extends Vue {

	synth = new Tone.Synth().toDestination();

	play(note: string) {
		this.synth.oscillator.type = "sawtooth"
		this.synth.triggerAttack(note)
	}

	stop(note: string) {
		this.synth.triggerRelease()
	}

}
</script>


<template  lang="pug">

	div#app
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

		#my-piano
			height: 300px
			margin: 20px

		#piano
			height: 300px

</style>
