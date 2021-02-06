<script lang="ts">
import Vue from 'vue'
import { Component, VModel, Prop } from 'vue-property-decorator'

@Component
export default class VLed extends Vue {

	@VModel({ default: false})
	model!: boolean

	@Prop({ default: 'red'})
	color!: string

	get state() {
		return this.model ? 'on' : 'off'
	}

	get style() {
		const { model, color } = this
		return !model ? {} : {
			backgroundColor: color,
			boxShadow: `0px 0px 2px ${color}`
		}
	}

}
</script>


<template lang="pug">

	.v-led(:class='`v-led-${state}`', :style='style')

</template>


<style lang="sass" scoped>

	.v-led
		display: inline-block
		background-color: dimgray
		width: 5px
		height: 5px
		border: 1px solid gray
		border-radius: 50%
		margin: 3px

</style>