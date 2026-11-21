
import { useState } from "react";

function Registration({ onBack }) {
    const [role, setRole] = useState("individual");
    const [fullName, setFullName] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [industry, setIndustry] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("Registering...");

        const url =
            role === "individual"
                ? "http://localhost:5000/api/auth/register/individual"
                : "http://localhost:5000/api/auth/register/organization";

        const data =
            role === "individual"
                ? { fullName, email, password }
                : { organizationName, industry, email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message);
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage("Unable to connect to the server.");
        }
    };

    return (
        <div className="registration-page">
            <h1>Create Your Account</h1>

            <div>
                <button
                    type="button"
                    onClick={() => setRole("individual")}
                >
                    Individual
                </button>

                <button
                    type="button"
                    onClick={() => setRole("organization")}
                >
                    Organization
                </button>
            </div>

            <form onSubmit={handleRegister}>
                {role === "individual" ? (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Organization Name"
                            value={organizationName}
                            onChange={(e) =>
                                setOrganizationName(e.target.value)
                            }
                            required
                        />

                        <input
                            type="text"
                            placeholder="Industry"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            required
                        />
                    </>
                )}

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password (minimum 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                />

                <button type="submit">
                    Create Account
                </button>
            </form>

            <p>{message}</p>

            <button type="button" onClick={onBack}>
                Back to Login
            </button>
        </div>
    );
}

export default Registration;
