import type { Complaint, DuplicateGroup, Department } from './types';

// 15+ realistic mock complaints pre-populated for the Officer Dashboard demo
const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
const minutesAhead = (m: number) => new Date(now.getTime() + m * 60000).toISOString();

export const DEPARTMENTS: { name: Department; subCategories: string[]; officer: string }[] = [
  { name: 'Municipal Corporation', subCategories: ['Garbage Collection', 'Street Lighting', 'Road Repair', 'Encroachment'], officer: 'Rajesh Kumar' },
  { name: 'Public Works Department', subCategories: ['Road Construction', 'Bridge Maintenance', 'Public Infrastructure'], officer: 'Sunita Sharma' },
  { name: 'Electricity Board', subCategories: ['Power Outage', 'Billing Dispute', 'Transformer Issue', 'Street Light Fault'], officer: 'Amit Verma' },
  { name: 'Water Supply & Sewerage', subCategories: ['Water Shortage', 'Pipeline Leak', 'Sewer Overflow', 'Water Quality'], officer: 'Priya Nair' },
  { name: 'Police Department', subCategories: ['Traffic Violation', 'Public Nuisance', 'Theft Report', 'Cyber Crime'], officer: 'Vikram Singh' },
  { name: 'Health & Family Welfare', subCategories: ['Hospital Negligence', 'Sanitation Issue', 'Disease Outbreak', 'Drug Adulteration'], officer: 'Dr. Meena Iyer' },
  { name: 'Transport Authority', subCategories: ['Bus Service', 'License Issue', 'Fare Dispute', 'Road Safety'], officer: 'Karthik Reddy' },
  { name: 'Revenue & Land Records', subCategories: ['Land Dispute', 'Mutation Pending', 'Record Correction'], officer: 'Lakshmi Devi' },
  { name: 'Education Department', subCategories: ['School Infrastructure', 'Teacher Absenteeism', 'Fee Dispute', 'Midday Meal Issue'], officer: 'Sanjay Gupta' },
  { name: 'Environment & Pollution Control', subCategories: ['Industrial Emissions', 'Noise Pollution', 'Water Contamination', 'Illegal Dumping'], officer: 'Anjali Desai' },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'GRV-2026-001',
    citizenName: 'Ramesh Patil',
    citizenContact: '+91 98220 11234',
    text: 'There is a massive garbage pile near Ward 12, Sector 7 that has not been collected for over two weeks. The smell is unbearable and mosquitoes are breeding rapidly. Children in the area are falling sick.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(45),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Sanitation Complaint',
      entities: ['Ward 12', 'Sector 7', 'garbage collection'],
      sentiment: 'negative',
      urgency: 'high',
      confidence: 91,
      flaggedForReview: false,
    },
    routing: {
      department: 'Municipal Corporation',
      subCategory: 'Garbage Collection',
      jurisdiction: 'Pune Municipal Corporation',
      assignedOfficer: 'Rajesh Kumar',
      reasons: [
        { module: 'Department Mapping', detail: 'Sanitation & waste management → Municipal Corporation' },
        { module: 'Sub-Category Tagging', detail: 'Garbage collection / uncollected waste' },
        { module: 'Jurisdiction Check', detail: 'Ward 12 falls under Pune Municipal Corporation' },
        { module: 'Workload Balancer', detail: 'Officer Rajesh Kumar has 3 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(180),
    slaTotalMinutes: 480,
    duplicateGroupId: 'CASE-GRV-001',
    duplicateGroupSize: 3,
  },
  {
    id: 'GRV-2026-002',
    citizenName: 'Sunita Kale',
    citizenContact: '+91 98765 43210',
    text: 'No electricity in our entire lane for the past 3 days. Multiple complaints to local office went unanswered. We are in sector 14, Kothrud. Elderly residents are suffering in this heat.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(120),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Power Outage Complaint',
      entities: ['Sector 14', 'Kothrud', '3 days'],
      sentiment: 'very negative',
      urgency: 'critical',
      confidence: 88,
      flaggedForReview: false,
    },
    routing: {
      department: 'Electricity Board',
      subCategory: 'Power Outage',
      jurisdiction: 'MSEDCL Pune Circle',
      assignedOfficer: 'Amit Verma',
      reasons: [
        { module: 'Department Mapping', detail: 'Electricity supply → Electricity Board' },
        { module: 'Sub-Category Tagging', detail: 'Extended power outage (3+ days)' },
        { module: 'Jurisdiction Check', detail: 'Kothrud falls under MSEDCL Pune Circle' },
        { module: 'Workload Balancer', detail: 'Officer Amit Verma has 2 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(30),
    slaTotalMinutes: 360,
    duplicateGroupId: 'CASE-GRV-002',
    duplicateGroupSize: 1,
  },
  {
    id: 'GRV-2026-003',
    citizenName: 'Ahmed Khan',
    citizenContact: '+91 90011 22334',
    text: 'The main road connecting Hadapsar to Magarpatta has huge potholes. My car got damaged yesterday. This road was supposed to be repaired last month but nothing happened.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(300),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Road Infrastructure Complaint',
      entities: ['Hadapsar', 'Magarpatta', 'potholes'],
      sentiment: 'negative',
      urgency: 'medium',
      confidence: 84,
      flaggedForReview: false,
    },
    routing: {
      department: 'Public Works Department',
      subCategory: 'Road Construction',
      jurisdiction: 'Pune PWD Division',
      assignedOfficer: 'Sunita Sharma',
      reasons: [
        { module: 'Department Mapping', detail: 'Road infrastructure → Public Works Department' },
        { module: 'Sub-Category Tagging', detail: 'Pothole / road surface damage' },
        { module: 'Jurisdiction Check', detail: 'Hadapsar-Magarpatta road under Pune PWD Division' },
        { module: 'Workload Balancer', detail: 'Officer Sunita Sharma has 4 active cases — near capacity' },
      ],
    },
    slaDeadline: minutesAhead(600),
    slaTotalMinutes: 1440,
    duplicateGroupId: 'CASE-GRV-003',
    duplicateGroupSize: 2,
  },
  {
    id: 'GRV-2026-004',
    citizenName: 'Fatima Sheikh',
    citizenContact: '+91 80123 45678',
    text: 'Garbage has been piling up near Sector 7 for weeks. The entire area smells terrible and there are mosquitoes everywhere. Please send someone to clean this immediately.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(60),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Sanitation Complaint',
      entities: ['Sector 7', 'garbage', 'mosquitoes'],
      sentiment: 'negative',
      urgency: 'high',
      confidence: 93,
      flaggedForReview: false,
    },
    routing: {
      department: 'Municipal Corporation',
      subCategory: 'Garbage Collection',
      jurisdiction: 'Pune Municipal Corporation',
      assignedOfficer: 'Rajesh Kumar',
      reasons: [
        { module: 'Department Mapping', detail: 'Sanitation & waste management → Municipal Corporation' },
        { module: 'Sub-Category Tagging', detail: 'Garbage collection / uncollected waste' },
        { module: 'Jurisdiction Check', detail: 'Sector 7 falls under Pune Municipal Corporation' },
        { module: 'Workload Balancer', detail: 'Officer Rajesh Kumar has 3 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(165),
    slaTotalMinutes: 480,
    duplicateGroupId: 'CASE-GRV-001',
    duplicateGroupSize: 3,
  },
  {
    id: 'GRV-2026-005',
    citizenName: 'Deepak Joshi',
    citizenContact: '+91 91234 56789',
    text: 'Water supply has been completely cut off in our society for 5 days. No prior notice was given. There are 200+ families affected. We need urgent help.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(90),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Water Supply Complaint',
      entities: ['5 days', '200+ families', 'water supply'],
      sentiment: 'very negative',
      urgency: 'critical',
      confidence: 90,
      flaggedForReview: false,
    },
    routing: {
      department: 'Water Supply & Sewerage',
      subCategory: 'Water Shortage',
      jurisdiction: 'PMC Water Department',
      assignedOfficer: 'Priya Nair',
      reasons: [
        { module: 'Department Mapping', detail: 'Water supply → Water Supply & Sewerage Board' },
        { module: 'Sub-Category Tagging', detail: 'Extended water shortage (5+ days)' },
        { module: 'Jurisdiction Check', detail: 'Falls under PMC Water Department jurisdiction' },
        { module: 'Workload Balancer', detail: 'Officer Priya Nair has 1 active case — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(60),
    slaTotalMinutes: 360,
    duplicateGroupId: 'CASE-GRV-005',
    duplicateGroupSize: 1,
  },
  {
    id: 'GRV-2026-006',
    citizenName: 'Lakshmi Reddy',
    citizenContact: '+91 93456 78901',
    text: 'Street lights in our area have not been working for a month. It is very unsafe for women returning home at night. Lane 3, Baner area.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(200),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Street Lighting Complaint',
      entities: ['Lane 3', 'Baner', 'street lights', 'one month'],
      sentiment: 'negative',
      urgency: 'medium',
      confidence: 86,
      flaggedForReview: false,
    },
    routing: {
      department: 'Municipal Corporation',
      subCategory: 'Street Lighting',
      jurisdiction: 'Pune Municipal Corporation',
      assignedOfficer: 'Rajesh Kumar',
      reasons: [
        { module: 'Department Mapping', detail: 'Street lighting → Municipal Corporation' },
        { module: 'Sub-Category Tagging', detail: 'Non-functional street lights' },
        { module: 'Jurisdiction Check', detail: 'Baner under Pune Municipal Corporation' },
        { module: 'Workload Balancer', detail: 'Officer Rajesh Kumar has 3 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(400),
    slaTotalMinutes: 960,
    duplicateGroupId: 'CASE-GRV-006',
    duplicateGroupSize: 1,
  },
  {
    id: 'GRV-2026-007',
    citizenName: 'Manoj Deshmukh',
    citizenContact: '+91 94567 89012',
    text: 'The sewer line near our building is overflowing. Dirty water is entering our compound. This has been happening for a week now. Viman Nagar, building 22.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(150),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Sewer Complaint',
      entities: ['Viman Nagar', 'building 22', 'sewer', 'one week'],
      sentiment: 'negative',
      urgency: 'high',
      confidence: 89,
      flaggedForReview: false,
    },
    routing: {
      department: 'Water Supply & Sewerage',
      subCategory: 'Sewer Overflow',
      jurisdiction: 'PMC Sewerage Department',
      assignedOfficer: 'Priya Nair',
      reasons: [
        { module: 'Department Mapping', detail: 'Sewerage → Water Supply & Sewerage Board' },
        { module: 'Sub-Category Tagging', detail: 'Sewer overflow / blockage' },
        { module: 'Jurisdiction Check', detail: 'Viman Nagar under PMC Sewerage Department' },
        { module: 'Workload Balancer', detail: 'Officer Priya Nair has 1 active case — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(120),
    slaTotalMinutes: 480,
    duplicateGroupId: 'CASE-GRV-007',
    duplicateGroupSize: 1,
  },
  {
    id: 'GRV-2026-008',
    citizenName: 'Geeta Pawar',
    citizenContact: '+91 95678 90123',
    text: 'There is heavy noise pollution from the construction site next to our residential area. They work at night too, beyond 10 PM. Children cannot study. Wakad, sector 21.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(400),
    status: 'resolved',
    nlpResult: {
      language: 'English',
      intent: 'Noise Pollution Complaint',
      entities: ['Wakad', 'sector 21', 'construction', 'night'],
      sentiment: 'negative',
      urgency: 'medium',
      confidence: 82,
      flaggedForReview: false,
    },
    routing: {
      department: 'Environment & Pollution Control',
      subCategory: 'Noise Pollution',
      jurisdiction: 'MPCB Pune Region',
      assignedOfficer: 'Anjali Desai',
      reasons: [
        { module: 'Department Mapping', detail: 'Noise pollution → Environment & Pollution Control' },
        { module: 'Sub-Category Tagging', detail: 'Night-time construction noise violation' },
        { module: 'Jurisdiction Check', detail: 'Wakad under MPCB Pune Region' },
        { module: 'Workload Balancer', detail: 'Officer Anjali Desai has 0 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(800),
    slaTotalMinutes: 1440,
    duplicateGroupId: 'CASE-GRV-008',
    duplicateGroupSize: 1,
    officerAction: 'resolve',
    feedback: 'satisfied',
  },
  {
    id: 'GRV-2026-009',
    citizenName: 'Suresh Gaikwad',
    citizenContact: '+91 96789 01234',
    text: 'The government hospital in our area is very dirty. Staff is rude and medicines are always out of stock. My mother went for checkup and was made to wait 4 hours.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(250),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Healthcare Complaint',
      entities: ['government hospital', 'medicines', '4 hours'],
      sentiment: 'very negative',
      urgency: 'high',
      confidence: 79,
      flaggedForReview: false,
    },
    routing: {
      department: 'Health & Family Welfare',
      subCategory: 'Hospital Negligence',
      jurisdiction: 'District Health Office Pune',
      assignedOfficer: 'Dr. Meena Iyer',
      reasons: [
        { module: 'Department Mapping', detail: 'Healthcare service → Health & Family Welfare' },
        { module: 'Sub-Category Tagging', detail: 'Hospital negligence / poor service' },
        { module: 'Jurisdiction Check', detail: 'District Health Office Pune' },
        { module: 'Workload Balancer', detail: 'Officer Dr. Meena Iyer has 2 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(90),
    slaTotalMinutes: 480,
    duplicateGroupId: 'CASE-GRV-009',
    duplicateGroupSize: 1,
  },
  {
    id: 'GRV-2026-010',
    citizenName: 'Anita Kulkarni',
    citizenContact: '+91 97890 12345',
    text: 'Bus number 27 on the Swargate-Hinjewadi route never comes on time. Commuters are always late to work. The frequency is supposed to be every 15 minutes but it takes over an hour.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(500),
    status: 'resolved',
    nlpResult: {
      language: 'English',
      intent: 'Transport Service Complaint',
      entities: ['Bus 27', 'Swargate', 'Hinjewadi', '15 minutes'],
      sentiment: 'negative',
      urgency: 'low',
      confidence: 85,
      flaggedForReview: false,
    },
    routing: {
      department: 'Transport Authority',
      subCategory: 'Bus Service',
      jurisdiction: 'PMPML Pune Division',
      assignedOfficer: 'Karthik Reddy',
      reasons: [
        { module: 'Department Mapping', detail: 'Public transport → Transport Authority' },
        { module: 'Sub-Category Tagging', detail: 'Bus service / irregular frequency' },
        { module: 'Jurisdiction Check', detail: 'Route under PMPML Pune Division' },
        { module: 'Workload Balancer', detail: 'Officer Karthik Reddy has 1 active case — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(1000),
    slaTotalMinutes: 1440,
    duplicateGroupId: 'CASE-GRV-010',
    duplicateGroupSize: 1,
    officerAction: 'resolve',
    feedback: 'not_satisfied',
    appealCount: 1,
  },
  {
    id: 'GRV-2026-011',
    citizenName: 'Rahul Bhosale',
    citizenContact: '+91 98901 23456',
    text: 'There is illegal dumping of industrial waste near the river behind our colony. The water has turned black and there is a chemical smell. This needs immediate attention.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(30),
    status: 'routed',
    nlpResult: {
      language: 'English',
      intent: 'Environmental Pollution Complaint',
      entities: ['industrial waste', 'river', 'chemical smell'],
      sentiment: 'very negative',
      urgency: 'critical',
      confidence: 87,
      flaggedForReview: false,
    },
    routing: {
      department: 'Environment & Pollution Control',
      subCategory: 'Water Contamination',
      jurisdiction: 'MPCB Pune Region',
      assignedOfficer: 'Anjali Desai',
      reasons: [
        { module: 'Department Mapping', detail: 'Industrial pollution → Environment & Pollution Control' },
        { module: 'Sub-Category Tagging', detail: 'Industrial waste / water contamination' },
        { module: 'Jurisdiction Check', detail: 'River pollution under MPCB Pune Region' },
        { module: 'Workload Balancer', detail: 'Officer Anjali Desai has 0 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(240),
    slaTotalMinutes: 360,
    duplicateGroupId: 'CASE-GRV-011',
    duplicateGroupSize: 1,
  },
  {
    id: 'GRV-2026-012',
    citizenName: 'Prakash Jadhav',
    citizenContact: '+91 99012 34567',
    text: 'The potholes on the Hadapsar-Magarpatta road are getting worse. Two accidents happened last week. Please fix this road before someone dies.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(180),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Road Infrastructure Complaint',
      entities: ['Hadapsar', 'Magarpatta', 'potholes', 'accidents'],
      sentiment: 'very negative',
      urgency: 'high',
      confidence: 91,
      flaggedForReview: false,
    },
    routing: {
      department: 'Public Works Department',
      subCategory: 'Road Construction',
      jurisdiction: 'Pune PWD Division',
      assignedOfficer: 'Sunita Sharma',
      reasons: [
        { module: 'Department Mapping', detail: 'Road infrastructure → Public Works Department' },
        { module: 'Sub-Category Tagging', detail: 'Pothole / road surface damage' },
        { module: 'Jurisdiction Check', detail: 'Hadapsar-Magarpatta road under Pune PWD Division' },
        { module: 'Workload Balancer', detail: 'Officer Sunita Sharma has 4 active cases — near capacity' },
      ],
    },
    slaDeadline: minutesAhead(300),
    slaTotalMinutes: 1440,
    duplicateGroupId: 'CASE-GRV-003',
    duplicateGroupSize: 2,
  },
  {
    id: 'GRV-2026-013',
    citizenName: 'Vandana More',
    citizenContact: '+91 90123 45670',
    text: 'The municipal school in our area has no proper classrooms. Roof is leaking and there are not enough teachers. Our children deserve better. Bibwewadi area.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(350),
    status: 'manual_review',
    nlpResult: {
      language: 'English',
      intent: 'Education Infrastructure Complaint',
      entities: ['municipal school', 'Bibwewadi', 'roof', 'teachers'],
      sentiment: 'negative',
      urgency: 'medium',
      confidence: 68,
      flaggedForReview: true,
    },
    routing: undefined,
    slaDeadline: minutesAhead(600),
    slaTotalMinutes: 960,
    duplicateGroupId: 'CASE-GRV-013',
    duplicateGroupSize: 1,
  },
  {
    id: 'GRV-2026-014',
    citizenName: 'Kiran Shinde',
    citizenContact: '+91 91234 67890',
    text: 'My land records show wrong owner name. I applied for correction 6 months ago but nothing happened. The revenue office keeps asking for more documents every time.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(600),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Land Records Complaint',
      entities: ['land records', '6 months', 'revenue office'],
      sentiment: 'very negative',
      urgency: 'low',
      confidence: 81,
      flaggedForReview: false,
    },
    routing: {
      department: 'Revenue & Land Records',
      subCategory: 'Record Correction',
      jurisdiction: 'Talathi Office Pune',
      assignedOfficer: 'Lakshmi Devi',
      reasons: [
        { module: 'Department Mapping', detail: 'Land records → Revenue & Land Records' },
        { module: 'Sub-Category Tagging', detail: 'Record correction / mutation pending' },
        { module: 'Jurisdiction Check', detail: 'Falls under Talathi Office Pune' },
        { module: 'Workload Balancer', detail: 'Officer Lakshmi Devi has 2 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(-60),
    slaTotalMinutes: 2880,
    duplicateGroupId: 'CASE-GRV-014',
    duplicateGroupSize: 1,
  },
  {
    id: 'GRV-2026-015',
    citizenName: 'Sneha Kulkarni',
    citizenContact: '+91 92345 67891',
    text: 'Garbage collection in Sector 7 area has been irregular for weeks. The bins are overflowing and stray dogs are scattering waste everywhere. This is a health hazard.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(75),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Sanitation Complaint',
      entities: ['Sector 7', 'garbage', 'stray dogs', 'health hazard'],
      sentiment: 'negative',
      urgency: 'high',
      confidence: 92,
      flaggedForReview: false,
    },
    routing: {
      department: 'Municipal Corporation',
      subCategory: 'Garbage Collection',
      jurisdiction: 'Pune Municipal Corporation',
      assignedOfficer: 'Rajesh Kumar',
      reasons: [
        { module: 'Department Mapping', detail: 'Sanitation & waste management → Municipal Corporation' },
        { module: 'Sub-Category Tagging', detail: 'Garbage collection / uncollected waste' },
        { module: 'Jurisdiction Check', detail: 'Sector 7 falls under Pune Municipal Corporation' },
        { module: 'Workload Balancer', detail: 'Officer Rajesh Kumar has 3 active cases — capacity available' },
      ],
    },
    slaDeadline: minutesAhead(135),
    slaTotalMinutes: 480,
    duplicateGroupId: 'CASE-GRV-001',
    duplicateGroupSize: 3,
  },
  {
    id: 'GRV-2026-016',
    citizenName: 'Mohan Agarwal',
    citizenContact: '+91 93456 78902',
    text: 'There is a huge pothole on the Hadapsar main road that has caused multiple bike accidents. The road was dug up for pipeline work and never properly filled.',
    attachments: [],
    location: 'Pune, Maharashtra',
    submittedAt: minutesAgo(210),
    status: 'in_progress',
    nlpResult: {
      language: 'English',
      intent: 'Road Infrastructure Complaint',
      entities: ['Hadapsar', 'main road', 'pothole', 'bike accidents'],
      sentiment: 'very negative',
      urgency: 'high',
      confidence: 83,
      flaggedForReview: false,
    },
    routing: {
      department: 'Public Works Department',
      subCategory: 'Road Construction',
      jurisdiction: 'Pune PWD Division',
      assignedOfficer: 'Sunita Sharma',
      reasons: [
        { module: 'Department Mapping', detail: 'Road infrastructure → Public Works Department' },
        { module: 'Sub-Category Tagging', detail: 'Pothole / road surface damage' },
        { module: 'Jurisdiction Check', detail: 'Hadapsar main road under Pune PWD Division' },
        { module: 'Workload Balancer', detail: 'Officer Sunita Sharma has 4 active cases — near capacity' },
      ],
    },
    slaDeadline: minutesAhead(270),
    slaTotalMinutes: 1440,
    duplicateGroupId: 'CASE-GRV-003',
    duplicateGroupSize: 2,
  },
];

export const MOCK_DUPLICATE_GROUPS: DuplicateGroup[] = [
  {
    caseId: 'CASE-GRV-001',
    complaintIds: ['GRV-2026-001', 'GRV-2026-004', 'GRV-2026-015'],
    rootCause: 'Irregular garbage collection schedule in Sector 7, Ward 12 — PMC sanitation crew understaffed',
    clusterArea: 'Sector 7 / Ward 12, Pune',
    severity: 'high',
  },
  {
    caseId: 'CASE-GRV-003',
    complaintIds: ['GRV-2026-003', 'GRV-2026-012', 'GRV-2026-016'],
    rootCause: 'Incomplete road repair after pipeline work on Hadapsar-Magarpatta stretch — PWD contractor default',
    clusterArea: 'Hadapsar-Magarpatta corridor, Pune',
    severity: 'high',
  },
];

export const MOCK_LOCATIONS = [
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'Delhi, NCR',
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
];

// Simulated NLP processing — returns a deterministic-ish result based on text content
export function simulateNLP(text: string) {
  const lower = text.toLowerCase();
  let intent = 'General Complaint';
  let urgency: 'critical' | 'high' | 'medium' | 'low' = 'medium';
  let department: Department = 'Municipal Corporation';
  let subCategory = 'General';
  let entities: string[] = [];

  if (lower.includes('garbage') || lower.includes('waste') || lower.includes('sanitation')) {
    intent = 'Sanitation Complaint';
    urgency = 'high';
    department = 'Municipal Corporation';
    subCategory = 'Garbage Collection';
  } else if (lower.includes('electric') || lower.includes('power') || lower.includes('light')) {
    intent = 'Power/Electricity Complaint';
    urgency = 'critical';
    department = 'Electricity Board';
    subCategory = 'Power Outage';
  } else if (lower.includes('road') || lower.includes('pothole') || lower.includes('bridge')) {
    intent = 'Road Infrastructure Complaint';
    urgency = 'high';
    department = 'Public Works Department';
    subCategory = 'Road Construction';
  } else if (lower.includes('water') || lower.includes('sewer') || lower.includes('pipe')) {
    intent = 'Water/Sewerage Complaint';
    urgency = 'critical';
    department = 'Water Supply & Sewerage';
    subCategory = 'Water Shortage';
  } else if (lower.includes('hospital') || lower.includes('health') || lower.includes('medicine')) {
    intent = 'Healthcare Complaint';
    urgency = 'high';
    department = 'Health & Family Welfare';
    subCategory = 'Hospital Negligence';
  } else if (lower.includes('noise') || lower.includes('pollution') || lower.includes('environment')) {
    intent = 'Environmental Pollution Complaint';
    urgency = 'medium';
    department = 'Environment & Pollution Control';
    subCategory = 'Noise Pollution';
  } else if (lower.includes('bus') || lower.includes('transport') || lower.includes('traffic')) {
    intent = 'Transport Service Complaint';
    urgency = 'low';
    department = 'Transport Authority';
    subCategory = 'Bus Service';
  } else if (lower.includes('land') || lower.includes('revenue') || lower.includes('property')) {
    intent = 'Land Records Complaint';
    urgency = 'low';
    department = 'Revenue & Land Records';
    subCategory = 'Record Correction';
  } else if (lower.includes('school') || lower.includes('education') || lower.includes('teacher')) {
    intent = 'Education Complaint';
    urgency = 'medium';
    department = 'Education Department';
    subCategory = 'School Infrastructure';
  } else if (lower.includes('police') || lower.includes('theft') || lower.includes('crime')) {
    intent = 'Police Complaint';
    urgency = 'high';
    department = 'Police Department';
    subCategory = 'Public Nuisance';
  }

  if (lower.includes('critical') || lower.includes('urgent') || lower.includes('emergency') || lower.includes('death') || lower.includes('accident')) {
    urgency = 'critical';
  }
  if (lower.includes('days') || lower.includes('week') || lower.includes('month')) {
    urgency = urgency === 'low' ? 'medium' : urgency;
  }

  // Extract simple entities
  const sectorMatch = text.match(/[Ss]ector\s?\d+/);
  const wardMatch = text.match(/[Ww]ard\s?\d+/);
  const areaMatch = text.match(/(?:in|near|at|behind)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/);
  if (sectorMatch) entities.push(sectorMatch[0]);
  if (wardMatch) entities.push(wardMatch[0]);
  if (areaMatch) entities.push(areaMatch[1]);

  const deptInfo = DEPARTMENTS.find((d) => d.name === department);
  const officer = deptInfo?.officer ?? 'Rajesh Kumar';
  const jurisdiction = deptInfo ? `${deptInfo.name} Jurisdiction` : 'Pune Municipal Corporation';

  const confidence = Math.floor(Math.random() * 30) + 68; // 68-97
  const sentiment: 'negative' | 'very negative' = lower.includes('urgent') || lower.includes('unbearable') || lower.includes('suffering') || lower.includes('terrible')
    ? 'very negative'
    : 'negative';

  return {
    nlpResult: {
      language: 'English',
      intent,
      entities: entities.length > 0 ? entities : ['Location detected'],
      sentiment,
      urgency,
      confidence,
      flaggedForReview: confidence <= 75,
    },
    routing: {
      department,
      subCategory,
      jurisdiction,
      assignedOfficer: officer,
      reasons: [
        { module: 'Department Mapping', detail: `${intent} → ${department}` },
        { module: 'Sub-Category Tagging', detail: subCategory },
        { module: 'Jurisdiction Check', detail: jurisdiction },
        { module: 'Workload Balancer', detail: `Officer ${officer} assigned — capacity available` },
      ],
    },
  };
}
