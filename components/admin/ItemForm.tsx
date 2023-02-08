import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IDietaryTags, IItemFormProps } from "types";
import styles from "@styles/admin/ItemForm.module.css";
import SubmitButton from "@components/layout/SubmitButton";
import { formatImageName, staticTags } from "@utils/index";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

export default function ItemForm({
  formData,
  isLoading,
  buttonText,
  setFormData,
  handleSubmit,
}: IItemFormProps) {
  // Initial dietary tags
  const initialDietaryTags = staticTags.reduce(
    (acc, curr) => ({ ...acc, [curr]: false }),
    {}
  );

  // Hooks
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [dietaryTags, setDietaryTags] =
    useState<IDietaryTags>(initialDietaryTags);
  const [file, setFile] = useState<File | undefined>(undefined);

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

  // Update dietary tags
  useEffect(() => {
    if (tags) {
      // Create array of current tags
      const currentTags = (tags as string).split(",").map((tag) => tag.trim());

      // Update state
      setDietaryTags(
        staticTags.reduce((acc, curr) => {
          if (currentTags.includes(curr)) {
            return {
              ...acc,
              [curr]: true,
            };
          } else {
            return {
              ...acc,
              [curr]: false,
            };
          }
        }, {} as { [key: string]: boolean })
      );
    }
  }, [tags]);

  // Handle change
  function handleChangeFormData(
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

  // Handle change tags
  function handleChangeTags(e: ChangeEvent<HTMLInputElement>) {
    // Update state
    setDietaryTags((currState) => ({
      ...currState,
      [e.target.name]: e.target.checked,
    }));
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e, dietaryTags, file)}
      style={
        {
          "--image_height": `${imageHeight}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.item}>
        <label htmlFor="name">Item name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleChangeFormData}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor="addableIngredients">Addable ingredients</label>
        <input
          type="text"
          id="addableIngredients"
          value={addableIngredients}
          onChange={handleChangeFormData}
          placeholder="E.g. Cheese - 2, Mayo - 0"
        />
      </div>

      <div className={styles.item}>
        <label htmlFor="removableIngredients">Removable ingredients</label>
        <input
          type="text"
          id="removableIngredients"
          value={removableIngredients}
          onChange={handleChangeFormData}
          placeholder="E.g. Cheese, Mayo"
        />
      </div>

      <div className={styles.item}>
        <label htmlFor="price">Item price</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={handleChangeFormData}
        />
      </div>

      <div className={styles.dietary_tags}>
        <p>Dietary tags</p>

        <div className={styles.tags}>
          {Object.keys(dietaryTags).map((dietaryTag, index) => (
            <div className={styles.tag} key={index}>
              <input
                type="checkbox"
                id={dietaryTag}
                name={dietaryTag}
                onChange={handleChangeTags}
                checked={dietaryTags[dietaryTag]}
              />
              <label htmlFor={dietaryTag}>{dietaryTag}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.item}>
        <label htmlFor="description">Item description</label>
        <textarea
          id="description"
          value={description}
          onChange={handleChangeFormData}
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
