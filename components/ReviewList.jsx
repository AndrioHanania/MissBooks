import { Review } from "./Review.jsx";

export function ReviewList({ bookReviews, onRemove }) {
    return (
        <ul style={{ padding: '0px' }}>
            {bookReviews.map(bookReview => (
                <li key={bookReview.id} style={{ listStyle: 'none', margin: '5px' }}>
                    <Review reviewId={bookReview.reviewId} onRemove={onRemove}/>
                </li>
            ))}
        </ul>
    );
}
