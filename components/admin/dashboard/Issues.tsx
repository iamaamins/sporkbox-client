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
import styles from './Issues.module.css';
import { useUser } from '@context/User';
import { FaRegCircle } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { FaCircleXmark } from 'react-icons/fa6';
import ModalContainer from '@components/layout/ModalContainer';
import Link from 'next/link';

type Issue = {
  _id: string;
  customer: { _id: string; firstName: string; lastName: string };
  type: 'ISSUE';
  issue: {
    category: string;
    date: string;
    restaurant: { _id: string; name: string } | null;
    message: string;
    image?: string;
    isValidated: boolean;
    isRejected: boolean;
  };
};
type IssueStat = { complaintRate: number; orderAccuracy: number };

type Issues = {
  isLoading: boolean;
  stats: IssueStat | null;
  data: Issue[] | null;
};

export default function Issues() {
  const { isAdmin } = useUser();
  const { setAlerts } = useAlert();
  const [issues, setIssues] = useState<Issues>({
    stats: null,
    data: null,
    isLoading: true,
  });
  const [period, setPeriod] = useState('7d');
  const [range, setRange] = useState({ start: '', end: '' });
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

  useEffect(() => {
    async function getIssueStatAndData(start: string, end: string) {
      try {
        const response = await axiosInstance.get(
          `/feedback/issue/${start}/${end}`
        );

        setIssues({
          isLoading: false,
          stats: {
            complaintRate: response.data.complaintRate,
            orderAccuracy: response.data.orderAccuracy,
          },
          data: response.data.issues,
        });
      } catch (err) {
        setIssues((prevState) => ({ ...prevState, isLoading: false }));
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

    if (isAdmin && start && end) getIssueStatAndData(start, end);
  }, [isAdmin, period, range]);

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
      </form>
      {issues.isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : (
        <div className={styles.tables}>
          {issues.stats && (
            <table>
              <thead>
                <tr>
                  <th>Complaint rate</th>
                  <th>Order accuracy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{issues.stats.complaintRate}%</td>
                  <td>{issues.stats.orderAccuracy}%</td>
                </tr>
              </tbody>
            </table>
          )}
          {issues.data && issues.data.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Restaurant</th>
                  <th className={styles.hide_on_mobile}>User</th>
                  <th>Category</th>
                  <th className={styles.hide_on_mobile}>Comment</th>
                  {issues.data.some((el) => el.issue.image) && (
                    <th className={styles.hide_on_mobile}>Image</th>
                  )}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.data.map((el) => (
                  <tr key={el._id}>
                    <td>{dateToText(el.issue.date)}</td>
                    <td>{el.issue.restaurant?.name || 'Not Applicable'}</td>
                    <td className={styles.hide_on_mobile}>
                      {el.customer.firstName} {el.customer.lastName}
                    </td>
                    <td>{el.issue.category}</td>
                    <td className={styles.hide_on_mobile}>
                      {el.issue.message}
                    </td>
                    <td className={styles.hide_on_mobile}>
                      {el.issue.image ? (
                        <Link href={el.issue.image}>
                          <a target='_blank'>View image</a>
                        </Link>
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td
                      className={`${styles.issue_status} ${
                        (el.issue.isValidated || el.issue.isRejected) &&
                        styles.updated
                      }`}
                      onClick={() =>
                        !el.issue.isValidated &&
                        !el.issue.isRejected &&
                        initiateIssueUpdate(
                          el._id,
                          `${el.customer.firstName} ${el.customer.lastName}`,
                          el.issue.category
                        )
                      }
                    >
                      {el.issue.isRejected ? (
                        <FaCircleXmark />
                      ) : el.issue.isValidated ? (
                        <FaCircleCheck />
                      ) : (
                        !el.issue.isValidated && <FaRegCircle />
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
            setIssues={setIssues}
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
  setIssues,
  setShowIssueUpdateModal,
}: {
  issueUpdatePayload: { id: string; user: string; category: string };
  setIssues: Dispatch<SetStateAction<Issues>>;
  setShowIssueUpdateModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { setAlerts } = useAlert();
  const [isUpdatingIssue, setIsUpdatingIssue] = useState(false);

  async function updateIssue(issueId: string, action: 'validate' | 'reject') {
    try {
      setIsUpdatingIssue(true);

      const response = await axiosInstance.patch(
        `/feedback/issue/${issueId}/${action}`
      );

      setIssues((prevState) => {
        if (!prevState.data) return prevState;

        const updatedIssues = prevState.data.map((el) => {
          if (el._id !== response.data._id) return el;
          return { ...response.data, issue: response.data.issue };
        });

        return { ...prevState, data: updatedIssues };
      });

      showSuccessAlert('Issue updated successfully.', setAlerts);
    } catch (err) {
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      setIsUpdatingIssue(false);
      setShowIssueUpdateModal(false);
    }
  }

  return (
    <div className={styles.issue_update_modal}>
      <p>
        Update {issueUpdatePayload.category} issue reported by{' '}
        {issueUpdatePayload.user}
      </p>
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
