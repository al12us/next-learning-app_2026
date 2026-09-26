import { NextResponse } from 'next/server';

// Simulare baza de cuvinte cheie pentru a părea un AI real
const techKeywords = ['react', 'next', 'javascript', 'typescript', 'api', 'server', 'client', 'frontend', 'backend'];
const adjectives = ['Modern', 'Rapid', 'Avansat', 'Suprem', 'Interactiv', 'Sigur', 'Scalabil'];
const nouns = ['Ghid', 'Tutorial', 'Introducere', 'Arhitectură', 'Proiect', 'Framework', 'Aplicație'];

export async function POST(request: Request) {
  try {
    const { content, type } = await request.json();

    // 1. Simulam "Timpul de Gândire" al unui AI (1.5 secunde pana la 3 secunde)
    const thinkingTime = Math.floor(Math.random() * 1500) + 1500;
    await new Promise((resolve) => setTimeout(resolve, thinkingTime));

    if (!content || content.length < 5) {
      return NextResponse.json({
        error: "Am nevoie de mai mult context (minim 5 caractere) pentru a genera o sugestie bună!"
      }, { status: 400 });
    }

    // 2. Analizăm textul (foarte basic) pentru a "înțelege" contextul
    const words = content.toLowerCase().split(/\s+/);
    const foundKeywords = techKeywords.filter(kw => words.includes(kw));
    
    let generatedResult = "";

    if (type === 'title') {
      // GENERARE TITLU
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      
      if (foundKeywords.length > 0) {
        const primaryTopic = foundKeywords[0].charAt(0).toUpperCase() + foundKeywords[0].slice(1);
        generatedResult = `${primaryTopic} ${randomAdjective}: ${randomNoun} Definitiv`;
      } else {
        generatedResult = `Cum să creezi un ${randomNoun} ${randomAdjective} pas cu pas`;
      }
    } else if (type === 'content') {
      // GENERARE CONȚINUT (Extindere)
      const topic = foundKeywords.length > 0 ? foundKeywords[0] : 'acest domeniu';
      generatedResult = `${content}\n\n[✨ Adăugat de AI]: Pe lângă aceste aspecte, utilizarea tehnologiilor moderne precum ${topic} ajută la creșterea vitezei de dezvoltare și îmbunătățește semnificativ experiența utilizatorului final. Scalabilitatea este garantată prin decuparea aplicației în componente reutilizabile și izolarea logicii de server de cea din client.`;
    }

    return NextResponse.json({
      success: true,
      suggestion: generatedResult
    });

  } catch (error) {
    return NextResponse.json({ error: "Eroare la procesarea cererii AI." }, { status: 500 });
  }
}
