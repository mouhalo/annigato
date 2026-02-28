import type { LLMConfig, LLMMessage } from '../types/creation'

// Configuration par defaut - peut etre changee via les settings
let currentConfig: LLMConfig = {
  provider: 'claude',
  model: 'claude-sonnet-4-20250514',
}

export function setLLMConfig(config: Partial<LLMConfig>) {
  currentConfig = { ...currentConfig, ...config }
}

export function getLLMConfig(): LLMConfig {
  return { ...currentConfig }
}

// System prompt pour l'assistant de creation de gateau
const CAKE_ASSISTANT_SYSTEM_PROMPT = `Tu es un assistant joyeux et enthousiaste qui aide les enfants a creer leur gateau d'anniversaire de reve.

Tu dois poser des questions simples et amusantes pour comprendre ce que l'enfant veut :
- Quel theme pour le gateau ? (licorne, super-heros, princesse, pirate, espace, jungle, ocean, arc-en-ciel)
- Quelle saveur ? (vanille, chocolat, fraise, caramel, citron, noix de coco, myrtille, banane, red velvet, pistache)
- Quelles decorations ? (vermicelles, pepites chocolat, etoiles, fleurs, couronne, animaux, bougies, fruits frais, chantilly)
- Quelles couleurs ? (rose, bleu, violet, vert, jaune, orange, rouge, blanc, marron, turquoise) - max 3
- Quel message ecrire sur le gateau ?

Reponds TOUJOURS en francais. Sois encourageant et utilise des mots simples.
Quand tu as rassemble assez d'informations, resume les choix dans un bloc JSON comme ceci :
\`\`\`choices
{"theme":"unicorn","flavor":"vanilla","decorations":["stars","rainbow-sprinkles"],"colors":["pink","purple"],"message":"Joyeux Anniversaire !"}
\`\`\`

Les IDs valides sont :
- Themes : unicorn, superhero, princess, pirate, space, jungle, ocean, rainbow
- Saveurs : vanilla, chocolate, strawberry, caramel, lemon, coconut, blueberry, banana, redvelvet, pistachio
- Decorations : rainbow-sprinkles, chocolate-chips, stars, flowers, crown, animals, flag, rocket, candles-number, candles-sparkle, fruits-fresh, whipped-cream
- Couleurs : pink, blue, purple, green, yellow, orange, red, white, brown, turquoise`

// Envoie un message au LLM et retourne la reponse
// Pour l'instant c'est un mock - a connecter a une vraie API
export async function sendChatMessage(
  messages: LLMMessage[],
  _config?: Partial<LLMConfig>
): Promise<string> {
  const config = _config ? { ...currentConfig, ..._config } : currentConfig

  const fullMessages: LLMMessage[] = [
    { role: 'system', content: CAKE_ASSISTANT_SYSTEM_PROMPT },
    ...messages,
  ]

  // Si une API key est configuree, on utilise le vrai provider
  if (config.apiKey) {
    return await callRealProvider(fullMessages, config)
  }

  // Sinon, mode mock intelligent
  return mockResponse(messages)
}

async function callRealProvider(messages: LLMMessage[], config: LLMConfig): Promise<string> {
  switch (config.provider) {
    case 'claude': {
      const baseUrl = config.baseUrl ?? 'https://api.anthropic.com'
      const response = await fetch(`${baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model ?? 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: messages.filter(m => m.role !== 'system').map(m => ({
            role: m.role,
            content: m.content,
          })),
          system: messages.find(m => m.role === 'system')?.content,
        }),
      })
      const data = await response.json()
      return data.content?.[0]?.text ?? 'Desole, je n\'ai pas compris. Peux-tu repeter ?'
    }

    case 'openai': {
      const baseUrl = config.baseUrl ?? 'https://api.openai.com'
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model ?? 'gpt-4o-mini',
          max_tokens: 500,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await response.json()
      return data.choices?.[0]?.message?.content ?? 'Desole, je n\'ai pas compris.'
    }

    default:
      return mockResponse(messages.filter(m => m.role !== 'system'))
  }
}

// Reponse mock intelligente basee sur le contexte
function mockResponse(messages: LLMMessage[]): Promise<string> {
  const lastMsg = messages[messages.length - 1]?.content.toLowerCase() ?? ''
  const msgCount = messages.filter(m => m.role === 'user').length

  let response: string

  if (msgCount <= 1) {
    response = `Super ! Tu veux creer un gateau genial ! Dis-moi, quel theme tu aimerais ? Par exemple : licorne, super-heros, princesse, pirate, espace, jungle, ocean ou arc-en-ciel ?`
  } else if (lastMsg.includes('licorne') || lastMsg.includes('unicorn')) {
    response = `Un gateau licorne, quelle super idee ! Et quelle saveur tu preferes ? Vanille, chocolat, fraise ou autre chose ?`
  } else if (lastMsg.includes('chocolat') || lastMsg.includes('chocolate')) {
    response = `Miam, du chocolat ! Et quelles decorations tu veux ? Des etoiles en sucre, des vermicelles colores, de la chantilly ?`
  } else if (lastMsg.includes('vanille') || lastMsg.includes('vanilla')) {
    response = `La vanille, c'est delicieux ! Et quelles decorations tu aimerais ? Des etoiles, des fleurs en sucre, des vermicelles ?`
  } else if (lastMsg.includes('fraise') || lastMsg.includes('strawberry')) {
    response = `La fraise, super choix ! Quelles decorations tu veux ajouter sur ton gateau ?`
  } else if (lastMsg.includes('etoile') || lastMsg.includes('vermicelle') || lastMsg.includes('chantilly') || lastMsg.includes('fleur')) {
    response = `Genial ! Quelles couleurs tu veux pour ton gateau ? Tu peux en choisir jusqu'a 3 : rose, bleu, violet, vert, jaune...`
  } else if (lastMsg.includes('rose') || lastMsg.includes('bleu') || lastMsg.includes('violet') || lastMsg.includes('vert')) {
    response = `Tres joli ! Derniere question : quel message tu veux ecrire sur le gateau ? Par exemple "Joyeux Anniversaire" ou autre chose ?`
  } else if (lastMsg.includes('anniversaire') || lastMsg.includes('joyeux') || lastMsg.includes('happy')) {
    response = `Parfait ! Voici ton gateau de reve :\n\n\`\`\`choices\n{"theme":"unicorn","flavor":"vanilla","decorations":["stars","rainbow-sprinkles","whipped-cream"],"colors":["pink","purple"],"message":"${lastMsg.charAt(0).toUpperCase() + lastMsg.slice(1)}"}\n\`\`\`\n\nTon gateau va etre magique !`
  } else {
    response = `Super ! Et sinon, quel theme tu voudrais pour ton gateau ? Licorne, super-heros, princesse, ou autre chose ?`
  }

  return new Promise(resolve => setTimeout(() => resolve(response), 800))
}

// Extraire les choix du JSON dans la reponse de l'IA
export function extractChoicesFromResponse(response: string): Record<string, unknown> | null {
  const match = response.match(/```choices\n([\s\S]*?)\n```/)
  if (match?.[1]) {
    try {
      return JSON.parse(match[1])
    } catch {
      return null
    }
  }
  return null
}
