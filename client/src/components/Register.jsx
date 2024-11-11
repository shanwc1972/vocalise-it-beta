import { useState } from 'react'
import { CREATE_USER } from '../utils/mutations'
import { useMutation } from '@apollo/client'
import Auth from '../utils/auth'

const Register = ( ) => {
  const [registerFormData, setRegisterFormData] = useState({ email: '', password: '', username: '' });

  const [createUser] = useMutation(CREATE_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterFormData({ ...registerFormData, [name]: value });
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(registerFormData);
    try {
      // Execute the CREATE_USER mutation and pass in variable data from the form
      const { data } = await createUser({
      variables: { ...registerFormData },
      });

      if (!data) {
      throw new Error('something went wrong!');
      }
      console.log(data);

      const { token } = data.createUser;
      Auth.login(token);
    } catch (err) {
      console.error(err);
    }

    setRegisterFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
      <div className="p-4 mx-12 mb-4 w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-left text-xl mt-4 ml-2 font-semibold text-gray-900 dark:text-white">
          Register for an account
        </h1>
        <form onSubmit={handleFormSubmit} className="mt-10 flex flex-col w-full space-y-6">
        <div className="w-full px-2">
            <label htmlFor="email" className="block mb-2 text-sm ml-1 font-medium text-gray-900 dark:text-gray-300 text-left">
              Username
            </label>
            <input
              type="username"
              id="username-register"
              name="username"
              placeholder="Username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 inline-block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={registerFormData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full px-2">
            <label htmlFor="email" className="block mb-2 text-sm ml-1 font-medium text-gray-900 dark:text-gray-300 text-left">
              Your email
            </label>
            <input
              type="email"
              id="email-register"
              name="email"
              placeholder="Email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 inline-block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={registerFormData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full px-2">
            <label htmlFor="password" className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300 text-left">
              Password
            </label>
            <input
              type="password"
              id="password-register"
              name="password"
              placeholder="Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={registerFormData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-4">

          <button type="submit" className="text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Register
          </button>
          </div>
        </form>
      </div>
  )
}

export default Register
