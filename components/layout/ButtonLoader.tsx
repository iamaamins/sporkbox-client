import PulseLoader from "react-spinners/PulseLoader";

export default function ButtonLoader({
  color = "#fafafa",
  size = 10,
  margin = 5,
}) {
  return (
    <PulseLoader
      color={color}
      size={size}
      speedMultiplier={0.75}
      margin={margin}
    />
  );
}
