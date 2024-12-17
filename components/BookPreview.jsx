import { utilService } from "../services/util.service.js";

export function BookPreview({ book }) {
    return (
        <article className="book-preview">
            <img className="book-img" src={book.thumbnail} alt="book-img" />
            <h2>{book.title}</h2>
            <h3>{book.authors}</h3>
            <div className="book-sales">
                <div>
                    <div className="book-sale">
                        <img src="./assets/img/phone.svg" alt="phone-icon" />
                        <p>Digital</p>
                    </div>
                    {book.listPrice.amount} {utilService.currencyCodeToSymbol.get(book.listPrice.currencyCode)}
                </div>

                <div>
                    <div className="book-sale">
                        <img src="./assets/img/book.svg" alt="book-icon" />
                        <p>Printed</p>
                    </div>
                    {book.listPrice.amount} {utilService.currencyCodeToSymbol.get(book.listPrice.currencyCode)}
                </div>
            </div>
        </article>
    );
};
