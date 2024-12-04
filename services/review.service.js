import { utilService } from './util.service.js';
import { storageService } from './async-storage.service.js';
import { bookService } from "./book.service.js";

const REVIEW_KEY = 'reviewDB';
const RATE_BY_OPTIONS = ['stars', 'select', 'textbox'];

//need to validate rating before updating it.
//it need to be double
//but start and select need to floor it so it can be a int to them.
//cant be zero or bigger than 5.

_createReviews();

export const reviewService = {
    query,
    get,
    remove,
    removeIfExist,
    save,
    getEmptyReview,
    getDefaultFilter,
    removeByBookId,
};

async function query(filterBy = {}) {
    try {
        let reviews = await storageService.query(REVIEW_KEY);

        if(filterBy.bookId)
            reviews = reviews.filter(review => review.bookId === filterBy.bookId);

        return reviews;
    } catch (err) {
        console.error("Couldn't query and filtering reviews from storage: " + err);
        return [];
    }
}

async function get(reviewId) {
    return await storageService.get(REVIEW_KEY, reviewId);
}

async function remove(reviewId) {
    return await storageService.remove(REVIEW_KEY, reviewId);
}

async function removeIfExist(reviewId) {
    return await storageService.removeIfExist(REVIEW_KEY, reviewId);
}

async function removeByBookId(bookId) {
    const reviews = await query({ bookId });

    for (const review of reviews) {
        storageService.remove(REVIEW_KEY, review.id);
    }
}

async function save(review) {
    if(review.id)
        return await storageService.put(REVIEW_KEY, review);

    await bookService.get(review.bookId);
    return await storageService.post(REVIEW_KEY, review);
}

function getEmptyReview(bookId) {
    return {
        bookId,
        fullname: '',
        rating: 0,
        rateBy: '',
        readAt: new Date(),
    };
}

function getDefaultFilter() {
    return {
        bookId: '',
        txt: '',
        rating: 0,
        ratingPosition: true,
        rateBy: '',
        readAt: new Date(),
        readAtPosition: false,
    };
}

async function _createReviews() {
    let reviews = utilService.loadFromStorage(REVIEW_KEY);
    if (!reviews || !reviews.length) {
        const books = await bookService.query();
        let reviews = [];
        let countUsers = 1;
        let randomReviewsForCurrBook;

        books.forEach(book => {
            randomReviewsForCurrBook = utilService.getRandomIntInclusive(0, 5);

            for(let i = 0; i <= randomReviewsForCurrBook; i++, countUsers++) {
                reviews.push({
                    bookId: book.id,
                    fullname: `user${countUsers}`,
                    rating: utilService.getRandomRating(),
                    rateBy: RATE_BY_OPTIONS[utilService.getRandomIntInclusive(0, RATE_BY_OPTIONS.length - 1)],
                    readAt: new Date(Date.now() - utilService.getRandomIntInclusive(0, 14) * 24 * 60 * 60 * 1000),
                });
            }
        });

        utilService.saveToStorage(REVIEW_KEY, reviews.map(review => _createReview(review)));
    }
}

function _createReview(review) {
    review.id = utilService.makeId();
    return review;
}