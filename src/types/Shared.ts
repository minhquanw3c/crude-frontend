export type Chain = {
	id: number;
	chainId: number;
	name: string;
	imageUrl: string;
	tokens: Array<Token>;
};

export type Token = {
	id: number;
	tokenId: number;
	currency: string;
	date: string;
	price: number;
	imageUrl: string;
	chains: Array<Chain>;
};

export type SwapComponent = {
	amount: number;
	selectedToken: Token | null;
	selectedChainId: string;
	openDialog: boolean;
	chainsToSelect: Array<Chain>;
	tokensToShow: Array<Token>;
};
