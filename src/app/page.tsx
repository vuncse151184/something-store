import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';  // your defineRouting()

export default function Home() {
    redirect(`/${routing.defaultLocale}`);
}
