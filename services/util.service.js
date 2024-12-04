const currencyCodeToSymbol = new Map([
    ["USD", "$"],
    ["EUR", "€"],
    ["ILS", "₪"],
]);

const languages = new Map([
    ["he", "Hebrew"],
    ["sp", "Spanish"],
    ["en", "English"],
    ["fr", "French"],
    ["de", "German"],
    ["zh", "Chinese"],
    ["ja", "Japanese"],
    ["ru", "Russian"],
    ["ar", "Arabic"],
    ["hi", "Hindi"],
    ["pt", "Portuguese"],
    ["it", "Italian"],
    ["ko", "Korean"],
    ["tr", "Turkish"],
    ["nl", "Dutch"],
    ["sv", "Swedish"],
    ["pl", "Polish"],
    ["vi", "Vietnamese"],
    ["th", "Thai"],
    ["el", "Greek"],
    ["es", "Spanish"],
]);

const categories = [
    "Computers",
    "Hack",
    "Fiction",
    "Non-Fiction",
    "Biography",
    "History",
    "Science",
    "Business",
    "Technology",
    "Art",
    "Religion",
    "Philosophy",
    "Politics",
    "Education",
    "Sports",
    "Travel",
    "Cooking",
    "Poetry",
    "Drama",
    "Reference",
    "Self-Help",
    "Health",
    "Humor",
    "Music",
    "Nature",
    "Law",
    "Medicine",
    "Mathematics",
    "Language",
    "Literature",
    "Academic"
];

export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    getRandomBoolean,
    loadFromStorage,
    saveToStorage,
    animateCSS,
    currencyCodeToSymbol, 
    debounce,
    languages,
    categories,
    formatDate,
    filterToParams,
    paramsToFilter,
    getRandomRating,
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color' ,'of nature', 'tuned', 'to', 'a live channel', 'All', 'this happened', 'more or less', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)]
        if (size >= 1 ) txt += ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRating() {
    return Math.random() * 5 + 0.000001;
}

function getRandomBoolean() {
    return getRandomIntInclusive(1, 100) > 50;
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function animateCSS(el, animation='bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}

function debounce(func, time = 500) {
    var timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
        }, time);
    }
}

function formatDate(date) {
    if (!(date instanceof Date))
        date = new Date(date);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function filterToParams(filter) {
    const params = {};
    for (const key in filter) {
        if (typeof filter[key] === "object") {
            for (const subKey in filter[key]) {
                params[`${key}.${subKey}`] = filter[key][subKey];
            }
        } else {
            params[key] = filter[key];
        }
    }
    return new URLSearchParams(params);
};

function paramsToFilter(searchParams, defaultFilter) {
    const filter = { ...defaultFilter };

    for (const [key, value] of searchParams.entries()) {
        const newVal = _convertValueParam(value);
        if (key.includes(".")) {
            const [group, subKey] = key.split(".");
            filter[group] = filter[group] || {};
            filter[group][subKey] = newVal;
        } else {
            filter[key] = newVal;
        }
    }
    return filter;
};

function _convertValueParam(value) {
    switch(value) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            return value;
    }
}

