import { utilService } from './util.service.js';
import { storageService } from './async-storage.service.js';

const REVIEW_KEY = 'reviewDB';

const DEFAULT_DATA = [
    {
        fullname: 'user1',
        rating: 2,
        rateBy: 'stars',
        readAt: new Date(),
    },
    {
        fullname: 'user2',
        rating: 5,
        rateBy: 'select',
        readAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        fullname: 'user3',
        rating: 3,
        rateBy: 'textbox',
        readAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
];

_createReviews();

export const reviewService = {
    query,
    get,
    remove,
    removeIfExist,
    save,
    getEmptyReview,
    getDefaultFilter,
};

async function query(filterBy = {}) {
    try {
        let reviews = await storageService.query(REVIEW_KEY);
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

async function save(review) {
    return review.id ? await storageService.put(REVIEW_KEY, review) : await storageService.post(REVIEW_KEY, review);
}

function getEmptyReview() {
    return {
        fullname: '',
        rating: 0,
        rateBy: '',
        readAt: new Date(),
    };
}

function getDefaultFilter() {
    return {
        txt: '',
        rating: 0,
        ratingPosition: true,
        rateBy: '',
        readAt: new Date(),
        readAtPosition: false,
    };
}

function _createReviews() {
    let reviews = utilService.loadFromStorage(REVIEW_KEY);
    if (!reviews || !reviews.length)
        utilService.saveToStorage(REVIEW_KEY, DEFAULT_DATA.map(review => _createReview(review)));
}

function _createReview(review) {
    review.id = utilService.makeId();
    return review;
}