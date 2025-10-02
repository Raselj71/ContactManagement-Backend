export type ApiResponse<T> = {
	success: boolean;
	payload: T | null;
	message: string;
	status: number;
};

export function ok<T>(
	payload: T,
	message = "OK",
	status = 200,
): ApiResponse<T> {
	return { success: true, payload, message, status };
}

export function created<T>(payload: T, message = "Created"): ApiResponse<T> {
	return { success: true, payload, message, status: 201 };
}

export function fail(
	message: string,
	status = 400,
	payload: unknown = null,
): ApiResponse<unknown> {
	return { success: false, payload, message, status };
}
