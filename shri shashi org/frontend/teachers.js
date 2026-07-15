// ══ CLEAN TEACHERS DATA ══
const TEACHERS = [
  {
    name: "Purushottam Prasad Gupta",
    role: "Head Master",
    subjects: ["Administration", "Management"],
    qual: "#",
    contact: "9754345671",
    color: "#0B2545",
    photo: "images/teachers/purushottam.png"
  },
  {
    name: "Amay Raj Singh",
    role: "Senior Teacher",
    subjects: ["English", "Math", "Science"],
    qual: "PG Chemistry",
    contact: "6264145423",
    color: "#3B82F6",
    photo: "images/teachers/amay.jpg"
  },
  {
    name: "Rajendra Rathour",
    role: "Senior Teacher",
    subjects: ["English", "Sanskrit"],
    contact: "8434535050",
    color: "#10B981",
    photo: "images/teachers/rajendra.jpg"
  },
  {
    name: "Ramnarayan Rathour",
    role: "Senior Teacher",
    subjects: ["Social Science", "Hindi"],
    contact: "7509194053",
    color: "#F59E0B",
    photo: "null"
  },
  {
    name: "Ranjeet Rathour",
    role: "Teacher",
    subjects: ["Math", "Science"],
    contact: "7771833810",
    color: "#8B5CF6",
    photo: "images/teachers/ranjeet.jpg"
  },
  {
    name: "Aasha Rathour",
    role: "Senior Teacher",
    subjects: ["Hindi", "Sanskrit"],
    contact: "8435545050",
    color: "#EC4899",
    photo: null
  },
  {
    name: "Anita Rathour",
    role: "Senior Teacher",
    subjects: ["Math", "Science"],
    contact: "8878684510",
    color: "#F97316",
    photo: "images/teachers/anita.jpg"
  },
  {
    name: "Jalebiya Rathour",
    role: "Teacher",
    subjects: ["English", "Hindi", "EVS"],
    contact: "9303099021",
    color: "#14B8A6",
    photo: "images/teachers/jalebiya.jpg"
  },
  {
    name: "Anuradha Rathour",
    role: "Senior Teacher",
    subjects: ["Hindi", "Social Science"],
    contact: "000000000000",
    color: "#6366F1",
    photo: "images/teachers/anuradha.jpg"
  },
  {
    name: "Naina Rathour",
    role: "Teacher",
    subjects: ["Hindi", "EVS"],
    contact: "00000000000000",
    color: "#A855F7",
    photo: null
  },
  {
    name: "Rajni Rathour",
    role: "Teacher",
    subjects: ["EVS", "Kindergarten"],
    contact: "9244061466",
    color: "#EF4444",
    photo: null
  },
  {
    name: "Kiran Rathour",
    role: "Teacher",
    subjects: ["EVS", "Hindi", "Math"],
    contact: "7974430680",
    color: "#84CC16",
    photo: null
  }
];

function renderTeachers() {
  const grid = document.getElementById('teachersGrid');
  if (!grid) return;

  grid.innerHTML = TEACHERS.map((t, i) => {
    const initials = t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    // Photo handles dynamic error beautifully
    const innerContent = t.photo
      ? `<img src="${t.photo}" alt="${t.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
         <span style="display:none;">${initials}</span>`
      : `<span>${initials}</span>`;

    const subjectTags = t.subjects.map(s => `<span class="subject-tag">${s}</span>`).join('');

    return `
    <div class="teacher-card fade-up" style="animation-delay:${i * 0.05}s">
      <div class="tc-front">
        <div class="tc-avatar" style="background:${t.color}">
          ${innerContent}
        </div>
        <div class="tc-name">${t.name}</div>
        <span class="tc-role-tag">${t.role}</span>
        <div class="tc-subjects">${subjectTags}</div>
        <div class="tc-qual"><i class="fas fa-graduation-cap" style="color:var(--gold)"></i>${t.qual}</div>
        ${t.contact ? `<div class="tc-contact"><i class="fas fa-phone"></i> ${t.contact}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// Dropdown utility
let loginOpen = false;
function toggleLogin(e) {
  e.stopPropagation();
  loginOpen = !loginOpen;
  document.getElementById('loginDropdown').classList.toggle('open', loginOpen);
  document.getElementById('loginChevron').style.transform = loginOpen ? 'rotate(180deg)' : '';
}

document.addEventListener('click', function (e) {
  const loginWrap = document.getElementById('loginWrap');
  if (loginWrap && !loginWrap.contains(e.target)) {
    loginOpen = false;
    document.getElementById('loginDropdown').classList.remove('open');
    document.getElementById('loginChevron').style.transform = '';
  }
});

// Init
renderTeachers();