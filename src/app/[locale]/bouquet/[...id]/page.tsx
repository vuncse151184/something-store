import React from 'react'
import BouquetDetail from '../../components/bouquet-detail'
import BouquetCustomizer from '../../components/bouquet-customizer'

const BouquetPage = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4'>
            <BouquetDetail />
            {/* <BouquetCustomizer /> */}
            {/* <BouquetDetail locale={locale} /> */}
        </div>
    )
}

export default BouquetPage