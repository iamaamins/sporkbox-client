import { AiFillStar } from 'react-icons/ai';

export default function Stars({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= rating; i++) {
    stars.push(<AiFillStar key={i + 1} />);
  }
  return <>{stars.map((star) => star)}</>;
}
