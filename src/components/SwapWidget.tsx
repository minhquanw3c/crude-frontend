import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwapVerticalCircleOutlinedIcon from "@mui/icons-material/SwapVerticalCircleOutlined";
import Stack from "@mui/material/Stack";
import { Alert } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { SwapComponent } from "../types/shared";
import { Chain, Token } from "../types/shared";
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

	const [showLoader, setShowLoader] = React.useState<boolean>(false);
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
			return;
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
		setShowLoader(true);

		setTimeout(() => {
			fetchChains();
			setShowLoader(false);
		}, 3000);
	}, []);

	return (
		<>
			<Box
				maxWidth={"380px"}
				display={"flex"}
				flexDirection={"column"}
				gap={"0.5rem"}
			>
				<Alert severity="warning">
					Note that we haven't added implementation logic for making
					sure swapping on same chain.
				</Alert>

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
												<Alert
													severity="error"
													key={index}
												>
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
									`1 ${
										buyComponent.selectedToken.currency
									} = ${
										buyComponent.selectedToken.price /
										sellComponent.selectedToken.price
									} ${sellComponent.selectedToken.currency}`}
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
			</Box>

			<Backdrop open={showLoader}>
				<CircularProgress color="warning" size={"3rem"} />
			</Backdrop>
		</>
	);
}
