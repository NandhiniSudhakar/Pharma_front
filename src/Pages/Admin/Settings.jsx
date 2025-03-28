import React, { useState , useEffect } from 'react';
import { getpharmacydetails } from '../../Api/apiservices';
import { updatePharmacyDetails } from '../../Api/apiservices';
import { AiOutlineMail, AiOutlinePhone, AiOutlineQuestionCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";




const Settings = () => {
  const[ details , setDetails] = useState([]);
  const[loading , setLoading] = useState();
  const[error , setError] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlepasswordSubmit = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    handleChangePassword(details.shop_id, passwords.newPassword);
    setShowPasswordModal(false);
    setPasswords({ newPassword: "", confirmPassword: "" });
  };
  const handleChangePassword = (shopId, newPassword) => {
    // call API or handle password change logic here
  };



   useEffect(() => {
      const pharmacyDetails = async () => {
        try {
          const response = await getpharmacydetails();
          setDetails(response.shops[0]);
          console.log("Fuction list",response)
        } catch (err) {
          setError("Failed to PharmacyDetails");
        } finally {
          setLoading(false);
        }
      };
      pharmacyDetails();
    }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!details.shop_id) {
        alert("Error: Pharmacy ID is missing.");
        return;
      }
      const updatedData = {
        pharmacy_name: details.pharmacy_name,
        owner_GST_number: details.owner_GST_number,
        pharmacy_address: details.pharmacy_address,
        pincode: details.pincode,
        isGovtRegistered: details.isGovtRegistered
      };
      console.log("asdsdads",details.shop_id)
      console.log("updated",updatedData)
      await updatePharmacyDetails(details.shop_id, updatedData);
      toast.success('Pharmacy details updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update pharmacy details. Please try again.');
    }
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  // Handle delete
  // const handleDelete = () => {
  //   if (window.confirm("Are you sure you want to delete this pharmacy details?")) {
  //     alert("Pharmacy details deleted");
      
  //   }
  // };
  const handleEdit = () => {
    if (Object.keys(details).length === 0) {
      alert("No details available to edit.");
      return;
    }
    setIsEditing(true);
  };

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const handleGstChange = (e) => {
  const value = e.target.value.toUpperCase();
  if (value === "" || gstRegex.test(value)) {
    setDetails((prev) => ({ ...prev, gst_number: value }));
  } else {
    // Optionally show an error if needed
  }
};

  return (
    
    <div className="w-[94%] p-6 bg-white rounded-lg shadow-lg mt-2 max-w-4xl mx-auto">
  <h1 className="text-3xl font-bold text-gray-900 mb-2">Pharmacy Details</h1>
  {isEditing ? (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Shop Name */}
      <div>
        <label className="block font-semibold text-gray-700 ">Shop Name:</label>
        <input
          type="text"
          name="pharmacy_name"
          value={details.pharmacy_name || ""}
          onChange={handleChange}
          maxLength={25}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter shop name (max 20 chars)"

        />
      </div>

      {/* GST Number */}
      <div>
        <label className="block font-semibold text-gray-700 ">GST Number:</label>
        <input
          type="text"
          name="owner_GST_number"
          value={details.owner_GST_number || " "}
          onChange={handleGstChange}
          maxLength={15}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block font-semibold text-gray-700 ">Address:</label>
        <input
          type="text"
          name="pharmacy_address"
          value={details.pharmacy_address || " "}
          onChange={handleChange}
          minLength={5}
          maxLength={150}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter full address (min 5, max 150 chars)"
        />
      </div>

      {/* PIN */}
      <div>
        <label className="block font-semibold text-gray-700 ">PIN:</label>
        <input
          type="number"
          name="pincode"
          value={details.pincode || " "}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>   

      {/* Government Registered */}
      {/* <div>
        <label className="block font-semibold text-gray-700 ">Government Registered:</label>
        <select
          name="isGovtRegistered"
          value={details.isGovtRegistered}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div> */}

<div>
  <label className="block font-semibold text-gray-700">Government Registration Number:</label>
  <input
    type="text"
    name="registrationNumber"
    value={details.registrationNumber || ""}
    onChange={handleChange}
    placeholder="Enter Registration Number"
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>
      {/* Buttons */}
      <div className="col-span-1 sm:col-span-2 flex justify-end space-x-4 ">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow transition duration-300"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 shadow transition duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  ) : (
    <div className="bg-gray-50 shadow-lg rounded-lg p-4 border border-gray-200">
      {/* Shop Details */}
    
      { details &&  (
      <div className="space-y-4">
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-48">Shop Name:</span>
          <span className="text-gray-800">{details.pharmacy_name}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-48">GST Number:</span>
          <span className="text-gray-800">{details.owner_GST_number}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-48">Address:</span>
          <span className="text-gray-800">{details.pharmacy_address}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-48">PIN:</span>
          <span className="text-gray-800">{details.pincode}</span>
        </div>
        {/* <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-48">Phone Number:</span>
          <span className="text-gray-800">{details.phoneNumber}</span>
        </div> */}
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-48">Govt Registered Number:</span>
          <span className="text-gray-800">14785123698
           
          </span>
        </div>
      </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-6">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
        >
          Change Password
        </button>
        <button
          onClick={() =>handleEdit(details.shop_id)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
        >
          Edit
        </button>
      </div>
    </div>
  )}


{showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setShowPasswordModal(false)}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700">New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={handlepasswordSubmit}
              className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300 w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}

   <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-md shadow-md">
        <AiOutlineMail className="text-blue-600 text-2xl" />
        <div>
          <h2 className="text-lg font-semibold">Email Support</h2>
          <div className='flex gap-2'>
          <p>For queries, email us at:</p>
          <a href="mailto:pharmasupport@evvisolutions.com" className="text-blue-500 hover:underline">
            pharmasupport@evvisolutions.com
          </a>
          </div>
        </div>
      </div>
</div>


  );
};

