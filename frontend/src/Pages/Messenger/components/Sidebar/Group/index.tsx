import React, { useEffect, useState } from "react";
import { createGroup } from "../../../../../api/group";
import { getAllUsers } from "../../../../../api/user";
import { getNameInitials } from "../../../../../utils";

const Group = ({ goBack, handleGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCreateGroup = async () => {
    if (members.length === 0 || !groupName) {
      alert("Group name and members are both required");
      return;
    }
    try {
      const response = await createGroup(members, groupName);
      alert(`Group created: ${response.group.name}`);
      handleGroupCreated(response.group);
      goBack();
    } catch (error) {
      alert("Error creating group");
    }
  };

  const User = ({ id, name }) => {
    return (
      <div
        className="flex gap-2 items-center border-[1px] cursor-pointer p-2 rounded-md mb-2 hover:bg-slate-50"
        style={{ borderColor: members.includes(id) ? "green" : "auto" }}
        onClick={() => {
          const temp = [...members];
          if (temp.includes(id)) {
            const index = temp.indexOf(id);
            temp.splice(index, 1);
          } else temp.push(id);

          setMembers(temp);
        }}
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

  return (
    <div className="px-2">
      <h1 className="text-xl text-black font-semibold mt-2 mb-4">
        Add a new group
      </h1>
      <input
        placeholder="Enter group name"
        style={{
          fontSize: "16px",
          padding: "8px 8px",
          border: "1px solid gainsboro",
          borderRadius: "6px",
          outline: "none",
          width: "100%",
          marginBottom: "12px",
        }}
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div>
        <h1 className="mb-2">Choose group members</h1>
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

      <button className="title-bar-btn w-full" onClick={handleCreateGroup}>
        Create group
      </button>
    </div>
  );
};

export default Group;
