import React from 'react'
import { Container, Row, Col, Table } from 'react-bootstrap';


function calcularGananciaAnualInteresCompuesto(P, r, n, t, cripto) {
	var A = P * Math.pow(1 + r/n, n*t);
	var B = A / cripto
	 
	return { dollars: A.toFixed(2), crypto: B}; // Redondeamos el resultado a dos decimales
  }
function calcularGananciaAnualInteresSimple(P, r, t, cripto) {
	var A = P * r * t;
	var B = A / cripto
	return { dollars: A.toFixed(2), crypto: B};  // Redondeamos el resultado a dos decimales
  }



function Calculator({coins}, {interest}) {
    
        return (
            <div >
            <Container>
            <Row>
              <Col>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>capital</th>
                      <th>monthly interest</th>
                      <th>final profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coins.map((coin) => (
                        <tr key={coin.id}>
                        <td>
                          <div className="coin-name d-flex align-items-center">
                            <span>{coin.slug} - {coin.symbol}</span>
                          </div>
                        </td>
                        <td>{coin.metrics.market_data.price_usd.toFixed(2)}</td>
                      </tr>
                    ))}
                    {interest.map((e) => (
                        <tr key={e.id}>
                        <td>
                          <div className="coin-name d-flex align-items-center">
                            
                          </div>
                        </td>
                        <td>{e.interest}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <input type="number" placeholder="amount"  />
          </Container>
          </div>
          );
      };
      

 


    // <div className="container">
    //   <div className="col">
    //     <div className="col-2">Name</div>
    //     <div className="col-2 text-right">Price</div>
    //   </div>
    //   {coins.map((crypto) => (
    //     <div key={crypto.id} className="row crypto-row">
    //       <div className="row">
    //         <div className="d-flex align-items-center">
    //           <div className="crypto-icon">{getIcon(crypto.symbol)}</div>
    //           <div className="crypto-name">{crypto.slug}</div>
    //         </div>
    //       </div>
    //       <div className="row-2 text-right">${crypto.metrics.market_data.price_usd.toFixed(2)}</div>
    //     </div>
    //   ))}
    // </div>
    
  




export default Calculator