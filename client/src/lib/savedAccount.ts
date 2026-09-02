export function createSavedAccountGuard() {
  let activeUserId: string | null = null;

  return {
    select(userId: string | null) {
      activeUserId = userId;
    },
    allows(userId: string) {
      return activeUserId === userId;
    },
  };
}