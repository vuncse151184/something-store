// pages/api/seed-bouquets.ts

import { NextResponse } from 'next/server';
import { supabaseClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';
const bouquets = [
  {
    id: uuidv4(),
    name_en: "Sunshine Charm",
    name_vi: "Phép Màu Ánh Dương",
    description_en: "A bright bouquet of sunflowers and daisies to bring joy.",
    description_vi: "Bó hoa rực rỡ từ hoa hướng dương và cúc mang lại niềm vui.",
    meaning_en: "Symbolizes happiness and positive energy.",
    meaning_vi: "Biểu tượng của hạnh phúc và năng lượng tích cực.",
    price: 490000,
    image_url: "https://example.com/images/sunshine_charm.jpg"
  },
  {
    id: uuidv4(),
    name_en: "Romantic Whisper",
    name_vi: "Lời Thì Thầm Lãng Mạn",
    description_en: "Red roses and baby’s breath perfect for lovers.",
    description_vi: "Hoa hồng đỏ và hoa bi trắng dành riêng cho người yêu.",
    meaning_en: "Represents love and passion.",
    meaning_vi: "Tượng trưng cho tình yêu và đam mê.",
    price: 650000,
    image_url: "https://example.com/images/romantic_whisper.jpg"
  },
  {
    id: uuidv4(),
    name_en: "Elegant Grace",
    name_vi: "Vẻ Đẹp Thanh Lịch",
    description_en: "White lilies and orchids in a graceful arrangement.",
    description_vi: "Hoa lily trắng và lan được sắp xếp đầy thanh nhã.",
    meaning_en: "Symbolizes purity and elegance.",
    meaning_vi: "Biểu tượng cho sự tinh khiết và thanh cao.",
    price: 720000,
    image_url: "https://example.com/images/elegant_grace.jpg"
  },
  {
    id: uuidv4(),
    name_en: "Morning Bloom",
    name_vi: "Bình Minh Nở Rộ",
    description_en: "Soft pastel tulips representing a new beginning.",
    description_vi: "Tulip màu pastel dịu dàng tượng trưng cho khởi đầu mới.",
    meaning_en: "Represents hope and renewal.",
    meaning_vi: "Biểu trưng cho hy vọng và sự đổi mới.",
    price: 580000,
    image_url: "https://example.com/images/morning_bloom.jpg"
  },
  {
    id: uuidv4(),
    name_en: "Happy Moment",
    name_vi: "Khoảnh Khắc Hạnh Phúc",
    description_en: "Mix of gerberas and roses to celebrate any happy event.",
    description_vi: "Sự kết hợp của hoa đồng tiền và hồng cho mọi dịp vui.",
    meaning_en: "Spreads cheer and celebration.",
    meaning_vi: "Mang đến niềm vui và sự hân hoan.",
    price: 450000,
    image_url: "https://example.com/images/happy_moment.jpg"
  }
];
export async function POST(){
  

  try {


    const { data, error } = await supabaseClient.from('bouquets').insert(bouquets);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message });
    }

    return NextResponse.json({ message: 'Bouquets seeded!', data });
  } catch (e: any) {
    console.error('API error:', e);
    return NextResponse.json({ error: e.message });
  }
}

