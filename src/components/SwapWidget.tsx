import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwapVerticalCircleOutlinedIcon from "@mui/icons-material/SwapVerticalCircleOutlined";
import Stack from "@mui/material/Stack";
import { Alert } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";

import { SwapComponent, Token } from "../types/Token";
import { Chain } from "../types/Chain";
import axios from "axios";
import TokenSwap from "./TokenSwap";

export default function SwapWidget() {
	const initialData: SwapComponent = {
		amount: 0,
		selectedToken: null,
		selectedChainId: "",
		openDialog: false,
		chainsToSelect: [],
		tokensToShow: [],
	};

	const [errors, setErrors] = React.useState<Array<{ message: string }>>([]);
	const [chains, setChains] = React.useState<Array<Chain>>([]);
	const [sellComponent, setSellComponent] = React.useState<SwapComponent>({
		...initialData,
	});
	const [buyComponent, setBuyComponent] = React.useState<SwapComponent>({
		...initialData,
	});

	const onConfirmSwap = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const errorsToShow: Array<{ message: string }> = [];

		if (sellComponent.amount <= 0) {
			errorsToShow.push({
				message: "Sell amount must be greater than 0",
			});
		}

		if (!sellComponent.selectedToken) {
			errorsToShow.push({
				message: "Please select token to sell",
			});
		}

		if (buyComponent.amount <= 0) {
			errorsToShow.push({
				message: "Buy amount must be greater than 0",
			});
		}

		if (!buyComponent.selectedToken) {
			errorsToShow.push({
				message: "Please select token to buy",
			});
		}

		if (errorsToShow.length) {
			setErrors(errorsToShow);

			setTimeout(() => {
				setErrors([]);
			}, 5000);
		}
	};

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
			<Card raised>
				<CardContent>
					<Box
						display={"flex"}
						justifyContent={"center"}
						flexDirection={"column"}
					>
						<Box marginBottom={"1rem"}>
							{errors.length ? (
								<Stack>
									{errors.map((error, index) => {
										return (
											<Alert severity="error" key={index}>
												{error.message}
											</Alert>
										);
									})}
								</Stack>
							) : null}
						</Box>

						<TokenSwap
							label="Sell amount"
							chains={chains}
							componentData={sellComponent}
							onSetComponentData={setSellComponent}
						/>

						<Button>
							<SwapVerticalCircleOutlinedIcon fontSize="large" />
						</Button>

						<TokenSwap
							label="Buy amount"
							chains={chains}
							componentData={buyComponent}
							onSetComponentData={setBuyComponent}
						/>

						<Box marginTop={"1rem"}>
							{buyComponent.selectedToken &&
								sellComponent.selectedToken &&
								`1 ${buyComponent.selectedToken.currency} = ${sellComponent.selectedToken.currency}`}
						</Box>

						<Box marginTop={"1rem"}>
							<Button
								variant="contained"
								onClick={onConfirmSwap}
								fullWidth
							>
								Confirm swap
							</Button>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</>
	);
}
