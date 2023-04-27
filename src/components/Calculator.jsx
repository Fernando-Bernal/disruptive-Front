import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ReactCSV from "./ReactCSV";

function Calculator() {

  const [crypto, setCrypto] = useState([]);
	const [interestRate, setInterestRate] = useState([]);
	const [coins, setCoins] = useState([]);
	const [input, setInput] = useState("");

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
			console.log(error);	
		}
	};
  
	async function getAllCoins() {
    let interest = await axios("http://localhost:3001/coins");
		return setInterestRate(interest.data);
	}
  
	function calculateCompoundInterest(Capital, r, cripto) {
    var A = Capital * Math.pow(1 + r, 12);
		var B = A / cripto;
    
		return { dollars: A.toFixed(2), crypto: B }; // Redondeamos el resultado a dos decimales
	}
	function simpleInterestCalculation(Capital, r, cripto) {
    var A = Capital * r * 1;
		var B = A / cripto;
		return { dollars: A.toFixed(2), crypto: B }; // Redondeamos el resultado a dos decimales
	}
  
	useEffect(() => {
    getAllCoins()
		getApiCoins();
    const interval = setInterval(() => {
      getApiCoins();
    }, 20000);
    return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (interestRate && coins) {
			let interes = coins?.map((coin) => {
				let interes = interestRate?.find((e) => e.name === coin.slug);
				return {
					...coin,
					interestRate: interes.interestRate,
				};
			});
			setCrypto(interes);
		}
	}, [interestRate]);



	useEffect(() => {
    
		if (input && crypto) {
			let ganancia = crypto?.map((coin) => {
				let ganancia = calculateCompoundInterest(
					input,
					coin.interestRate,
					coin.metrics.market_data.price_usd
				);
				return {
					...coin,
					ganancia: ganancia,
          capital: input,
				};
			});
     	setCrypto(ganancia);
    }
  }, [input]);

	
  const data = crypto
  const headers = [
    { label: "Name", key: "slug" },
    { label: "Price USD", key: "metrics.market_data.price_usd" },
    { label: "Monthly interest", key: "interestRate" },
    { label: "Capital", key: "capital" },
    { label: "Compound interst", key: "ganancia.dollars" },
    { label: "Earning in crypto", key: "ganancia.crypto" },
    { label: "Simple interest", key: "ganancia.dollars" },
  ];



  
function downloadJSON(data, filename) {
  const dataStr = JSON.stringify(data);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const downloadLink = document.createElement("a");
  downloadLink.href = dataUri;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function handleDownload() {
  downloadJSON(data, 'json.txt')
}


	return (
		<>
				<Container>
					<Row>
								<th style={{ width: 175 }}>Name</th>
								<th style={{ width: 175 }}>Price USD</th>
								<th style={{ width: 175 }}>Monthly interest</th>
								<th style={{ width: 175 }}>Capital</th>
								<th style={{ width: 175 }}>Compound interst</th>
								<th style={{ width: 175 }}>Earning in crypto</th>
								<th style={{ width: 175 }}>Simple interest</th>		
					</Row>
					<tbody>
						{crypto?.map((coin) => (
              <Row key={coin.id}>
								<tr >
									<td style={{ width: 150 }}>
										<div className="coin-name d-flex align-items-center">
											<span>
												{coin.slug.charAt(0).toUpperCase() + coin.slug.slice(1)} - {coin.symbol}
											</span>
										</div>
									</td>
									<td style={{ width: 175 }} >	{coin.metrics.market_data.price_usd.toFixed(2)}	</td>
									<td style={{ width: 175 }} > {coin.interestRate * 100}%</td>
									<td style={{ width: 175 }} > ${input}</td>
									<td style={{ width: 175 }} > ${coin.ganancia?.dollars || ""}</td>
									<td style={{ width: 175 }} > {coin.ganancia?.crypto.toFixed(5) || ""}	</td>
									<td style={{ width: 175 }} > {simpleInterestCalculation(input,coin.interestRate,coin.metrics.market_data.price_usd).dollars}</td>
								</tr>
							</Row>
						))
          }
					</tbody>
					<input
						type="number"
						placeholder="amount"
						onChange={(e) => setInput(e.target.value)}
						value={input}
            />
				</Container>
        <button className="btn-json" onClick={handleDownload}>Download JSON</button>
        <ReactCSV  data={data} headers={headers} filename={"My investment"}  />
		</>
	);
};

export default Calculator