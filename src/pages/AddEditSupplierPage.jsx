import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditSupplierPage = () => {
    const { supplierId } = useParams();
    const [name, setName] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 4000);
    };

    useEffect(() => {
        if (supplierId) {
            setIsEditing(true);
            const fetchSupplier = async () => {
                try {
                    const supplierData = await ApiService.getSupplierById(supplierId);
                    setName(supplierData.name);
                    setContactInfo(supplierData.contactInfo);
                    setAddress(supplierData.address);
                } catch (error) {
                    showMessage(error.response?.data.message || "Could not find supplier by ID: " + error);
                }
            };
            fetchSupplier();
        }
    }, [supplierId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const supplierData = { name, contactInfo, address };

        try {
            if (isEditing) {
                await ApiService.updateSupplier(supplierId, supplierData);
                showMessage("Supplier updated!");
            } else {
                await ApiService.addSupplier(supplierData);
                showMessage("Supplier added!");
                navigate("/supplier");
            }
            navigate("/suppliers");
        } catch (error) {
            showMessage(error.response?.data.message || "Failed to save supplier: " + error);
        }
    };

    return (
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="supplier-form-page">
                <h1>{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Supplier Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            type="text"
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Info</label>
                        <input
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            required
                            type="text"
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            type="text"
                        />
                    </div>
                    <button type="submit">{isEditing ? "Edit Supplier" : "Add Supplier"}</button>
                </form>
            </div>
        </Layout>
    );
};

export default AddEditSupplierPage;
