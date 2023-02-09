import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IStaticTags, IItemFormProps } from "types";
import styles from "@styles/admin/ItemForm.module.css";
import SubmitButton from "@components/layout/SubmitButton";
import { formatImageName, splitTags, tags } from "@utils/index";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

export default function ItemForm({
  formData,
  isLoading,
  buttonText,
  setFormData,
  handleSubmit,
}: IItemFormProps) {
  // Initial dietary tags
  const initialStaticTags = tags.reduce(
    (acc, curr) => ({ ...acc, [curr]: false }),
    {}
  );

  // Hooks
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [staticTags, setStaticTags] = useState<IStaticTags>(initialStaticTags);

  // Destructure form data and check
  const {
    name,
    file,
    price,
    image,
    currentTags,
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
    if (currentTags) {
      setStaticTags(
        tags.reduce((acc, curr) => {
          if (splitTags(currentTags).includes(curr)) {
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
        }, {} as IStaticTags)
      );
    }
  }, [currentTags]);

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
    // Update tags
    setStaticTags((currState) => ({
      ...currState,
      [e.target.name]: e.target.checked,
    }));

    // Update form data
    setFormData((currState) => ({
      ...currState,
      updatedTags: e.target.checked
        ? [...currState.updatedTags, e.target.name]
        : currState.updatedTags.filter(
            (updatedTag) => updatedTag !== e.target.name
          ),
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
          {Object.keys(staticTags).map((staticTag, index) => (
            <div className={styles.tag} key={index}>
              <input
                type="checkbox"
                id={staticTag}
                name={staticTag}
                onChange={handleChangeTags}
                checked={staticTags[staticTag]}
              />
              <label htmlFor={staticTag}>{staticTag}</label>
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
              onClick={() =>
                setFormData((currState) => ({
                  ...currState,
                  file: undefined,
                }))
              }
            >
              Remove <RiDeleteBinLine />
            </span>
          )}
        </div>

        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) =>
            setFormData((currState) => ({
              ...currState,
              file: e.target.files?.[0],
            }))
          }
        />

        {image && (
          <div className={styles.image} ref={imageRef}>
            <Image
              src={image}
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
