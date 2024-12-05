import { utilService } from './util.service.js';
import { storageService } from './async-storage.service.js';
import { DEFAULT_DATA } from '../books.js';

const BOOK_KEY = 'bookDB';

_createBooks();

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
};

async function query(filterBy = {}) {
    try {
        let books = await storageService.query(BOOK_KEY);

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i');
            books = books.filter(book => regExp.test(book.title) || book.authors.some(author => regExp.test(author)));
        };

        if (filterBy.apiId) {
            books = books.filter(book => book.apiId === filterBy.apiId);
        };

        if (filterBy.language && filterBy.language != "all") {
            books = books.filter(book => book.language === filterBy.language);
        }

        if (filterBy.category && filterBy.category != "all") {
            books = books.filter(book => book.categories.includes(filterBy.category));
        }

        if (filterBy.pages != undefined) {
            if (filterBy.page_position)
                books = books.filter(book => book.publishedDate >= filterBy.pages);
            else
                books = books.filter(book => book.publishedDate < filterBy.pages);
        }

        if (filterBy.publish_year != undefined) {
            if (filterBy.publish_year_position)
                books = books.filter(book => book.pageCount >= filterBy.publish_year);
            else
                books = books.filter(book => book.pageCount < filterBy.publish_year);
        }

        if (filterBy.listPrice) {
            if (filterBy.listPrice.amount != undefined) {
                if (filterBy.listPrice.amount_position)
                    books = books.filter(book => book.listPrice.amount >= filterBy.listPrice.amount);
                else
                    books = books.filter(book => book.listPrice.amount < filterBy.listPrice.amount);
            }

            if (filterBy.listPrice.currencyCode && filterBy.listPrice.currencyCode != "all") {
                books = books.filter(book => book.listPrice.currencyCode === filterBy.listPrice.currencyCode);
            }

            switch (filterBy.listPrice.sale) {
                case "sale":
                    books = books.filter(book => book.listPrice.isOnSale);
                    break;

                case "not sale":
                    books = books.filter(book => !book.listPrice.isOnSale);
                    break;

                default:
                    break;
            }
        }

        return books;
    } catch (err) {
        console.error("Couldn't query and filtering books from storage: " + err);
        return [];
    }
}

async function get(bookId) {
    return _setNextPrevBookId(await storageService.get(BOOK_KEY, bookId));
}

async function remove(bookId) {
    await storageService.remove(BOOK_KEY, bookId);
}

async function save(book) {
    return book.id ? await storageService.put(BOOK_KEY, book) : await storageService.post(BOOK_KEY, book);
}

function getEmptyBook() {
    return {
        title: '',
        subtitle: '',
        authors: [],
        description: '',
        language: '',
        categories: [],
        pageCount: 0,
        publishedDate: '',
        thumbnail: '',
        listPrice: { amount: 0, currencyCode: "USD", isOnSale: false },
        avgRating: 0,
    };
}

function getDefaultFilter() {
    return {
        txt: '',
        language: "all",
        category: "all",
        pages: 0,
        page_position: true,
        publish_year: new Date().getFullYear(),
        publish_year_position: false,
        listPrice: { amount: 0, amount_position: true, currencyCode: "all", sale: "all" },
        // avgRating: 0,
    };
}

function _createBooks() {
    let books = utilService.loadFromStorage(BOOK_KEY);
    if (!books || !books.length)
        utilService.saveToStorage(BOOK_KEY, DEFAULT_DATA.map(book => _createBook(book)));
}

function _createBook(book) {
    book.id = utilService.makeId();
    book.avgRating = 0;
    return book;
}

async function _setNextPrevBookId(book) {
    try {
        const books = await query();
        const bookIdx = books.findIndex((currBook) => currBook.id === book.id);
        const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0];
        const prevBook = books[bookIdx - 1] ? books[bookIdx - 1] : books[books.length - 1];
        book.nextBookId = nextBook.id;
        book.prevBookId = prevBook.id;
        return book;
    }
    catch (err) {
        console.error("Couldn't set next prev to book");
        return book;
    }
}