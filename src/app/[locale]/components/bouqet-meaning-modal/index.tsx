import React, { useEffect, useState } from 'react'
import { X, Heart, Sparkles, Quote, Flower, Calendar, Lightbulb } from 'lucide-react'
import { BouquetType } from '@/app/types/bouqet.type'
import { generateBouquetMeaning, GeneratedMeaning } from '@/lib/generate-meaning';

interface BouquetMeaningModalProps {
    // bouquet: BouquetType | null;
    bouquet: any;
    isOpen: boolean;
    onClose: () => void;
}

const BouquetMeaningModal = ({ bouquet, isOpen, onClose }: BouquetMeaningModalProps) => {
    const [meaning, setMeaning] = useState<GeneratedMeaning | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [error, setError] = useState<string | null>(null);
    console.log('BouquetMeaningModal rendered with bouquet:', bouquet);
    useEffect(() => {
        if (!bouquet || !isOpen) return;

        const getMeaning = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setStreamingText('');

                // Extract bouquet information
                const bouquetInfo = {
                    name: bouquet.name || "Beautiful Bouquet",
                    flowers: bouquet.flowers || ["Mixed Flowers"],
                    colors: bouquet.colors || ["Mixed Colors"],
                    occasion: bouquet.occasion,
                    style: bouquet.style
                };

                const result = await generateBouquetMeaning(
                    bouquetInfo,
                    (chunk: string) => {
                        setStreamingText(prev => prev + chunk);
                    }
                );

                if (result.success) {
                    setMeaning(result.meaning);
                } else {
                    setError(result.error || 'Failed to generate meaning');
                }
            } catch (err) {
                setError('Something went wrong while generating the meaning');
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
                setStreamingText('');
            }
        };

        getMeaning();
    }, [isOpen]);

    if (!isOpen || !bouquet) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 max-w-4xl min-w-[800px] !z-10 opacity-1  p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl  w-full max-h-[90vh] overflow-hidden relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-[150px] text-white p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-yellow-200" size={28} />
                            <h2 className="text-2xl font-bold">
                                {meaning?.title || "Discovering Meaning..."}
                            </h2>
                        </div>
                        <p className="text-rose-100 text-sm">
                            The deeper significance of {bouquet.name}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {isLoading && (
                        <div className="space-y-6">
                            {/* Loading Animation */}
                            <div className="text-center py-8">
                                <div className="inline-flex items-center gap-2 text-rose-500">
                                    <Flower className="animate-spin" size={24} />
                                    <span className="text-lg font-medium">Unveiling the meaning...</span>
                                </div>
                            </div>

                            {/* Streaming Text Preview */}
                            {streamingText && (
                                <div className="bg-rose-50 rounded-lg p-4 border-l-4 border-rose-300">
                                    <p className="text-gray-700 leading-relaxed">
                                        {streamingText}
                                        <span className="inline-block w-2 h-5 bg-rose-400 ml-1 animate-pulse"></span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <Heart className="mx-auto text-red-400 mb-3" size={32} />
                                <h3 className="font-semibold text-red-800 mb-2">Unable to Generate Meaning</h3>
                                <p className="text-red-600">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {meaning && !isLoading && (
                        <div className="space-y-8">
                            {/* Inspirational Quote */}
                            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border-l-4 border-rose-400">
                                <div className="flex items-start gap-3">
                                    <Quote className="text-rose-400 mt-1 flex-shrink-0" size={24} />
                                    <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                                        &ldquo;{meaning.inspirationalQuote}&rdquo;
                                    </blockquote>
                                </div>
                            </div>

                            {/* Main Meaning Text */}
                            <div className="prose prose-gray max-w-none">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Heart className="text-rose-500" size={20} />
                                    The Deeper Meaning
                                </h3>
                                <div className="text-gray-700 leading-relaxed space-y-4">
                                    {meaning.meaningText.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Symbolism Grid */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Sparkles className="text-yellow-500" size={20} />
                                    Symbolic Meanings
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {meaning.symbolism.map((symbol, index) => (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg p-3 text-center border border-rose-200"
                                        >
                                            <span className="text-rose-700 font-medium">{symbol}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Emotional Message */}
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                    <Heart className="text-purple-600" size={20} />
                                    Emotional Message
                                </h3>
                                <p className="text-purple-700 leading-relaxed">{meaning.emotionalMessage}</p>
                            </div>

                            {/* Poetic Description */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                                    <Flower className="text-emerald-600" size={20} />
                                    Poetic Vision
                                </h3>
                                <p className="text-emerald-700 leading-relaxed italic">{meaning.poeticDescription}</p>
                            </div>

                            {/* Flower Wisdom */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                    <Lightbulb className="text-amber-600" size={20} />
                                    Flower Wisdom
                                </h3>
                                <p className="text-amber-700 leading-relaxed">{meaning.flowerWisdom}</p>
                            </div>

                            {/* Perfect Occasions */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                                    <Calendar className="text-blue-600" size={20} />
                                    Perfect Occasions
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {meaning.occasions.map((occasion, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                                        >
                                            {occasion}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            Generated with love and flower wisdom ✨
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BouquetMeaningModal;