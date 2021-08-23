class Api {

	constructor() {}

	requestHeaders(token) {
		const common = {
			"Content-Type": "application/json",
			"Accept": "application/json",
		};

		const headers = token
			? { Authorization: `Bearer ${token}`, ...common }
			: { ...common };

		return headers;
	}

	// Wrapper for axios.get
	async axiosGet(url, params = {}, token = "", cancelToken = {}) {

		const headers = this.requestHeaders(token);

		return window.axios.get(url, {
			withCredentials: true,
			params: {
				...params,
			},
			headers,
			cancelToken: cancelToken ? cancelToken.token : null,
		});
	}

	// Wrapper for axios.post
	async axiosPost(url, inputs = {}, token = "") {

		const headers = this.requestHeaders(token);

		return window.axios.post(url, {
			...inputs,
		}, { 
			withCredentials: true,
			headers
		});
	}

	// Wrapper for axios.put
	async axiosPut(url, inputs = {}, token = "") {

		const headers = this.requestHeaders(token);

		return window.axios.put(url, {
			...inputs,
		}, { 
			withCredentials: true,
			headers 
		});
	}

	// Wrapper for axios.delete
	async axiosDelete(url, params = {}, token = "") {

		const headers = this.requestHeaders(token);

		return window.axios.delete(url, {
			withCredentials: true,
			params: {
				...params,
			},
			headers
		});
	}
}

export default Api;
