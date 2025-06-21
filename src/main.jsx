import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import App from "./App.jsx";
import { Box } from "@mui/material";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<CssBaseline />
		<App />
	</StrictMode>
);
