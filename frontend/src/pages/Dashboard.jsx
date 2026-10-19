import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h2>Welcome, {user.name}</h2>
      <p>
        You are logged in as a <strong>{user.role}</strong>.
      </p>
    </div>
  );
}