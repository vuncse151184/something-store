import OpenAI from 'openai';

// Core interfaces for bouquet meaning generation
interface BouquetInfo {
    name: string;
    flowers: string[];
    colors: string[];
    occasion?: string;
    style?: string;
}

interface GeneratedMeaning {
    title: string;
    meaningText: string;
    inspirationalQuote: string;
    symbolism: string[];
    emotionalMessage: string;
    poeticDescription: string;
    flowerWisdom: string;
    occasions: string[];
}

interface MeaningResult {
    meaning: GeneratedMeaning;
    success: boolean;
    error?: string;
}

// Configuration
const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_V3_API_KEY || process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
    throw new Error('API key is required for bouquet meaning generation.');
}

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true, // Allow browser usage for client-side calls
    // defaultHeaders: {
    //     'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
    //     'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'Bouquet Meaning Generator',
    // },
});

// System prompt for generating meaningful content
const MEANING_PROMPT = `You are a poetic flower expert and meaning interpreter. When given bouquet information, create beautiful, meaningful content including:

1. Inspirational and meaningful text about the bouquet's significance
2. Beautiful quotes related to the flowers and their meanings
3. Symbolic interpretations of each flower and color
4. Emotional messages the bouquet conveys
5. Poetic descriptions that capture the essence
6. Wisdom and insights about the flowers

Focus on creating content that is:
- Emotionally resonant and meaningful
- Poetic and beautifully written
- Culturally aware and respectful
- Inspirational and uplifting
- Rich in symbolism and deeper meaning

Format your response as JSON with the specified structure.`;

class BouquetMeaningGenerator {
    private meaningTemplates: Map<string, any> = new Map();

    constructor() {
        this.initializeMeaningTemplates();
    }

    private initializeMeaningTemplates() {
        // Fallback templates for common bouquet types
        const templates = {
            roses: {
                quotes: [
                    "A rose speaks of love silently, in a language known only to the heart.",
                    "The rose is the poetry of earth written in petals and perfume.",
                    "In every rose, there lies a story of love waiting to bloom."
                ],
                symbolism: ["Love", "Passion", "Beauty", "Devotion", "Romance"],
                wisdom: "Roses teach us that love, like their petals, unfolds gradually and reveals its beauty in layers."
            },
            mixed: {
                quotes: [
                    "In diversity of flowers lies the true beauty of a garden.",
                    "Each bloom tells its own story, together they create a symphony.",
                    "Life is like a bouquet - made beautiful by its variety."
                ],
                symbolism: ["Diversity", "Harmony", "Celebration", "Joy", "Unity"],
                wisdom: "Mixed bouquets remind us that beauty comes from embracing differences and finding harmony in variety."
            }
        };

        Object.entries(templates).forEach(([key, template]) => {
            this.meaningTemplates.set(key, template);
        });
    }

    /**
     * Generate meaning for a bouquet when user clicks "See Meaning"
     */
    async generateBouquetMeaning(
        bouquetInfo: BouquetInfo,
        onProgress?: (chunk: string) => void
    ): Promise<MeaningResult> {
        try {
            const prompt = this.buildMeaningPrompt(bouquetInfo);

            const response = await openai.chat.completions.create({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages: [
                    { role: 'system', content: MEANING_PROMPT },
                    { role: 'user', content: prompt }
                ],
                stream: true,
                temperature: 0.9, // Higher creativity for poetic content
                max_tokens: 1200,
                presence_penalty: 0.2,
                frequency_penalty: 0.1
            });

            let fullResponse = '';

            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    fullResponse += content;
                    if (onProgress) onProgress(content);
                }
            }

            const meaning = this.parseMeaningResponse(fullResponse, bouquetInfo);

