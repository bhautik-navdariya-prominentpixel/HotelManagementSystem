import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../store/auth-slice";
import { NavLink, useNavigate } from "react-router-dom";
import type { StoreType } from "../store";

const Header = (props: { type: "ADMIN" | "WAITER" }) => {
  const user = useSelector((store: StoreType) => store.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logOutUser());
    navigate("/");
  }
  return (
    <>
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='text-xl font-semibold text-gray-900'>
              {props.type === "ADMIN" ? "Admin" : "Waiter"} Dashboard
            </h1>
            {props.type === "WAITER" && (
              <div>
                <NavLink
                  to={"/user"}
                  className='mx-2'
                  style={({ isActive }) => (isActive ? { textDecoration: "underline" } : undefined)}
                  end
                >
                  Home
                </NavLink>
                <NavLink
                  to={"/user/log"}
                  className='mx-2'
                  style={({ isActive }) => (isActive ? { textDecoration: "underline" } : undefined)}
                  end
                >
                  Logs
                </NavLink>
              </div>
            )}
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>Welcome, {user.fullname}</span>
              <button
                onClick={handleLogout}
                className='bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
