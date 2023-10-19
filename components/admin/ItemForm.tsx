import Image from 'next/image';
import { FiUpload } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { StaticTags, ItemFormProps } from 'types';
import styles from '@styles/admin/ItemForm.module.css';
import SubmitButton from '@components/layout/SubmitButton';
import { formatImageName, splitTags, tags } from '@utils/index';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function ItemForm({
  formData,
  isLoading,
  buttonText,
  setFormData,
  handleSubmit,
}: ItemFormProps) {
  // Initial dietary tags
  const initialStaticTags = tags.reduce(
    (acc, curr) => ({ ...acc, [curr]: false }),
    {}
  );

  // Hooks
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [staticTags, setStaticTags] = useState<StaticTags>(initialStaticTags);

  // Destructure form data and check
  const {
    name,
    file,
    price,
    image,
    currentTags,
    description,
    optionalAddons,
    requiredAddons,
    removableIngredients,
  } = formData;

  // Get image height
  useEffect(() => {
    setImageHeight(imageRef.current?.offsetHeight || 144);

    function handleResize() {
      setImageHeight(imageRef.current?.offsetHeight || 144);
    }

    // Add resize event to window
    window.addEventListener('resize', handleResize);

    // Remove resize event from window
    return () => {
      window.removeEventListener('resize', handleResize);
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
        }, {} as StaticTags)
      );
    }
  }, [currentTags]);

  // Handle change form data
  function handleChangeFormData(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    // Update state
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle change addons
  function handleChangeAddons(
    e: ChangeEvent<HTMLInputElement>,
    addonIndex: number,
    addons: 'optionalAddons' | 'requiredAddons'
  ) {
    // Update state
    setFormData((prevState) => ({
      ...prevState,
      [addons]: prevState[addons].map((addon, index) => {
        if (index === addonIndex) {
          return {
            ...addon,
            [e.target.name]: e.target.value,
          };
        } else {
          return addon;
        }
      }),
    }));
  }

  // Handle change tags
  function handleChangeTags(e: ChangeEvent<HTMLInputElement>) {
    // Update tags
    setStaticTags((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));

    // Update form data
    setFormData((prevState) => ({
      ...prevState,
      updatedTags: e.target.checked
        ? [...prevState.updatedTags, e.target.name]
        : prevState.updatedTags.filter(
            (updatedTag) => updatedTag !== e.target.name
          ),
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={
        {
          '--image_height': `${imageHeight}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.item}>
        <label htmlFor='name'>Item name</label>
        <input
          type='text'
          id='name'
          value={name}
          onChange={handleChangeFormData}
        />
      </div>

      <>
        <p className={styles.addons_title}>Optional addons</p>

        {optionalAddons.map((optionalAddon, index) => (
          <div className={styles.addons} key={index}>
            <div>
              {/* <label htmlFor={`optional-addons-${index}`}>Addons</label> */}
              <input
                type='text'
                // id={`optional-addons-${index}`}
                name='addons'
                value={optionalAddon.addons}
                placeholder='E.g. Cheese - 2, Mayo - 0'
                onChange={(e) => handleChangeAddons(e, index, 'optionalAddons')}
              />
            </div>

            <div>
              {/* <label htmlFor={`optional-addable-${index}`}>Addable</label> */}
              <input
                type='number'
                name='addable'
                // id={`optional-addable-${index}`}
                placeholder='E.g. 0'
                value={optionalAddon.addable}
                onChange={(e) => handleChangeAddons(e, index, 'optionalAddons')}
              />
            </div>
          </div>
        ))}
      </>

      <>
        <p className={styles.addons_title}>Required addons</p>

        {requiredAddons.map((requiredAddon, index) => (
          <div className={styles.addons} key={index}>
            <div>
              {/* <label htmlFor={`required-addons-${index}`}>Addons</label> */}
              <input
                type='text'
                name='addons'
                // id={`required-addons-${index}`}
                value={requiredAddon.addons}
                placeholder='E.g. Cheese - 2, Mayo - 0'
                onChange={(e) => handleChangeAddons(e, index, 'requiredAddons')}
              />
            </div>

            <div>
              {/* <label htmlFor={`required-addable-${index}`}>Addable</label> */}
              <input
                type='number'
                name='addable'
                // id={`required-addable-${index}`}
                placeholder='E.g. 0'
                value={requiredAddon.addable}
                onChange={(e) => handleChangeAddons(e, index, 'requiredAddons')}
              />
            </div>
          </div>
        ))}
      </>

      <div className={styles.item}>
        <label htmlFor='removableIngredients'>Removable ingredients</label>
        <input
          type='text'
          id='removableIngredients'
          value={removableIngredients}
          onChange={handleChangeFormData}
          placeholder='E.g. Cheese, Mayo'
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='price'>Item price</label>
        <input
          type='number'
          id='price'
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
                type='checkbox'
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
        <label htmlFor='description'>Item description</label>
        <textarea
          id='description'
          value={description}
          onChange={handleChangeFormData}
        />
      </div>

      <div className={styles.image_upload}>
        <div className={styles.upload}>
          <div className={styles.upload_icon_and_text}>
            <FiUpload />
            <span>{file ? formatImageName(file.name) : 'Upload image'}</span>
          </div>

          {file && (
            <span
              className={styles.remove_upload}
              onClick={() =>
                setFormData((prevState) => ({
                  ...prevState,
                  file: undefined,
                }))
              }
            >
              Remove <RiDeleteBinLine />
            </span>
          )}
        </div>

        <input
          type='file'
          id='image'
          accept='image/*'
          onChange={(e) =>
            setFormData((prevState) => ({
              ...prevState,
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
              objectFit='cover'
              layout='responsive'
            />

            <span
              className={styles.remove_image}
              onClick={() =>
                setFormData((prevState) => ({
                  ...prevState,
                  image: '',
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
