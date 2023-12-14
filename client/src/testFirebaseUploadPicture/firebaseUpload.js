import React, { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../firebase";
import check from "../assets/images/toBeDone.png";


const FirebaseUpload = ({name, label, value, type, handleInputState, ...rest}) => {
  const inputRef = useRef();
  const [progress, setProgress] = useState(0);
  const [progressShow, setProgressShow] = useState(false);

  const handleUpload = () => {
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  };

  return <div>
        <input
		    type="file"
			ref={inputRef}
			onChange={(e) => handleInputState(name, e.currentTarget.files[0])}
			vlaue={value}
			
			{...rest}/>
			<button
				type="button"
				onClick={() => inputRef.current.click()}
				
			>
				{label}
			</button>
            {type === "image" && value && (
				<img
					src={typeof value === "string" ? value : URL.createObjectURL(value)}
					alt="file"
					className={styles.preview_img}
				/>
			)}
            {value !== null && !progressShow && typeof value !== "string" && (
				<button onClick={handleUpload} className={styles.button}>
					Upload
				</button>
			)}
  </div>;
};

export default FirebaseUpload;