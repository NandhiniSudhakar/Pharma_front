import React from 'react'
import { MdEdit } from "react-icons/md";
import { FcPlus } from "react-icons/fc";
import { useState, useEffect } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { getCategory } from '../../Api/apiservices';
import { createCategory } from '../../Api/apiservices';
import { updateCategory } from '../../Api/apiservices';
import { deleteCategory } from '../../Api/apiservices';
import * as XLSX from "xlsx";
import PaginationComponent from '../../Components/PaginationComponent';
import { FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
// import { Tooltip } from "@/components/ui/tooltip";

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [showEditModal, setShowEditModal] = useState(false); // For modal visibility
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [limit,setLimit] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState([]);  
    
        
    useEffect(() => {
        const fetchCategories =async () => {
          try {
            const staticCategories = await getCategory(currentPage, limit);
            setLimit(staticCategories.limit);
            setTotalPages(staticCategories.totalPages);
            setCurrentPage(staticCategories.page)
            setCategories(staticCategories.data);
            console.log("Fetched categories",staticCategories);

          } catch (error) {
            console.error("Error setting static categories:", error.message || error);
          }
        };
        fetchCategories();
      }, [currentPage]);
      
      const toggleFormVisibility = () => {
        console.log("Form visibility before toggle:", isFormVisible);
        setIsFormVisible(!isFormVisible);
      };      
          const handleSubmit = async (e) => {
            try {
              const newCategory = {
                category_name: categoryName,
                description:description, // Include description if needed
              };
              const response = await createCategory(newCategory); // API call
              setCategories((prev) => [...prev, response]); // Update UI with API response
              setCategoryName("");
              setDescription("");
              setShowCreateForm(false); // Close form
              toast.success("Category created successfully:", response);
              window.location.reload();
            } catch (error) {
              console.error("Error creating category:", error);
              toast.error("Error Creating Category : ",error)
            }
          };

          const handleEditSubmit = async (e) => {
            // e.preventDefault();
            try {
              const updatedData = { 
                category_name: categoryName, // Ensure correct key
                description 
              };
              console.log("Final Data Sent to API:", updatedData); // Debugging
              await updateCategory(selectedCategory.id, updatedData);
              // alert("Category updated successfully!");
              toast.success("Category Updated Sucessfully !");
              setShowEditModal(false);
              window.location.reload();
            } catch (error) {
              console.error("Error updating category:", error);
              alert("Failed to update category!");
              toast.error("Failed to Update Category !");
            }
          };

           const [query, setQuery] = useState("");
              const handleSearch = () => {
                if (query.trim() !== "") {
                  onSearch(query);
                }
              };
          const handleDelete = async (categoryId) => {
            console.log("FUN",categoryId)
            try {
              await deleteCategory(categoryId);
              alert("Category deleted successfully!"); // Replace with modal if needed
              // Optionally, refresh category list
              toast.success("Category Deleted Sucessfully!");
              setCategories(categories.filter(category => category.id !== categoryId));
              window.location.reload();
            } catch (error) {
              // console.error("Error deleting category:", error);
              // alert("Failed to delete category!");
              toast.error("Error : ",error);
            }
          };   
          const handleOpenEditModal = (category) => {
            if (!category) return;
            console.log("Category Data in Modal:", category); // Debugging
            setCategoryName(category.category_name || ""); // Ensure correct key
            setDescription(category.description || "");
            setSelectedCategory(category);
            setShowEditModal(true);
          };
          
          useEffect(() => {
            if (showEditModal && selectedCategory) {
              setCategoryName(selectedCategory.category_name);
              setDescription(selectedCategory.description);
            }
          }, [showEditModal, selectedCategory]);

  return (
<div className="m-2">
  <div className="flex justify-between items-center w-[96%]">
    <h1 className="text-xl font-bold ml-2">Category Details</h1>
      <div className="flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="CategoryName or ProductName"
                    className="px-1 py-1 w-64 focus:outline-none rounded-l"
                  />

                  <button
                    onClick={handleSearch}
                    className="bg-[#028090] hover:bg-[#027483] text-white px-2 py-2 flex rounded-r"
                  >
                    <FaSearch />
                  </button>
                  </div>
                  {/* <Tooltip content="Add Category"> */}

    <div className='relative'>
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="flex items-end text-xl text-white border-black rounded-lg px-2 py-1 gap-1 bg-[#019493]"
      >
        <FcPlus size={28} title="Add New Category"/>
      </button>
      {/* <span className="absolute bottom-full mb-1 hidden group-hover:block text-sm bg-gray-800 text-white py-1 px-2 rounded shadow-lg">
          Add Customer
        </span> */}
        </div>
      {/* </Tooltip> */}

  </div>

  <table className="table-fixed w-[96%] bg-white  justify-center rounded-lg shadow-md text-left mb-1 mt-1 ">
  <thead className="bg-[#027483] text-white">
    <tr className=''>
      <th className="py-2 px-4 w-14">S.No</th>
      <th className="py-2 px-4 truncate">Category Name</th>
      <th className="py-2 px-4 truncate ">Description</th>
      <th className="py-2 px-28">Actions</th>
    </tr>
  </thead>
  <tbody>
    {categories && categories.map((category, index) => (
      <tr
        key={category.id}
        className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
      >
        <td className="py-2 px-4">{index + 1}</td>
        <td className="py-2 px-4 overflow-hidden truncate">{category.category_name}</td>
        <td className="py-2 px-4 overflow-hidden truncate">{category.description}</td>
        <td className="py-2 px-28 flex gap-4">
          <button
            className="text-cyan-700"
            onClick={() => handleOpenEditModal(category)} >
            <MdEdit size={20} />
          </button>
          <button
            className="text-cyan-700 ml-2"
            onClick={() => handleDelete(category.id)}
          >
            <MdDeleteForever size={20} />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    {showEditModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-lg w-1/2 h-68">
      <h2 className="text-xl font-bold">Edit Category</h2>
      <form onSubmit= {handleEditSubmit}>
      <label
            className="block text-gray-700 text-sm font-bold "
            htmlFor="description"
          >
            Category Name
          </label>
        {/* <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
        /> */}
        <input
  type="text"
  value={categoryName}
  onChange={(e) => {
    const value = e.target.value;
    if (/^(?!\d+$)[a-zA-Z0-9]*$/.test(value)) {
      setCategoryName(value);
    }
  }}
  className="mt-2 p-2 border rounded w-full"
/>

           <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <input
            type="text"
            id="descripton"
            value={description}
            // onChange={(e) => setDescription(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              if (/^(?!\d+$)[a-zA-Z0-9]*$/.test(value)) {
                setDescription(value);
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() =>setShowEditModal(false)}
            className="bg-gray-400 text-white  mt-4  px-4 py-2 rounded"
          >
            Cancel
          </button>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        </div>
      </form>
    </div>
  </div>
)}
    {showCreateForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-1/2 shadow-lg">
      <h1 className="text-center text-2xl mb-2 bg-[#019493] text-white rounded-lg p-2">
        Create Category
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="category_name"
            value={categoryName}
            // onChange={(e) => setCategoryName(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              // Ensure at least one alphabet is present while allowing numbers and spaces
              if (/^(?=.*[A-Za-z])[A-Za-z0-9\s]*$/.test(value)) {
                setCategoryName(value);
              }
            }}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            required
          /> </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => {
              const value = e.target.value;
              if (/^(?=.*[A-Za-z])[A-Za-z0-9\s]*$/.test(value)) {

              // if (/^(?!\d+$)[a-zA-Z0-9]*$/.test(value)) {
                setDescription(value);
              }
            }}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowCreateForm(false)}
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}
<PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} />

  </div>
    )
}

export default AdminCategory
  {/* <div className="lg:flex lg:flex-row sm:flex-col w-full"> */}
