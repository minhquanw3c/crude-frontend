import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
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

	const [activeInput, setActiveInput] = React.useState<"sell" | "buy" | null>(
		null
	);
	const [showLoader, setShowLoader] = React.useState<boolean>(false);
	const [messages, setMessages] = React.useState<
		Array<{ message: string; type: "success" | "error" }>
	>([]);
	const [chains, setChains] = React.useState<Array<Chain>>([]);
	const [sellComponent, setSellComponent] = React.useState<SwapComponent>({
		...initialData,
	});
	const [buyComponent, setBuyComponent] = React.useState<SwapComponent>({
		...initialData,
	});

	const onConfirmSwap = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const errorsToShow: Array<{
			message: string;
			type: "success" | "error";
		}> = [];

		if (sellComponent.amount <= 0) {
			errorsToShow.push({
				message: "Sell amount must be greater than 0",
				type: "error",
			});
		}

		if (!sellComponent.selectedToken) {
			errorsToShow.push({
				message: "Please select token to sell",
				type: "error",
			});
		}

		if (buyComponent.amount <= 0) {
			errorsToShow.push({
				message: "Buy amount must be greater than 0",
				type: "error",
			});
		}

		if (!buyComponent.selectedToken) {
			errorsToShow.push({
				message: "Please select token to buy",
				type: "error",
			});
		}

		if (errorsToShow.length) {
			setMessages(errorsToShow);

			setTimeout(() => {
				setMessages([]);
			}, 5000);
			return;
		}

		setMessages([
			{
				message: "Transaction completed",
				type: "success",
			},
		]);
		setSellComponent({ ...sellComponent, amount: 0 });
		setBuyComponent({ ...buyComponent, amount: 0 });

		setTimeout(() => {
			setMessages([]);
		}, 5000);
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

	React.useEffect(() => {
		if (
			sellComponent.selectedToken &&
			sellComponent.amount &&
			buyComponent.selectedToken
		) {
			const receiveAmount =
				(sellComponent.selectedToken.price * sellComponent.amount) /
				buyComponent.selectedToken.price;

			setBuyComponent({
				...buyComponent,
				amount: receiveAmount,
			});
		}
	}, [
		sellComponent.amount,
		sellComponent.selectedToken,
		buyComponent.selectedToken,
	]);

	return (
		<>
			<Box
				maxWidth={"380px"}
				display={"flex"}
				flexDirection={"column"}
				gap={"0.5rem"}
			>
				<Alert severity="info">Welcome to CRUD Swap</Alert>

				<Card raised>
					<CardContent>
						<Box
							display={"flex"}
							justifyContent={"center"}
							flexDirection={"column"}
						>
							<Box marginBottom={"1rem"}>
								{messages.length ? (
									<Stack>
										{messages.map((message, index) => {
											return (
												<Alert
													severity={message.type}
													key={index}
												>
													{message.message}
												</Alert>
											);
										})}
									</Stack>
								) : null}
							</Box>

							<TokenSwap
								isReadOnly={false}
								swapType={"sell"}
								label="Input amount"
								chains={chains}
								componentData={sellComponent}
								onSetComponentData={setSellComponent}
								onSetActiveInput={setActiveInput}
							/>

							<Button>
								<ArrowDownwardOutlinedIcon fontSize="large" />
							</Button>

							<TokenSwap
								isReadOnly={true}
								swapType={"buy"}
								label="Receive amount"
								chains={chains}
								componentData={buyComponent}
								onSetComponentData={setBuyComponent}
								onSetActiveInput={setActiveInput}
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
