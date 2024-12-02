const { useEffect, useState } = React;

export function Stars({ rating, length = 5, onChange }) {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        loadStars(rating);
    }, [rating]);

    function loadStars(grade) {
        setStars(Array.from({ length }, (_, index) => (
            index < grade ? '★' : '☆'
        )));
    }

    function onUpdateRate(index) {
        const newRating = index + 1;

        onChange({ target: { name: 'rating', value: newRating } });
        loadStars(newRating);
    }

    return (
        <div style={{ display: 'flex', fontSize: '24px' }}>
        {stars.map((star, index) => (
            <span 
                key={index}
                style={{ marginRight: '5px', cursor: 'pointer' }}
                onClick={() => onUpdateRate(index)}
            >
                {star}
            </span>
        ))}
    </div>
    );
};
