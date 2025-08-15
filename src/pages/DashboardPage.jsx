import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMetric, setSelectedMetric] = useState("amount");
  const [transactionData, setTransactionData] = useState([]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await ApiService.getAllTransactions();

        const transactions = responseData.transactions ?? responseData ?? [];
        const series = transformTransactionData(
          transactions,
          selectedMonth,
          selectedYear
        );
        setTransactionData(series);
      } catch (error) {
        showMessage(
          error?.response?.data?.message ||
            "Could not display dashboard: " + error
        );
        console.error(error);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const transformTransactionData = (transactions, month, year) => {
    const dailyData = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = { day, count: 0, quantity: 0, amount: 0 };
    }

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const tMonth = date.getMonth() + 1;
      const tYear = date.getFullYear();

      if (tMonth === month && tYear === year) {
        const d = date.getDate();
        dailyData[d].count += 1;
        dailyData[d].quantity += Number(transaction.totalProducts || 0);

        const priceNumber = Number(transaction.totalPrice || 0);
        dailyData[d].amount += isNaN(priceNumber) ? 0 : priceNumber;
      }
    });

    return Object.values(dailyData);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="dashboard-page">
        <div className="button-group">
          <button
            className={selectedMetric === "count" ? "active" : ""}
            onClick={() => setSelectedMetric("count")}
          >
            Total # of Transactions
          </button>
          <button
            className={selectedMetric === "quantity" ? "active" : ""}
            onClick={() => setSelectedMetric("quantity")}
          >
            Product Quantity
          </button>
          <button
            className={selectedMetric === "amount" ? "active" : ""}
            onClick={() => setSelectedMetric("amount")}
          >
            Amount
          </button>
        </div>

        <div className="dashbaord-content">
          <div className="filter-section">
            <label htmlFor="month-select">Select Month</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const monthNumber = i + 1;
                const monthName = new Date(0, i).toLocaleString("default", {
                  month: "long",
                });
                return (
                  <option key={monthNumber} value={monthNumber}>
                    {monthName}
                  </option>
                );
              })}
            </select>

            <label htmlFor="year-select">Select Year</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="chart-section">
            <div className="chart-container">
              <h2>Daily Transactions</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    label={{
                      value: "Day",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#008080"
                    fillOpacity={0.2}
                    fill="#008080"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
