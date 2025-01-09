import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    phoneNo: "",
    location: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/emp/get");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async () => {
    if (editId) {
      // Update employee
      try {
        await axios.put(`http://localhost:8081/api/emp/update/${editId}`, form);
        setEditId(null);
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    } else {
      // Create employee
      try {
        await axios.post("http://localhost:8081/api/emp/create", form);
      } catch (error) {
        console.error("Error creating employee:", error);
      }
    }
    setForm({ employeeId: "", name: "", phoneNo: "", location: "" });
    fetchEmployees();
  };

  const handleEdit = (employee) => {
    setEditId(employee.id);
    setForm({
      employeeId: employee.employeeId,
      name: employee.name,
      phoneNo: employee.phoneNo,
      location: employee.location,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/emp/delete/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Details</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateOrUpdate();
        }}
      >
        <div>
          <input
            type="number"
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="phoneNo"
            placeholder="Phone Number"
            value={form.phoneNo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{editId ? "Update" : "Create"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ employeeId: "", name: "", phoneNo: "", location: "" });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h2>Employee List</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Phone No</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.employeeId}</td>
              <td>{employee.name}</td>
              <td>{employee.phoneNo}</td>
              <td>{employee.location}</td>
              <td>
                <button onClick={() => handleEdit(employee)}>Edit</button>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

