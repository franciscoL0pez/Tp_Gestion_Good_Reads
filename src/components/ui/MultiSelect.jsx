import { useState } from "react";
import Select from "react-select";
import { FormControl, FormLabel, Box } from "@chakra-ui/react";

// Define custom styles for react-select to match Chakra UI theme
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#E2E8F0", // Chakra's gray.200 color
    boxShadow: "none",
    "&:hover": {
      borderColor: "#CBD5E0", // Chakra's gray.300 color
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10, // Ensure dropdown appears above other elements
  }),
};

const MultiSelect = ({ options, label, placeholder, onChange, value }) => {
  const handleChange = (selectedOptions) => {
    onChange(selectedOptions || []);
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Select
        isMulti
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </FormControl>
  );
};

export default MultiSelect;
