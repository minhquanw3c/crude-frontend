import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";

export default function Layout() {
	return (
		<>
			<AppBar color="primary">
				<Toolbar>
					<Container>
						<Box
							display={"flex"}
							gap={"2rem"}
							alignItems={"center"}
						>
							<Link to="/">
								<Box
									display={"flex"}
									gap={"0.3rem"}
									alignItems={"center"}
									color={"white"}
								>
									<CurrencyExchangeOutlinedIcon />
									CRUD Swap
								</Box>
							</Link>

							<Link to="/functions">
								<Typography color="white">Functions</Typography>
							</Link>
						</Box>
					</Container>
				</Toolbar>
			</AppBar>
			<Outlet />
		</>
	);
}
