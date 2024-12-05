import { utilService } from './util.service.js';
import { storageService } from './async-storage.service.js';
import { bookService } from "./book.service.js";
import { userService } from "./user.service.js";
import { ValidationError } from "../errors/ValidationError.js";

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
    save,
    getEmptyReview,
    getDefaultFilter,
    removeByBookId,
};

async function query(filterBy = {}) {
    try {
        let reviews = await storageService.query(REVIEW_KEY);

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i');
            reviews = reviews.filter(review => regExp.test(review.fullname));
        };

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
    await storageService.remove(REVIEW_KEY, reviewId);
    _UpdateBookRating(reviewId);
}

async function removeByBookId(bookId) {
    const reviews = await query({ bookId });

    for (const review of reviews) {
        storageService.remove(REVIEW_KEY, review.id);
    }
}

async function save(review) {
    const reviewForUser = await query({ txt: review.fullname });
    let res;

    if(reviewForUser && reviewForUser.length > 1)
        throw new ValidationError("User can't create one review for each book");

    if(review.id)
        res = await storageService.put(REVIEW_KEY, review);
    else
        res = await storageService.post(REVIEW_KEY, review);

    _UpdateBookRating(reviewId);
    return res;
}

function getEmptyReview(bookId) {
    return {
        bookId,
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
        const users = await userService.query();
        let reviews = [];

        users.forEach(user => {
            books.forEach(book => {
                reviews.push({
                    bookId: book.id,
                    fullname: user.fullname,
                    rating: utilService.getRandomRating(),
                    rateBy: RATE_BY_OPTIONS[utilService.getRandomIntInclusive(0, RATE_BY_OPTIONS.length - 1)],
                    readAt: new Date(Date.now() - utilService.getRandomIntInclusive(0, 14) * 24 * 60 * 60 * 1000),
                });
            });
        });

        utilService.saveToStorage(REVIEW_KEY, reviews.map(review => _createReview(review)));
        _UpdateBooksRating();
    }
}

function _createReview(review) {
    review.id = utilService.makeId();
    return review;
}

async function _UpdateBookRating(reviewId) {
    const review = await get(reviewId);
    const book = await bookService.get(review.bookId);
    const bookReviews = await query({ bookId: book.id });
    let newSumRating = 0;
    bookReviews.forEach(bookReview => newSumRating += bookReview.rating);
    book.avgRating = newSumRating / bookReviews.length;
    bookService.save(book);
}

async function _UpdateBooksRating() {
    const books = await bookService.query();

    for (const book of books) {
        const bookReviews = await query({ bookId: book.id });
        let newSumRating = 0;
        bookReviews.forEach(bookReview => newSumRating += bookReview.rating);
        book.avgRating = bookReviews.length ? newSumRating / bookReviews.length : 0;
        await bookService.save(book);
    };
}