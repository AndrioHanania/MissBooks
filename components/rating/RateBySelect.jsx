const { useState } = React;

export function RateBySelect({ val, onSelected, isDisabled }) {
    const [rating, setRating] = useState(val || 0);

    const handleChange = (e) => {
        if(isDisabled) return;
        const selectedValue = e.target.value;
        setRating(selectedValue);
        onSelected(e);
    };

    return (
        <div className={`select-rating  ${isDisabled ? 'disabled' : ''}`}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: '#6B7280' }}
            >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>

            <select 
                value={rating} 
                onChange={handleChange} 
                className="select-rate"
                disabled={isDisabled}
                name="rating"
            >
                <option value="0">Select Rating</option>
                <option value="1">Poor</option>
                <option value="2">Fair</option>
                <option value="3">Good</option>
                <option value="4">Very Good</option>
                <option value="5">Excellent</option>
            </select>
        </div>
    );
};