import React from "react";
import Calculator from "./Calculator";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Table } from "react-bootstrap";

function Home() {
	const [coins, setCoins] = useState([]);
	const [interestRate, setInterestRate] = useState([]);
	console.log(interestRate);

	const getApiCoins = async () => {
		try {
			const apiUrl = await axios(
				"https://data.messari.io/api/v1/assets?fields=id,slug,symbol,metrics/market_data/price_usd"
			);
			const arrayCoins = [
				apiUrl.data.data[0],
				apiUrl.data.data[1],
				apiUrl.data.data[6],
			];
			return setCoins(arrayCoins);
		} catch (error) {
			console.log("Try/catch error!");
			res.status(404).json({ error: error.message });
		}
	};

	async function getAllCoins() {
		let interest = await axios("http://localhost:3001/coins");
		return interest.data;
	}
	useEffect(() => {
		getAllCoins().then((res) => {
			setInterestRate(res);
		});
		getApiCoins();
	}, []);

	return (
		<>
			{/* <h1>Calculate your inverst</h1>
        <Calculator coins={coins} interest={interestRate}/> */}

			<div>
				<Container>
					<Row>
						<Col>
							<Table hover>
								<thead>
									<tr>
										<th>Name</th>
										<th>Price</th>
										<th>monthly interest</th>
										<th>capital</th>
										<th>final profit</th>
									</tr>
								</thead>
								<tbody>
									{coins.map((coin) => (
										<tr key={coin.id}>
											<td>
												<div className="coin-name d-flex align-items-center">
													<span>
														{coin.slug} - {coin.symbol}
													</span>
												</div>
											</td>
											<td>{coin.metrics.market_data.price_usd.toFixed(2)}</td>
										</tr>
									))}
									{interestRate.map((e) => (
										<tr key={e.id}>
											
											<td>{e.interestRate}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Col>
					</Row>
					<input type="number" placeholder="amount" />
				</Container>
			</div>
		</>
	);
}

export default Home;
