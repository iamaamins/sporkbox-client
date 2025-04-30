import Image from 'next/image';
import { FiUpload } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FormProps, ItemFormData } from 'types';
import styles from './ItemForm.module.css';
import SubmitButton from '@components/layout/SubmitButton';
import { formatImageName } from '@lib/utils';
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useData } from '@context/Data';

interface Props extends FormProps {
  formData: ItemFormData;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<ItemFormData>>;
}

export default function ItemForm({
  formData,
  isLoading,
  buttonText,
  setFormData,
  handleSubmit,
}: Props) {
  const { dietaryTags } = useData();
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  const {
    name,
    file,
    price,
    image,
    description,
    optionalAddons,
    requiredAddonsOne,
    requiredAddonsTwo,
    removableIngredients,
  } = formData;

  function handleChangeFormData(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  function handleChangeAddons(
    e: ChangeEvent<HTMLInputElement>,
    addons: 'optionalAddons' | 'requiredAddonsOne' | 'requiredAddonsTwo'
  ) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [addons]: {
        ...prevState[addons],
        [name]: name === 'addable' ? +value : value,
      },
    }));
  }

  function handleChangeTags(e: ChangeEvent<HTMLInputElement>) {
    const tag = e.target.id;
    const isChecked = e.target.checked;
    setFormData((prevState) => ({
      ...prevState,
      tags: isChecked
        ? [...prevState.tags, tag]
        : prevState.tags.filter((el) => el !== tag),
    }));
  }

  // Get image height
  useEffect(() => {
    setImageHeight(imageRef.current?.offsetHeight || 144);
    function handleResize() {
      setImageHeight(imageRef.current?.offsetHeight || 144);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (dietaryTags.data) setTags(dietaryTags.data);
  }, [dietaryTags]);

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
      <div className={styles.addons}>
        <div>
          <label htmlFor='optionalAddons'>Optional addons</label>
          <input
            type='text'
            id='optionalAddons'
            name='addons'
            value={optionalAddons.addons}
            placeholder='E.g. Cheese - 2, Mayo - 0'
            onChange={(e) => handleChangeAddons(e, 'optionalAddons')}
          />
        </div>
        <div>
          <label htmlFor='optionalAddable'>Optional addable</label>
          <input
            type='number'
            name='addable'
            id='optionalAddable'
            placeholder='E.g. 0'
            value={optionalAddons.addable}
            onChange={(e) => handleChangeAddons(e, 'optionalAddons')}
          />
        </div>
      </div>
      <div className={styles.addons}>
        <div>
          <label htmlFor='requiredAddonsOne'>Req. add-on 1</label>
          <input
            type='text'
            name='addons'
            id='requiredAddonsOne'
            value={requiredAddonsOne.addons}
            placeholder='E.g. Cheese - 2, Mayo - 0'
            onChange={(e) => handleChangeAddons(e, 'requiredAddonsOne')}
          />
        </div>
        <div>
          <label htmlFor='requiredAddable'>Req. add-on 1 addable</label>
          <input
            type='number'
            name='addable'
            id='requiredAddable'
            placeholder='E.g. 0'
            value={requiredAddonsOne.addable}
            onChange={(e) => handleChangeAddons(e, 'requiredAddonsOne')}
          />
        </div>
      </div>
      <div className={styles.addons}>
        <div>
          <label htmlFor='requiredAddonsTwo'>Req. add-on 2</label>
          <input
            type='text'
            name='addons'
            id='requiredAddonsTwo'
            value={requiredAddonsTwo.addons}
            placeholder='E.g. Cheese - 2, Mayo - 0'
            onChange={(e) => handleChangeAddons(e, 'requiredAddonsTwo')}
          />
        </div>
        <div>
          <label htmlFor='requiredAddonsTwo'>Req. add-on 2 addable</label>
          <input
            type='number'
            name='addable'
            id='requiredAddonsTwo'
            placeholder='E.g. 0'
            value={requiredAddonsTwo.addable}
            onChange={(e) => handleChangeAddons(e, 'requiredAddonsTwo')}
          />
        </div>
      </div>
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
          {tags.map((tag, index) => (
            <div className={styles.tag} key={index}>
              <input
                type='checkbox'
                id={tag}
                onChange={handleChangeTags}
                checked={formData.tags.includes(tag)}
              />
              <label htmlFor={tag}>{tag}</label>
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
