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
  getPastDate,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { CustomAxiosError, FormData } from 'types';
import { useAlert } from '@context/Alert';
import SubmitButton from '@components/layout/SubmitButton';
import ButtonLoader from '@components/layout/ButtonLoader';

type Restaurants = {
  isLoading: boolean;
  data: { _id: string; name: string }[];
};

export default function Support() {
  const router = useRouter();
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [restaurants, setRestaurants] = useState<Restaurants>({
    isLoading: true,
    data: [],
  });
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    issue: '',
    date: '',
    restaurant: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { issue, date, restaurant, message } = formData;

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!issue || !date || !restaurant || !message)
      return showErrorAlert('Please provide the required fields', setAlerts);

    try {
      setIsLoading(true);

      await axiosInstance.post('/feedback/issue', {
        issue,
        date,
        restaurant,
        message,
      });

      showSuccessAlert('Feedback submitted', setAlerts);
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
        >('/restaurants/active');
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
          />
          <MdSentimentVerySatisfied
            size={48}
            color='#85d273'
            title='Satisfied'
          />
          <MdSentimentNeutral size={48} color='#fbe118' title='Neither' />
          <MdOutlineSentimentDissatisfied
            size={48}
            color='#fba831'
            title='Somewhat unsatisfied'
          />
          <MdOutlineSentimentVeryDissatisfied
            size={48}
            color='#ff6449'
            title='Very unsatisfied'
          />
        </div>
        <p>We want to hear what you think!</p>
      </div>

      {customer && customer.companies[0].code === 'octib' && (
        <div className={styles.survey_and_slack}>
          <Link href='/'>
            <a className={styles.survey_button}>
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

        <form onSubmit={handleSubmit}>
          <div className={styles.item}>
            <label htmlFor='issue'>What is your issue about?*</label>
            <select required id='issue' value={issue} onChange={handleChange}>
              <option hidden value='select'>
                ---Select---
              </option>
              <option value='Missing Meal'>
                Missing Meal (not present at delivery; excluded if later found
                or identified as theft)
              </option>
              <option value='Incorrect Meal'>
                Incorrect Meal (delivered but does not match order)
              </option>
              <option value='Late Delivery'>
                Late Delivery (outside the service window defined in SLA §2)
              </option>
              <option value='Foreign Object'>
                Foreign Object / Immediate Quality Issue (reported at time of
                delivery)
              </option>
              <option value='Portion Size Concern'>
                Portion Size Concern (feedback only, not KPI failure)
              </option>
              <option value='Other'>
                Other (recorded but only counted if recategorized into a KPI
                category)
              </option>
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
          <button
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
