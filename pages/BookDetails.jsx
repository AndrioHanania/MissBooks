import { bookService } from "../services/book.service.js";
import { utilService } from "../services/util.service.js";
import { LongTxt } from "../components/LongTxt.jsx";
import { Reviews } from "../components/Reviews.jsx"

const { useEffect, useState } = React;
const { useParams, useNavigate, Link } = ReactRouterDOM;

export function BookDetails() {
    const [book, setBook] = useState(null);
    const params = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        if(params.bookId)
            loadBook();
    }, [params.bookId])

    async function loadBook() {
        try{
            setBook(await bookService.get(params.bookId));
        }
        catch(err){
            console.error('Problem getting book', err);
        }
    }

    function StatusReading() {
        if (!book) return null; 

        let statusReading;

        if(book.pageCount > 500)
            statusReading = "Series";
        else if(book.pageCount > 200)
            statusReading = "Descent";
        else if(book.pageCount < 100)
            statusReading = "Light";

        return statusReading && <h1>{statusReading} Reading</h1>;
    };

    function StatusAge() {
        if (!book) return null; 

        const currentYear = new Date().getFullYear();
        const diff = currentYear - book.publishedDate;
        let statusAge;

        if(diff > 10)
            statusAge = "Vintage";
        else if(diff < 1)
            statusAge = "New";

        return statusAge && <h1>{statusAge}</h1>;
    }

    function getPriceClass(amount) {
        if (amount > 150) return 'expensive';
        if (amount < 20) return 'cheap';
        return '';
    }

    function onBack() {
        navigate('/book')
    }

    if (!book) return (<div>Details Loading...</div>);

    return (
        <section className="book-details-index">
            <div className="book-details-container">
                <img src={book.thumbnail}/>  

                <div className="book-details">
                    <h1>Title: {book.title}</h1>
                    <h1 className={getPriceClass(book.listPrice.amount)}>Amount: {book.listPrice.amount} {utilService.currencyCodeToSymbol.get(book.listPrice.currencyCode)}</h1>
                    <StatusReading/>
                    <StatusAge/>
                    <LongTxt txt={book.description}/>
                    {book.listPrice.isOnSale && <p>On Sale</p>}
                </div>
            </div>
            
            <Reviews bookId={book.id}/>
            <button onClick={onBack}>Back</button>
            <section>
                <button><Link to={`/book/${book.prevBookId}`}>Prev Book</Link></button>
                <button><Link to={`/book/${book.nextBookId}`}>Next Book</Link></button>
            </section>
        </section>
    );
};