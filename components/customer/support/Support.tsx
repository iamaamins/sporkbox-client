import Image from 'next/image';
import styles from './Support.module.css';
import { MdOutlineSentimentVerySatisfied } from 'react-icons/md';
import { MdSentimentVerySatisfied } from 'react-icons/md';
import { MdOutlineSentimentDissatisfied } from 'react-icons/md';
import { MdSentimentNeutral } from 'react-icons/md';
import { MdOutlineSentimentVeryDissatisfied } from 'react-icons/md';
import { useUser } from '@context/User';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FAQ_DATA } from 'data/FAQ';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  axiosInstance,
  formatImageName,
  getPastDate,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { CustomAxiosError } from 'types';
import { useAlert } from '@context/Alert';
import ButtonLoader from '@components/layout/ButtonLoader';
import { FiUpload } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';

type Restaurants = {
  isLoading: boolean;
  data: { _id: string; name: string }[];
};

type FormData = {
  category: string;
  date: string;
  restaurant: string;
  message: string;
  file?: File;
};

export default function Support() {
  const initialState: FormData = {
    category: '',
    date: '',
    restaurant: '',
    message: '',
  };
  const router = useRouter();
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [restaurants, setRestaurants] = useState<Restaurants>({
    isLoading: true,
    data: [],
  });
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const { category, date, restaurant, message, file } = formData;

  function toggleFAQ(index: number) {
    setOpenQuestions((prevState) =>
      !prevState.includes(index)
        ? [...prevState, index]
        : prevState.filter((el) => el !== index)
    );
  }

  function handleChange(
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function submitGeneralFeedback(rating: number) {
    try {
      const response = await axiosInstance.post('/feedback/general', {
        rating,
      });

      showSuccessAlert(response.data, setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  async function submitIssueFeedback(e: FormEvent) {
    e.preventDefault();

    const data = new FormData();
    data.append('category', category);
    data.append('date', date);
    data.append('restaurant', restaurant);
    data.append('message', message);
    file && data.append('file', file);

    try {
      setIsLoading(true);

      const response = await axiosInstance.post('/feedback/issue', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData(initialState);
      showSuccessAlert(response.data, setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function getActiveRestaurants() {
      try {
        const response = await axiosInstance.get<
          { _id: string; name: string }[]
        >('/restaurants/active/support');
        setRestaurants({ isLoading: false, data: response.data });
      } catch (err) {
        setRestaurants((prevState) => ({ ...prevState, isLoading: false }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }
    if (router.isReady) getActiveRestaurants();
  }, [router]);

  return (
    <section className={styles.container}>
      <div className={styles.feedback}>
        <h1>How are you feeling about Spork Box today?</h1>
        <div className={styles.ratings}>
          <MdOutlineSentimentVerySatisfied
            size={48}
            color='#56cd8c'
            title='Very satisfied'
            onClick={() => submitGeneralFeedback(5)}
          />
          <MdSentimentVerySatisfied
            size={48}
            color='#85d273'
            title='Satisfied'
            onClick={() => submitGeneralFeedback(4)}
          />
          <MdSentimentNeutral
            size={48}
            color='#fbe118'
            title='Neither'
            onClick={() => submitGeneralFeedback(3)}
          />
          <MdOutlineSentimentDissatisfied
            size={48}
            color='#fba831'
            title='Somewhat unsatisfied'
            onClick={() => submitGeneralFeedback(2)}
          />
          <MdOutlineSentimentVeryDissatisfied
            size={48}
            color='#ff6449'
            title='Very unsatisfied'
            onClick={() => submitGeneralFeedback(1)}
          />
        </div>
        <p>We want to hear what you think!</p>
      </div>

      {customer && customer.companies[0].code === 'twist' && (
        <div className={styles.survey_and_slack}>
          <Link href='https://docs.google.com/forms/d/e/1FAIpQLSc7EbMUO3fGcU5R7Xe3YV98fsV9GBRSo4uHBdYgSCZdrvDCPA/viewform?usp=header'>
            <a target='_blank' className={styles.survey_button}>
              Take The Spork Box <br /> Satisfaction Survey
            </a>
          </Link>
          <Link href='/'>
            <a className={styles.slack_channel_link}>
              <p className={styles.join_slack}>
                Join the Slack channel for instant delivery notifications!
              </p>
              <div className={styles.slack_logo}>
                <Image
                  src='/customer/slack-logo.png'
                  width={1600}
                  height={407}
                />
              </div>
              <p className={styles.company_name}>Twist Wilsonville</p>
            </a>
          </Link>
        </div>
      )}

      <div className={styles.issue}>
        <div>
          <h2>Have an issue?</h2>
          <p>Report it here.</p>
        </div>

        <form onSubmit={submitIssueFeedback}>
          <div className={styles.item}>
            <label htmlFor='category'>What is your issue about?*</label>
            <select
              required
              id='category'
              value={category}
              onChange={handleChange}
            >
              <option hidden value='select'>
                ---Select---
              </option>
              <option value='Missing Meal'>
                Missing Meal (not present at delivery)
              </option>
              <option value='Incorrect Meal'>
                Incorrect Meal (delivered but does not match order)
              </option>
              <option value='Late Delivery'>
                Late Delivery (delivered after 12:30pm)
              </option>
              <option value='Quality Issue'>
                Quality Issue (damaged meal, foreign object, etc.)
              </option>
              <option value='Portion Size'>
                Portion Size Concern (please attach photo)
              </option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div className={styles.item}>
            <label htmlFor='date'>When did you experience this issue?*</label>
            <input
              required
              type='date'
              id='date'
              value={date}
              onChange={handleChange}
              max={getPastDate(0)}
            />
          </div>
          {!restaurants.isLoading && restaurants.data.length > 0 && (
            <div className={styles.item}>
              <label htmlFor='restaurant'>
                Which restaurant was involved?*
              </label>
              <select
                required
                id='restaurant'
                value={restaurant}
                onChange={handleChange}
              >
                <option hidden value='select'>
                  --Select---
                </option>
                <option value='Not Applicable'>Not Applicable</option>
                {restaurants.data.map((restaurant) => (
                  <option value={restaurant._id} key={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.item}>
            <label htmlFor='message'>Message*</label>
            <textarea
              required
              cols={20}
              rows={10}
              id='message'
              value={message}
              onChange={handleChange}
              placeholder='Tell us more'
            />
          </div>
          <div className={styles.image_upload}>
            <label htmlFor='image'>Image</label>
            <div className={styles.upload}>
              <div className={styles.upload_icon_and_text}>
                <FiUpload />
                <span>
                  {file ? formatImageName(file.name) : 'Upload image'}
                </span>
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
              id='image'
              type='file'
              accept='image/*'
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  file: e.target.files?.[0],
                }))
              }
            />
          </div>
          <button
            disabled={isLoading}
            type='submit'
            className={`${styles.submit_button} ${
              isLoading && styles.disabled
            }`}
          >
            {isLoading ? <ButtonLoader /> : 'Submit'}
          </button>
        </form>
      </div>

      <div className={styles.faq}>
        <h2>FAQ</h2>
        <ul>
          {FAQ_DATA.map((faq, index) => (
            <li key={index}>
              <div onClick={() => toggleFAQ(index)} className={styles.question}>
                <span
                  className={`${styles.arrow} ${
                    openQuestions.includes(index) && styles.rotate
                  }`}
                >
                  {openQuestions.includes(index) ? (
                    <IoIosArrowUp size={32} title='Arrow up' />
                  ) : (
                    <IoIosArrowDown size={32} title='Arrow down' />
                  )}
                </span>
                <p>{faq.question}</p>
              </div>
              <div
                className={`${styles.answer} ${
                  openQuestions.includes(index) && styles.open
                }`}
                style={{
                  maxHeight: openQuestions.includes(index) ? '288px' : '0px',
                }}
              >
                <div className={styles.item}>
                  {faq.answer.map((el, index) => (
                    <p key={index}>{el}</p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
