
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');

// Security: Environment-specific CORS configuration
const getAllowedOrigins = () => {
  const production = Deno.env.get('DENO_DEPLOYMENT_ID'); // Supabase edge function deployment indicator
  if (production) {
    // In production, use specific domains
    return ['https://your-domain.com']; // Replace with actual production domain
  }
  // Development: Allow localhost and preview URLs
  return ['http://localhost:3000', 'http://localhost:5173', 'https://*.lovableproject.com'];
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Will be dynamically set per request
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Helper function to call Hugging Face Inference API with DeepSeek
async function callDeepSeek(messages: any[], temperature = 0.7, maxTokens = 1024) {
  // Convert messages to a single prompt for DeepSeek
  let prompt = '';
  for (const msg of messages) {
    if (msg.role === 'system') {
      prompt += `${msg.content}\n\n`;
    } else if (msg.role === 'user') {
      prompt += `User: ${msg.content}\n`;
    } else if (msg.role === 'assistant') {
      prompt += `Assistant: ${msg.content}\n`;
    }
  }
  prompt += 'Assistant:';

  const response = await fetch('https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        temperature,
        max_new_tokens: maxTokens,
        top_p: 0.9,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Hugging Face API error:', errorData);
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Handle different response formats
  if (Array.isArray(data) && data.length > 0) {
    return data[0].generated_text || data[0].text || '';
  } else if (data.generated_text) {
    return data.generated_text;
  } else if (data[0]?.generated_text) {
    return data[0].generated_text;
  }
  
  throw new Error('Unexpected response format from Hugging Face API');
}

// Post-processing: Style transfer and rewriting
async function rewriteForHumanStyle(content: string, contentType: string): Promise<string> {
  const stylePrompts = {
    'social-post': 'Rewrite this to sound like a human social media expert who understands current trends and speaks naturally to their audience.',
    'captions': 'Rewrite this caption to sound more authentic and relatable, like it was written by someone who genuinely connects with their audience.',
    'hashtags': 'Refine these hashtags to be more strategic and natural, like those chosen by an experienced social media manager.',
    'threads': 'Rewrite this thread to flow more naturally and conversationally, like a real person sharing valuable insights with their community.',
    'blog-posts': 'Rewrite this blog post to be more engaging and conversational while maintaining professionalism, like a human expert sharing their knowledge.',
    'articles': 'Rewrite this article to be more engaging and accessible while maintaining authority, like a human expert explaining complex topics clearly.',
    'website-copy': 'Rewrite this website copy to be more persuasive and human-centered, focusing on emotional connection and clear value propositions.',
    'marketing-copy': 'Rewrite this marketing copy to be more compelling and authentic, like it was crafted by a human marketer who understands their audience deeply.'
  };

  const stylePrompt = stylePrompts[contentType as keyof typeof stylePrompts] || stylePrompts['social-post'];
  
  const messages = [
    {
      role: 'system',
      content: `You are an expert content editor. Your job is to make AI-generated content sound more human, natural, and engaging. ${stylePrompt}`
    },
    {
      role: 'user',
      content: `Please rewrite this content to make it more natural and engaging:\n\n${content}`
    }
  ];

  return await callDeepSeek(messages, 0.8);
}

// Post-processing: Tone modulation
async function adjustTone(content: string, tone: string): Promise<string> {
  const toneDescriptions = {
    'professional': 'professional, authoritative, and trustworthy',
    'casual': 'casual, friendly, and approachable',
    'witty': 'witty, clever, and entertaining with subtle humor',
    'persuasive': 'persuasive, compelling, and action-oriented',
    'empathetic': 'empathetic, understanding, and emotionally resonant',
    'confident': 'confident, assertive, and inspiring',
    'conversational': 'conversational, warm, and relatable',
    'urgent': 'urgent, compelling, and time-sensitive'
  };

  const toneDescription = toneDescriptions[tone as keyof typeof toneDescriptions] || toneDescriptions['professional'];

  const messages = [
    {
      role: 'system',
      content: `You are a tone specialist. Adjust the given content to match the specified tone while preserving the core message and information. The tone should be ${toneDescription}.`
    },
    {
      role: 'user',
      content: `Please adjust this content to have a ${tone} tone:\n\n${content}`
    }
  ];

  return await callDeepSeek(messages, 0.7);
}

// Post-processing: Grammar and style correction
async function refineGrammarAndStyle(content: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert editor and writing coach. Edit this content to be clear, concise, and engaging for a human reader. Improve grammar, flow, readability, and overall impact while maintaining the original message and tone. Make it sound natural and polished.'
    },
    {
      role: 'user',
      content: `Please edit this content for clarity, grammar, and engagement:\n\n${content}`
    }
  ];

  return await callDeepSeek(messages, 0.6);
}

// Security: Rate limiting (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

