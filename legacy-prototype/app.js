const STORAGE_KEY = 'agencyPMPrototypeData';
const statusColors = {
  Planning: 'status-Planning',
  'In Progress': 'status-In Progress',
  Review: 'status-Review',
  Delivered: 'status-Delivered',
};

const state = {
  campaigns: [],
  members: [],
  selectedCampaignId: null,
  activeView: 'campaigns',
};

const elements = {
  tabs: document.querySelectorAll('.tab-btn'),
  campaignsBody: document.getElementById('campaignsBody'),
  campaignDetail: document.getElementById('campaignDetail'),
  campaignDetailTitle: document.getElementById('campaignDetailTitle'),
  campaignDetailSubtitle: document.getElementById('campaignDetailSubtitle'),
  taskBody: document.getElementById('taskBody'),
  taskForm: document.getElementById('taskForm'),
  taskTitle: document.getElementById('taskTitle'),
  taskAssignee: document.getElementById('taskAssignee'),
  taskDue: document.getElementById('taskDue'),
  taskPriority: document.getElementById('taskPriority'),
  taskStatus: document.getElementById('taskStatus'),
  taskId: document.getElementById('taskId'),
  workloadGrid: document.getElementById('workloadGrid'),
  clientSelect: document.getElementById('clientSelect'),
  clientSummary: document.getElementById('clientSummary'),
  newCampaignBtn: document.getElementById('newCampaignBtn'),
  campaignModal: document.getElementById('campaignModal'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  closeCampaignModal: document.getElementById('closeCampaignModal'),
  campaignForm: document.getElementById('campaignForm'),
  campaignName: document.getElementById('campaignName'),
  campaignClient: document.getElementById('campaignClient'),
  campaignOwner: document.getElementById('campaignOwner'),
  campaignDeadline: document.getElementById('campaignDeadline'),
  campaignStatus: document.getElementById('campaignStatus'),
  closeDetail: document.getElementById('closeDetail'),
};

const sampleData = {
  campaigns: [
    {
      id: 'camp-1',
      name: 'Q3 Social Launch',
      client: 'Mint Media',
      owner: 'Asha',
      deadline: '2026-06-25',
      status: 'In Progress',
      tasks: [
        { id: 'task-1', title: 'Finalize social copy', assignee: 'Asha', dueDate: '2026-06-05', priority: 'High', status: 'In Progress' },
        { id: 'task-2', title: 'Design hero assets', assignee: 'Sam', dueDate: '2026-06-09', priority: 'Medium', status: 'Planning' },
        { id: 'task-3', title: 'Approve media plan', assignee: 'Maya', dueDate: '2026-06-12', priority: 'High', status: 'Review' },
      ],
    },
    {
      id: 'camp-2',
      name: 'SEO Audit + Content',
      client: 'Bright Bites',
      owner: 'Maya',
      deadline: '2026-06-30',
      status: 'Planning',
      tasks: [
        { id: 'task-4', title: 'Audit top landing pages', assignee: 'Maya', dueDate: '2026-06-14', priority: 'High', status: 'Planning' },
        { id: 'task-5', title: 'Create editorial calendar', assignee: 'Asha', dueDate: '2026-06-20', priority: 'Medium', status: 'Planning' },
      ],
    },
    {
      id: 'camp-3',
      name: 'Paid Ads Refresh',
      client: 'Luna Labs',
      owner: 'Sam',
      deadline: '2026-07-05',
      status: 'Review',
      tasks: [
        { id: 'task-6', title: 'Refine audience segments', assignee: 'Sam', dueDate: '2026-06-18', priority: 'High', status: 'Review' },
        { id: 'task-7', title: 'Set budget pacing', assignee: 'Asha', dueDate: '2026-06-19', priority: 'Low', status: 'In Progress' },
      ],
    },
  ],
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse storage data', error);
    }
  }
  return sampleData;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ campaigns: state.campaigns }));
}

function computeMembers() {
  const members = new Set();
  state.campaigns.forEach((campaign) => {
    members.add(campaign.owner);
    campaign.tasks.forEach((task) => members.add(task.assignee));
  });
  state.members = Array.from(members).sort();
}

