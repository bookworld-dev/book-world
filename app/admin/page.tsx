import BookSearch from "./components/BookSearch";
import LocationLookup from "./components/LocationLookup";

const AdminHome = async () => {
  return (
    <>
      <h1>Admin</h1>
      <hr />
      <LocationLookup />
      <hr />
      <BookSearch />
    </>
  )
};

export default AdminHome;