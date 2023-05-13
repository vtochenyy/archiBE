import { DotenvParseOutput } from 'dotenv';

export interface IConfigService {
	get: (key: string) => string;
	config: DotenvParseOutput;
}
