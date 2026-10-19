import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Run both requests at the same time instead of one after another
        const [companyRes, expRes] = await Promise.all([
          api.get(`/companies/${id}`),
          api.get("/experiences", { params: { company: id } }),
        ]);
        setCompany(companyRes.data);
        setExperiences(expRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this company");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page error">{error}</div>;
  if (!company) return null;

  return (
    <div className="page">
      <Link to="/companies">&larr; Back to companies</Link>
      <h2>{company.name}</h2>
      {company.about && <p>{company.about}</p>}

      <div className="info-grid">
        <div className="info-box">
          <h4>Roles</h4>
          <p>{company.roles?.join(", ") || "Not added yet"}</p>
        </div>
        <div className="info-box">
          <h4>Package</h4>
          <p>
            {company.package?.min
              ? `${company.package.min} - ${company.package.max} LPA`
              : "Not added yet"}
          </p>
        </div>
        <div className="info-box">
          <h4>Eligibility</h4>
          <p>Min CGPA: {company.eligibility?.minCGPA ?? "N/A"}</p>
          <p>Max backlogs: {company.eligibility?.maxBacklogs ?? "N/A"}</p>
          <p>Branches: {company.eligibility?.branches?.join(", ") || "All"}</p>
        </div>
      </div>

      <h3>Hiring rounds</h3>
      {company.rounds?.length > 0 ? (
        <ol>
          {company.rounds.map((r, index) => (
            <li key={index}>
              <strong>{r.name}</strong>
              {r.description && <span> - {r.description}</span>}
            </li>
          ))}
        </ol>
      ) : (
        <p>No rounds added yet.</p>
      )}

      <h3>What to prepare</h3>
      <div className="chips">
        {company.prepTopics?.map((topic) => (
          <span className="chip" key={topic}>
            {topic}
          </span>
        ))}
      </div>

      <h3>Past visits</h3>
      {company.visits?.length > 0 ? (
        <ul>
          {company.visits.map((v) => (
            <li key={v.year}>
              {v.year}: {v.selectedCount} students selected
            </li>
          ))}
        </ul>
      ) : (
        <p>No visit history yet.</p>
      )}

      <h3>Senior experiences ({experiences.length})</h3>
      {experiences.length === 0 && <p>No experiences shared yet.</p>}
      {experiences.map((exp) => (
        <div className="experience" key={exp._id}>
          <div className="exp-header">
            <strong>
              {exp.role} ({exp.year})
            </strong>
            <span className={`badge ${exp.result}`}>{exp.result}</span>
            <span className="badge">{exp.difficulty}</span>
          </div>
          <p className="muted">Shared by {exp.user?.name}</p>

          {exp.rounds?.map((r, index) => (
            <p key={index}>
              <strong>{r.name}:</strong> {r.details}
            </p>
          ))}

          {exp.questions?.length > 0 && (
            <>
              <h5>Questions asked</h5>
              <ul>
                {exp.questions.map((q, index) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
            </>
          )}

          {exp.tips && (
            <p>
              <strong>Tip:</strong> {exp.tips}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}