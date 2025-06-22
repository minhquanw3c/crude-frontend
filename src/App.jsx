import { Container } from "@mui/material";
import SwapWidget from "./components/SwapWidget";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function App() {
	return (
		<>
			<AppBar color="primary">
				<Toolbar>
					<Container>
						<Typography
							color="white"
							variant="h6"
							component="div"
							sx={{ flexGrow: 1 }}
						>
							CRUD Swap
						</Typography>
					</Container>
				</Toolbar>
			</AppBar>
			<SwapWidget />
		</>
	);
}

export default App;
