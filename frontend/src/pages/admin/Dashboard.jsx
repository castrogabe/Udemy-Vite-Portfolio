import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Chart from 'react-google-charts';
import LoadingBox from '../../components/LoadingBox.jsx';
import MessageBox from '../../components/MessageBox.jsx';
import { Store } from '../../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '', summary: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload || 'Error' };
    default:
      return state;
  }
};

export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { users: [], websites: [], messagesTotal: 0 },
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        // Summary (users + websites aggregates)
        const sRes = await fetch('/api/summary/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const sBody = await sRes.json().catch(() => ({}));
        if (!sRes.ok) throw new Error(sBody?.message || `HTTP ${sRes.status}`);

        // Messages (just need a total count; use admin endpoint with tiny page)
        const mRes = await fetch('/api/messages/admin?page=1&pageSize=1', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const mBody = await mRes.json().catch(() => ({}));
        if (!mRes.ok) throw new Error(mBody?.message || `HTTP ${mRes.status}`);

        const messagesTotal =
          typeof mBody.totalMessages === 'number'
            ? mBody.totalMessages
            : Array.isArray(mBody.messages)
            ? mBody.messages.length
            : 0;

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { ...sBody, messagesTotal },
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };

    fetchData();
  }, [userInfo]);

  const numUsers =
    summary?.users && summary.users[0] ? summary.users[0].numUsers : 0;

  const websitesTotal = Array.isArray(summary?.websites)
    ? summary.websites.reduce((acc, cur) => acc + (cur.totalWebsites || 0), 0)
    : 0;

  const websiteStacks = Array.isArray(summary?.websites)
    ? summary.websites.length
    : 0;

  const messagesTotal = summary?.messagesTotal || 0;

  return (
    <div className='content'>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <br />
      <h2 className='box'>Admin Dashboard</h2>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          {/* Stat cards */}
          <div className='row mt-3'>
            <div className='col-12 col-md-3 mb-3'>
              <div className='card h-100'>
                <div className='card-body'>
                  <h3 className='card-title mb-1'>{numUsers}</h3>
                  <p className='card-text text-muted'>Users</p>
                </div>
              </div>
            </div>

            <div className='col-12 col-md-3 mb-3'>
              <div className='card h-100'>
                <div className='card-body'>
                  <h3 className='card-title mb-1'>{websitesTotal}</h3>
                  <p className='card-text text-muted'>Total Websites</p>
                </div>
              </div>
            </div>

            <div className='col-12 col-md-3 mb-3'>
              <div className='card h-100'>
                <div className='card-body'>
                  <h3 className='card-title mb-1'>{websiteStacks}</h3>
                  <p className='card-text text-muted'>Website Stack</p>
                </div>
              </div>
            </div>

            <div className='col-12 col-md-3 mb-3'>
              <div className='card h-100'>
                <div className='card-body'>
                  <h3 className='card-title mb-1'>{messagesTotal}</h3>
                  <p className='card-text text-muted'>Messages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pie chart */}
          <div className='my-3'>
            <h2>Websites by Language Description</h2>
            {!summary?.websites || summary.websites.length === 0 ? (
              <MessageBox>No Websites</MessageBox>
            ) : (
              <Chart
                width='100%'
                height='400px'
                chartType='PieChart'
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Language Description', 'Websites'],
                  ...summary.websites.map((x) => [x._id, x.totalWebsites]),
                ]}
              />
            )}
          </div>
          <br />
        </>
      )}
    </div>
  );
}

// If you want to review the commented teaching version of the Dashboard.jsx setup, check commit lesson-07.
