import React, { useState, useEffect, useMemo } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const itemsPerPage = 10;

const TransactionsPage = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const showMessage = (msg) => {
    setMessage(msg);
    const timer = setTimeout(() => setMessage(""), 4000);
    // cleanup if component unmounts before timeout
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getAllTransactions(valueToSearch);
        if (!ignore) {
          setAllTransactions(Array.isArray(data.transactions) ? data.transactions : []);
          // reset to first page when the search term changes
          setCurrentPage(1);
        }
      } catch (error) {
        if (!ignore) {
          showMessage(
            error.response?.data?.message ||
              "Could not retrieve transactions: " + error
          );
          setAllTransactions([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [valueToSearch]);

  const totalPages = useMemo(
    () => Math.ceil(allTransactions.length / itemsPerPage),
    [allTransactions.length]
  );

  const pagedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return allTransactions.slice(start, start + itemsPerPage);
  }, [allTransactions, currentPage]);

  const handleSearch = () => {
    // Force a search even if the term didn't change by updating valueToSearch
    setValueToSearch(filter.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="transactions-page">
        <div className="transactions-header">
          <h1>Transactions</h1>
          <div className="transaction-search">
            <input
              placeholder="Search transactions..."
              value={filter}
              type="text"
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Empty / loading states */}
        {loading && <div className="info">Loading transactions…</div>}

        {!loading && allTransactions.length === 0 && (
          <div className="empty-state">
            <p>No transactions found.</p>
            <button onClick={() => { setFilter(""); setValueToSearch(""); }}>
              Clear search
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && allTransactions.length > 0 && (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
                <th># of Products</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.transactionType ?? t.type}</td>
                  <td>{t.status ?? "-"}</td>
                  <td>{t.totalPrice != null ? Number(t.totalPrice).toFixed(2) : "-"}</td>
                  <td>{t.totalProducts ?? t.quantity ?? "-"}</td>
                  <td>
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}
                  </td>
                  <td>
                    <button onClick={() => navigateToTransactionDetailsPage(t.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Only show pagination when there is more than one page */}
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </Layout>
  );
};

export default TransactionsPage;
