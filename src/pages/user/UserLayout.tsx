import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { StoreType } from "../../store";

const UserLayout = () => {
  const user = useSelector((store: StoreType) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.login || user.user.isAdmin) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <div className='min-h-screen bg-gray-50'>
        <Header type='WAITER' />
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
