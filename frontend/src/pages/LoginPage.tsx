import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../store/authSlice';
import { AppDispatch, RootState } from '../store';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
