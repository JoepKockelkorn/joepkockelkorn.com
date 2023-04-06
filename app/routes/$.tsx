import { json, LoaderArgs } from '@vercel/remix';

export function loader({}: LoaderArgs) {
  throw json('Not found', { status: 404 });
}

export default function Component() {
  return null;
}
