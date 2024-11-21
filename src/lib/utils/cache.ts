const saveToCache = (key: string, value: unknown) => {
	return new Promise<void>((resolve) => {
		localStorage.setItem(key, JSON.stringify(value));
		resolve();
	});
};

const readFromCache = <T>(key: string) => {
	return new Promise<T | null>((resolve) => {
		const value = localStorage.getItem(key);
		resolve(value ? (JSON.parse(value) as T) : null);
	});
};

export { saveToCache, readFromCache };
