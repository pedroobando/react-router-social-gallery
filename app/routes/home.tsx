import { redirect } from 'react-router';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  return redirect('/auth');
}

export default function Home() {
  return <></>;
}