export default Settings;


// Display details when not in edit mode
// <div>
//     <div className="mb-2">
//         <span className="font-semibold text-gray-600">Shop Name: </span>
//         <span>{shopDetails.shopName}</span>
//     </div>
//     <div className="mb-2">
//         <span className="font-semibold text-gray-600">GST Number: </span>
//         <span>{shopDetails.gstNumber}</span>
//     </div>
//     <div className="mb-2">
//         <span className="font-semibold text-gray-600">Address: </span>
//         <span>{shopDetails.address}</span>
//     </div>
//     <div className="mb-2">
//         <span className="font-semibold text-gray-600">PIN: </span>
//         <span>{shopDetails.pin}</span>
//     </div>
//     <div className="mb-2">
//         <span className="font-semibold text-gray-600">Phone Number: </span>
//         <span>{shopDetails.phoneNumber}</span>
//     </div>
//     <div className="mb-2">
//         <span className="font-semibold text-gray-600">Government Registered: </span>
//         <span>
//             {shopDetails.isGovtRegistered ? (
//                 <span className="text-green-600 font-bold">Yes</span>
//             ) : (
//                 <span className="text-red-600 font-bold">No</span>
//             )}
//         </span>
//     </div>
//     <div className="mt-4 flex space-x-4">
//         <button
//             onClick={handleEdit}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//             Edit
//         </button>
//         <button
//             onClick={handleDelete}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//             Delete
//         </button>
//     </div>
// </div>
// <div className="w-[94%] p-4 bg-white rounded-lg shadow-md mt-8">
    //   <h1 className="text-2xl font-bold text-gray-800 mb-4">Pharmacy Details</h1>
    //   {isEditing ? (
    //     // Edit form with two columns
    //     <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
    //       <div>
    //         <label className="block font-semibold text-gray-600">Shop Name:</label>
    //         <input
    //           type="text"
    //           name="shopName"
    //           value={shopDetails.shopName}
    //           onChange={handleChange}
    //           className="w-full p-2 border border-gray-300 rounded"
    //         />
    //       </div>
    //       <div>
    //         <label className="block font-semibold text-gray-600">GST Number:</label>
    //         <input
    //           type="text"
    //           name="gstNumber"
    //           value={shopDetails.gstNumber}
    //           onChange={handleChange}
    //           className="w-full p-2 border border-gray-300 rounded"
    //         />
    //       </div>
    //       <div>
    //         <label className="block font-semibold text-gray-600">Address:</label>
    //         <input
    //           type="text"
    //           name="address"
    //           value={shopDetails.address}
    //           onChange={handleChange}
    //           className="w-full p-2 border border-gray-300 rounded"
    //         />
    //       </div>
    //       <div>
    //         <label className="block font-semibold text-gray-600">PIN:</label>
    //         <input
    //           type="text"
    //           name="pin"
    //           value={shopDetails.pin}
    //           onChange={handleChange}
    //           className="w-full p-2 border border-gray-300 rounded"
    //         />
    //       </div>
    //       <div>
    //         <label className="block font-semibold text-gray-600">Phone Number:</label>
    //         <input
    //           type="text"
    //           name="phoneNumber"
    //           value={shopDetails.phoneNumber}
    //           onChange={handleChange}
    //           className="w-full p-2 border border-gray-300 rounded"
    //         />
    //       </div>
    //       <div>
    //         <label className="block font-semibold text-gray-600">Government Registered:</label>
    //         <select
    //           name="isGovtRegistered"
    //           value={shopDetails.isGovtRegistered}
    //           onChange={handleChange}
    //           className="w-full p-2 border border-gray-300 rounded"
    //         >
    //           <option value={true}>Yes</option>
    //           <option value={false}>No</option>
    //         </select>
    //       </div>

    //       {/* Full-width Save and Cancel buttons */}
    //       <div className="col-span-2 mt-4 flex space-x-4">
    //         <button
    //           type="submit"
    //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    //         >
    //           Save
    //         </button>
    //         <button
    //           type="button"
    //           onClick={() => setIsEditing(false)}
    //           className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
    //         >
    //           Cancel
    //         </button>
    //       </div>
    //     </form>
    //   ) : (
    //     <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-lg mx-auto">
    //       {/* Shop Details */}
    //       <div className="space-y-4">
    //         <div className="flex items-start">
    //           <span className="font-semibold text-gray-700 w-40">Shop Name:</span>
    //           <span className="text-gray-800">{shopDetails.shopName}</span>
    //         </div>
    //         <div className="flex items-start">
    //           <span className="font-semibold text-gray-700 w-40">GST Number:</span>
    //           <span className="text-gray-800">{shopDetails.gstNumber}</span>
    //         </div>
    //         <div className="flex items-start">
    //           <span className="font-semibold text-gray-700 w-40">Address:</span>
    //           <span className="text-gray-800">{shopDetails.address}</span>
    //         </div>
    //         <div className="flex items-start">
    //           <span className="font-semibold text-gray-700 w-40">PIN:</span>
    //           <span className="text-gray-800">{shopDetails.pin}</span>
    //         </div>
    //         <div className="flex items-start">
    //           <span className="font-semibold text-gray-700 w-40">Phone Number:</span>
    //           <span className="text-gray-800">{shopDetails.phoneNumber}</span>
    //         </div>
    //         <div className="flex items-start">
    //           <span className="font-semibold text-gray-700 w-40">Government Registered:</span>
    //           <span>
    //             {shopDetails.isGovtRegistered ? (
    //               <span className="text-green-600 font-bold">Registred</span>
    //             ) : (
    //               <span className="text-red-600 font-bold">No</span>
    //             )}
    //           </span>
    //         </div>
    //       </div>

    //       {/* Buttons */}
    //       <div className="mt-6 flex justify-end space-x-4">
    //         <button
    //           onClick={handleEdit}
    //           className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out"
    //         >
    //           Edit
    //         </button>
    //         <button
    //           onClick={handleDelete}
    //           className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 ease-in-out"
    //         >
    //           Delete
    //         </button>
    //       </div>
    //     </div>

    //   )}
    // </div>
