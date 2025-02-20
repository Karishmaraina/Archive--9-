import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../../../api/user";
import { getNameInitials } from "../../../../../utils";

const AllUsers = ({ selectConvo }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(
          data.filter((user) => user._id !== localStorage.getItem("user"))
        );
      } catch (error) {
        console.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const User = ({ id, name }) => {
    return (
      <div
        className="flex gap-2 items-center border-[1px] cursor-pointer p-2 rounded-md mb-2 hover:bg-slate-50"
        onClick={() =>
          selectConvo({
            isGroup: false,
            id,
            title: name,
            members: [],
          })
        }
      >
        <div className="flex justify-center items-center bg-[#eeeeee] w-[40px] h-[40px] rounded-full relative">
          {getNameInitials(name)}
        </div>
        <div>
          <h1 className="text-lg">{name}</h1>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2">
      <h1 className="text-xl text-black font-semibold mt-2 mb-4">
        Start a new chat
      </h1>
      <div>
        {loading && <p className="text-center my-6">Loading users...</p>}
        {!loading && (
          <>
            {users.length === 0 ? (
              <p className="text-center my-6">No other users found...</p>
            ) : (
              users.map((user) => <User id={user._id} name={user.name} />)
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