const checkRateLimit = (clientId: string): boolean => {
  const now = Date.now();
  const client = requestCounts.get(clientId);
  
  if (!client || now > client.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (client.count >= RATE_LIMIT) {
    return false;
  }
  
  client.count++;
  return true;
};

// Security: Enhanced prompt filtering
const containsSuspiciousContent = (prompt: string): boolean => {
  const suspiciousPatterns = [
    /ignore\s+(previous|above|all)\s+(instructions?|prompts?|rules?)/i,
    /system\s*:\s*you\s+are\s+now/i,
    /\bprompt\s+injection\b/i,
    /\bjailbreak\b/i,
    /roleplay\s+as\s+/i,
    /pretend\s+(to\s+be|you\s+are)/i,
    /forget\s+(everything|all|previous)/i,
    /new\s+instruction/i,
    /override\s+(previous|security|safety)/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(prompt));
};

serve(async (req) => {
  // Security: Validate request method
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Security: Dynamic CORS origin validation
  const origin = req.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();
  const isOriginAllowed = !origin || allowedOrigins.some(allowed => 
    allowed === '*' || origin === allowed || (allowed.includes('*') && origin.includes('lovableproject.com'))
  );
  
  const dynamicCorsHeaders = {
    ...corsHeaders,
    'Access-Control-Allow-Origin': isOriginAllowed ? (origin || '*') : 'null',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: dynamicCorsHeaders });
  }

  // Security: Rate limiting
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
      status: 429,
      headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    if (!HUGGING_FACE_API_KEY) {
      throw new Error('HUGGING_FACE_API_KEY is not configured');
    }

    const { prompt, contentType, tone = 'professional', enablePostProcessing = true } = await req.json();

    // Enhanced input validation and sanitization
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Valid prompt is required');
    }
    
    // Security: Check for prompt injection attempts
    if (containsSuspiciousContent(prompt)) {
      console.warn('Blocked suspicious prompt:', prompt.substring(0, 100));
      throw new Error('Invalid prompt content detected');
    }
    
    const sanitizedPrompt = prompt.trim().slice(0, 2000); // Limit prompt length
    if (sanitizedPrompt.length < 3) {
      throw new Error('Prompt must be at least 3 characters long');
    }
    
    // Security: Additional validation for content type and tone
    if (typeof contentType !== 'string' || typeof tone !== 'string') {
      throw new Error('Invalid content type or tone format');
    }

    // Validate content type
    const validContentTypes = ['social-post', 'captions', 'hashtags', 'threads', 'blog-posts', 'articles', 'website-copy', 'marketing-copy'];
    if (!validContentTypes.includes(contentType)) {
      throw new Error('Invalid content type');
    }

    // Create content-specific system prompts
    const systemPrompts = {
      'social-post': 'You are a social media expert. Create engaging, authentic social media posts that drive engagement. Include emojis where appropriate and keep the tone conversational yet professional.',
      'captions': 'You are a creative caption writer. Write catchy, engaging captions that complement visual content. Be creative with wordplay and include relevant emojis.',
      'hashtags': 'You are a hashtag strategist. Generate relevant, trending hashtags that will help increase reach and engagement. Provide a mix of popular and niche hashtags.',
      'threads': 'You are a thread content creator. Write engaging Twitter/X threads that tell a story or provide value. Structure the content in numbered tweets that flow naturally together.',
      'blog-posts': 'You are a professional blog writer. Create well-structured, informative, and engaging blog posts with clear headlines, subheadings, and valuable content that provides real value to readers.',
      'articles': 'You are an expert article writer. Write authoritative, well-researched articles that demonstrate expertise in the subject matter. Use professional tone and provide actionable insights.',
      'website-copy': 'You are a conversion-focused copywriter. Create compelling website copy that clearly communicates value propositions, builds trust, and guides visitors toward desired actions.',
      'marketing-copy': 'You are a persuasive marketing copywriter. Create compelling marketing content that captures attention, builds desire, and motivates action. Focus on benefits and emotional triggers.'
    };

    const systemPrompt = systemPrompts[contentType as keyof typeof systemPrompts] || systemPrompts['social-post'];

    // Step 1: Generate initial content
    console.log('Generating initial content...');
    const initialMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: sanitizedPrompt
      }
    ];

    let generatedContent = await callDeepSeek(initialMessages, 0.8, 1024);
    console.log('Initial content generated');

    // Step 2: Apply post-processing if enabled
    if (enablePostProcessing) {
      console.log('Starting post-processing pipeline...');
      
      // Step 2a: Style transfer and rewriting for human-like quality
      console.log('Applying style transfer...');
      generatedContent = await rewriteForHumanStyle(generatedContent, contentType);
      
      // Step 2b: Tone modulation
      if (tone !== 'professional') {
        console.log(`Adjusting tone to: ${tone}`);
        generatedContent = await adjustTone(generatedContent, tone);
      }
      
      // Step 2c: Grammar and style refinement
      console.log('Refining grammar and style...');
      generatedContent = await refineGrammarAndStyle(generatedContent);
      
      console.log('Post-processing pipeline completed');
    }

    return new Response(JSON.stringify({ 
      content: generatedContent,
      processedWithAI: enablePostProcessing,
      tone: tone
    }), {
      headers: { 
        ...dynamicCorsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      },
    });
  } catch (error) {
    // Security: Don't leak sensitive error information
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const sanitizedError = errorMessage.includes('API') || errorMessage.includes('key') 
      ? 'Service temporarily unavailable' 
      : errorMessage;
    
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ error: sanitizedError }), {
      status: 500,
      headers: { 
        ...dynamicCorsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      },
    });
  }
});
