import { Form, NavLink, useActionData, useLoaderData } from "@remix-run/react";
import loginback from "../../public/login2.jpg";
import { useNavigation } from "@remix-run/react";
import logo from "../../public/subhobibaho.png";
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

const RegisterForm = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const userData: any = useActionData();


  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    firstname: '',
    midname: '',
    lastname: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'firstname':
      case 'lastname':
        if (!value.trim()) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else if (!/^[A-Za-z]+$/.test(value)) {
          error = 'Only letters are allowed';
        }
        break;

      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Invalid email format';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'gender':
        if (!value) {
          error = 'Please select a gender';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateForm(name, value);
  };

  return (
    <div className="min-h-screen w-full relative">
      <img
        src={loginback}
        className="w-full h-screen object-cover fixed top-0 left-0"
        alt="login_background_img"
      />

      <div className="absolute top-0 right-0 h-screen flex items-center justify-end px-6">
        <Form
          method="post"
          id="register-form"
          className="bg-white p-4 rounded-2xl shadow-xl w-96 my-4  mr-4"
        >
          <div className="flex flex-col items-center gap-y-2">
            <NavLink to={'/'} >
            <img
              src={logo}
              alt="Subhobibaho"
              className="w-16 h-16 object-contain"
            />
          </NavLink>

          <h2 className="text-xl text-[#FF477E] font-semibold text-center mb-2">
            Register Here!
          </h2>

          <div className="w-full space-y-2">
            <div>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg text-[#FF477E] focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                placeholder="First Name *"
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
              )}
            </div>

            <input
              type="text"
              name="midname"
              value={formData.midname}
              onChange={handleInputChange}
              className="border p-2 w-full rounded-lg text-[#FF477E] focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              placeholder="Middle Name (Optional)"
            />

            <div>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg text-[#FF477E] focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                placeholder="Last Name *"
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
              )}
            </div>

            <div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg text-[#FF477E] focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              >
                <option value="">Select Gender *</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg text-[#FF477E] focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                placeholder="Email *"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg text-[#FF477E] focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                placeholder="Password *"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg text-[#FF477E] focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                placeholder="Confirm Password *"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {userData?.status === 'success' && (
            <p className="text-[#FF477E] text-sm">{userData?.message}</p>
          )}
          {userData?.status === 'error' && (
            <p className="text-[#FF477E] text-sm">{userData?.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || Object.values(errors).some(error => error !== '')}
            className="p-2 bg-[#FF477E] text-white rounded-lg w-full hover:bg-pink-400 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors text-sm mt-2"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>

          <p className="text-sm text-center">
            Already have an Account?{' '}
            <NavLink to="/login" className="text-[#FF477E] hover:underline">
              Sign in here
            </NavLink>
          </p>
      </div>
    </Form>
      </div >
    </div >
  );
};

export default RegisterForm;