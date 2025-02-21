import { setUser } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
// import { setUser, logout } from "../store/userSlice";
import { toast } from "sonner";

function Temp() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleLogin = () => {
    const userData = { id: 1, name: "Vasu", email: "vasukamani.ce@gmail.com" };
    dispatch(setUser(userData));
    toast.success(`Welcome, ${userData.name}!`);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.error("You have logged out.");
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}

export default Temp;
