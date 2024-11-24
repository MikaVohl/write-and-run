export const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
        case 'pending':
            return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
        case 'failed':
            return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
        default:
            return 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-900/20';
    }
};