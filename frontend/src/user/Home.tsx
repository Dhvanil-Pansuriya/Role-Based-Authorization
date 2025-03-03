import React from "react";
import Navbar from "../components/Navbar";
// import { useSelector } from "react-redux";
// import { RootState } from "../app/store";

const Home: React.FC = () => {
  // const user = useSelector((state: RootState) => state.user.userData);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold text-center">Home</h1>
        <p className="text-center mt-5">
          Welcome to the home page. This is a protected route.
        </p>
        {/* {user?.name}
        <br />
        {user?.email}
        <br />
        {user?.role ? "Admin" : " User"}
        <br />
        {user?.role}
        <br />
        {user?.gender} */}
      </div>
    </div>
  );
};

export default Home;
