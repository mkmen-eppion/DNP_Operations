export type Newsletter = {
  id: string;
  wp_title: string;
  wp_body: string;
  received_at: string;
};

// In-memory store — persists for the lifetime of the server process.
// Replace with a database (e.g. Postgres, DynamoDB) for production persistence.
declare global {
  // eslint-disable-next-line no-var
  var __newsletters: Newsletter[] | undefined;
}

if (!global.__newsletters) {
  global.__newsletters = [];
}

export const store = global.__newsletters;

export function addNewsletters(items: { wp_title: string; wp_body: string }[]): Newsletter[] {
  const added: Newsletter[] = items.map((item) => ({
    id: crypto.randomUUID(),
    wp_title: item.wp_title,
    wp_body: item.wp_body,
    received_at: new Date().toISOString(),
  }));
  store.unshift(...added); // newest first
  return added;
}

export function getAll(): Newsletter[] {
  return store;
}

export function getById(id: string): Newsletter | undefined {
  return store.find((n) => n.id === id);
}
