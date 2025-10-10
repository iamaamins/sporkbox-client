import Image from 'next/image';
import styles from './Support.module.css';
import { MdOutlineSentimentVerySatisfied } from 'react-icons/md';
import { MdSentimentVerySatisfied } from 'react-icons/md';
import { MdOutlineSentimentSatisfiedAlt } from 'react-icons/md';
import { MdOutlineSentimentDissatisfied } from 'react-icons/md';
import { MdSentimentNeutral } from 'react-icons/md';
import { MdOutlineSentimentVeryDissatisfied } from 'react-icons/md';
import { useUser } from '@context/User';
import { useState } from 'react';
import { FAQ_DATA } from 'data/FAQ';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Link from 'next/link';

export default function Support() {
  const { customer } = useUser();
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  function toggleFAQ(index: number) {
    setOpenQuestions((prevState) =>
      !prevState.includes(index)
        ? [...prevState, index]
        : prevState.filter((el) => el !== index)
    );
  }

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
          <MdOutlineSentimentSatisfiedAlt
            size={48}
            color='#afd55c'
            title='Happy'
          />
          <MdSentimentNeutral size={48} color='#fbe118' title='Undecided' />
          <MdOutlineSentimentDissatisfied
            size={48}
            color='#fba831'
            title='Not happy'
          />
          <MdOutlineSentimentVeryDissatisfied
            size={48}
            color='#ff6449'
            title='Angry'
          />
        </div>
        <p>We want to hear what you think!</p>
      </div>

      {customer && customer.companies[0].code === 'octib' && (
        <div className={styles.survey_and_slack}>
          <Link href='/'>
            <a className={styles.survey_button}>
              Take The Spork Box <br /> Survey
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

      <div className={styles.detailed_feedback}>
        <h2>Have an issue?</h2>
        <Link href='/'>
          <a className={styles.detailed_feedback_button}>
            Leave Detailed <br /> Feedback
          </a>
        </Link>
      </div>
    </section>
  );
}
