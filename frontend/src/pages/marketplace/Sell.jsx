import { useState } from "react";
import { Link } from "react-router-dom";
import "./sell.scss";

const Sell = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    seller: "",
    contact: "",
    age: "",
    features: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Item submitted! (You can now connect this to backend)");
    console.log(form);
  };

  return (
    <div className="sell-form">
      <Link to="/marketplace" className="back-button">
        ← Back to Marketplace
      </Link>
      <h2>Sell Your Item</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Product Name" onChange={handleChange} />
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="seller" placeholder="Your Name" onChange={handleChange} />
        <input name="contact" placeholder="Contact Details" onChange={handleChange} />
        <input name="age" placeholder="Product Age" onChange={handleChange} />
        <textarea name="features" placeholder="Product Features (comma separated)" onChange={handleChange} />
        {/* Upload Photo Field */}
  <label htmlFor="imageUpload" style={{ marginTop: "10px" }}>
    Upload Product Photo:
  </label>
  <input
    type="file"
    id="imageUpload"
    name="photo"
    accept="image/*"
    onChange={handleChange}
  />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Sell;
