"use client"

import React from 'react'

const TestPage = () => {

    const handleClick = async () => {
        try {
            const response = fetch('/api/bouquet-seeding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Hello from TestPage!'
                }),
            });
            response.then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            }).then(data => {
                console.log('Response from /api/bouquet-seeding:', data);
            }).catch(error => {
                console.error('Error in fetch:', error);
            });
        } catch (error) {
            console.error('Unexpected error in handleClick:', error);
        }
    }
    return (
        <div onClick={handleClick} className='text-white hover:cursor-pointer p-4 bg-yellow-600'>TestPage</div>
    )
}

export default TestPage