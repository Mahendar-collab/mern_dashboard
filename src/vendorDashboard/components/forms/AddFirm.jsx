import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';

const AddFirm = () => {
  const [firmName, setFirmName] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (category.includes(value)) {
      setCategory(category.filter((item) => item !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  const handleRegionChange = (event) => {
    const value = event.target.value;
    if (region.includes(value)) {
      setRegion(region.filter((item) => item !== value));
    } else {
      setRegion([...region, value]);
    }
  };

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setFile(selectedImage);
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginToken = localStorage.getItem("loginToken");
      if (!loginToken) {
        console.error("User not authenticated");
        return;
      }

      const formData = new FormData();
      formData.append("firmName", firmName);
      formData.append("area", area);
      formData.append("offer", offer);
      formData.append("image", file);

      category.forEach((value) => formData.append("category", value));
      region.forEach((value) => formData.append("region", value));

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: "POST",
        headers: {
          token: `${loginToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Add firm response:", data);

      if (response.ok && data.firmId) {
        // ✅ Save firmId and firmName to localStorage
        localStorage.setItem("firmId", data.firmId);
        localStorage.setItem("firmName", firmName); // <---- add this line

        alert("✅ Firm added successfully");

        // ✅ Reset form fields
        setFirmName("");
        setArea("");
        setCategory([]);
        setRegion([]);
        setOffer("");
        setFile(null);
        e.target.reset();
      }
      else if (data.message === "vendor can only one firm") {
        alert("⚠️ Firm already exists — Only one firm can be added");
        console.log("Existing firmId retained:", localStorage.getItem("firmId"));
      } else {
        alert("❌ Failed to add firm");
      }
    } catch (error) {
      console.error("Failed to add firm:", error);
      alert("Something went wrong while adding the firm.");
    }
  };

  return (
    <div className="firmSection">
      <form className="tableForm" onSubmit={handleFirmSubmit}>
        <h2>Add Firm</h2>

        <label>Firm Name</label>
        <input
          type="text"
          name="firmName"
          value={firmName}
          onChange={(e) => setFirmName(e.target.value)}
        />

        <label>Area</label>
        <input
          type="text"
          name="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

        <div className="checkInp">
          <label>Category</label>
          <div className="inputsContainer">
            <div className="checkboxContainer">
              <label>Veg</label>
              <input
                type="checkbox"
                checked={category.includes("veg")}
                value="veg"
                onChange={handleCategoryChange}
              />
            </div>
            <div className="checkboxContainer">
              <label>Non-Veg</label>
              <input
                type="checkbox"
                checked={category.includes("non-veg")}
                value="non-veg"
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>

        <label>Offer</label>
        <input
          type="text"
          name="offer"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />

        <div className="checkInp">
          <label>Region</label>
          <div className="inputsContainer">
            {["south-indian", "north-indian", "chinese", "bakery"].map(
              (r) => (
                <div className="checkboxContainer" key={r}>
                  <label>{r.replace("-", " ").toUpperCase()}</label>
                  <input
                    type="checkbox"
                    value={r}
                    checked={region.includes(r)}
                    onChange={handleRegionChange}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <label>Firm Image</label>
        <input type="file" onChange={handleImageUpload} />

        <br />
        <div className="btnSubmit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddFirm;
