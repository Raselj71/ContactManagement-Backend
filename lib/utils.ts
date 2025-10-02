const OPERATOR_RANGE = /^[0-9]$/;

function digitsOnly(s: string): string {
	return (s || "").replace(/\D+/g, "");
}

export function isValidBDMobile(raw: string): boolean {
	const d = digitsOnly(raw);

	if (d.length === 11 && d.startsWith("01")) {
		const op = d[2]; // 3rd digit
		return op >= "3" && op <= "9";
	}

	if (d.length === 13 && d.startsWith("8801")) {
		const op = d[4]; // 5th digit
		return op >= "3" && op <= "9";
	}

	return false;
}

export function normalizeBDMobile(raw: string): string {
	const d = digitsOnly(raw);

	if (d.length === 11 && d.startsWith("01")) {
		return "880" + d.slice(1);
	}
	if (d.length === 13 && d.startsWith("8801")) {
		return d;
	}

	return "";
}
