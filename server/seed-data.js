const seedCampaigns = [
  {
    id: 'camp-1',
    name: 'Q3 Social Launch',
    client: 'Mint Media',
    owner: 'Asha',
    deadline: '2026-06-25',
    status: 'In Progress',
    tasks: [
      {
        id: 'task-1',
        title: 'Finalize social copy',
        assignee: 'Asha',
        dueDate: '2026-06-05',
        priority: 'High',
        status: 'In Progress'
      },
      {
        id: 'task-2',
        title: 'Design hero assets',
        assignee: 'Sam',
        dueDate: '2026-06-09',
        priority: 'Medium',
        status: 'Planning'
      },
      {
        id: 'task-3',
        title: 'Approve media plan',
        assignee: 'Maya',
        dueDate: '2026-06-12',
        priority: 'High',
        status: 'Review'
      }
    ]
  },
  {
    id: 'camp-2',
    name: 'SEO Audit + Content',
    client: 'Bright Bites',
    owner: 'Maya',
    deadline: '2026-06-30',
    status: 'Planning',
    tasks: [
      {
        id: 'task-4',
        title: 'Audit top landing pages',
        assignee: 'Maya',
        dueDate: '2026-06-14',
        priority: 'High',
        status: 'Planning'
      },
      {
        id: 'task-5',
        title: 'Create editorial calendar',
        assignee: 'Asha',
        dueDate: '2026-06-20',
        priority: 'Medium',
        status: 'Planning'
      }
    ]
  },
  {
    id: 'camp-3',
    name: 'Paid Ads Refresh',
    client: 'Luna Labs',
    owner: 'Sam',
    deadline: '2026-07-05',
    status: 'Review',
    tasks: [
      {
        id: 'task-6',
        title: 'Refine audience segments',
        assignee: 'Sam',
        dueDate: '2026-06-18',
        priority: 'High',
        status: 'Review'
      },
      {
        id: 'task-7',
        title: 'Set budget pacing',
        assignee: 'Asha',
        dueDate: '2026-06-19',
        priority: 'Low',
        status: 'In Progress'
      }
    ]
  }
];

module.exports = { seedCampaigns };
