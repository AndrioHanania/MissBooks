const { useState } = React;

export function RateByTextbox({ val, onSelected, isDisabled }) {
    const [rating, setRating] = useState(val || '');

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const sanitizedValue = Math.max(0, Math.min(5, Number(inputValue)));
        setRating(sanitizedValue);
        onSelected({ target: { name: e.target.name, value: sanitizedValue } });
    };

    return (
        <div className={`textbox-rating  ${isDisabled ? 'disabled' : ''}`}>
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
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
            </svg>

            <input 
            name="rating"
                type="number" 
                value={rating} 
                onChange={handleChange}
                min="0" 
                max="5" 
                step="0.1"
                className="textbox"
                placeholder="0-5"
                disabled={isDisabled}
            />
        </div>
    );
};