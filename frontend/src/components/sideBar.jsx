import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ setChatUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-1/3 p-4 bg-gray-100 border-r">
      <h2 className="text-lg font-semibold mb-4">Team Members</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 border-b cursor-pointer hover:bg-gray-200"
            onClick={() => setChatUser(user)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
