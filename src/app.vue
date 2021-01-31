<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VPianoKeyboard from 'vue-piano-keyboard'
import MyPianoKeyboard from '@/components/vue-piano-keyboard.vue'

@Component({
	components: { VPianoKeyboard, MyPianoKeyboard },
})
export default class App extends Vue {}
</script>


<template  lang="pug">

	div#app
		my-piano-keyboard#my-piano
		v-piano-keyboard#piano(show-keys)

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
			height: 150px
			margin: 20px

		#piano
			height: 300px

</style>
