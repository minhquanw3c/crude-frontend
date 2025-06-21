import { Chain } from "./Chain";

export type Token = {
	id: number;
	tokenId: number;
	currency: string;
	date: string;
	price: number;
	imageUrl: string;
	chains: Array<Chain>;
};
