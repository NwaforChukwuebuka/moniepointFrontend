import React, { memo, useState } from 'react'
import { useLoginMutation } from '../apis/fakeStoreApi';
import styles from "./login.module.css"
import { useNavigate } from 'react-router';


const Login = () => {
const userDetails = {
    username: "",
    password: ""
}

const [userProfile, setUserProfile] = useState(userDetails);
const [login, {isLoading,isError}] = useLoginMutation();
const [errorMessage, setErrorMessage] = useState("");

const navigate = useNavigate()

function handleChange(e) {
    const { name, value } = e.target;
    setUserProfile((prev)=>({...prev,[name]: value}))
}

async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
        const response = await login(userProfile).unwrap();
        localStorage.setItem("token", response.token);
        navigate("/products");
    } catch (error) {
        if (error?.originalStatus === 401 || error?.status === 401) {
            setErrorMessage("Incorrect username or password. Please try again.");
        } else {
            setErrorMessage("Something went wrong. Please try again later.");
        }
    }
}
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-12 w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-10">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
          <div>
            <label htmlFor="username" className="block text-blue-600 font-semibold mb-2 text-sm tracking-wide">
              Username
            </label>
            <input
              name="username"
              onChange={handleChange}
              type="text"
              id="username"
              placeholder="Omo, put your username"
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-blue-600 font-semibold mb-2 text-sm tracking-wide">
              Password
            </label>
            <input
              name="password"
              onChange={handleChange}
              type="password"
              id="password"
              placeholder="Omo, put your password"
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mt-2 transition-colors duration-200 disabled:opacity-60"
          >
            {isLoading ? "Loading ..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}




export default memo(Login)
