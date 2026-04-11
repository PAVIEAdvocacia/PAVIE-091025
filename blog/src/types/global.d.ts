interface Window {
	onTsDone?: (token?: string) => void;
	onTsExpired?: () => void;
	onTsError?: () => void;
	turnstile?: {
		reset?: () => void;
	};
}
