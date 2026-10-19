import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    branch: "",
    year: "",
  });
  const [error, setError] = useState("");

  // One handler for all inputs: uses the input's "name" to update the right field
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({ ...form, year: form.year ? Number(form.year) : undefined });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-card">
      <h2>Sign up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required minLength={6} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">I am a student</option>
          <option value="senior">I am a placed senior</option>
        </select>
        <input name="branch" placeholder="Branch (e.g. CSE)" value={form.branch} onChange={handleChange} />
        <input name="year" type="number" placeholder="Year (e.g. 3)" value={form.year} onChange={handleChange} />
        <button type="submit">Create account</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}