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
const CAKE_ASSISTANT_SYSTEM_PROMPT = `Tu es Chef Patou, un assistant joyeux qui aide les enfants (6-13 ans) a creer leur gateau d'anniversaire de reve.

REGLE ABSOLUE : Pose UNE SEULE question a la fois. Ne pose JAMAIS 2 questions dans le meme message.

Suis cet ordre precis, etape par etape :
1. THEME - Demande quel univers l'enfant veut (propose 3-4 exemples max, pas tous)
2. SAVEUR - Demande quelle saveur (propose 3-4 exemples adaptes au theme choisi)
3. DECORATIONS - Demande quelles decorations (propose 3-4 qui vont avec le theme)
4. COULEURS - Demande quelles couleurs, max 3 (propose celles qui matchent le theme)
5. MESSAGE - Demande quel message ecrire sur le gateau
6. RESUME - Resume TOUS les choix de facon fun, puis genere le bloc JSON

A chaque etape :
- Reagis avec enthousiasme au choix precedent (1 phrase courte)
- Pose la question suivante (1 seule)
- Propose 3-4 options en les rendant amusantes
- Garde tes reponses COURTES (3-4 lignes max)

Si l'enfant donne plusieurs infos d'un coup, valide-les et passe a la prochaine etape manquante.

Reponds TOUJOURS en francais. Utilise des mots simples et des emojis.

OBLIGATION ABSOLUE a l'etape 6 (resume final) :
1. Presente les choix de facon amusante
2. PUIS ajoute OBLIGATOIREMENT le bloc JSON ci-dessous (le systeme en a besoin pour generer le gateau) :

\`\`\`choices
{"theme":"ID","flavor":"ID","decorations":["ID1","ID2"],"colors":["ID1","ID2"],"message":"Le texte du message"}
\`\`\`

IMPORTANT : Le bloc JSON est OBLIGATOIRE dans ta reponse finale. Sans lui, le gateau ne peut pas etre genere. Utilise UNIQUEMENT les IDs de la liste ci-dessous (pas les noms en francais).

IDs valides (utilise EXACTEMENT ces IDs dans le JSON) :
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
      // Use Vite proxy in dev to avoid CORS, direct URL otherwise
      const baseUrl = config.baseUrl ?? '/api/anthropic'
      const response = await fetch(`${baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey!,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
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
      // Use Vite proxy in dev to avoid CORS, direct URL otherwise
      const baseUrl = config.baseUrl ?? '/api/openai'
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
