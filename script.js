
const questions = [
  {
    id: 1,
    category: "Стрессоустойчивость",
    question: "Что оператор должен сделать первым при эмоционально нестабильном звонке?",
    correctAnswer: "Спокойно установить контакт и уточнить адрес",
    answers: [
      "Сразу завершить звонок",
      "Спокойно установить контакт и уточнить адрес",
      "Перевести звонок без уточнений",
      "Попросить перезвонить позже"
    ]
  },
  {
    id: 2,
    category: "Протокол",
    question: "Какой блок информации оператор обязан уточнить в первые секунды?",
    correctAnswer: "Адрес, тип происшествия, наличие угрозы жизни",
    answers: [
      "Адрес, тип происшествия, наличие угрозы жизни",
      "Фамилию знакомых заявителя",
      "Марку автомобиля заявителя",
      "Причину задержки обращения"
    ]
  },
  {
    id: 3,
    category: "Коммуникация",
    question: "Какой стиль общения считается правильным для линии 112?",
    correctAnswer: "Нейтральный, чёткий и направляющий",
    answers: [
      "Жёсткий и без пояснений",
      "Нейтральный, чёткий и направляющий",
      "Разговорный и неформальный",
      "Максимально короткий без уточняющих вопросов"
    ]
  }
];

let state = {
  fullName: "",
  operatorId: "",
  currentIndex: 0,
  selected: null,
  confirmed: []
};

const loginScreen = document.getElementById("loginScreen");
const testScreen = document.getElementById("testScreen");
const resultScreen = document.getElementById("resultScreen");

const fullNameInput = document.getElementById("fullName");
const operatorIdInput = document.getElementById("operatorId");
const startBtn = document.getElementById("startBtn");

const operatorNameView = document.getElementById("operatorNameView");
const operatorIdView = document.getElementById("operatorIdView");
const questionCategory = document.getElementById("questionCategory");
const questionCount = document.getElementById("questionCount");
const questionText = document.getElementById("questionText");
const answersList = document.getElementById("answersList");

const confirmBox = document.getElementById("confirmBox");
const selectedAnswerView = document.getElementById("selectedAnswerView");
const changeBtn = document.getElementById("changeBtn");
const confirmBtn = document.getElementById("confirmBtn");

const scoreView = document.getElementById("scoreView");
const summaryText = document.getElementById("summaryText");
const detailsList = document.getElementById("detailsList");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

document.getElementById("restartBtnTop").addEventListener("click", resetAll);
document.getElementById("restartBtnBottom").addEventListener("click", resetAll);

startBtn.addEventListener("click", () => {
  const name = fullNameInput.value.trim();
  const op = operatorIdInput.value.trim();

  if (name.length < 5 || !op) {
    alert("Введите ФИО и номер оператора.");
    return;
  }

  state.fullName = name;
  state.operatorId = op;
  state.currentIndex = 0;
  state.selected = null;
  state.confirmed = [];

  loginScreen.classList.add("hidden");
  testScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");

  operatorNameView.textContent = name;
  operatorIdView.textContent = "ID: " + op;

  renderQuestion();
});

changeBtn.addEventListener("click", () => {
  confirmBox.classList.add("hidden");
});

confirmBtn.addEventListener("click", () => {
  if (!state.selected) return;

  const current = questions[state.currentIndex];
  state.confirmed.push({
    questionId: current.id,
    question: current.question,
    correctAnswer: current.correctAnswer,
    operatorAnswer: state.selected,
    isCorrect: state.selected === current.correctAnswer
  });

  state.selected = null;
  confirmBox.classList.add("hidden");

  if (state.currentIndex === questions.length - 1) {
    renderResult();
  } else {
    state.currentIndex += 1;
    renderQuestion();
  }
});

function renderQuestion() {
  const current = questions[state.currentIndex];
  questionCategory.textContent = current.category;
  questionCount.textContent = `Вопрос ${state.currentIndex + 1}/${questions.length}`;
  questionText.textContent = current.question;
  answersList.innerHTML = "";
  confirmBox.classList.add("hidden");

  current.answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.type = "button";
    btn.innerHTML = `<span class="dot"></span><span class="answer-text">${answer}</span>`;
    btn.addEventListener("click", () => {
      state.selected = answer;
      [...answersList.children].forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
      selectedAnswerView.textContent = answer;
      confirmBox.classList.remove("hidden");
    });
    answersList.appendChild(btn);
  });

  updateProgress();
}

function renderResult() {
  testScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const score = state.confirmed.filter(x => x.isCorrect).length;
  scoreView.textContent = `${score} / ${questions.length}`;
  summaryText.textContent = `${state.fullName}, оператор ${state.operatorId}. Тест завершён.`;

  detailsList.innerHTML = "";
  state.confirmed.forEach((item, index) => {
    const box = document.createElement("div");
    box.className = "detail-card " + (item.isCorrect ? "ok" : "bad");
    box.innerHTML = `
      <div class="qnum">Вопрос ${index + 1}</div>
      <div class="qtext">${item.question}</div>
      <div class="lbl">Ответ оператора</div>
      <div class="ans">${item.operatorAnswer}</div>
      ${item.isCorrect ? "" : `<div class="lbl">Правильный ответ</div><div class="ans">${item.correctAnswer}</div>`}
    `;
    detailsList.appendChild(box);
  });

  progressBar.style.width = "100%";
  progressText.textContent = "100%";
}

function updateProgress() {
  const percent = Math.round(((state.currentIndex + 1) / questions.length) * 100);
  progressBar.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

function resetAll() {
  state = {
    fullName: "",
    operatorId: "",
    currentIndex: 0,
    selected: null,
    confirmed: []
  };
  fullNameInput.value = "";
  operatorIdInput.value = "";
  loginScreen.classList.remove("hidden");
  testScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  progressBar.style.width = "0%";
  progressText.textContent = "0%";
}
