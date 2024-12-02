import { utilService } from "../services/util.service.js";

export function BookPreview({ book }) {
    return (
        <article className="book-preview">
            <h2>{book.title}</h2>
            <h4>{book.listPrice.amount} {utilService.currencyCodeToSymbol.get(book.listPrice.currencyCode)}</h4>
            <img src={book.thumbnail} alt="book-img" />
        </article>
    );
};
