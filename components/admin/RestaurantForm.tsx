import Image from 'next/image';
import { IRestaurantFormProps } from 'types';
import { FiUpload } from 'react-icons/fi';
import { formatImageName } from '@lib/utils';
import { RiDeleteBinLine } from 'react-icons/ri';
import SubmitButton from '@components/layout/SubmitButton';
import styles from './RestaurantForm.module.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function RestaurantForm({
  isLoading,
  formData,
  setFormData,
  buttonText,
  handleSubmit,
  showPasswordFields,
}: IRestaurantFormProps) {
  // Hooks
  const logoRef = useRef<HTMLDivElement>(null);
  const [logoHeight, setLogoHeight] = useState(0);

  // Destructure form data
  const {
    zip,
    logo,
    file,
    city,
    state,
    email,
    lastName,
    password,
    firstName,
    addressLine1,
    addressLine2,
    restaurantName,
    confirmPassword,
  } = formData;

  // Get image height
  useEffect(() => {
    setLogoHeight(logoRef.current?.offsetHeight || 144);

    function handleResize() {
      setLogoHeight(logoRef.current?.offsetHeight || 144);
    }

    // Add resize event to window
    window.addEventListener('resize', handleResize);

    // Remove resize event from window
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Check if passwords match
  const passwordsMatch = password === confirmPassword;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={
        {
          '--logo_height': `${logoHeight}px`,
        } as React.CSSProperties
      }
    >
      <p className={styles.form_title}>Contact info</p>

      <div className={styles.item}>
        <label htmlFor='firstName'>First name</label>
        <input
          type='text'
          id='firstName'
          value={firstName}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='lastName'>Last name</label>
        <input
          type='text'
          id='lastName'
          value={lastName}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='email'>Email address</label>
        <input type='email' id='email' value={email} onChange={handleChange} />
      </div>

      {showPasswordFields && (
        <>
          <div className={styles.item}>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={handleChange}
            />
          </div>

          <div className={styles.item}>
            <label htmlFor='confirmPassword'>
              Confirm password {!passwordsMatch && " - Passwords don't match"}
            </label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <p className={styles.form_title}>Restaurant info</p>

      <div className={styles.item}>
        <label htmlFor='restaurantName'>Name</label>
        <input
          type='text'
          id='restaurantName'
          value={restaurantName}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='addressLine1'>Address line 1</label>
        <input
          type='text'
          id='addressLine1'
          value={addressLine1}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor='addressLine2'>Address line 2</label>
        <input
          type='text'
          id='addressLine2'
          value={addressLine2}
          onChange={handleChange}
        />
      </div>

      <div className={styles.city_state_zip}>
        <div className={styles.item}>
          <label htmlFor='city'>City</label>
          <input type='text' id='city' value={city} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor='state'>State</label>
          <input type='text' id='state' value={state} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor='zip'>Zip</label>
          <input type='text' id='zip' value={zip} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.logo_upload}>
        <div className={styles.upload}>
          <div className={styles.upload_icon_and_text}>
            <FiUpload />
            <span>{file ? formatImageName(file.name) : 'Upload logo'}</span>
          </div>

          {file && (
            <span
              className={styles.remove_logo}
              onClick={() =>
                setFormData((prevState) => ({ ...prevState, file: undefined }))
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

        {logo && (
          <div className={styles.image} ref={logoRef}>
            <Image
              src={logo}
              width={16}
              height={10}
              objectFit='cover'
              layout='responsive'
            />
          </div>
        )}
      </div>

      <SubmitButton text={buttonText} isLoading={isLoading} />
    </form>
  );
}
