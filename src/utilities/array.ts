type Predicate<T, A extends readonly T[]> = (item: T, index: number, arr: A) => boolean
namespace Predicate {
	export function test<P extends Predicate<any, readonly any[]>>(pred: P | unknown) {
		return (pred instanceof Function) ? pred as P : undefined
	}
}

export function last<T>(arr: readonly T[]): T  
export function last<T>(arr: readonly T[], num: number): T[]
export function last<T>(arr: readonly T[], num?: number): T | T[] {
	return (num == null) ?
		arr[arr.length - 1] :
		arr.slice(arr.length - num)
}

export function append<T, A extends T[] = T[]>(arr: A, item: T) {
	arr.push(item)
	return arr
}

export function remove<T, A extends T[] = T[]>(arr: A, search: T): A
export function remove<T, A extends T[] = T[]>(arr: A, search: Predicate<T, A>): A
export function remove<T, A extends T[] = T[]>(arr: A, search: T | Predicate<T, A>) {
	arr.flatMap((item, index) => {
			const matches = (item === search) || Predicate.test(search)?.(item, index, arr)
			return matches ? index : []
		})
		.reverse()
		.forEach(index => arr.splice(index, 1))
	return arr
}

export function atIndex<T>(arr: readonly T[], index: number) {
	const end = (index + 1) || undefined
	return arr.slice(index, end)[0]
}
