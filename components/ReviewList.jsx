import { Review } from "./Review.jsx";

export function ReviewList({ reviews, onRemove }) {
    return (
        <ul className="reviews">
            {reviews.map(review => (
                <li key={review.id} className="li-review">
                    <Review reviewId={review.id} onRemove={onRemove}/>
                </li>
            ))}
        </ul>
    );
};