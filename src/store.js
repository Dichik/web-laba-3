import { writable } from 'svelte/store';

export const isLoading = writable(0);
export const modal = writable(null);
