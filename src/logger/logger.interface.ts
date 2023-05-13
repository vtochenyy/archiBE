export interface ILogger {
	log: (args: any) => void;
	err: (args: any) => void;
	warn: (args: any) => void;
	debug: (args: any) => void;
}
