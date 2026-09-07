export const adminOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => {
  return req.user?.collection === 'users'
}