function campaignProgress(campaign) {
  if (!campaign.tasks.length) return 0;
  const done = campaign.tasks.filter((task) => task.status === 'Delivered').length;
  return Math.round((done / campaign.tasks.length) * 100);
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function renderCampaigns() {
  elements.campaignsBody.innerHTML = '';
  state.campaigns.forEach((campaign) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${campaign.name}</td>
      <td>${campaign.client}</td>
      <td>${campaign.owner}</td>
      <td>${formatDate(campaign.deadline)}</td>
      <td><span class="status-pill ${statusColors[campaign.status] || ''}">${campaign.status}</span></td>
      <td class="progress-cell">
        <div class="progress-bar"><div class="progress-fill" style="width:${campaignProgress(campaign)}%"></div></div>
        <small>${campaignProgress(campaign)}%</small>
      </td>
      <td><button class="small-btn" data-action="open" data-id="${campaign.id}">Manage</button></td>
    `;
    elements.campaignsBody.appendChild(row);
  });
}

function renderWorkload() {
  elements.workloadGrid.innerHTML = '';
  const counts = state.members.reduce((acc, member) => ({ ...acc, [member]: 0 }), {});
  state.campaigns.forEach((campaign) => {
    campaign.tasks.forEach((task) => {
      if (counts[task.assignee] !== undefined) counts[task.assignee]++;
    });
  });

  const capacity = 6;
  state.members.forEach((member) => {
    const card = document.createElement('div');
    card.className = 'workload-card';
    const count = counts[member] || 0;
    const filled = Math.min((count / capacity) * 100, 100);
    const statusText = count > capacity ? 'Overloaded' : count >= capacity * 0.75 ? 'Busy' : 'Available';
    const statusColor = count > capacity ? '#ef4444' : count >= capacity * 0.75 ? '#f59e0b' : '#16a34a';
    card.innerHTML = `
      <h3>${member}</h3>
      <p>${count} active tasks</p>
      <div class="capacity-bar"><div class="capacity-fill" style="width:${filled}%; background:${statusColor}"></div></div>
      <p style="margin: 12px 0 0; color: ${statusColor}; font-weight: 600;">${statusText}</p>
    `;
    elements.workloadGrid.appendChild(card);
  });
}

function renderClientOptions() {
  const clients = [...new Set(state.campaigns.map((campaign) => campaign.client))].sort();
  elements.clientSelect.innerHTML = clients.map((client) => `<option value="${client}">${client}</option>`).join('');
  renderClientSummary();
}

function renderClientSummary() {
  const client = elements.clientSelect.value;
  if (!client) {
    elements.clientSummary.innerHTML = '<p>No clients found.</p>';
    return;
  }
  const campaigns = state.campaigns.filter((campaign) => campaign.client === client);
  const summary = campaigns.map((campaign) => {
    const progress = campaignProgress(campaign);
    const tasksByStatus = campaign.tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
    return `
      <article>
        <h3>${campaign.name}</h3>
        <p><strong>Owner:</strong> ${campaign.owner} · <strong>Deadline:</strong> ${formatDate(campaign.deadline)}</p>
        <p><strong>Status:</strong> <span class="status-pill ${statusColors[campaign.status] || ''}">${campaign.status}</span></p>
        <p><strong>Progress:</strong> ${progress}%</p>
        <p><strong>Deliverables:</strong> ${campaign.tasks.length} task(s)</p>
        <p style="margin:8px 0 0;">${Object.entries(tasksByStatus).map(([status, count]) => `${count} ${status}`).join(' · ')}</p>
      </article>
    `;
  }).join('');
  elements.clientSummary.innerHTML = summary;
}

function openCampaignDetail(campaignId) {
  state.selectedCampaignId = campaignId;
  const campaign = state.campaigns.find((item) => item.id === campaignId);
  if (!campaign) return;
  elements.campaignDetailTitle.textContent = campaign.name;
  elements.campaignDetailSubtitle.textContent = `${campaign.client} · Owner: ${campaign.owner} · Due ${formatDate(campaign.deadline)}`;
  elements.taskBody.innerHTML = '';

  campaign.tasks.forEach((task) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.assignee}</td>
      <td>${formatDate(task.dueDate)}</td>
      <td>${task.priority}</td>
      <td>${task.status}</td>
      <td><button class="small-btn" data-action="edit" data-taskid="${task.id}">Edit</button></td>
    `;
    elements.taskBody.appendChild(row);
  });

  elements.taskAssignee.innerHTML = state.members.map((member) => `<option value="${member}">${member}</option>`).join('');
  elements.campaignDetail.classList.remove('hidden');
}

