import { Token } from "./Token";

export type Chain = {
	id: number;
	chainId: number;
	name: string;
	imageUrl: string;
	tokens: Array<Token>;
};
