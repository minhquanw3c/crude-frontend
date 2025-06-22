import { SwapComponent } from "../types/shared";
import { Chain, Token } from "../types/shared";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { Avatar } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { useEffect, useState } from "react";

export default function TokenSwap({
	chains,
	componentData,
	label,
	onSetComponentData,
}: {
	chains: Array<Chain>;
	componentData: SwapComponent;
	label: string;
	onSetComponentData: React.Dispatch<React.SetStateAction<SwapComponent>>;
}) {
	const [openTokensDialog, setOpenTokensDialog] = useState<boolean>(
		componentData.openDialog
	);
	const [selectedChainId, setSelectedChainId] = useState<string>(
		componentData.selectedChainId
	);
	const [selectedToken, setSelectedToken] = useState<Token | null>(
		componentData.selectedToken
	);
	const [selectedChainTokens, setSelectedChainTokens] = useState<
		Array<Token>
	>(componentData.tokensToShow);
	const [inputAmout, setInputAmount] = useState<number>(componentData.amount);

	const onOpenTokensDialog = () => {
		setOpenTokensDialog(true);
		setSelectedChainTokens([]);
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
		setSelectedChainId(chainId);

		const chainToFilter = chains.find(
			(chain) => chain.chainId.toString() === chainId
		);

		if (chainToFilter) {
			setSelectedChainTokens([...chainToFilter.tokens]);
		}
	};

	const onSelectChainToken = (
		event: React.MouseEvent<HTMLDivElement>,
		token: Token
	) => {
		setSelectedToken(token);
		setOpenTokensDialog(false);
	};

	useEffect(() => {
		onSetComponentData({
			...componentData,
			openDialog: openTokensDialog,
			selectedChainId,
			selectedToken,
			tokensToShow: selectedChainTokens,
			amount: inputAmout,
		});
	}, [
		openTokensDialog,
		selectedChainId,
		selectedChainTokens,
		selectedToken,
		inputAmout,
	]);

	return (
		<>
			<Box display={"flex"} gap={"1rem"}>
				<Box minWidth={"250px"}>
					<FormControl fullWidth variant="filled">
						<TextField
							variant="filled"
							label={label}
							value={inputAmout}
							type="number"
							onChange={(e) => {
								setInputAmount(
									Number(e.target.value) < 0
										? 0
										: Number(e.target.value)
								);
							}}
						/>
					</FormControl>
				</Box>

				<Button onClick={onOpenTokensDialog}>
					{componentData.selectedToken ? (
						<Avatar src={componentData.selectedToken.imageUrl} />
					) : (
						"Select token"
					)}
					<ArrowDownwardOutlinedIcon></ArrowDownwardOutlinedIcon>
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
								value={selectedChainId}
							>
								{chains.map((chain) => {
									return (
										<MenuItem value={chain.chainId}>
											<Box
												display={"flex"}
												gap={"0.5rem"}
												alignItems={"center"}
											>
												<Avatar src={chain.imageUrl} />
												{chain.name}
											</Box>
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>

						{selectedChainTokens.length ? (
							<List>
								{selectedChainTokens.map((token) => {
									return (
										<ListItemButton
											key={token.id}
											onClick={(e) =>
												onSelectChainToken(e, token)
											}
										>
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
