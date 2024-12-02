export function Toggle({ isChecked, onChange, label1 = 'ON', label2 = "OFF", id = `toggle-${label1}`, name = `toggle-${label1}` }) {

  return (
    <div className="toggle-container">
      <label htmlFor={id} className="toggle-switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          id={id}
          name={name}
        />
        <span className="slider"></span>
      </label>
      <span>{isChecked ? label1 : label2}</span>
    </div>
  );
};