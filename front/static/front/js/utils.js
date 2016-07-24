function convertEngine(value) {
    if (value >= 1000) {
	return (value / 1000).toFixed(1);
    }

    return value;
}

function sanitizeEngine(value) {
    if (value >= 0 && value <= 10) {
	return Math.trunc(value * 1000);
    }

    return value;
}
