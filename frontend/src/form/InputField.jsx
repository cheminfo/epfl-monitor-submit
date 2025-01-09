export default function InputField(props) {
  const { signal } = props;
  return (
    <input
      type="text"
      value={signal.value}
      onInput={(e) => {
        signal.value = e.target.value;
      }}
    />
  );
}
