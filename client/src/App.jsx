import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'agencyPMClientData';
const apiUrl = '/api/seed';
const statuses = ['Planning', 'In Progress', 'Review', 'Delivered'];
const priorities = ['High', 'Medium', 'Low'];
const capacityLimit = 6;

const emptyCampaign = {
  name: '',
  client: '',
  owner: '',
  deadline: '',
  status: 'Planning',
};

const emptyTask = {
  id: '',
  title: '',
  assignee: '',
  dueDate: '',
  priority: 'Medium',
  status: 'Planning',
};

function loadFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Invalid localStorage payload', error);
    return null;
  }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function statusClass(status) {
  return `status-pill status-${status.replace(/\s+/g, '')}`;
}

function useMembers(campaigns) {
  return useMemo(() => {
    const set = new Set();
    campaigns.forEach((campaign) => {
      set.add(campaign.owner);
      campaign.tasks.forEach((task) => set.add(task.assignee));
    });
    return Array.from(set).filter(Boolean).sort();
  }, [campaigns]);
}

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [view, setView] = useState('campaigns');
  const [campaignForm, setCampaignForm] = useState(emptyCampaign);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [clientFilter, setClientFilter] = useState('');

  const members = useMembers(campaigns);
  const selectedCampaign = campaigns.find((item) => item.id === selectedCampaignId) || null;
  const clients = useMemo(() => Array.from(new Set(campaigns.map((campaign) => campaign.client))).sort(), [campaigns]);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored?.campaigns?.length) {
      setCampaigns(stored.campaigns);
      setClientFilter(stored.campaigns[0]?.client || '');
      return;
    }

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const loaded = data?.campaigns || [];
        setCampaigns(loaded);
        setClientFilter(loaded[0]?.client || '');
        saveToStorage({ campaigns: loaded });
      })
      .catch((error) => {
        console.error('Seed fetch failed', error);
      });
  }, []);

  useEffect(() => {
    if (campaigns.length) {
      saveToStorage({ campaigns });
    }
  }, [campaigns]);

  const handleCampaignChange = (field, value) => {
    setCampaignForm((current) => ({ ...current, [field]: value }));
  };

  const handleTaskChange = (field, value) => {
    setTaskForm((current) => ({ ...current, [field]: value }));
  };

  const getProgress = (campaign) => {
    if (!campaign.tasks.length) return 0;
    const completed = campaign.tasks.filter((task) => task.status === 'Delivered').length;
    return Math.round((completed / campaign.tasks.length) * 100);
  };

  const workload = useMemo(() => {
    const counts = members.reduce((acc, member) => ({ ...acc, [member]: 0 }), {});
    campaigns.forEach((campaign) => {
      campaign.tasks.forEach((task) => {
        if (task.assignee) counts[task.assignee] = (counts[task.assignee] || 0) + 1;
      });
    });
    return counts;
  }, [campaigns, members]);

  const handleCreateCampaign = (event) => {
    event.preventDefault();
    if (!campaignForm.name || !campaignForm.client || !campaignForm.owner || !campaignForm.deadline) return;

    const newCampaign = {
      ...campaignForm,
      id: `camp-${Date.now()}`,
      tasks: [],
    };

    setCampaigns((current) => [...current, newCampaign]);
    setCampaignForm(emptyCampaign);
    setShowCampaignModal(false);
  };

  const openCampaign = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setView('campaigns');
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();
    if (!selectedCampaign || !taskForm.title || !taskForm.assignee || !taskForm.dueDate) return;

    const updatedCampaigns = campaigns.map((campaign) => {
      if (campaign.id !== selectedCampaign.id) return campaign;

      const task = {
        ...taskForm,
        id: taskForm.id || `task-${Date.now()}`,
      };

      const tasks = taskForm.id
        ? campaign.tasks.map((current) => (current.id === task.id ? task : current))
        : [...campaign.tasks, task];

      return { ...campaign, tasks };
    });

    setCampaigns(updatedCampaigns);
    setTaskForm(emptyTask);
  };

  const handleEditTask = (task) => {
    setTaskForm(task);
  };

  const selectedClient = clientFilter || clients[0] || '';
  const clientCampaigns = campaigns.filter((campaign) => campaign.client === selectedClient);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Agency PM System</h1>
          <p>React + Node prototype with campaign, task, workload, and client dashboards.</p>
        </div>
        <nav className="tabs">
          <button className={view === 'campaigns' ? 'tab-btn active' : 'tab-btn'} onClick={() => setView('campaigns')}>
            Campaigns
          </button>
          <button className={view === 'workload' ? 'tab-btn active' : 'tab-btn'} onClick={() => setView('workload')}>
            Workload
          </button>
          <button className={view === 'client-dashboard' ? 'tab-btn active' : 'tab-btn'} onClick={() => setView('client-dashboard')}>
            Client Dashboard
          </button>
        </nav>
      </header>

      <main>
        {view === 'campaigns' && (
          <section>
            <div className="section-header">
              <div>
                <h2>Campaigns</h2>
                <p>Track active campaigns with owner, deadline, and delivery progress.</p>
              </div>
              <button className="primary-btn" onClick={() => setShowCampaignModal(true)}>
                New Campaign
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Client</th>
                    <th>Owner</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>{campaign.name}</td>
                      <td>{campaign.client}</td>
                      <td>{campaign.owner}</td>
                      <td>{formatDate(campaign.deadline)}</td>
                      <td>
                        <span className={statusClass(campaign.status)}>{campaign.status}</span>
                      </td>
                      <td>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${getProgress(campaign)}%` }} />
                        </div>
                        <small>{getProgress(campaign)}%</small>
                      </td>
                      <td>
                        <button className="small-btn" onClick={() => openCampaign(campaign.id)}>
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedCampaign && (
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>{selectedCampaign.name}</h3>
                    <p>
                      {selectedCampaign.client} · Owner: {selectedCampaign.owner} · Due {formatDate(selectedCampaign.deadline)}
                    </p>
                  </div>
                  <button className="secondary-btn" onClick={() => setSelectedCampaignId(null)}>
                    Close
                  </button>
                </div>

                <div className="panel-grid">
                  <div>
                    <h4>Tasks</h4>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Task</th>
                            <th>Assignee</th>
                            <th>Due</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCampaign.tasks.map((task) => (
                            <tr key={task.id}>
                              <td>{task.title}</td>
                              <td>{task.assignee}</td>
                              <td>{formatDate(task.dueDate)}</td>
                              <td>{task.priority}</td>
                              <td>{task.status}</td>
                              <td>
                                <button className="small-btn" onClick={() => handleEditTask(task)}>
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="task-form-card">
                    <h4>{taskForm.id ? 'Update Task' : 'Create Task'}</h4>
                    <form onSubmit={handleTaskSubmit}>
                      <label>
                        Title
                        <input value={taskForm.title} onChange={(e) => handleTaskChange('title', e.target.value)} required />
                      </label>
                      <label>
                        Assignee
                        <select value={taskForm.assignee} onChange={(e) => handleTaskChange('assignee', e.target.value)} required>
                          <option value="">Select a team member</option>
                          {members.map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Due Date
                        <input type="date" value={taskForm.dueDate} onChange={(e) => handleTaskChange('dueDate', e.target.value)} required />
                      </label>
                      <label>
                        Priority
                        <select value={taskForm.priority} onChange={(e) => handleTaskChange('priority', e.target.value)}>
                          {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Status
                        <select value={taskForm.status} onChange={(e) => handleTaskChange('status', e.target.value)}>
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button type="submit" className="primary-btn">
                        Save Task
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {view === 'workload' && (
          <section>
            <div className="section-header">
              <div>
                <h2>Team Workload</h2>
                <p>See task load by assignee, with capacity indicators for fast triage.</p>
              </div>
            </div>
            <div className="workload-grid">
              {members.map((member) => {
                const count = workload[member] || 0;
                const ratio = Math.min((count / capacityLimit) * 100, 100);
                const busy = count >= capacityLimit * 0.75;
                const color = count > capacityLimit ? '#ef4444' : busy ? '#f59e0b' : '#16a34a';
                return (
                  <div className="workload-card" key={member}>
                    <h3>{member}</h3>
                    <p>{count} active tasks</p>
                    <div className="capacity-bar">
                      <div className="capacity-fill" style={{ width: `${ratio}%`, background: color }} />
                    </div>
                    <p className="workload-status" style={{ color }}>
                      {count > capacityLimit ? 'Overloaded' : busy ? 'Busy' : 'Available'}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {view === 'client-dashboard' && (
          <section>
            <div className="section-header">
              <div>
                <h2>Client Dashboard</h2>
                <p>Read-only client view summarizing campaigns, status, and deliverables.</p>
              </div>
            </div>
            <div className="dashboard-card">
              <label>
                Choose Client
                <select value={selectedClient} onChange={(e) => setClientFilter(e.target.value)}>
                  {clients.map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
              </label>
              <div className="client-summary">
                {clientCampaigns.map((campaign) => (
                  <article key={campaign.id}>
                    <h3>{campaign.name}</h3>
                    <p>
                      <strong>Owner:</strong> {campaign.owner} · <strong>Deadline:</strong> {formatDate(campaign.deadline)}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={statusClass(campaign.status)}>{campaign.status}</span>
                    </p>
                    <p>
                      <strong>Deliverables:</strong> {campaign.tasks.length} task(s)
                    </p>
                    <p>{campaign.tasks.reduce((acc, task) => {
                      acc[task.status] = (acc[task.status] || 0) + 1;
                      return acc;
                    }, {}) && Object.entries(campaign.tasks.reduce((acc, task) => {
                      acc[task.status] = (acc[task.status] || 0) + 1;
                      return acc;
                    }, {})).map(([status, count]) => `${count} ${status}`).join(' · ')}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {showCampaignModal && (
        <div className="modal-backdrop" onClick={() => setShowCampaignModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>New Campaign</h3>
              <button className="close-button" onClick={() => setShowCampaignModal(false)}>
                ×
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateCampaign}>
              <label>
                Campaign Name
                <input value={campaignForm.name} onChange={(e) => handleCampaignChange('name', e.target.value)} required />
              </label>
              <label>
                Client Name
                <input value={campaignForm.client} onChange={(e) => handleCampaignChange('client', e.target.value)} required />
              </label>
              <label>
                Owner
                <input value={campaignForm.owner} onChange={(e) => handleCampaignChange('owner', e.target.value)} required />
              </label>
              <label>
                Deadline
                <input type="date" value={campaignForm.deadline} onChange={(e) => handleCampaignChange('deadline', e.target.value)} required />
              </label>
              <label>
                Status
                <select value={campaignForm.status} onChange={(e) => handleCampaignChange('status', e.target.value)}>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <button className="primary-btn" type="submit">
                Create Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