            return {
                meaning,
                success: true
            };

        } catch (error) {
            console.error('Error generating bouquet meaning:', error);

            return {
                meaning: this.getFallbackMeaning(bouquetInfo),
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate meaning'
            };
        }
    }

    private buildMeaningPrompt(bouquetInfo: BouquetInfo): string {
        const flowersText = bouquetInfo.flowers.join(', ');
        const colorsText = bouquetInfo.colors.join(', ');

        return `Generate beautiful, meaningful content for this bouquet:

Bouquet Name: ${bouquetInfo.name}
Flowers: ${flowersText}
Colors: ${colorsText}
${bouquetInfo.occasion ? `Occasion: ${bouquetInfo.occasion}` : ''}
${bouquetInfo.style ? `Style: ${bouquetInfo.style}` : ''}

Please provide a JSON response with the following structure:
{
  "title": "Meaningful title for this bouquet",
  "meaningText": "2-3 paragraphs about the deeper meaning and significance",
  "inspirationalQuote": "A beautiful quote related to these flowers",
  "symbolism": ["array", "of", "symbolic", "meanings"],
  "emotionalMessage": "The emotional message this bouquet conveys",
  "poeticDescription": "A poetic, beautiful description of the bouquet",
  "flowerWisdom": "Wisdom or insight about these flowers",
  "occasions": ["suitable", "occasions", "for", "this", "bouquet"]
}

Make the content inspirational, meaningful, and beautifully written.`;
    }

    private parseMeaningResponse(response: string, bouquetInfo: BouquetInfo): GeneratedMeaning {
        try {
            // Extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);

                return {
                    title: parsed.title || `The Meaning of ${bouquetInfo.name}`,
                    meaningText: parsed.meaningText || this.generateFallbackMeaningText(bouquetInfo),
                    inspirationalQuote: parsed.inspirationalQuote || this.getRandomQuote(bouquetInfo),
                    symbolism: parsed.symbolism || this.getDefaultSymbolism(bouquetInfo),
                    emotionalMessage: parsed.emotionalMessage || 'A message of love and appreciation',
                    poeticDescription: parsed.poeticDescription || this.generatePoeticDescription(bouquetInfo),
                    flowerWisdom: parsed.flowerWisdom || this.getFlowerWisdom(bouquetInfo),
                    occasions: parsed.occasions || ['Special celebrations', 'Expressions of love', 'Meaningful moments']
                };
            }
        } catch (error) {
            console.warn('JSON parsing failed, using fallback generation');
        }

        // Fallback if JSON parsing fails
        return this.generateFromText(response, bouquetInfo);
    }

    private generateFromText(response: string, bouquetInfo: BouquetInfo): GeneratedMeaning {
        return {
            title: `The Beauty and Meaning of ${bouquetInfo.name}`,
            meaningText: response.substring(0, 400) + '...',
            inspirationalQuote: this.getRandomQuote(bouquetInfo),
            symbolism: this.getDefaultSymbolism(bouquetInfo),
            emotionalMessage: 'A heartfelt expression of care and beauty',
            poeticDescription: this.generatePoeticDescription(bouquetInfo),
            flowerWisdom: this.getFlowerWisdom(bouquetInfo),
            occasions: ['Celebrations', 'Gift-giving', 'Special moments']
        };
    }

    private getFallbackMeaning(bouquetInfo: BouquetInfo): GeneratedMeaning {
        return {
            title: `The Essence of ${bouquetInfo.name}`,
            meaningText: `This beautiful bouquet of ${bouquetInfo.flowers.join(', ')} represents the timeless language of flowers. Each bloom carries its own story, and together they create a symphony of meaning that speaks directly to the heart. The carefully chosen ${bouquetInfo.colors.join(' and ')} colors add layers of symbolism, creating an arrangement that goes beyond mere beauty to touch the soul.`,
            inspirationalQuote: this.getRandomQuote(bouquetInfo),
            symbolism: this.getDefaultSymbolism(bouquetInfo),
            emotionalMessage: 'A beautiful expression of love, care, and meaningful connection',
            poeticDescription: this.generatePoeticDescription(bouquetInfo),
            flowerWisdom: this.getFlowerWisdom(bouquetInfo),
            occasions: ['Anniversaries', 'Celebrations', 'Expressions of love', 'Meaningful gifts']
        };
    }

    private getRandomQuote(bouquetInfo: BouquetInfo): string {
        const generalQuotes = [
            "Flowers are the music of the ground, from earth's lips spoken without sound.",
            "In every flower, there is a story waiting to be told.",
            "A bouquet is poetry written in petals and perfume.",
            "Flowers whisper 'Beauty!' to the world, even as they fade, wilt, fall.",
            "Each flower blooms in its own time, and so do we."
        ];

        // Try to get specific quote based on flowers
        const primaryFlower = bouquetInfo.flowers[0]?.toLowerCase();
        const template = this.meaningTemplates.get(primaryFlower) || this.meaningTemplates.get('mixed');

        if (template?.quotes) {
            const randomQuote = template.quotes[Math.floor(Math.random() * template.quotes.length)];
            return randomQuote;
        }

        return generalQuotes[Math.floor(Math.random() * generalQuotes.length)];
    }

    private getDefaultSymbolism(bouquetInfo: BouquetInfo): string[] {
        const baseSymbols = ['Beauty', 'Love', 'Nature', 'Appreciation'];

        // Add color-based symbolism
        if (bouquetInfo.colors.includes('red')) baseSymbols.push('Passion', 'Deep Love');
        if (bouquetInfo.colors.includes('white')) baseSymbols.push('Purity', 'Peace');
        if (bouquetInfo.colors.includes('yellow')) baseSymbols.push('Joy', 'Friendship');
        if (bouquetInfo.colors.includes('pink')) baseSymbols.push('Gratitude', 'Admiration');
        if (bouquetInfo.colors.includes('purple')) baseSymbols.push('Nobility', 'Spirituality');

        return baseSymbols;
    }

    private generatePoeticDescription(bouquetInfo: BouquetInfo): string {
        const flowersText = bouquetInfo.flowers.join(' and ');
        const colorsText = bouquetInfo.colors.join(' and ');

        return `Like whispered secrets from nature's heart, this bouquet of ${flowersText} dances in shades of ${colorsText}, each petal a verse in love's eternal poem. Together, they create a masterpiece that speaks the language flowers have whispered since time began.`;
    }

    private generateFallbackMeaningText(bouquetInfo: BouquetInfo): string {
        return `This exquisite arrangement of ${bouquetInfo.flowers.join(', ')} represents more than mere beauty—it embodies the profound connection between nature and human emotion. Each flower has been chosen not only for its visual appeal but for the deeper meaning it carries through centuries of floral tradition.\n\nThe ${bouquetInfo.colors.join(' and ')} hues speak their own language of symbolism, creating layers of meaning that touch both heart and soul. This bouquet serves as a bridge between the giver and receiver, carrying messages that words alone cannot express.`;
    }

    private getFlowerWisdom(bouquetInfo: BouquetInfo): string {
        const wisdomPhrases = [
            "Flowers teach us that beauty is fleeting, but the memories they create last forever.",
            "In the language of flowers, every bloom has a story to tell and a heart to touch.",
            "Like flowers reaching toward the sun, we too grow toward the light of love and understanding.",
            "The wisdom of flowers lies not in their perfection, but in their willingness to bloom despite life's storms.",
            "Each petal reminds us that life's most beautiful moments are often the most delicate."
        ];

        return wisdomPhrases[Math.floor(Math.random() * wisdomPhrases.length)];
    }
}

// Main export functions
const generator = new BouquetMeaningGenerator();

/**
 * Generate meaning when user clicks "See Bouquet Meaning"
 */
export async function generateBouquetMeaning(
    bouquetInfo: BouquetInfo,
    onProgress?: (chunk: string) => void
): Promise<MeaningResult> {
    return generator.generateBouquetMeaning(bouquetInfo, onProgress);
}

/**
 * Quick generation for simple bouquets
 */
export async function generateSimpleMeaning(
    bouquetName: string,
    flowers: string[],
    colors: string[],
    onProgress?: (chunk: string) => void
): Promise<MeaningResult> {
    const bouquetInfo: BouquetInfo = {
        name: bouquetName,
        flowers,
        colors
    };

    return generator.generateBouquetMeaning(bouquetInfo, onProgress);
}

// Type exports
export type { BouquetInfo, GeneratedMeaning, MeaningResult };