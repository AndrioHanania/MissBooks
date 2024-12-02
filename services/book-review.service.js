import { utilService } from './util.service.js';
import { storageService } from './async-storage.service.js';

import { bookService } from "./book.service.js";
import { reviewService } from "./review.service.js";

const BOOK_REVIEW_KEY = 'bookReviewDB';

_createBookReviews();

export const bookReviewService = {
    query,
    get,
    remove,
    removeByBookId,
    save,
    getEmptyBookReview,
    getDefaultFilter,
};

async function query(filterBy = {}) {
    try {
        let bookReviews = await storageService.query(BOOK_REVIEW_KEY);

        if(filterBy.bookId)
            bookReviews = bookReviews.filter(bookReview => bookReview.bookId === filterBy.bookId);

        if(filterBy.reviewId)
            bookReviews = bookReviews.filter(bookReview => bookReview.reviewId === filterBy.reviewId);

        return bookReviews;
    } catch (err) {
        console.error("Couldn't query and filtering book reviews from storage: " + err);
        return [];
    }
}

async function get(bookReviewId) {
    return await storageService.get(BOOK_REVIEW_KEY, bookReviewId);
}

async function remove(bookReviewId) {
    const bookReview = await get(bookReviewId);
    await reviewService.removeIfExist(bookReview.reviewId);
    return await storageService.remove(BOOK_REVIEW_KEY, bookReviewId);
}

async function removeByBookId(bookId) {
    const bookReviews = await query({ bookId });

    for (const bookReview of bookReviews) {
        await reviewService.removeIfExist(bookReview.reviewId);
        await storageService.remove(BOOK_REVIEW_KEY, bookReview.id);
    }
}

async function save(bookReview) {
    if(bookReview.id)
        return await storageService.put(BOOK_REVIEW_KEY, bookReview);

    await bookService.get(bookReview.bookId);
    await reviewService.get(bookReview.reviewId);
    if(await query({ reviewId: bookReview.reviewId }).length > 0)
        throw new Error("A review can be associate only for one Book");

    return await storageService.post(BOOK_REVIEW_KEY, bookReview);
}

function getEmptyBookReview() {
    return {
        bookId: '',
        reviewId: '',
    };
}

function getDefaultFilter() {
    return {};
}

async function _createBookReviews() {
    let bookReviews = utilService.loadFromStorage(BOOK_REVIEW_KEY);
    if (!bookReviews || !bookReviews.length) {

        const reviews = await reviewService.query();
        const books = await bookService.query();
        const bookReviews = reviews.map( review => ({ bookId: books[0].id, reviewId: review.id }));

        utilService.saveToStorage(BOOK_REVIEW_KEY, bookReviews.map(bookReview => _createBookReview(bookReview)));
    }
}

function _createBookReview(bookReview) {
    bookReview.id = utilService.makeId();
    return bookReview;
}