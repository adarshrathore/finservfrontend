import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const App = () => {
  const [jsonInput, setJsonInput] = useState(""); 
  const [error, setError] = useState(null); 
  const [responseData, setResponseData] = useState(null); 
  const [selectedOptions, setSelectedOptions] = useState([]); 


  const dropdownOptions = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highestLowercase", label: "Highest Lowercase Alphabet" },
  ];

  useEffect(() => {
    document.title = "0101CS211006";
  }, []);

  const handleSubmit = async () => {
    setError(null); 
    setResponseData(null); 

    try {
      // Parse the input JSON
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid JSON format! 'data' must be an array.");
      }

      // Make the POST request
      const response = await axios.post("https://finservapi.onrender.com/bfhl", parsedInput);
      setResponseData(response.data); 
    } catch (err) {
      setError(err.message || "Invalid JSON");
    }
  };


  const renderResponse = () => {
    if (!responseData || selectedOptions.length === 0) return null;

    const filteredData = selectedOptions.map((option) => ({
      category: option.label,
      data: responseData[option.value],
    }));

    return (
      <div>
        <h3>Filtered Response:</h3>
        <ul>
          {filteredData.map((item, idx) => (
            <li key={idx}>
              <strong>{item.category}: </strong>
              {Array.isArray(item.data) ? item.data.join(", ") : item.data}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>JSON Input Validation</h1>

      <textarea
        placeholder="Enter JSON here..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows="5"
        cols="50"
        style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {responseData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Select Data to Display</h3>
          <Select
            isMulti
            options={dropdownOptions}
            onChange={(selected) => setSelectedOptions(selected || [])} 
          />
          {renderResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
