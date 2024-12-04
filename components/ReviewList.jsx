import { Review } from "./Review.jsx";

export function ReviewList({ reviews, onRemove }) {
    return (
        <ul style={{ padding: '0px' }}>
            {reviews.map(review => (
                <li key={review.id} style={{ listStyle: 'none', margin: '5px' }}>
                    <Review reviewId={review.id} onRemove={onRemove}/>
                </li>
            ))}
        </ul>
    );
}
