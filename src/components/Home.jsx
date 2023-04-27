import React from "react";
import Calculator from "./Calculator";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Table } from "react-bootstrap";

function Home() {
	const [coins, setCoins] = useState([]);
	const [interestRate, setInterestRate] = useState([]);
  const [crypto, setCrypto] = useState([]);
  const [input, setInput] = useState(0);
	

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
      console.log(arrayCoins)
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

  function calcularGananciaAnualInteresCompuesto(P, r, cripto) {
    var A = P * Math.pow(1 + r/12, 12*1);
    var B = A / cripto
     
    return { dollars: A.toFixed(2), crypto: B}; // Redondeamos el resultado a dos decimales
    }
  function calcularGananciaAnualInteresSimple(P, r, cripto) {
    var A = P * r * 1;
    var B = A / cripto
    return { dollars: A.toFixed(2), crypto: B};  // Redondeamos el resultado a dos decimales
    }


	useEffect(() => {
		getAllCoins().then((res) => {
			setInterestRate(res);
		});
    getApiCoins();
	}, []);
  
  useEffect(() => {
    if(interestRate && coins){
      // let interes = coins?.map((coin) => {
      //   return interestRate?.map((e) => {
      //     if (coin?.slug === e.name) {
      //       //retornar todo el objeto con el interes
      //       return {
      //         ...coin,
      //         interestRate: e.interestRate,
      //       };
      //     }
      //   });
      // });
      // recorrer el array de coins y por cada coin buscar el interes en el array de intereses
      // y agregarle el interes a la coin
      let interes = coins?.map((coin) => {
        let interes = interestRate?.find((e) => e.name === coin.slug);
        return {
          ...coin,
          interestRate: interes.interestRate,
        };
      });
      console.log(interes)
      setCrypto(interes)

    }

  },[coins, interestRate]);

  // setTimeout(() => {
  //   getApiCoins();
  // }, 300000);

  useEffect(() => {
    if(input && crypto){
      let ganancia = crypto?.map((coin) => {
        let ganancia = calcularGananciaAnualInteresCompuesto(input, coin.interestRate, coin.metrics.market_data.price_usd)
        return {
          ...coin,
          ganancia: ganancia,
        };
      });
      
      setCrypto(ganancia)
    }
  },[input]);


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
										<th>Compound interst</th>
                    <th>earning in crypto</th>
                    <th>Simple interest</th>
									</tr>
								</thead>
								<tbody>
									{crypto?.map((coin) => (
										<>
                    <tr key={coin.id}>
											<td>
												<div className="coin-name d-flex align-items-center">
													<span>
														{coin.slug} - {coin.symbol}
													</span>
												</div>
											</td>
										
                        <td>{coin.metrics.market_data.price_usd.toFixed(2)}</td>
                      
                        <td>{coin.interestRate}</td>
                        <td>{input}</td>
                        <td>{coin.ganancia?.dollars  || ''}</td>
                        <td>{coin.ganancia?.crypto || ''}</td>
                        <td>{calcularGananciaAnualInteresSimple(input, coin.interestRate, coin.metrics.market_data.price_usd).dollars}</td>
                      </tr>
                    </>
									))}
								</tbody>
							</Table>
						</Col>
					</Row>
					<input type="number" placeholder="amount" onChange={e=>setInput(e.target.value)} value={input} />
				</Container>
			</div>
		</>
	);
}

export default Home;
