const allRoles: Record<string, string[]> = {
	user: [],
	admin: ['getUsers', 'manageUsers']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map<string, string[]>(Object.entries(allRoles));
