import { BookPreview } from "./BookPreview.jsx";
import { userService } from "../services/user.service.js";

const { Link } = ReactRouterDOM;
const { useNavigate } = ReactRouter;

export function BookList({ books, onRemove }) {
    const navigate = useNavigate();
    const isLoginUserAdmin = userService.isLoginUserAdmin();

    return (
        <ul className="book-list">
            {books.map(book =>
                <li key={book.id} onClick={() => navigate(`/book/${book.id}`)}>
                    <BookPreview book={book}/>
                    <section>
                        {isLoginUserAdmin && (<button ><Link to={`/book/edit/${book.id}`}>Edit</Link></button>)}
                        {isLoginUserAdmin && (<button onClick={() => onRemove(book.id)}>x</button>)}
                    </section>
                </li>
            )}
        </ul>
    );
};