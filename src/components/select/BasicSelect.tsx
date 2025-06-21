import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import SwapVerticalCircleOutlinedIcon from "@mui/icons-material/SwapVerticalCircleOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { Avatar } from "@mui/material";
import { Token } from "../../types/Token";
import { Chain } from "../../types/Chain";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

export default function BasicSelect() {
	const [chains, setChains] = React.useState<Array<Chain>>([]);

	const [selectedChain, setSelectedChain] = React.useState<string>("");
	const [selectedChainTokens, setSelectedChainTokens] = React.useState<
		Array<Token>
	>([]);

	const [inputToken, setInputToken] = React.useState<string>();
	const [openTokensDialog, setOpenTokensDialog] =
		React.useState<boolean>(false);

	const [outputToken, setOutputToken] = React.useState<string>();

	const onChangeInputToken = (event: SelectChangeEvent) => {
		setInputToken(event.target.value as string);
	};

	const onChangeOutputToken = (event: SelectChangeEvent) => {
		setOutputToken(event.target.value as string);
	};

	const onOpenTokensDialog = () => {
		setOpenTokensDialog(true);
	};

	const onCloseTokensDialog = (
		event: React.SyntheticEvent<unknown>,
		reason?: string
	) => {
		if (reason !== "backdropClick") {
			setOpenTokensDialog(false);
		}
	};

	const onSelectChain = (event: SelectChangeEvent) => {
		const chainId = event.target.value.toString();
		setSelectedChain(chainId);

		const chainToFilter = chains.find(
			(chain) => chain.chainId.toString() === chainId
		);

		if (chainToFilter) {
			setSelectedChainTokens([...chainToFilter.tokens]);
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
			<Box display={"flex"} minWidth={"300px"}>
				<FormControl fullWidth variant="filled">
					<TextField variant="filled" label="Input amount" />
				</FormControl>

				<Button onClick={onOpenTokensDialog}>
					{inputToken ? "" : "Select token"}
					<ArrowDownwardOutlinedIcon></ArrowDownwardOutlinedIcon>
				</Button>
			</Box>

			<Box display={"flex"} justifyContent={"center"} marginY={"1rem"}>
				<Button>
					<SwapVerticalCircleOutlinedIcon fontSize="large" />
				</Button>
			</Box>

			<Dialog
				fullWidth
				maxWidth="xs"
				disableEscapeKeyDown
				open={openTokensDialog}
				onClose={onCloseTokensDialog}
			>
				<DialogTitle>Select a token</DialogTitle>
				<DialogContent>
					<Box display={"flex"} flexDirection={"column"}>
						<FormControl fullWidth variant="filled">
							<InputLabel id="input-chains-label">
								Available chains
							</InputLabel>
							<Select
								labelId="input-chains-label"
								id="input-chains-select"
								label="Available chains"
								onChange={onSelectChain}
								value={selectedChain}
							>
								{chains.map((chain) => {
									return (
										<MenuItem value={chain.chainId}>
											<Avatar src={chain.imageUrl} />
											{chain.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>

						{selectedChainTokens.length ? (
							<List>
								{selectedChainTokens.map((token) => {
									return (
										<ListItemButton key={token.id}>
											<ListItemAvatar>
												<Avatar src={token.imageUrl} />
											</ListItemAvatar>
											<ListItemText>
												{token.currency}
											</ListItemText>
										</ListItemButton>
									);
								})}
							</List>
						) : null}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onCloseTokensDialog}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
