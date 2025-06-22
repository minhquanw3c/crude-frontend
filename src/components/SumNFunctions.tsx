import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

const SumNFunctions = () => {
	const CodeBlock = styled(Box)(({ theme }) => ({
		component: "pre",
		backgroundColor: theme.palette.grey[100],
		borderRadius: theme.shape.borderRadius,
		padding: theme.spacing(2),
		fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
		fontSize: "0.875rem",
		overflowX: "auto",
		whiteSpace: "pre",
	}));

	return (
		<>
			<Box display={"flex"} flexDirection={"column"} gap={"1rem"}>
				<Card raised>
					<CodeBlock>
						{`
function sumToN_iterative(n: number): number {
    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}
                    `}
					</CodeBlock>
				</Card>

				<Card raised>
					<CodeBlock>
						{`
function sumToN_functional(n: number): number {
    return Array.from({ length: n }, (_, i) => i + 1)
        .reduce((acc, cur) => acc + cur, 0);
}
                    `}
					</CodeBlock>
				</Card>

				<Card raised>
					<CodeBlock>
						{`
function sumToN_formula(n: number): number {
    return (n * (n + 1)) / 2;
}
                        `}
					</CodeBlock>
				</Card>
			</Box>
		</>
	);
};

export default SumNFunctions;
