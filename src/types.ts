import { Session } from 'hono-sessions';

export interface SessionData {
  user?: string;
}

type SessionDataTypes = {
    'counter': number
  }
  

declare module 'hono' {
  interface ContextVariableMap {
    session: Session<SessionData>;
  }
}