import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Wait 400ms after the user stops typing, then fetch
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/companies", { params: { search } });
        setCompanies(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load companies");
      } finally {
        setLoading(false);
      }
    }, 400);

    // Cleanup: cancel the previous timer if search changes again
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="page">
      <h2>Companies</h2>

      <input
        className="search-input"
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && companies.length === 0 && <p>No companies found.</p>}

      <div className="card-grid">
        {companies.map((c) => (
          <Link to={`/companies/${c._id}`} key={c._id} className="card">
            <h3>{c.name}</h3>
            <p>{c.roles?.join(", ")}</p>
            {c.package?.min && (
              <p>
                {c.package.min} - {c.package.max} LPA
              </p>
            )}
            {c.eligibility?.minCGPA && <p>Min CGPA: {c.eligibility.minCGPA}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}