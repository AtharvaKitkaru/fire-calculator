import React, { useState, useEffect } from "react";
import "./RetirementCalculator.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState();
  const [retirementAge, setRetirementAge] = useState();
  const [lifeExpectancy, setLifeExpectancy] = useState();
  const [currentInvestmentCorpus, setCurrentInvestmentCorpus] = useState();
  const [monthlyInvestment, setMonthlyInvestment] = useState();
  const [annualIncreaseInSavings, setAnnualIncreaseInSavings] = useState();
  const [growthRate, setGrowthRate] = useState();
  const [capitalGainTax, setCapitalGainTax] = useState();
  const [postRetirementMonthlyIncome, setPostRetirementMonthlyIncome] =
    useState();
  const [inflationRate, setInflationRate] = useState();
  const [simulationData, setSimulationData] = useState([]);
  const [tableHidden, setTableHidden] = useState();

  useEffect(() => {
    // This function will run on component mount and whenever dependencies change
    // You can put client-side logic here if needed
    // For example, if you need to fetch data from an API on the client side
    setTableHidden(true);
  }, []);

  const notNumber = (number) => {
    if (
      isNaN(number) ||
      number === null ||
      number === undefined ||
      number === ""
    ) {
      return true;
    }
  };
  const calculateRetirement = () => {
    // Validate input values
    if (
      currentAge <= 0 ||
      retirementAge <= 0 ||
      lifeExpectancy <= 0 ||
      currentInvestmentCorpus < 0 ||
      monthlyInvestment < 0 ||
      annualIncreaseInSavings < 0 ||
      growthRate < 0 ||
      capitalGainTax < 0 ||
      postRetirementMonthlyIncome < 0 ||
      inflationRate < 0
    ) {
      toast.error("Please enter valid positive numbers.");
      return;
    } else if (
      notNumber(currentAge) ||
      notNumber(retirementAge) ||
      notNumber(lifeExpectancy) ||
      notNumber(currentInvestmentCorpus) ||
      notNumber(monthlyInvestment) ||
      notNumber(annualIncreaseInSavings) ||
      notNumber(growthRate) ||
      notNumber(capitalGainTax) ||
      notNumber(postRetirementMonthlyIncome) ||
      notNumber(inflationRate)
    ) {
      toast.error("Please enter all values");
      return;
    }
    // Clear previous simulation data
    setSimulationData([]);

    // Initialize variables
    let corpus = currentInvestmentCorpus;
    let withdrawals = 0;
    let yearlySavingsIncrement = 0;
    let returnsOnInvestment = 0;
    let monthlyReturnsRate = 0;
    let updatedMonthlyInvestment = monthlyInvestment;
    let updatedPostRetirementMonthlyIncome = postRetirementMonthlyIncome;
    // Calculate and store simulation data for each age until life expectancy
    const newData = [];
    for (let age = currentAge; age <= lifeExpectancy; age++) {
      // Calculate yearlySavingsIncrement, returnsOnInvestment, and corpus for each age

      corpus =
        corpus +
        returnsOnInvestment +
        yearlySavingsIncrement -
        withdrawals * (1 + capitalGainTax / 100);
      yearlySavingsIncrement =
        updatedMonthlyInvestment * 12 * (age <= retirementAge ? 1 : 0);
      monthlyReturnsRate = 1 + annualIncreaseInSavings / 100;
      updatedMonthlyInvestment = monthlyReturnsRate * updatedMonthlyInvestment;

      // return on investment = corpus * growthrate * (1-taxrate/100)
      returnsOnInvestment = Math.max(
        corpus * (growthRate / 100) * (1 - capitalGainTax / 100),
        0
      );

      // Calculate withdrawals based on post-retirement income and adjust for inflation

      if (age > retirementAge) {
        updatedPostRetirementMonthlyIncome =
          (1 + inflationRate / 100) * updatedPostRetirementMonthlyIncome;
        withdrawals = 12 * updatedPostRetirementMonthlyIncome;
      } else if (age === retirementAge) {
        withdrawals = updatedPostRetirementMonthlyIncome * 12;
      } else {
        withdrawals = 0;
      }

      // Store simulation data for the current age
      newData.push({
        age,
        corpus,
        yearlySavingsIncrement,
        returnsOnInvestment,
        withdrawals,
      });
    }

    // Update state after the loop is complete
    setSimulationData(newData);
    setTableHidden(false);
  };
  let formatNumber = (val) => {
    if (val >= 10000000 || val <= -10000000)
      val = (val / 10000000).toFixed(2) + " Cr";
    else if (val >= 100000 || val <= -100000)
      val = (val / 100000).toFixed(2) + " Lakh";
    else if (val >= 1000 || val <= -1000) val = (val / 1000).toFixed(2) + " K";
    return val;
  };

  return (
    <div className="calculator">
      <div className="heading-section">
        <h3>Retirement Savings Calculator</h3>
      </div>
      <ToastContainer></ToastContainer>

      <div className="body">
        <div className="input-section">
          <div className="inputs">
            <div className="input-line">
              <div className="label">Current Age</div>
              <div>
                <input
                  required="true"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                />
              </div>
            </div>
            <br />
            <div className="input-line">
              <div className="label">Retirement Age</div>
              <div>
                <input
                  required="true"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                />
              </div>
            </div>
            <br />
            <div className="input-line">
              <div className="label">Expect to Live Until</div>
              <div>
                <input
                  required="true"
                  type="number"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                />
              </div>
            </div>
            <br />
            <div className="input-line">
              {" "}
              <div className="label">Existing Investment Corpus</div>
              <div>
                <input
                  required="true"
                  type="number"
                  value={currentInvestmentCorpus}
                  onChange={(e) =>
                    setCurrentInvestmentCorpus(Number(e.target.value))
                  }
                />
              </div>
            </div>{" "}
            <br />
            <div className="input-line">
              {" "}
              <div className="label">Monthly Investment</div>
              <div>
                <input
                  required="true"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                />
              </div>
            </div>
            <br />
            <div className="input-line">
              <div className="label">
                Expected yearly increase in savings (%)
              </div>
              <div>
                <input
                  required="true"
                  type="number"
                  value={annualIncreaseInSavings}
                  onChange={(e) =>
                    setAnnualIncreaseInSavings(Number(e.target.value))
                  }
                />
              </div>
            </div>
            <br />
            <div className="input-line">
              {" "}
              <div className="label">
                Anticipated annual growth rate of investments (%)
              </div>
              <div>
                <input
                  required="true"
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                />
              </div>
            </div>
            <br />
            <div className="input-line">
              <div className="label">
                Percentage of tax on capital gains (%)
              </div>
              <div>
                <input
                  required="true"
                  type="number"
                  value={capitalGainTax}
                  onChange={(e) => setCapitalGainTax(Number(e.target.value))}
                />
              </div>
            </div>{" "}
            <br />
            <div className="input-line">
              {" "}
              <div className="label">
                Monthly income needed after retirement
              </div>{" "}
              <div>
                <input
                  required="true"
                  type="number"
                  value={postRetirementMonthlyIncome}
                  onChange={(e) =>
                    setPostRetirementMonthlyIncome(Number(e.target.value))
                  }
                />
              </div>
            </div>
            <br />
            <div className="input-line">
              <div className="label">Expected inflation rate (%)</div>{" "}
              <div>
                <input
                  required="true"
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <br />
          <div className="button">
            <button type="submit" onClick={calculateRetirement}>
              Calculate
            </button>
          </div>
        </div>

        {/* Display the simulation table */}

        {!tableHidden && (
          <div className="table-section">
            <table>
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Corpus</th>
                  <th>Increase in yearly Investment</th>
                  <th>Returns on Investment</th>
                  <th>Amount Withdrawn per annum</th>
                </tr>
              </thead>
              <tbody>
                {simulationData.map((data) => (
                  <tr
                    key={data.age}
                    style={{
                      backgroundColor:
                        data.age === retirementAge
                          ? "#eef0ff"
                          : data.corpus < -0.0001
                          ? "#fae9e5"
                          : "white",
                    }}
                  >
                    <td>{data.age}</td>
                    <td>₹ {formatNumber(data.corpus)}</td>
                    <td>₹ {formatNumber(data.yearlySavingsIncrement)}</td>
                    <td>₹ {formatNumber(data.returnsOnInvestment)}</td>
                    <td>₹ {formatNumber(data.withdrawals)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <footer>Made with ❤️ by Atharva Kitkaru</footer>
    </div>
  );
};

export default RetirementCalculator;
