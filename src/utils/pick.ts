/**
 * Create an object composed of the picked object properties
 * @param object The source object
 * @param keys The keys to pick
 * @returns An object with only the picked keys
 */
export default function pick<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
	return keys.reduce((obj, key) => {
		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
			(obj as any)[key] = object[key];
		}
		return obj;
	}, {} as Pick<T, K>);
}
