import Image from "next/image";
import { IEditItemProps } from "types";
import { FiUpload } from "react-icons/fi";
import { formatImageName } from "@utils/index";
import { RiDeleteBinLine } from "react-icons/ri";
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
    setImageHeight(imageRef.current?.offsetHeight || 144);

    function handleResize() {
      setImageHeight(imageRef.current?.offsetHeight || 144);
    }

    // Add resize event to window
    window.addEventListener("resize", handleResize);

    // Remove resize event from window
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Destructure form data and check
  const {
    name,
    tags,
    price,
    image,
    description,
    addableIngredients,
    removableIngredients,
  } = formData;

  // Handle change
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    // Id and value
    const id = e.target.id;
    const value = e.target.value;

    // Update state
    setFormData((currState) => ({
      ...currState,
      [id]: id === "price" ? +value : value,
    }));
  }

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
        <label htmlFor="tags">Dietary tags</label>
        <input type="text" id="tags" value={tags} onChange={handleChange} />
      </div>

      <div className={styles.item}>
        <label htmlFor="addableIngredients">Addable ingredients</label>
        <input
          type="text"
          id="addableIngredients"
          value={addableIngredients}
          onChange={handleChange}
          placeholder="E.g. Cheese - 2, Mayo - 0"
        />
      </div>

      <div className={styles.item}>
        <label htmlFor="removableIngredients">Removable ingredients</label>
        <input
          type="text"
          id="removableIngredients"
          value={removableIngredients}
          onChange={handleChange}
          placeholder="E.g. Cheese, Mayo"
        />
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
          <div className={styles.upload_icon_and_text}>
            <FiUpload />
            <span>{file ? formatImageName(file.name) : "Upload image"}</span>
          </div>

          {file && (
            <span
              className={styles.remove_upload}
              onClick={() => setFile(undefined)}
            >
              Remove <RiDeleteBinLine />
            </span>
          )}
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
              objectFit="cover"
              layout="responsive"
            />

            <span
              className={styles.remove_image}
              onClick={() =>
                setFormData((currState) => ({
                  ...currState,
                  image: "",
                }))
              }
            >
              Remove <RiDeleteBinLine />
            </span>
          </div>
        )}
      </div>

      <SubmitButton text={buttonText} isLoading={isLoading} />
    </form>
  );
}
