import Image from "next/image";
import { IEditItemProps } from "types";
import { FiUpload } from "react-icons/fi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import styles from "@styles/admin/ItemForm.module.css";
import SubmitButton from "@components/layout/SubmitButton";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

export default function ItemForm({
  handleSubmit,
  buttonText,
  isLoading,
  formData,
  file,
  setFile,
  setFormData,
}: IEditItemProps) {
  // Hooks
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);

  // Get image height
  useEffect(() => {
    setImageHeight(imageRef.current?.offsetHeight || 150);
  }, []);

  // Destructure form data and check
  const { name, description, tags, price, image } = formData;

  // Handle change
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    // Id and value
    const id = e.target.id;
    const value = e.target.value;

    // Update state
    setFormData((currData) => ({
      ...currData,
      [id]: id === "price" ? +value : value,
    }));
  }

  // Format image name
  const formatImageName = (name: string) =>
    name.length > 15
      ? `${name.slice(0, 10)}.${name.split(".")[name.split(".").length - 1]}`
      : name;

  return (
    <form
      onSubmit={handleSubmit}
      style={
        {
          "--image_height": `${imageHeight}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.item}>
        <label htmlFor="name">Item name</label>
        <input type="text" id="name" value={name} onChange={handleChange} />
      </div>

      <div className={styles.item}>
        <label htmlFor="tags">Dietary tags (comma separated)</label>
        <input type="text" id="tags" value={tags} onChange={handleChange} />
      </div>

      <div className={styles.item}>
        <label htmlFor="price">Item price</label>
        <input type="number" id="price" value={price} onChange={handleChange} />
      </div>

      <div className={styles.item}>
        <label htmlFor="description">Item description</label>
        <textarea
          id="description"
          value={description}
          onChange={handleChange}
        />
      </div>

      <div className={styles.image_upload}>
        <div className={styles.upload}>
          <FiUpload />
          <span className={styles.upload_icon_and_text}>
            {file ? formatImageName(file.name) : "Upload image"}
            {file && (
              <AiOutlineCloseCircle
                className={styles.remove_image}
                onClick={() => setFile(undefined)}
              />
            )}
          </span>
        </div>

        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
        />

        {image && (
          <div className={styles.image} ref={imageRef}>
            <Image
              src={image as string}
              width={16}
              height={10}
              layout="responsive"
            />
          </div>
        )}
      </div>

      <SubmitButton text={buttonText} isLoading={isLoading} />
    </form>
  );
}
