export function last<T>(arr: readonly T[]): T  
export function last<T>(arr: readonly T[], num: number): T[]
export function last<T>(arr: readonly T[], num?: number): T | T[] {
	return (num == null) ?
		arr[arr.length - 1] :
		arr.slice(arr.length - num)
}
