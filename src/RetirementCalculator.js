import React, { useState, useEffect } from "react";
import "./RetirementCalculator.scss";

// Calculations for the RetirementCalculator
// corpus = currentInvestmentCorpus
// incremental savings during the year = 12*monthlyInvestment
// monthly investment = (1+annualIncreaseInSavings/100)*monthlyInvestment
// corpus = corpus + incrementalSavings + returnoninvestment ... before retirement
// corpus =corpus + returnoninvestment - yearlyWithdrawal
// return on investment =corpus*growthrate*(1-taxrate/100)
// yearlyWithdrawal = 12*initialMonthlyPostRetirement
//                  = Previous withdrawals*(1+inflationRate/100)

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(22);
  const [retirementAge, setRetirementAge] = useState(50);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentInvestmentCorpus, setCurrentInvestmentCorpus] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(8000);
  const [annualIncreaseInSavings, setAnnualIncreaseInSavings] = useState(5);
  const [growthRate, setGrowthRate] = useState(12);
  const [capitalGainTax, setCapitalGainTax] = useState(10);
  const [postRetirementMonthlyIncome, setPostRetirementMonthlyIncome] =
    useState(100000);
  const [inflationRate, setInflationRate] = useState(8);
  const [simulationData, setSimulationData] = useState([]);

  useEffect(() => {
    // This function will run on component mount and whenever dependencies change
    // You can put client-side logic here if needed
    // For example, if you need to fetch data from an API on the client side
  }, []);

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
      alert("Please enter valid positive numbers.");
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
      <h3>Retirement Calculator</h3>
      <label>
        Current Age
        <input
          type="number"
          value={currentAge}
          onChange={(e) => setCurrentAge(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Retirement Age
        <input
          type="number"
          value={retirementAge}
          onChange={(e) => setRetirementAge(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Expect to Live Until
        <input
          type="number"
          value={lifeExpectancy}
          onChange={(e) => setLifeExpectancy(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Current Investment
        <input
          type="number"
          value={currentInvestmentCorpus}
          onChange={(e) => setCurrentInvestmentCorpus(Number(e.target.value))}
        />
      </label>
      <label>
        Monthly Investment
        <input
          type="number"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Increase in Savings (%)
        <input
          type="number"
          value={annualIncreaseInSavings}
          onChange={(e) => setAnnualIncreaseInSavings(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        CAGR (Annual Expected Returns on Investment %)
        <input
          type="number"
          value={growthRate}
          onChange={(e) => setGrowthRate(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Capital Gain Tax
        <input
          type="number"
          value={capitalGainTax}
          onChange={(e) => setCapitalGainTax(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Post Retirement Income
        <input
          type="number"
          value={postRetirementMonthlyIncome}
          onChange={(e) =>
            setPostRetirementMonthlyIncome(Number(e.target.value))
          }
        />
      </label>
      <br />
      <label>
        Inflation Rate
        <input
          type="number"
          value={inflationRate}
          onChange={(e) => setInflationRate(Number(e.target.value))}
        />
      </label>
      <br />
      <button onClick={calculateRetirement}>Calculate</button>

      {/* Display the simulation table */}
      <table>
        <thead>
          <tr>
            <th>Age</th>
            <th>Corpus</th>
            <th>yearlySavingsIncrement in Investment</th>
            <th>returnsOnInvestment</th>
            <th>Withdrawals During the Year</th>
          </tr>
        </thead>
        <tbody>
          {simulationData.map((data) => (
            <tr key={data.age}>
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
  );
};

export default RetirementCalculator;
