import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connectSocket } from "../socket";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 👇 Backend must return user data in this response
      // API থেকে POST রিকোয়েস্ট করা হচ্ছে 'register' রুটে, formData পাঠানো হচ্ছে 
const response = await API.post("register", formData);

// এখানে 'response' এর structure দেখে 'data' দুইবার আসছে। 
// প্রথম 'data' হল axios এর default response structure 
// এবং দ্বিতীয় 'data' হল backend থেকে আসা আসল user data।

// 'response.data.data' হল backend এর response এর ভিতরের 'user' object।
const userId = response.data.data._id; // 👈 এখানে '_id' বের করছি

// এখানে আমরা userId দিয়ে socket-এ কানেক্ট করছি, যাতে real-time chat ফিচার চালু করতে পারি
connectSocket(userId);


      toast.success("🎉 Registration Successful!", { autoClose: 2000 });
      setTimeout(() => navigate("/home"), 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <InputField
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            text={loading ? "Registering..." : "Register"}
            onClick={handleSubmit}
            disabled={loading}
          />

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
