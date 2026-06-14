import BookSearch from "./components/BookSearch";
import LocationLookup from "./components/LocationLookup";

const AdminHome = async () => {
  return (
    <>
      <div className="admin-section">
        <h1>Admin</h1>
        <LocationLookup />
      </div>
      <div className="admin-section">
        <BookSearch />
      </div>
    </>
  )
};

export default AdminHome;
