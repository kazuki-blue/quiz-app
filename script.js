/* クイズデータ（一般常識・5問） */
const quizData = [
  {
    question: '世界で最も面積が大きい国はどこですか？',
    choices: ['カナダ', 'アメリカ', 'ロシア', '中国'],
    answer: 2
  },
  {
    question: '日本の国鳥は何ですか？',
    choices: ['ツル', 'キジ', 'タカ', 'サギ'],
    answer: 1
  },
  {
    question: '人体の中で最も大きい臓器はどれですか？',
    choices: ['肝臓', '肺', '脳', '皮膚'],
    answer: 3
  },
  {
    question: '富士山の標高として正しいものはどれですか？',
    choices: ['3,567m', '3,776m', '4,012m', '3,891m'],
    answer: 1
  },
  {
    question: '光が1秒間に進む距離はおよそどのくらいですか？',
    choices: ['約10万km', '約30万km', '約60万km', '約90万km'],
    answer: 1
  }
];

/* 状態管理 */
let currentIndex = 0;
let score = 0;
let answered = false;

/* 画面要素の取得 */
const startScreen   = document.getElementById('start-screen');
const quizScreen    = document.getElementById('quiz-screen');
const resultScreen  = document.getElementById('result-screen');

const questionNumber = document.getElementById('question-number');
const progressFill   = document.getElementById('progress-fill');
const questionText   = document.getElementById('question-text');
const choicesEl      = document.getElementById('choices');
const feedbackEl     = document.getElementById('feedback');
const feedbackIcon   = document.getElementById('feedback-icon');
const feedbackText   = document.getElementById('feedback-text');
const nextBtn        = document.getElementById('next-btn');

const scoreNum       = document.getElementById('score-num');
const resultMessage  = document.getElementById('result-message');

/* スタートボタン */
document.getElementById('start-btn').addEventListener('click', startQuiz);

/* もう一度挑戦ボタン */
document.getElementById('retry-btn').addEventListener('click', startQuiz);

/* 次の問題へボタン */
nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
});

/* クイズを初期化して開始 */
function startQuiz() {
  currentIndex = 0;
  score = 0;
  answered = false;

  show(quizScreen);
  hide(startScreen);
  hide(resultScreen);

  showQuestion();
}

/* 現在の問題を表示 */
function showQuestion() {
  answered = false;
  const q = quizData[currentIndex];

  /* 進捗更新 */
  questionNumber.textContent = `問題 ${currentIndex + 1} / ${quizData.length}`;
  progressFill.style.width = `${((currentIndex) / quizData.length) * 100}%`;

  /* 問題文 */
  questionText.textContent = q.question;

  /* 選択肢を生成 */
  choicesEl.innerHTML = '';
  q.choices.forEach((choice, index) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${['A', 'B', 'C', 'D'][index]}．${choice}`;
    btn.addEventListener('click', () => selectAnswer(index, btn));
    choicesEl.appendChild(btn);
  });

  /* フィードバック・次へボタンをリセット */
  feedbackEl.className = 'feedback hidden';
  feedbackEl.classList.remove('correct', 'incorrect');
  hide(nextBtn);
}

/* 選択肢が選ばれたとき */
function selectAnswer(selectedIndex, selectedBtn) {
  if (answered) return;
  answered = true;

  const correctIndex = quizData[currentIndex].answer;
  const allBtns = choicesEl.querySelectorAll('.choice-btn');

  /* 全ボタンを無効化 */
  allBtns.forEach(btn => btn.disabled = true);

  /* 正解・不正解の色付け */
  allBtns[correctIndex].classList.add('correct');

  if (selectedIndex === correctIndex) {
    score++;
    showFeedback(true);
  } else {
    selectedBtn.classList.add('incorrect');
    showFeedback(false);
  }

  /* 進捗バーを次の段階へ進める */
  progressFill.style.width = `${((currentIndex + 1) / quizData.length) * 100}%`;

  /* 次へボタンを表示（最終問題は「結果を見る」） */
  nextBtn.textContent = currentIndex < quizData.length - 1 ? '次の問題へ →' : '結果を見る';
  show(nextBtn);
}

/* フィードバックメッセージを表示 */
function showFeedback(isCorrect) {
  feedbackEl.classList.remove('hidden', 'correct', 'incorrect');
  if (isCorrect) {
    feedbackEl.classList.add('correct');
    feedbackIcon.textContent = '⭕';
    feedbackText.textContent = '正解です！';
  } else {
    feedbackEl.classList.add('incorrect');
    feedbackIcon.textContent = '❌';
    feedbackText.textContent = `不正解… 正解は「${quizData[currentIndex].choices[quizData[currentIndex].answer]}」です。`;
  }
}

/* 結果画面を表示 */
function showResult() {
  hide(quizScreen);
  show(resultScreen);

  scoreNum.textContent = score;
  resultMessage.textContent = getResultMessage(score);
}

/* スコアに応じたメッセージ */
function getResultMessage(score) {
  if (score === 5) return '素晴らしい！全問正解です！🎉';
  if (score >= 4) return 'あと一歩！かなり博識ですね。';
  if (score >= 3) return 'まずまずの結果です。もう一度挑戦してみては？';
  if (score >= 2) return 'もう少し頑張りましょう！';
  return '残念… 気を取り直して再挑戦！';
}

/* ユーティリティ */
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
