export function invert<K extends string, V extends string>(obj: { [k in K]: V }) {
	const keys = Object.keys(obj) as K[]
	return keys.reduce((inverted, key) => {
		inverted[obj[key]] = key
		return inverted
	}, {} as { [key: string]: K }) as { [v in V]: K }
}
