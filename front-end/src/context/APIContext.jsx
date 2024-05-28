import { createContext, useCallback } from "react";

export const APIContext = createContext();

const APIProvider = ({ children }) => {
	const APIRequest = useCallback(async (path, method, body, stream_response_function) => {
		let data = {
			method,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		};

		if (body) data.body = JSON.stringify(body);

		return await new Promise((resolve) => {
			fetch(`http://${window.location?.hostname}:5000/api` + path, data)
				.then(async (res) => {
					if (stream_response_function !== undefined && stream_response_function !== false) {
						const reader = res.body.getReader();
						const decoder = new TextDecoder("utf-8");
						let assembling_chunk = "";
						let chunks = [];
						let first_piece = null;

						while (true) {
							const { done, value } = await reader.read();
							if (done) break;

							assembling_chunk += decoder.decode(value, { stream: true });

							let json_strings = assembling_chunk.split("\n");

							assembling_chunk = json_strings.pop();

							json_strings.map((string) => {
								string = string.trim();
								if (string.length === 0) return false;
								try {
									const json_chunk = JSON.parse(string)?.data;
									chunks = chunks.concat(json_chunk);

									if (first_piece === null) first_piece = chunks.shift();
									if (typeof first_piece === "number") {
										stream_response_function(chunks.length / first_piece);
									} else if (first_piece === "generating") {
										stream_response_function(json_chunk);
									}
									return true;
								} catch (e) {
									console.error("Error:", e, string);
									return false;
								}
							});
						}

						if (assembling_chunk.trim().length !== 0) {
							try {
								const json_chunk = JSON.parse(assembling_chunk)?.data;
								chunks = chunks.concat(json_chunk);
							} catch (e) {
								console.error("Error:", e, assembling_chunk);
							}
						}

						return chunks;
					}
					return res?.json();
				})
				.then((res) => resolve(res))
				.catch((error) => {
					console.error("Fetch error:", error);
				});
		});
	}, []);

	return <APIContext.Provider value={{ APIRequest }}>{children}</APIContext.Provider>;
};

export default APIProvider;
