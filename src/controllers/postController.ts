import { htmlEscape } from '@/lib/security';

// Mutăm "baza de date" aici, în stratul de date / controller
let posts = [
    { id: 1, title: "Primul meu articol Next.js", author: "Alexutu", content: "Next.js este un framework React fantastic care ne permite sa cream aplicatii web rapide.", imageUrl: "https://picsum.photos/seed/picsum1/800/400" },
    { id: 2, title: "De ce iubesc Server Components", author: "Alexutu", content: "Server Components imbunatatesc performanta si securitatea aplicatiilor web.", imageUrl: "https://picsum.photos/seed/picsum2/800/400" }
];

export const postController = {
  // GET: Returnează toate articolele
  getAll: () => {
    return posts;
  },

  // POST: Adaugă un articol nou (cu sanitizare)
  create: (data: { title: string, author: string, content: string }) => {
    const sanitizedTitle = htmlEscape(data.title || '');
    const sanitizedAuthor = htmlEscape(data.author || '');
    const sanitizedContent = htmlEscape(data.content || '');

    const randomSeed = Math.floor(Math.random() * 1000);
    const newPost = { 
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1, 
        title: sanitizedTitle, 
        author: sanitizedAuthor, 
        content: sanitizedContent,
        imageUrl: `https://picsum.photos/seed/${randomSeed}/800/400` 
    };
    
    posts.push(newPost);
    return newPost;
  },

  // PUT: Actualizează un articol existent (cu sanitizare)
  update: (id: number, data: { title?: string, content?: string }) => {
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null; // Nu a fost găsit

    if (data.title) posts[index].title = htmlEscape(data.title);
    if (data.content) posts[index].content = htmlEscape(data.content);

    return posts[index];
  },

  // DELETE: Șterge un articol
  delete: (id: number) => {
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null; // Nu a fost găsit

    const deleted = posts.splice(index, 1)[0];
    return deleted;
  }
};
