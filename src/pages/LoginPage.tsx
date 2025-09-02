import { useFormik } from "formik";
import { LoginModel, LoginModelValidator } from "../models/LoginModel";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/auth-slice";
import { loginUser as userLoginFromLocalStorage } from "../util/auth-util";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: new LoginModel(),
    validationSchema: LoginModelValidator,
    onSubmit: (values) => {
      const [isLogin, user] = userLoginFromLocalStorage(values);
      
      if (isLogin) {
        dispatch(loginUser(user));
        if(user?.isAdmin){
          navigate("/admin");
        }else{
          navigate("/user");
        }
      } else {
        alert("Invalid username or password");
      }
    },
  });

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-2xl font-bold text-center text-gray-900 mb-8'>Login</h2>

        <div className='space-y-6'>
          <div>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
              Username
            </label>
            <input
              id='username'
              type='text'
              {...formik.getFieldProps("username")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.username && formik.errors.username
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder='Enter username'
            />
            {formik.touched.username && formik.errors.username && (
              <p className='mt-1 text-sm text-red-600'>{formik.errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <input
              id='password'
              type='password'
              {...formik.getFieldProps("password")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder='Enter password'
            />
            {formik.touched.password && formik.errors.password && (
              <p className='mt-1 text-sm text-red-600'>{formik.errors.password}</p>
            )}
          </div>

          <button
            type='submit'
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
          >
            Login
          </button>
        </div>

        <div className='mt-6 text-sm text-gray-600'>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
