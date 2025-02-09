import { redirect } from 'next/navigation';
import React from 'react'
import '../app/globals.css'
export default function page() {
  redirect('/en');
}
