import * as Tone from 'tone'

export type Instrument = {
	name: string,
	instrument: typeof Tone.Synth,
	oscillators?: string[],
	isPoly?: boolean
}

const oscillators = {
	basic: ["sine", "square", "sawtooth", "triangle"],
	other: ["pulse", "pwm"],
	am: ["amsine", "amsquare", "amsawtooth", "amtriangle"],
	fm: ["fmsine", "fmsquare", "fmsawtooth", "fmtriangle"],
	fat: ["fatsine", "fatsquare", "fatsawtooth", "fattriangle"],
	all: [] as string[]
}
oscillators.all = [
	...oscillators.basic,
	...oscillators.other,
	...oscillators.am,
	...oscillators.fm,
	...oscillators.fat
]

export default [
	{
		name: 'basic',
		instrument: Tone.Synth,
		oscillators: oscillators.all
	}, {
		name: 'am',
		instrument: Tone.AMSynth,
		oscillators: oscillators.all
	},{
		name: 'fm',
		instrument: Tone.FMSynth,
		oscillators: oscillators.all
	},{
		name: 'mono',
		instrument: Tone.MonoSynth,
		oscillators: oscillators.all
	},{
		name: 'duo',
		instrument: Tone.DuoSynth
	},{
		name: 'poly',
		instrument: Tone.PolySynth,
		isPoly: true
	},{
		name: 'pluck',
		instrument: Tone.PluckSynth
	// },{
	// 	name: 'noise',
	// 	instrument: Tone.NoiseSynth
	},{
		name: 'membrane',
		instrument: Tone.MembraneSynth,
		oscillators: oscillators.all
	},{
		name: 'metal',
		instrument: Tone.MetalSynth
	// }, {
	// 	name: 'sampler',
	// 	instrument: Tone.Sampler
	}
] as Instrument[]
