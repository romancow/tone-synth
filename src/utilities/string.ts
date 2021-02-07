export function isString(something: any): something is string {
	return (typeof something === 'string')
}
