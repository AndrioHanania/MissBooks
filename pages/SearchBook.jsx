import { utilService } from "../services/util.service.js";
import { bookService } from "../services/book.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";

const { Link } = ReactRouterDOM;
const { useEffect, useState, useRef } = React;

export function SearchBook() {
    const [googleBooks, setGoogleBooks] = useState([]);
    const [search, setSearch] = useState('');
    const onSearchDebounce = useRef(utilService.debounce(onSearch, 2000)).current;

    useEffect(() => {
        if(search)
            onSearchDebounce(search);
    }, [search]);

    async function onSearch(search) {
        try{
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?printType=books&q=${search}`);

            if (!response.ok)
                throw new Error('Network response was not ok');

            const data = await response.json();
            setGoogleBooks(data.items || []);
        }
        catch(err){
            console.error("Couldn't fetch books from api, err:" + err);
            showErrorMsg('Cannot fetch Books');
        }

    }

    async function onAddBook(index) {
        const googleBook = googleBooks[index];

        try{
            const relatedBooks = await bookService.query({ apiId: googleBook.id });

            if(!relatedBooks || relatedBooks.length > 0)
                showErrorMsg("You already added this book");
            else {
                const book =  {
                    title: googleBook.volumeInfo.title,
                    subtitle: googleBook.volumeInfo.subtitle,
                    authors: googleBook.volumeInfo.authors,
                    publishedDate: googleBook.volumeInfo.publishedDate && googleBook.volumeInfo.publishedDate.split('-')[0],
                    description: googleBook.volumeInfo.description,
                    pageCount: googleBook.volumeInfo.pageCount,
                    categories: googleBook.volumeInfo.categories,
                    thumbnail: googleBook.volumeInfo.imageLinks.thumbnail,
                    language: googleBook.volumeInfo.language,
                    listPrice: {
                        amount: utilService.getRandomIntInclusive(10, 200),
                        currencyCode: "EUR",
                        isOnSale: utilService.getRandomBoolean(),
                    },
                    apiId: googleBook.id,
                };

                await bookService.save(book);
                showSuccessMsg("Book successfully added");
            }
        } catch(err){
            console.error("Couldn't added book, err: " + err);
            showErrorMsg("Couldn't added book");
        }
    }

    return (
        <section>
            <div>
                <input 
                    value={search}
                    type="search"
                    name="search"
                    placeholder="Search For Book..."
                    onChange={(ev) => setSearch(ev.target.value)}
                />
            </div>

            <ul style={{ width: 'fit-content' }}>
                {googleBooks.map((book, index) => (
                    <li key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {book.volumeInfo.title} - {book.volumeInfo.authors && book.volumeInfo.authors.join(', ')}
                        <button onClick={() => onAddBook(index)}>+</button>
                    </li>
                ))}
            </ul>

            <button><Link to="/book">See All Books</Link></button>


        </section>
    );
};
