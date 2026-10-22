export interface Block { type: 'p' | 'h' | 'li'; text: string }
export interface Program { id: string; title: string; img: string; short: string; blocks: Block[] }
export interface ProgramGroup { id: string; label: string; note: string; items: Program[] }
export interface Person { name: string; role: string; img: string; phone?: string | null; email?: string }
export interface Post { id: string | number; title: string; description: string; image_url: string; date: string }
