const Button = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-amber-800 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded-lg"
    >
      {text}
    </button>
  );
};

export default Button;
