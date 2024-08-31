import { useEffect, useState } from "react";
import UsersList from "../components/usersList/UsersList";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    //ne pas faire de fonction asynchrone dans useEffect qui retourne une promise, useEffect n'aime pas ca..
    const fetchUsers = async () => {
      try {
        console.log("users");
        const response = await sendRequest("http://localhost:5000/api/users");
        console.log(response);
        setLoadedUsers(response.utilisateurs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <UsersList items={loadedUsers} />
    </>
  );
};

export default Users;
