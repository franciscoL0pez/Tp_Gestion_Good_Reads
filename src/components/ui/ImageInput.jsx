import { useRef, useState } from "react";
import { Button, Input, Image, Box, Text } from "@chakra-ui/react";

const ImageUpload = ({ onImageChange }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);

  const handleClick = () => inputRef.current?.click();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      //   setPreview(imageUrl); // Show image preview
      onImageChange(file); // Pass file to parent component
    }
  };

  return (
    <Box textAlign="center">
      <Input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <Button colorScheme="teal" onClick={handleClick} mb={4}>
        Select Image
      </Button>
      {preview && (
        <Box mt={4}>
          <Text>Image Preview:</Text>
          <Image src={preview} alt="Selected Image" boxSize="200px" mt={2} />
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
