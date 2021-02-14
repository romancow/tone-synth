import { times } from '@/utilities/number'
import { atIndex } from '@/utilities/array'

type Note = `${Note.Basic}${Note.Octave}`

namespace Note {	
	export const Notes: Basic[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

	export type Basic = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
	export type Octave = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

	export enum Type {
		White = 'white',
		Black = 'black',
		Placeholder = 'placeholder'
	}

	export namespace Type {
		export function get(note: Note | null) {
			return note ? (note.charAt(1) === "#") ?
				Type.Black : Type.White : Type.Placeholder
		}
	}

	export function split(note: Note) {
		const [n, octave] = note.split(/(-?[\d]+)$/)
		return { 
			note: n as Basic,
			octave: parseInt(octave) as Octave
		}
	}

	function transposeFromIndex(index: number, octave: number, halfSteps: number) {
		const indexSum = index + halfSteps
		const nextNote = atIndex(Notes, indexSum % Notes.length)
		const nextOctave = Math.floor(indexSum / Notes.length) + octave
		return `${nextNote}${nextOctave}` as Note 
	}

	export function transpose(note: Note, halfSteps: number) {
		const { note: basic, octave } = split(note)
		const index = Notes.indexOf(basic)
		return transposeFromIndex(index, octave, halfSteps)
	}

	export function getRange(first: Note, count: number) {
		const { note, octave } = split(first)
		const noteIndex = Notes.indexOf(note)
		return times(count, index => transposeFromIndex(noteIndex, octave, index))
	}
}

export default Note
