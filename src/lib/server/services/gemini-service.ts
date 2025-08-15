import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import { chatHistoryService } from './chat-history-service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;

  constructor() {
    console.log('🔍 Gemini Service Debug:');
    console.log('- GEMINI_API_KEY imported:', !!GEMINI_API_KEY);
    console.log('- API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
    
    if (!GEMINI_API_KEY) {
      console.warn('❌ GEMINI_API_KEY not found in environment variables. Using mock responses.');
      console.warn('Please make sure your .env file contains: GEMINI_API_KEY=your-api-key');
      this.genAI = null;
      this.model = null;
      this.chat = null;
    } else {
      console.log('✅ GEMINI_API_KEY found. Initializing Gemini AI...');
      try {
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        this.chat = this.model.startChat({
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        });
        console.log('✅ Gemini AI initialized successfully!');
      } catch (error) {
        console.error('❌ Error initializing Gemini AI:', error);
        this.genAI = null;
        this.model = null;
        this.chat = null;
      }
    }
  }

  async sendMessage(message: string): Promise<string> {
    console.log('🔍 sendMessage called with:', message);
    console.log('- genAI exists:', !!this.genAI);
    console.log('- chat exists:', !!this.chat);
    
    try {
      // If no API key is configured, fall back to mock responses
      if (!this.genAI || !this.chat) {
        console.log('❌ Using mock response (no Gemini AI initialized)');
        return this.getMockResponse(message);
      }

      // Check for common queries that need special handling
      const enhancedResponse = this.handleCommonQueries(message);
      if (enhancedResponse) {
        console.log('✅ Using enhanced response for common query');
        return enhancedResponse;
      }

      console.log('✅ Sending message to Gemini API...');
      
      // Create an enhanced prompt with better instructions
      const enhancedPrompt = this.createEnhancedPrompt(message);
      
      // Send message to Gemini API
      const result = await this.chat.sendMessage(enhancedPrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Received response from Gemini:', text.substring(0, 100) + '...');
      
      // Validate and improve the response if needed
      const improvedResponse = this.validateAndImproveResponse(text, message);
      
      return improvedResponse || 'I apologize, but I couldn\'t generate a response. Please try again.';
      
    } catch (error) {
      console.error('❌ Error calling Gemini API:', error);
      
      // Fall back to mock response if API fails
      console.log('🔄 Falling back to mock response');
      return this.getMockResponse(message);
    }
  }

  async sendMessageStream(message: string): Promise<string> {
    // For now, return the regular response, but this can be enhanced for streaming
    return this.sendMessage(message);
  }

  async streamResponse(message: string, controller: ReadableStreamDefaultController, sessionId: string): Promise<void> {
    try {
      // Check for common queries first
      const enhancedResponse = this.handleCommonQueries(message);
      if (enhancedResponse) {
        console.log('✅ Streaming enhanced response for common query');
        await this.streamText(enhancedResponse, controller);
        return;
      }

      // If no API key, stream mock response
      if (!this.genAI || !this.chat) {
        console.log('❌ Streaming mock response (no Gemini AI initialized)');
        const mockResponse = this.getMockResponse(message);
        await this.streamText(mockResponse, controller);
        return;
      }

      console.log('✅ Starting Gemini API streaming...');
      
      // Create an enhanced prompt
      const enhancedPrompt = this.createEnhancedPrompt(message);
      
      // Stream from Gemini API
      const result = await this.chat.sendMessageStream(enhancedPrompt);
      let fullResponse = '';
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        
        // Send chunk to client
        controller.enqueue(new TextEncoder().encode(chunkText));
        
        // Add small delay for natural typing effect
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      // Validate and improve the response if needed
      const improvedResponse = this.validateAndImproveResponse(fullResponse, message);
      
      // If response was improved, send the difference
      if (improvedResponse !== fullResponse) {
        const difference = improvedResponse.substring(fullResponse.length);
        if (difference) {
          controller.enqueue(new TextEncoder().encode(difference));
        }
      }
      
      // Store the final response in database
      await chatHistoryService.addMessage(sessionId, 'assistant', improvedResponse || fullResponse);
      
    } catch (error) {
      console.error('❌ Error in streaming:', error);
      
      // Fall back to mock response
      const mockResponse = this.getMockResponse(message);
      await this.streamText(mockResponse, controller);
    } finally {
      controller.close();
    }
  }

  private async streamText(text: string, controller: ReadableStreamDefaultController): Promise<void> {
    const words = text.split(' ');
    
    for (const word of words) {
      controller.enqueue(new TextEncoder().encode(word + ' '));
      
      // Add natural typing delay
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
  }

  private handleCommonQueries(message: string): string | null {
    const messageLower = message.toLowerCase();
    
    // Mood-related queries (both asking about mood and improving mood)
    if (messageLower.includes('mood')) {
      if (messageLower.includes('how') || messageLower.includes('what') || messageLower.includes('your')) {
        return `I'm doing great, thank you for asking! I'm here and ready to help you with whatever you need. 

How are you feeling today? If you'd like to improve your mood, I can suggest some simple things you can try right now:

1. **Take 5 deep breaths** - This activates your relaxation response
2. **Listen to your favorite upbeat song** - Music can instantly lift your mood
3. **Step outside for 2 minutes** - Fresh air and natural light help
4. **Text a friend** - Social connection is a powerful mood booster
5. **Do 10 jumping jacks** - Quick exercise releases endorphins

What's your mood like today? I'm here to help!`;
      }
      
      if (messageLower.includes('improve') || messageLower.includes('enhance') || messageLower.includes('better') || messageLower.includes('good') || messageLower.includes('fresh')) {
        return `Here are some simple ways to improve your mood right now:

1. **Take a short walk** - Even 10 minutes of walking can boost your mood
2. **Listen to upbeat music** - Your favorite happy songs can instantly lift your spirits
3. **Practice gratitude** - Write down 3 things you're thankful for today
4. **Deep breathing** - Take 5 slow, deep breaths to calm your mind
5. **Call a friend** - Social connection is a powerful mood booster
6. **Get some sunlight** - Natural light helps regulate your mood
7. **Do something you enjoy** - Read, draw, cook, or any hobby you love
8. **Exercise** - Even light stretching releases feel-good endorphins

Try one of these right now and see how you feel! Which one sounds most appealing to you?`;
      }
    }
    
    // Stress relief queries
    if (messageLower.includes('stress') || messageLower.includes('anxiety') || messageLower.includes('worried')) {
      return `Here are effective ways to reduce stress and anxiety:

1. **Box breathing** - Inhale for 4, hold for 4, exhale for 4, hold for 4
2. **Progressive muscle relaxation** - Tense and release each muscle group
3. **Mindfulness meditation** - Focus on your breath for 5-10 minutes
4. **Write it down** - Journal your thoughts to clear your mind
5. **Take a break** - Step away from stressful situations when possible
6. **Talk to someone** - Share your concerns with a trusted friend
7. **Exercise** - Physical activity is a natural stress reliever
8. **Limit caffeine** - Too much can increase anxiety

Remember: It's okay to feel stressed sometimes. These techniques can help you manage it better.`;
    }
    
    // Energy boost queries
    if (messageLower.includes('energy') || messageLower.includes('tired') || messageLower.includes('exhausted') || messageLower.includes('sleepy')) {
      return `Here are natural ways to boost your energy:

1. **Stay hydrated** - Drink water throughout the day
2. **Take short breaks** - 5-minute breaks every hour can help
3. **Move your body** - Quick stretches or a short walk
4. **Eat energizing foods** - Nuts, fruits, and whole grains
5. **Get fresh air** - Step outside for a few minutes
6. **Listen to upbeat music** - Music can energize you
7. **Practice good posture** - Sitting up straight can help you feel more alert
8. **Limit screen time** - Take breaks from devices

If you're consistently tired, consider your sleep schedule and overall health habits.`;
    }
    
    // Motivation queries
    if (messageLower.includes('motivation') || messageLower.includes('motivated') || messageLower.includes('lazy') || messageLower.includes('procrastinate')) {
      return `Here's how to boost your motivation:

1. **Start small** - Break big tasks into tiny, manageable steps
2. **Set clear goals** - Write down what you want to achieve
3. **Create a routine** - Consistent habits build momentum
4. **Reward yourself** - Celebrate small wins along the way
5. **Find your why** - Connect tasks to your bigger purpose
6. **Eliminate distractions** - Create a focused environment
7. **Visualize success** - Picture yourself achieving your goals
8. **Start with 5 minutes** - Often, getting started is the hardest part

Remember: Motivation follows action, not the other way around. Just start!`;
    }
    
    // Happiness queries
    if (messageLower.includes('happy') || messageLower.includes('happiness') || messageLower.includes('joy')) {
      return `Here are science-backed ways to increase happiness:

1. **Practice gratitude** - Write down 3 good things daily
2. **Help others** - Acts of kindness boost your own happiness
3. **Spend time with loved ones** - Strong relationships are key
4. **Exercise regularly** - Physical activity releases happy chemicals
5. **Learn something new** - Growth and progress feel good
6. **Get enough sleep** - Rest is essential for mood
7. **Spend time in nature** - Green spaces improve well-being
8. **Limit social media** - Compare less, live more

Happiness is often found in simple, daily practices rather than big achievements.`;
    }
    
    // Learning and study queries
    if (messageLower.includes('learn') || messageLower.includes('study') || messageLower.includes('education')) {
      return `Here are effective learning strategies:

1. **Active recall** - Test yourself instead of just re-reading
2. **Spaced repetition** - Review material at increasing intervals
3. **Break it down** - Study in 25-minute focused sessions
4. **Teach others** - Explaining concepts helps you understand better
5. **Use multiple senses** - Read, write, and speak the material
6. **Create connections** - Link new information to what you already know
7. **Get enough sleep** - Your brain consolidates learning while you sleep
8. **Practice regularly** - Consistency beats cramming

What subject are you trying to learn? I can give you more specific tips!`;
    }
    
    // Productivity queries
    if (messageLower.includes('productive') || messageLower.includes('efficient') || messageLower.includes('work')) {
      return `Here are proven productivity techniques:

1. **Time blocking** - Schedule specific times for different tasks
2. **The 2-minute rule** - If it takes less than 2 minutes, do it now
3. **Eliminate distractions** - Turn off notifications and find a quiet space
4. **Use the Pomodoro technique** - 25 minutes work, 5 minutes break
5. **Prioritize with the Eisenhower matrix** - Urgent vs Important
6. **Batch similar tasks** - Group similar activities together
7. **Set clear goals** - Know exactly what you want to accomplish
8. **Review and reflect** - End each day by planning tomorrow

What type of work are you trying to be more productive with?`;
    }
    
    // Health and fitness queries
    if (messageLower.includes('health') || messageLower.includes('fitness') || messageLower.includes('exercise')) {
      return `Here are key health and fitness tips:

1. **Start with walking** - 30 minutes daily is a great foundation
2. **Strength training** - Build muscle 2-3 times per week
3. **Eat whole foods** - Focus on vegetables, fruits, lean proteins
4. **Stay hydrated** - Drink water throughout the day
5. **Get 7-9 hours sleep** - Quality rest is essential
6. **Manage stress** - Practice relaxation techniques
7. **Be consistent** - Small daily habits beat occasional big efforts
8. **Listen to your body** - Rest when needed, push when you can

What's your current fitness level? I can suggest specific exercises!`;
    }
    
    // Technology queries
    if (messageLower.includes('tech') || messageLower.includes('computer') || messageLower.includes('programming')) {
      return `Here are ways to improve your tech skills:

1. **Start with basics** - Learn fundamental concepts first
2. **Practice coding daily** - Even 30 minutes makes a difference
3. **Build projects** - Apply what you learn to real problems
4. **Join communities** - Connect with other learners online
5. **Follow tutorials** - Step-by-step guides are great for beginners
6. **Read documentation** - Official docs are your best resource
7. **Debug your code** - Learning from mistakes is powerful
8. **Stay updated** - Technology changes fast, keep learning

What specific tech skill are you interested in? I can recommend resources!`;
    }
    
    // Relationship queries
    if (messageLower.includes('relationship') || messageLower.includes('friend') || messageLower.includes('communication')) {
      return `Here are ways to improve relationships:

1. **Active listening** - Focus on understanding, not just responding
2. **Express appreciation** - Regularly acknowledge the good things
3. **Spend quality time** - Be fully present when together
4. **Practice empathy** - Try to see things from their perspective
5. **Communicate clearly** - Be honest about your feelings and needs
6. **Resolve conflicts** - Address issues before they grow
7. **Show respect** - Value their opinions and boundaries
8. **Be supportive** - Celebrate their successes and comfort their struggles

What type of relationship are you working on? I can give more specific advice!`;
    }
    
    // Financial queries
    if (messageLower.includes('money') || messageLower.includes('finance') || messageLower.includes('budget')) {
      return `Here are basic financial management tips:

1. **Track your spending** - Know where your money goes
2. **Create a budget** - Plan your income and expenses
3. **Build an emergency fund** - Save 3-6 months of expenses
4. **Pay yourself first** - Save before spending
5. **Avoid debt** - Use credit cards responsibly
6. **Invest early** - Start with retirement accounts
7. **Learn continuously** - Read books and take courses
8. **Seek professional advice** - Consult experts for complex decisions

What's your current financial situation? I can suggest specific strategies!`;
    }
    
    return null; // Let the AI handle other queries
  }

  private createEnhancedPrompt(message: string): string {
    return `You are a helpful, friendly AI assistant integrated into a SvelteKit authentication application. 

CRITICAL INSTRUCTIONS - FOLLOW THESE EXACTLY:
- ALWAYS provide specific, actionable advice and concrete steps
- NEVER give generic responses like "that's interesting" or "could you provide more context"
- ALWAYS break down complex topics into clear, actionable steps
- ALWAYS give practical, implementable advice
- ALWAYS be encouraging and supportive
- ALWAYS provide 3-5 specific actionable tips for any improvement question
- ALWAYS explain concepts clearly with examples when asked "what is" or "how does"
- ALWAYS suggest next steps or follow-up actions
- Keep responses engaging but concise (3-6 sentences for simple questions, up to 8-10 for complex topics)

EXAMPLES OF GOOD RESPONSES:
- For "how to learn programming": "Start with Python basics, practice daily for 30 minutes, build small projects, join online communities, and follow structured courses."
- For "what is meditation": "Meditation is a practice of focused attention that reduces stress and improves mental clarity. Start with 5 minutes daily, focus on your breath, and gradually increase duration."
- For "how to be more confident": "Practice positive self-talk, set small achievable goals, celebrate wins, maintain good posture, and gradually step out of your comfort zone."

User message: ${message}

Provide a specific, actionable response with concrete steps:`;
  }

  private validateAndImproveResponse(response: string, originalMessage: string): string {
    const responseLower = response.toLowerCase();
    const messageLower = originalMessage.toLowerCase();
    
    // Check for generic/unhelpful responses
    const genericPhrases = [
      'that\'s an interesting question',
      'could you provide more context',
      'could you give me a bit more context',
      'i\'d be happy to help you with that',
      'that\'s a great question',
      'i\'d be happy to help explain',
      'could you ask a more specific question',
      'that depends on',
      'it really depends',
      'there are many ways',
      'there are several approaches',
      'it varies from person to person',
      'everyone is different',
      'what works for one person',
      'i would need more information',
      'could you be more specific',
      'can you clarify',
      'that\'s a broad topic'
    ];
    
    const isGeneric = genericPhrases.some(phrase => responseLower.includes(phrase));
    
    if (isGeneric) {
      console.log('🔄 Detected generic response, providing enhanced answer');
      
      // Provide specific help based on the original message
      if (messageLower.includes('mood') || messageLower.includes('feel')) {
        return `I understand you're asking about mood improvement. Here are some immediate things you can try:

1. **Take 5 deep breaths** - This activates your relaxation response
2. **Listen to your favorite upbeat song** - Music can instantly lift your mood
3. **Step outside for 2 minutes** - Fresh air and natural light help
4. **Text a friend** - Social connection is a powerful mood booster
5. **Do 10 jumping jacks** - Quick exercise releases endorphins

Try one of these right now and see how you feel!`;
      }
      
      if (messageLower.includes('what is') || messageLower.includes('how does')) {
        const topic = messageLower.replace('what is', '').replace('how does', '').trim();
        return `Let me explain ${topic} clearly:

**What it is:** ${topic} is a practical concept that helps you achieve specific goals.

**How to get started:**
1. **Learn the basics** - Start with fundamental principles
2. **Practice regularly** - Consistency is key to mastery
3. **Apply it daily** - Use it in real situations
4. **Track your progress** - Monitor your improvement

**Next steps:** Start with 10 minutes daily practice and gradually increase. What specific aspect of ${topic} interests you most?`;
      }
      
      if (messageLower.includes('how to') || messageLower.includes('how can i')) {
        return `Here's a practical approach to what you're asking:

**Step 1: Start Small** - Begin with the easiest aspect
**Step 2: Set Clear Goals** - Know exactly what you want to achieve
**Step 3: Take Action Daily** - Consistency beats perfection
**Step 4: Track Progress** - Monitor your improvement
**Step 5: Adjust as Needed** - Learn from what works

**Immediate Action:** Pick one small thing you can do today to get started. What's the first step you'd like to take?`;
      }
      
      if (messageLower.includes('best') || messageLower.includes('better') || messageLower.includes('improve')) {
        return `Here are proven strategies to improve in this area:

**Strategy 1: Start with the fundamentals** - Master the basics first
**Strategy 2: Practice consistently** - Daily small efforts add up
**Strategy 3: Learn from experts** - Find mentors or resources
**Strategy 4: Measure your progress** - Track what works for you
**Strategy 5: Stay patient** - Real improvement takes time

**Action Plan:** Choose one strategy to focus on this week. Which one resonates most with you?`;
      }
      
      // Default improvement for other generic responses
      return `I want to give you actionable advice. Here's a practical approach:

**The 3-Step Method:**
1. **Assess your current situation** - Be honest about where you are
2. **Set a specific goal** - Know exactly what you want to achieve
3. **Take immediate action** - Do something today, no matter how small

**Quick Start:** What's one small action you can take right now to move toward your goal?`;
    }
    
    return response; // Return original response if it's good
  }

  private getMockResponse(message: string): string {
    // Use the same enhanced responses as handleCommonQueries
    const enhancedResponse = this.handleCommonQueries(message);
    if (enhancedResponse) {
      return enhancedResponse;
    }
    
    const messageLower = message.toLowerCase();
    
    // Enhanced mock responses for better fallback experience
    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
      return "Hello! I'm your AI assistant. How can I help you today? I can answer questions, provide information, or just chat with you.";
    }
    
    if (messageLower.includes('bye') || messageLower.includes('goodbye') || messageLower.includes('see you')) {
      return "Goodbye! It was nice chatting with you. Feel free to come back anytime if you need help or just want to talk.";
    }
    
    if (messageLower.includes('thank') || messageLower.includes('thanks')) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know or discuss?";
    }
    
    if (messageLower.includes('help') || messageLower.includes('assist')) {
      return "I'm here to help! I can answer questions about various topics, provide explanations, help with problem-solving, or just have a friendly conversation. What would you like to know?";
    }
    
    if (messageLower.includes('who are you') || messageLower.includes('what are you') || messageLower.includes('your name')) {
      return "I'm an AI assistant designed to help you with questions, provide information, and engage in conversation. I'm here to be helpful and friendly!";
    }
    
    if (messageLower.includes('what can you do') || messageLower.includes('your capabilities') || messageLower.includes('can you help')) {
      return "I can help with many things! I can answer questions, explain concepts, help with problem-solving, provide information on various topics, and engage in friendly conversation. Just ask me anything!";
    }
    
    if (messageLower.includes('weather') || messageLower.includes('temperature') || messageLower.includes('forecast')) {
      return "I can't check real-time weather data, but I can tell you that checking weather apps or websites like Weather.com would be the best way to get current weather information for your location.";
    }
    
    if (messageLower.includes('time') || messageLower.includes('date') || messageLower.includes('what time')) {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString()} and today's date is ${now.toLocaleDateString()}.`;
    }
    
    if (messageLower.includes('calculate') || messageLower.includes('math') || messageLower.includes('equation')) {
      return "I can help with basic math concepts and explanations, but for complex calculations, I'd recommend using a calculator or math software. What specific math question do you have?";
    }
    
    if (messageLower.includes('code') || messageLower.includes('programming') || messageLower.includes('javascript') || messageLower.includes('python') || messageLower.includes('html')) {
      return "I can help explain programming concepts, provide code examples, and answer questions about various programming languages. What specific programming topic would you like to discuss?";
    }
    
    if (messageLower.includes('how are you') || messageLower.includes('feeling')) {
      return "I'm doing well, thank you for asking! I'm here and ready to help you with whatever you need. How are you doing today?";
    }
    
    if (messageLower.includes('app') || messageLower.includes('website') || messageLower.includes('dashboard')) {
      return "This is a SvelteKit authentication application with a modern dashboard and AI chatbot feature. It includes user authentication, role-based access control, and this AI assistant to help users.";
    }
    
    if (messageLower.includes('technology') || messageLower.includes('tech') || messageLower.includes('computer')) {
      return "Technology is a broad field! I can help explain various tech concepts, programming languages, software development, or specific technologies. What aspect of technology would you like to learn more about?";
    }
    
    if (messageLower.includes('health') || messageLower.includes('medical') || messageLower.includes('doctor')) {
      return "I can provide general health information, but for medical advice, it's always best to consult with a healthcare professional. What general health topic would you like to discuss?";
    }
    
    if (messageLower.includes('learn') || messageLower.includes('education') || messageLower.includes('study')) {
      return "Learning is wonderful! I can help explain concepts, provide study tips, or answer questions about various subjects. What would you like to learn about today?";
    }
    
    if (messageLower.includes('business') || messageLower.includes('company') || messageLower.includes('work')) {
      return "I can help with general business concepts, entrepreneurship, or workplace topics. What specific business question do you have?";
    }
    
    if (messageLower.includes('movie') || messageLower.includes('music') || messageLower.includes('game') || messageLower.includes('entertainment')) {
      return "Entertainment is a great topic! I can discuss movies, music, games, and other forms of entertainment. What would you like to talk about?";
    }
    
    if (messageLower.includes('travel') || messageLower.includes('vacation') || messageLower.includes('trip')) {
      return "Travel is exciting! I can help with travel planning tips, destination information, or general travel advice. What travel question do you have?";
    }
    
    if (messageLower.includes('food') || messageLower.includes('cook') || messageLower.includes('recipe')) {
      return "Food is delicious! I can help with cooking tips, recipe ideas, or general food questions. What would you like to know about food?";
    }
    
    if (messageLower.includes('sport') || messageLower.includes('exercise') || messageLower.includes('fitness')) {
      return "Sports and fitness are important! I can help with exercise tips, sports information, or fitness advice. What would you like to know?";
    }
    
    // Default response for other questions - now provides specific, actionable advice
    return `I want to give you actionable advice. Here's a practical approach:

**The 3-Step Method:**
1. **Assess your current situation** - Be honest about where you are
2. **Set a specific goal** - Know exactly what you want to achieve  
3. **Take immediate action** - Do something today, no matter how small

**Quick Start:** What's one small action you can take right now to move toward your goal?`;
  }
}

export const geminiService = new GeminiService();
