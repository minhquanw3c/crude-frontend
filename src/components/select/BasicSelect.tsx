import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwapVerticalCircleOutlinedIcon from "@mui/icons-material/SwapVerticalCircleOutlined";

import { SwapComponent, Token } from "../../types/Token";
import { Chain } from "../../types/Chain";
import axios from "axios";
import TokenSwap from "../TokenSwap";

export default function BasicSelect() {
	const initialData: SwapComponent = {
		amount: 0,
		selectedToken: null,
		selectedChainId: "",
		openDialog: false,
		chainsToSelect: [],
		tokensToShow: [],
	};

	const [chains, setChains] = React.useState<Array<Chain>>([]);
	const [inputComponent, setInputComponent] = React.useState<SwapComponent>({
		...initialData,
	});

	const fetchChains = async () => {
		try {
			const fetchedChainsRequest = (await axios.get("/chains", {
				baseURL: "http://localhost:3000",
				headers: {
					Accept: "application/json",
				},
			})) as {
				data: {
					chains: Array<Chain>;
				};
				status: number;
				statusText: string;
			};

			setChains(fetchedChainsRequest.data.chains);
		} catch (err) {
			console.error(err);
		}
	};

	React.useEffect(() => {
		fetchChains();
	}, []);

	return (
		<>
			<Box
				display={"flex"}
				justifyContent={"center"}
				marginY={"1rem"}
				flexDirection={"column"}
			>
				<TokenSwap
					chains={chains}
					componentData={inputComponent}
					onSetComponentData={setInputComponent}
				/>

				<Button>
					<SwapVerticalCircleOutlinedIcon fontSize="large" />
				</Button>
			</Box>
		</>
	);
}
