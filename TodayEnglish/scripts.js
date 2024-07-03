const wordList = document.getElementById('wordList');
const fetchButton = document.getElementById('fetchWords');
const fetchJapaneseButton = document.getElementById('fetchJapaneseWords');
const scoreElement = document.getElementById('score');
let score = 0;

async function translateToKorean(word) {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${word}&langpair=en|ko`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error('번역 중 오류 발생:', error);
        return '번역 오류';
    }
}

async function translateToJapanese(word) {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${word}&langpair=en|ja`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error('번역 중 오류 발생:', error);
        return '번역 오류';
    }
}

async function fetchRandomWords() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=10');
        const words = await response.json();
        return words;
    } catch (error) {
        console.error('단어를 가져오는 중 오류 발생:', error);
        return [];
    }
}

async function updateWords(translateFunction) {
    wordList.innerHTML = '';
    score = 0;
    scoreElement.textContent = score;

    const words = await fetchRandomWords();
    for (const word of words) {
        const meaning = await translateFunction(word);
        const wordCard = createWordCard(word, meaning);
        wordList.appendChild(wordCard);
    }
}

function createWordCard(word, meaning) {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.innerHTML = `
        <span class="english">${word}</span>
        <span class="meaning">${meaning}</span>
        <input type="text" placeholder="영어 단어 입력">
        <input type="text" placeholder="뜻을 입력하세요">
        <div class="button-group">
            <button class="hide-english" onclick="toggleEnglish(this)">영어 숨기기</button>
            <button class="hide-meaning" onclick="toggleMeaning(this)">뜻 숨기기</button>
            <button class="check-answer" onclick="checkAnswer(this)">정답 확인</button>
            <button class="delete-word" onclick="deleteWord(this)">삭제</button>
        </div>
    `;
    return card;
}

function toggleEnglish(button) {
    const card = button.closest('.word-card');
    const english = card.querySelector('.english');
    english.classList.toggle('hidden');
    button.textContent = english.classList.contains('hidden') ? '영어 보이기' : '영어 숨기기';
}

function toggleMeaning(button) {
    const card = button.closest('.word-card');
    const meaning = card.querySelector('.meaning');
    meaning.classList.toggle('hidden');
    button.textContent = meaning.classList.contains('hidden') ? '뜻 보이기' : '뜻 숨기기';
}

function checkAnswer(button) {
    const card = button.closest('.word-card');
    const englishInput = card.querySelector('input:nth-of-type(1)');
    const meaningInput = card.querySelector('input:nth-of-type(2)');
    const english = card.querySelector('.english').textContent.trim().toLowerCase();
    const meaning = card.querySelector('.meaning').textContent.trim().toLowerCase();

    if (englishInput.value.trim().toLowerCase() === english && meaningInput.value.trim().toLowerCase() === meaning) {
        alert('정답입니다!');
        score += 10;
        scoreElement.textContent = score;
    } else {
        alert('틀렸습니다. 다시 시도해보세요.');
    }
}

function deleteWord(button) {
    const card = button.closest('.word-card');
    card.remove();
}

fetchButton.addEventListener('click', () => updateWords(translateToKorean));
fetchJapaneseButton.addEventListener('click', () => updateWords(translateToJapanese));
window.addEventListener('load', () => updateWords(translateToKorean));
