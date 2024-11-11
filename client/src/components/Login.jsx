import { useState } from 'react';
import { useMutation } from '@apollo/client';

//import { loginUser } from '../utils/API';
import Auth from '../utils/auth';
import { LOGIN } from '../utils/mutations';

const Login = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // GraphQL mutation for user login
  const [gqlmloginUser] = useMutation(LOGIN);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      console.log(`Attempting to login user ${userFormData.email}`);
      //Execute the LOGIN_USER mutation
      const { data } = await gqlmloginUser({
        variables: { ...userFormData },
      });

      const { token, user } = data.login;
      console.log(user);
      Auth.login(token); //Signin the user
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
      <div className="p-4 mb-4 mx-12 w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-left text-xl mt-4 ml-2 font-semibold text-gray-900 dark:text-white">
          Sign in to your account
        </h1>
        <form onSubmit={handleFormSubmit} className="mt-10 flex flex-col w-full space-y-6">
          <div className="w-full px-2">
            <label htmlFor="email" className="block mb-2 text-sm ml-1 font-medium text-gray-900 dark:text-gray-300 text-left">
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 inline-block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={userFormData.email}
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
              id="password"
              name="password"
              placeholder="Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={userFormData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="p-4">
            <button type="submit" className="text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Sign in
            </button>

          </div>
        </form>
      </div>
  );
};

export default Login
