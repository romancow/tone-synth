<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VPianoKeyboard from 'vue-piano-keyboard'

@Component({
	components: { VPianoKeyboard },
})
export default class App extends Vue {}
</script>


<template  lang="pug">

	div#app
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

		#piano
			height: 300px

</style>
