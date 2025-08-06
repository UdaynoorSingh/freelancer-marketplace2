import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getService, updateService } from "../services/serviceApi";

const formStyle = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  padding: "2rem",
  maxWidth: 500,
  margin: "2rem auto",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};
const labelStyle = { fontWeight: 600, color: "#222" };
const inputStyle = {
  padding: "0.7rem",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "1rem",
};
const btnStyle = {
  background: "#1dbf73",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "0.8rem",
  fontWeight: 700,
  fontSize: "1.1rem",
  cursor: "pointer",
  marginTop: "1rem",
};

const categories = [
  "Trending",
  "Graphics & Design",
  "Programming & Tech",
  "Digital Marketing",
  "Video & Animation",
  "Writing & Translation",
  "Music & Audio",
  "Business",
];

const EditGig = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    price: "",
    category: categories[0],
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getService(id).then((data) => {
      if (data && data._id) {
        setForm({
          title: data.title,
          description: data.description,
          tags: data.tags ? data.tags.join(", ") : "",
          price: data.price,
          category: data.category,
          images: [],
        });
        setExistingImages(data.images || []);
      } else {
        setError(data.message || "Gig not found.");
      }
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm({ ...form, images: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("tags", form.tags);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("seller", user?.id);
    form.images.forEach((img) => formData.append("images", img));
    try {
      const res = await updateService(id, formData, token);
      if (res && res._id) {
        setSuccess("Gig updated successfully!");
        setExistingImages(res.images || []);
        setForm((f) => ({ ...f, images: [] }));
      } else {
        setError(res.message || "Failed to update gig.");
      }
    } catch (err) {
      setError("Failed to update gig.");
    }
    setLoading(false);
  };

  return (
    <form
      style={formStyle}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 style={{ color: "#1dbf73", fontWeight: 700, textAlign: "center" }}>
        Edit Gig
      </h2>
      {error && <div style={{ color: "red", fontWeight: 500 }}>{error}</div>}
      {success && (
        <div style={{ color: "#1dbf73", fontWeight: 500 }}>{success}</div>
      )}
      <label style={labelStyle}>Title</label>
      <input
        style={inputStyle}
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <label style={labelStyle}>Description</label>
      <textarea
        style={{ ...inputStyle, minHeight: 80 }}
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <label style={labelStyle}>Tags (comma separated)</label>
      <input
        style={inputStyle}
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="e.g. website, react, node"
      />
      <label style={labelStyle}>Price (INR)</label>
      <input
        style={inputStyle}
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        required
        min={1}
      />
      <label style={labelStyle}>Category</label>
      <select
        style={inputStyle}
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <label style={labelStyle}>Current Images</label>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        {existingImages.length === 0 && (
          <span style={{ color: "#888" }}>No images</span>
        )}
        {existingImages.map((img) => (
          <img
            key={img}
            src={`${process.env.REACT_APP_SERVER_URL}/uploads/${img}`}
            alt="gig"
            style={{
              width: 60,
              height: 40,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        ))}
      </div>
      <label style={labelStyle}>Replace Images (up to 5)</label>
      <input
        style={inputStyle}
        name="images"
        type="file"
        accept="image/*"
        onChange={handleChange}
        multiple
      />
      <button style={btnStyle} type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Gig"}
      </button>
    </form>
  );
};

export default EditGig;