function closeCampaignDetail() {
  state.selectedCampaignId = null;
  elements.campaignDetail.classList.add('hidden');
  elements.taskForm.reset();
  elements.taskId.value = '';
}

function showModal() {
  elements.campaignModal.classList.remove('hidden');
  elements.modalBackdrop.classList.remove('hidden');
}

function hideModal() {
  elements.campaignModal.classList.add('hidden');
  elements.modalBackdrop.classList.add('hidden');
  elements.campaignForm.reset();
}

function switchView(view) {
  state.activeView = view;
  elements.tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === view);
    document.getElementById(tab.dataset.view).classList.toggle('active', tab.dataset.view === view);
  });
}

function initEventListeners() {
  elements.tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });

  elements.campaignsBody.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const campaignId = button.dataset.id;
    if (action === 'open') openCampaignDetail(campaignId);
  });

  elements.closeDetail.addEventListener('click', closeCampaignDetail);

  elements.taskBody.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const taskId = button.dataset.taskid;
    if (button.dataset.action === 'edit') {
      const campaign = state.campaigns.find((item) => item.id === state.selectedCampaignId);
      const task = campaign?.tasks.find((item) => item.id === taskId);
      if (!task) return;
      elements.taskTitle.value = task.title;
      elements.taskAssignee.value = task.assignee;
      elements.taskDue.value = task.dueDate;
      elements.taskPriority.value = task.priority;
      elements.taskStatus.value = task.status;
      elements.taskId.value = task.id;
      switchView('campaigns');
    }
  });

  elements.taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const campaign = state.campaigns.find((item) => item.id === state.selectedCampaignId);
    if (!campaign) return;
    const taskData = {
      id: elements.taskId.value || `task-${Date.now()}`,
      title: elements.taskTitle.value,
      assignee: elements.taskAssignee.value,
      dueDate: elements.taskDue.value,
      priority: elements.taskPriority.value,
      status: elements.taskStatus.value,
    };
    const existingIndex = campaign.tasks.findIndex((item) => item.id === taskData.id);
    if (existingIndex >= 0) {
      campaign.tasks[existingIndex] = taskData;
    } else {
      campaign.tasks.push(taskData);
    }
    saveState();
    computeMembers();
    renderCampaigns();
    renderWorkload();
    renderClientOptions();
    openCampaignDetail(campaign.id);
    elements.taskForm.reset();
    elements.taskId.value = '';
  });

  elements.newCampaignBtn.addEventListener('click', showModal);
  elements.closeCampaignModal.addEventListener('click', hideModal);
  elements.modalBackdrop.addEventListener('click', hideModal);

  elements.campaignForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const campaign = {
      id: `camp-${Date.now()}`,
      name: elements.campaignName.value,
      client: elements.campaignClient.value,
      owner: elements.campaignOwner.value,
      deadline: elements.campaignDeadline.value,
      status: elements.campaignStatus.value,
      tasks: [],
    };
    state.campaigns.push(campaign);
    saveState();
    computeMembers();
    renderCampaigns();
    renderWorkload();
    renderClientOptions();
    hideModal();
  });

  elements.clientSelect.addEventListener('change', renderClientSummary);
}

function init() {
  const loaded = loadState();
  state.campaigns = loaded.campaigns || sampleData.campaigns;
  computeMembers();
  renderCampaigns();
  renderWorkload();
  renderClientOptions();
  initEventListeners();
  switchView('campaigns');
}

init();
