import { BookFilter } from "../components/BookFilter.jsx";
import { BookList } from "../components/BookList.jsx";
import { bookService } from "../services/book.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { reviewService } from "../services/review.service.js";

const { Link } = ReactRouterDOM;
const { useState, useEffect } = React;


export function BookIndex() {
    const [books, setBooks] = useState([]);
    const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter());

    useEffect(() => {
        fetchBooks();
    }, [filterBy]);

    async function fetchBooks() {
        try{
            setBooks(await bookService.query(filterBy));
        }
        catch(err){
            console.error('err:', err);
            showErrorMsg('Cannot load Books');
        }
    }

    async function onRemoveBook(bookId) {
        try{
            await bookService.remove(bookId);
            await reviewService.removeByBookId(bookId);
            setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
            showSuccessMsg(`Book removed`);
        }
        catch(err){
            console.error('err:', err);
            showErrorMsg('Cannot remove book ' + bookId);
        }
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (!books) return (<div>Loading...</div>);


    return (
        <section className="book-index">
            <BookFilter defaultFilter={bookService.getDefaultFilter()} onSetFilter={onSetFilter} />

            <section>
                <Link to="/book/edit">Add Book</Link>
            </section>

            <BookList
                books={books}
                onRemove={onRemoveBook}
            />
        </section>
    );
};