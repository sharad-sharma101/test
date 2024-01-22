import './index.css'

export default function QuantityInput({value, increment, decrement}:any) {
	

	return (
		<div>
			<div className="quantity-input">
				<button
					className="quantity-input__modifier quantity-input__modifier--left"
					onClick={decrement}
				>
					&mdash;
				</button>
				<input
					className="quantity-input__screen"
					type="text"
					value={value}
					readOnly
				/>
				<button
					className="quantity-input__modifier quantity-input__modifier--right"
					onClick={increment}
				>
					&#xff0b;
				</button>
			</div>
		</div>
	);
}
