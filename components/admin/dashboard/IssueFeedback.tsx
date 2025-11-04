import { useAlert } from '@context/Alert';
import {
  axiosInstance,
  dateToText,
  getPastDate,
  showErrorAlert,
  showSuccessAlert,
} from '@lib/utils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CustomAxiosError } from 'types';
import styles from './IssueFeedback.module.css';
import { useUser } from '@context/User';
import { FaRegCircle } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { FaCircleXmark } from 'react-icons/fa6';
import ModalContainer from '@components/layout/ModalContainer';
import Link from 'next/link';
import { ISSUE_CATEGORIES } from 'data/FEEDBACK';

type IssueFeedback = {
  _id: string;
  customer: { _id: string; firstName: string; lastName: string };
  type: 'ISSUE';
  issue: {
    category: string;
    date: string;
    restaurant: { _id: string; name: string } | null;
    message: string;
    image?: string;
    status: 'PENDING' | 'VALIDATED' | 'REJECTED';
    audit?: { note: string };
  };
};

type IssueFeedbackStats = { complaintRate: number; orderAccuracy: number };

type IssueFeedbackData = {
  isLoading: boolean;
  feedback: IssueFeedback[];
  stats: IssueFeedbackStats;
};

export default function IssueFeedback() {
  const { setAlerts } = useAlert();
  const { isAdmin, isCompanyAdmin } = useUser();
  const [issueFeedbackData, setIssueFeedbackData] = useState<IssueFeedbackData>(
    {
      isLoading: true,
      feedback: [],
      stats: { complaintRate: 0, orderAccuracy: 0 },
    }
  );
  const [period, setPeriod] = useState('7d');
  const [range, setRange] = useState({ start: '', end: '' });
  const [category, setCategory] = useState('All');
  const [issueFeedback, setIssueFeedback] = useState<IssueFeedback[]>([]);
  const [issueUpdatePayload, setIssueUpdatePayload] = useState({
    id: '',
    user: '',
    category: '',
  });
  const [showIssueUpdateModal, setShowIssueUpdateModal] = useState(false);

  function initiateIssueUpdate(id: string, user: string, category: string) {
    setIssueUpdatePayload({ id, user, category });
    setShowIssueUpdateModal(true);
  }

  // Filter issue feedback
  useEffect(() => {
    setIssueFeedback(
      category === 'All'
        ? issueFeedbackData.feedback
        : issueFeedbackData.feedback.filter(
            (feedback) => feedback.issue.category === category
          )
    );
  }, [category, issueFeedbackData.feedback]);

  // Get issue feedback data
  useEffect(() => {
    async function getIssueStatAndData(start: string, end: string) {
      try {
        const response = await axiosInstance.get(
          `/feedback/issue/${start}/${end}`
        );

        setIssueFeedbackData({
          isLoading: false,
          stats: response.data.stats,
          feedback: response.data.feedback,
        });
        setIssueFeedback(response.data.feedback);
      } catch (err) {
        setIssueFeedbackData((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        showErrorAlert(err as CustomAxiosError, setAlerts);
      }
    }

    let start = '';
    let end = getPastDate(0);
    if (period === '7d') start = getPastDate(7);
    if (period === '30d') start = getPastDate(30);
    if (period === '3m') start = getPastDate(90);
    if (period === 'custom' && range.start && range.end) {
      start = range.start;
      end = range.end;
    }

    if ((isAdmin || isCompanyAdmin) && start && end)
      getIssueStatAndData(start, end);
  }, [isAdmin, isCompanyAdmin, period, range]);

  return (
    <section className={styles.container}>
      <h2>Issues</h2>
      <form className={styles.period_and_range_selector}>
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setRange({ start: '', end: '' });
          }}
          className={styles.period_selector}
        >
          <option value='7d'>Last 7 days</option>
          <option value='30d'>Last 30 days</option>
          <option value='3m'>Last 3 months</option>
          <option value='custom'>Custom range</option>
        </select>
        {period === 'custom' && (
          <div className={styles.range_selector}>
            <div>
              <label htmlFor='start'>From</label>
              <input
                type='date'
                id='start'
                value={range.start}
                onChange={(e) =>
                  setRange((prevState) => ({
                    ...prevState,
                    start: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor='end'>To</label>
              <input
                type='date'
                id='end'
                value={range.end}
                max={getPastDate(0)}
                onChange={(e) =>
                  setRange((prevState) => ({
                    ...prevState,
                    end: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}
        <select
          value={category}
          className={styles.category_selector}
          onChange={(e) => setCategory(e.target.value)}
        >
          {ISSUE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value='All'>All</option>
        </select>
      </form>
      {issueFeedbackData.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : (
        <div className={styles.tables}>
          <table>
            <thead>
              <tr>
                <th>Complaint rate</th>
                <th>Order accuracy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{issueFeedbackData.stats.complaintRate}%</td>
                <td>{issueFeedbackData.stats.orderAccuracy}%</td>
              </tr>
            </tbody>
          </table>
          {issueFeedback.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Restaurant</th>
                  <th className={styles.hide_on_mobile}>User</th>
                  <th>Category</th>
                  <th className={styles.hide_on_mobile}>Comment</th>
                  <th className={styles.hide_on_mobile}>Image</th>
                  <th className={styles.hide_on_mobile}>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issueFeedback.map((feedback) => (
                  <tr key={feedback._id}>
                    <td>{dateToText(feedback.issue.date)}</td>
                    <td>
                      {feedback.issue.restaurant?.name || 'Not Applicable'}
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {feedback.customer.firstName} {feedback.customer.lastName}
                    </td>
                    <td>{feedback.issue.category}</td>
                    <td className={styles.hide_on_mobile}>
                      {feedback.issue.message}
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {feedback.issue.image ? (
                        <Link href={feedback.issue.image}>
                          <a target='_blank'>View image</a>
                        </Link>
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {feedback.issue.audit?.note || 'Not updated'}
                    </td>
                    <td
                      className={`${styles.issue_status} ${
                        (isCompanyAdmin ||
                          feedback.issue.status !== 'PENDING') &&
                        styles.default_cursor
                      }`}
                      onClick={() =>
                        !isCompanyAdmin &&
                        feedback.issue.status === 'PENDING' &&
                        initiateIssueUpdate(
                          feedback._id,
                          `${feedback.customer.firstName} ${feedback.customer.lastName}`,
                          feedback.issue.category
                        )
                      }
                    >
                      {feedback.issue.status === 'REJECTED' ? (
                        <FaCircleXmark color='red' />
                      ) : feedback.issue.status === 'VALIDATED' ? (
                        <FaCircleCheck color='green' />
                      ) : (
                        feedback.issue.status === 'PENDING' && <FaRegCircle />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <ModalContainer
        component={
          <IssueUpdateModal
            issueUpdatePayload={issueUpdatePayload}
            setIssueFeedbackData={setIssueFeedbackData}
            setShowIssueUpdateModal={setShowIssueUpdateModal}
          />
        }
        showModalContainer={showIssueUpdateModal}
        setShowModalContainer={setShowIssueUpdateModal}
      />
    </section>
  );
}

function IssueUpdateModal({
  issueUpdatePayload,
  setIssueFeedbackData,
  setShowIssueUpdateModal,
}: {
  issueUpdatePayload: { id: string; user: string; category: string };
  setIssueFeedbackData: Dispatch<SetStateAction<IssueFeedbackData>>;
  setShowIssueUpdateModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { setAlerts } = useAlert();
  const [auditNote, setAuditNote] = useState('');
  const [isUpdatingIssue, setIsUpdatingIssue] = useState(false);

  async function updateIssue(issueId: string, action: 'validate' | 'reject') {
    try {
      setIsUpdatingIssue(true);

      const response = await axiosInstance.patch(
        `/feedback/issue/${issueId}/${action}`,
        { auditNote }
      );

      setIssueFeedbackData((prevState) => {
        if (!prevState.feedback) return prevState;

        const updatedIssueFeedback = prevState.feedback.map((feedback) => {
          if (feedback._id !== response.data._id) return feedback;
          return {
            ...feedback,
            issue: {
              ...feedback.issue,
              status: response.data.issue.status,
              audit: { note: response.data.issue.audit.note },
            },
          };
        });

        return { ...prevState, feedback: updatedIssueFeedback };
      });

      showSuccessAlert('Issue updated successfully.', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setAuditNote('');
      setIsUpdatingIssue(false);
      setShowIssueUpdateModal(false);
    }
  }

  return (
    <div className={styles.issue_update_modal}>
      <p>
        Resolve {issueUpdatePayload.category} issue reported by{' '}
        {issueUpdatePayload.user}
      </p>
      <div className={styles.audit_note}>
        <label htmlFor='auditNote'>Audit note</label>
        <textarea
          id='auditNote'
          rows={3}
          cols={40}
          value={auditNote}
          placeholder='Type audit note'
          onChange={(e) => setAuditNote(e.target.value)}
        />
      </div>
      <div className={styles.buttons}>
        <button
          disabled={isUpdatingIssue}
          onClick={() => updateIssue(issueUpdatePayload.id, 'validate')}
        >
          Validate
        </button>
        <button
          disabled={isUpdatingIssue}
          onClick={() => updateIssue(issueUpdatePayload.id, 'reject')}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
