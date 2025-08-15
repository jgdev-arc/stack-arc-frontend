import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getTransactionById(transactionId);
        const tx = data.transaction ?? data;
        setTransaction(tx);
        setStatus(tx?.status ?? "");
      } catch (err) {
        showMessage(err?.response?.data?.message || "Could not load transaction details.");
      } finally {
        setLoading(false);
      }
    };
    if (transactionId) load();
  }, [transactionId]);

  const handleSaveStatus = async () => {
    if (!transaction) return;
    try {
      setSaving(true);
      const body = { ...transaction, status };
      const res = await ApiService.updateTransactionStatus(transactionId, body);
      showMessage(res.message || "Status updated");
      setTransaction((prev) => ({ ...(prev || {}), status }));
    } catch (err) {
      showMessage(err?.response?.data?.message || "Failed to update transaction status.");
    } finally {
      setSaving(false);
    }
  };

  const formatDateTime = (v) => (v ? new Date(v).toLocaleString() : "-");
  const formatMoney = (v) => (v != null ? Number(v).toFixed(2) : "-");

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="transaction-details-page">
        <div className="transactions-header" style={{ marginBottom: 10 }}>
          <button onClick={() => navigate(-1)}>&larr; Back</button>
          <h1 style={{ color: "#008080" }}>Transaction Details</h1>
        </div>

        {loading && <div className="loading">Loading…</div>}
        {!loading && !transaction && <div className="error-message">Transaction not found.</div>}

        {!loading && transaction && (
          <>
            {/* Transaction Information */}
            <section className="section-card">
              <h2>Transaction Information</h2>
              <p><strong>ID:</strong> {transaction.id}</p>
              <p><strong>Type:</strong> {transaction.type ?? transaction.transactionType}</p>
              <p><strong>Total Products:</strong> {transaction.totalProducts ?? "-"}</p>
              <p><strong>Total Price:</strong> ${formatMoney(transaction.totalPrice)}</p>
              <p><strong>Description:</strong> {transaction.description || "-"}</p>
              <p><strong>Created:</strong> {formatDateTime(transaction.createdAt)}</p>
              <p><strong>Updated:</strong> {formatDateTime(transaction.updatedAt)}</p>
            </section>

            {/* Product Information */}
            <section className="section-card">
              <h2>Product Information</h2>
              <p><strong>Product ID:</strong> {transaction.productId ?? transaction.product ?? "-"}</p>
              <p><strong>Supplier ID:</strong> {transaction.supplierId ?? transaction.supplier ?? "-"}</p>
            </section>

            {/* User Information */}
            <section className="section-card">
              <h2>User Information</h2>
              <p><strong>User ID:</strong> {transaction.userId ?? transaction.user ?? "-"}</p>
            </section>

            {/* Status Footer */}
            <section className="section-card transaction-status-update">
              <label htmlFor="statusSelect"><strong>Status:</strong></label>
              <select
                id="statusSelect"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select status…</option>
                <option value="PENDING">PENDING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="FAILED">FAILED</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>

              <button onClick={handleSaveStatus} disabled={saving || !status}>
                {saving ? "Updating…" : "Update Status"}
              </button>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;
