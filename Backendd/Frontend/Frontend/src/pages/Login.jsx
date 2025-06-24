import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { connectSocket } from "../socket";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ 1. Login - server sets cookies, and returns user info
      const response = await API.post("login", formData);

      // ✅ 2. Extract userId directly from login response
      const userId = response.data?.data?._id;
      if (!userId) throw new Error("User ID not found in response");

      // ✅ 3. Connect to socket with userId
      connectSocket(userId);

      toast.success("🎉 Login Successful!", { autoClose: 1500 });

      // ✅ 4. Navigate after short delay
      setTimeout(() => navigate("/allusers"), 1800);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:8000/api/v1/auth/google", "_self");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email or Username"
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Enter Email or Username"
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button text={loading ? "Logging in..." : "Login"} disabled={loading} />
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-sky-900 text-white py-2 rounded-lg hover:bg-sky-400 transition"
        >
          🔵 Login with Google
        </button>

        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
