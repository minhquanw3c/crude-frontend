import SwapWidget from "./components/SwapWidget";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SumNFunctions from "./components/SumNFunctions";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<SwapWidget />} />
						<Route path="functions" element={<SumNFunctions />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
