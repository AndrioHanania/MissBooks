const { useState } = React;

export function RateByStars({ val, onSelected, isDisabled = false }) {
    const [rating, setRating] = useState(val || 0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleRatingChange = (currentRating) => {
        if (isDisabled) return;
        setRating(currentRating);
        onSelected({ target: { name: 'rating', value: currentRating } });
    };

    return (
        <div className={`star-rating ${isDisabled ? 'disabled' : ''}`}>
            {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;

            return (
                <svg
                    key={ratingValue}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className={`star ${ratingValue <= (hoverRating || rating) ? 'filled' : 'empty'}`}
                    onMouseEnter={() => !isDisabled && setHoverRating(ratingValue)}
                    onMouseLeave={() => !isDisabled && setHoverRating(0)}
                    onClick={() => handleRatingChange(ratingValue)} 
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            );
            })}
        </div>
    );
};