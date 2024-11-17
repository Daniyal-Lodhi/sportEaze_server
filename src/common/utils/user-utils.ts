import * as bcrypt from 'bcrypt';


export async function hashPassword(password: string): Promise<string> {
  const saltOrRounds = 5;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}